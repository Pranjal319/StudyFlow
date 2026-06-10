import Progress from "../models/Progress.js";
import StudyTask from "../models/StudyTask.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { startOfDay } from "../utils/date.js";
import { recalculateUserStats } from "../utils/gamification.js";

export const logStudySession = asyncHandler(async (req, res) => {
  const {
    subjectId,
    taskId,
    minutesStudied = 25,
    pomodoroSessions = 1,
    completed = false
  } = req.body;

  if (!subjectId) {
    res.status(400);
    throw new Error("subjectId is required");
  }

  const progress = await Progress.findOneAndUpdate(
    {
      user: req.user._id,
      subject: subjectId,
      date: startOfDay()
    },
    {
      $setOnInsert: {
        user: req.user._id,
        subject: subjectId,
        date: startOfDay(),
        task: taskId || undefined
      },
      $inc: {
        minutesStudied,
        pomodoroSessions,
        completedTasks: completed ? 1 : 0
      }
    },
    { upsert: true, new: true }
  );

  if (taskId && completed) {
    await StudyTask.findOneAndUpdate(
      { _id: taskId, user: req.user._id },
      { status: "completed" },
      { new: true }
    );
  }

  const stats = await recalculateUserStats(req.user);
  res.status(201).json({ progress, stats });
});

export const getTodayProgress = asyncHandler(async (req, res) => {
  const today = startOfDay();
  const records = await Progress.find({ user: req.user._id, date: today }).populate("subject", "name color");
  const taskSummary = await StudyTask.aggregate([
    {
      $match: {
        user: req.user._id,
        plannedDate: { $gte: today, $lt: new Date(today.getTime() + 1000 * 60 * 60 * 24) }
      }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const summaryMap = taskSummary.reduce((accumulator, entry) => {
    accumulator[entry._id] = entry.count;
    return accumulator;
  }, {});

  res.json({
    totalMinutes: records.reduce((sum, record) => sum + record.minutesStudied, 0),
    pomodoroSessions: records.reduce((sum, record) => sum + record.pomodoroSessions, 0),
    completedTasks: records.reduce((sum, record) => sum + record.completedTasks, 0),
    plannedTasks: (summaryMap.pending || 0) + (summaryMap.completed || 0) + (summaryMap.skipped || 0),
    records
  });
});

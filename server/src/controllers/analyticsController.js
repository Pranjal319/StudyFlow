import Progress from "../models/Progress.js";
import StudyTask from "../models/StudyTask.js";
import Subject from "../models/Subject.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addDays, buildDateLabel, startOfDay } from "../utils/date.js";
import { recalculateUserStats } from "../utils/gamification.js";

export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const today = startOfDay();
  const weekStart = addDays(today, -6);

  const weeklyData = await Progress.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: weekStart, $lte: today }
      }
    },
    {
      $group: {
        _id: "$date",
        minutes: { $sum: "$minutesStudied" },
        completedTasks: { $sum: "$completedTasks" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const weeklyMap = weeklyData.reduce((accumulator, entry) => {
    accumulator[startOfDay(entry._id).toISOString()] = entry;
    return accumulator;
  }, {});

  const weeklyProgress = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const key = startOfDay(date).toISOString();
    const entry = weeklyMap[key];

    return {
      day: buildDateLabel(date).split(",")[0],
      minutes: entry?.minutes || 0,
      completedTasks: entry?.completedTasks || 0
    };
  });

  const timeBySubject = await Progress.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$subject",
        minutes: { $sum: "$minutesStudied" },
        sessions: { $sum: "$pomodoroSessions" }
      }
    },
    {
      $lookup: {
        from: "subjects",
        localField: "_id",
        foreignField: "_id",
        as: "subject"
      }
    },
    { $unwind: "$subject" },
    {
      $project: {
        _id: 0,
        name: "$subject.name",
        color: "$subject.color",
        minutes: 1,
        sessions: 1
      }
    },
    { $sort: { minutes: -1 } }
  ]);

  const taskBreakdownRaw = await StudyTask.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$status",
        value: { $sum: 1 }
      }
    }
  ]);

  const taskBreakdown = ["pending", "completed", "skipped"].map((status) => ({
    name: status,
    value: taskBreakdownRaw.find((entry) => entry._id === status)?.value || 0
  }));

  const subjects = await Subject.find({ user: req.user._id }).sort({ currentConfidence: 1, examDate: 1 });
  const weakSubjects = subjects
    .filter((subject) => subject.currentConfidence <= 2 || subject.priority === "high")
    .slice(0, 3)
    .map((subject) => ({
      name: subject.name,
      recommendation:
        subject.currentConfidence <= 2
          ? "Add one extra recall-focused session this week."
          : "Keep it in your first study block until the deadline passes."
    }));

  const stats = await recalculateUserStats(req.user);

  res.json({
    weeklyProgress,
    timeBySubject,
    taskBreakdown,
    weakSubjects,
    streak: stats.streak,
    achievements: stats.achievements,
    totals: stats.totals
  });
});

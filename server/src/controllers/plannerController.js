import Subject from "../models/Subject.js";
import StudyTask from "../models/StudyTask.js";
import Progress from "../models/Progress.js";
import { generateStudyPlan } from "../services/plannerService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatDateKey, startOfDay } from "../utils/date.js";
import { recalculateUserStats } from "../utils/gamification.js";

function groupTasks(tasks) {
  const grouped = tasks.reduce((accumulator, task) => {
    const key = formatDateKey(task.plannedDate);

    if (!accumulator[key]) {
      accumulator[key] = {
        date: key,
        tasks: []
      };
    }

    accumulator[key].tasks.push(task);
    return accumulator;
  }, {});

  return Object.values(grouped);
}

export const generatePlan = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: 1 });

  if (!subjects.length) {
    res.status(400);
    throw new Error("Add at least one subject before generating a study plan");
  }

  await StudyTask.deleteMany({
    user: req.user._id,
    source: "ai-plan",
    status: "pending",
    plannedDate: { $gte: startOfDay() }
  });

  const result = generateStudyPlan(subjects, req.user.studyHoursPerDay, req.body || {});

  const createdTasks = await StudyTask.insertMany(
    result.tasks.map((task) => ({
      ...task,
      user: req.user._id,
      source: "ai-plan"
    }))
  );

  res.status(201).json({
    summary: result.summary,
    suggestions: result.suggestions,
    schedule: groupTasks(createdTasks)
  });
});

export const getPlan = asyncHandler(async (req, res) => {
  const tasks = await StudyTask.find({ user: req.user._id })
    .populate("subject", "name color priority examDate")
    .sort({ plannedDate: 1, createdAt: 1 });

  res.json({ schedule: groupTasks(tasks) });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status, minutesStudied = 0 } = req.body;
  const task = await StudyTask.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.status = status || task.status;
  await task.save();

  if (task.status === "completed") {
    await Progress.findOneAndUpdate(
      {
        user: req.user._id,
        subject: task.subject,
        date: startOfDay(),
        task: task._id
      },
      {
        $setOnInsert: {
          user: req.user._id,
          subject: task.subject,
          task: task._id,
          date: startOfDay()
        },
        $inc: {
          minutesStudied: minutesStudied || task.durationMinutes,
          pomodoroSessions: task.pomodorosPlanned,
          completedTasks: 1
        }
      },
      { upsert: true, new: true }
    );

    await recalculateUserStats(req.user);
  }

  res.json({ task });
});

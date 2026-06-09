import StudyTask from "../models/StudyTask.js";
import Progress from "../models/Progress.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { startOfDay } from "../utils/date.js";

export const getDailyNotifications = asyncHandler(async (req, res) => {
  const today = startOfDay();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await StudyTask.find({
    user: req.user._id,
    plannedDate: { $gte: today, $lt: tomorrow },
    status: "pending"
  })
    .populate("subject", "name")
    .sort({ plannedDate: 1 });

  const progress = await Progress.find({ user: req.user._id, date: today });
  const totalMinutes = progress.reduce((sum, record) => sum + record.minutesStudied, 0);

  const reminders = [];

  if (tasks.length) {
    reminders.push(`You have ${tasks.length} pending study block(s) today. Start with ${tasks[0].subject.name}.`);
  }

  if (!totalMinutes) {
    reminders.push("No study time logged yet today. A single 25-minute Pomodoro keeps your streak alive.");
  }

  if (totalMinutes >= req.user.studyHoursPerDay * 60) {
    reminders.push("Daily study goal reached. Switch to light review or recovery time.");
  }

  res.json({ reminders });
});

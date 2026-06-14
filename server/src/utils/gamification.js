import Progress from "../models/Progress.js";
import { formatDateKey, startOfDay } from "./date.js";

export async function recalculateUserStats(user) {
  const progressDays = await Progress.aggregate([
    { $match: { user: user._id, minutesStudied: { $gt: 0 } } },
    { $group: { _id: "$date" } },
    { $sort: { _id: -1 } }
  ]);

  const progressKeys = progressDays.map((entry) => formatDateKey(entry._id));
  const today = startOfDay();
  let streak = 0;

  for (let index = 0; index < progressKeys.length; index += 1) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - index);

    if (progressKeys[index] !== formatDateKey(expectedDate)) {
      break;
    }

    streak += 1;
  }

  const aggregate = await Progress.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalMinutes: { $sum: "$minutesStudied" },
        totalSessions: { $sum: "$pomodoroSessions" },
        totalCompletedTasks: { $sum: "$completedTasks" }
      }
    }
  ]);

  const totals = aggregate[0] || {
    totalMinutes: 0,
    totalSessions: 0,
    totalCompletedTasks: 0
  };

  const achievements = [];

  if (streak >= 3) achievements.push("Three-day focus streak");
  if (totals.totalMinutes >= 600) achievements.push("Ten-hour study milestone");
  if (totals.totalSessions >= 20) achievements.push("Pomodoro regular");
  if (totals.totalCompletedTasks >= 15) achievements.push("Task finisher");

  user.streak = {
    current: streak,
    best: Math.max(user.streak?.best || 0, streak)
  };
  user.achievements = achievements;

  await user.save();

  return {
    streak: user.streak,
    achievements,
    totals
  };
}

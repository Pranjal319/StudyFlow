import { addDays, buildDateLabel, differenceInDays, formatDateKey, startOfDay } from "../utils/date.js";

function priorityWeight(priority) {
  return {
    low: 1,
    medium: 1.35,
    high: 1.8
  }[priority] || 1.35;
}

function buildSuggestion(subject, daysUntilExam) {
  if (subject.currentConfidence <= 2) {
    return `${subject.name}: increase active recall and past-paper practice to close confidence gaps.`;
  }

  if (daysUntilExam <= 7) {
    return `${subject.name}: switch the next sessions to timed revision because the deadline is close.`;
  }

  if (subject.priority === "high") {
    return `${subject.name}: keep it in the first half of your day to protect your highest-value focus window.`;
  }

  return `${subject.name}: maintain shorter review blocks to keep the plan balanced.`;
}

export function generateStudyPlan(subjects, studyHoursPerDay, options = {}) {
  const today = startOfDay();
  const horizonDays = options.horizonDays || 14;
  const dailyMinutes = Math.max(60, Math.round(studyHoursPerDay * 60));

  const states = subjects.map((subject) => {
    const daysUntilExam = subject.examDate ? Math.max(1, differenceInDays(subject.examDate, today)) : horizonDays + 7;
    const urgency = 1 + Math.max(0, 14 - Math.min(daysUntilExam, 14)) / 9;
    const weakness = 1 + (5 - subject.currentConfidence) * 0.18;
    const difficulty = 1 + (subject.difficulty - 3) * 0.12;
    const weeklyTarget = Math.max(2, subject.weeklyTargetHours || 4);
    const projectedMinutes = Math.max(150, weeklyTarget * 60 * Math.max(1, Math.ceil(horizonDays / 7)));

    return {
      subject,
      baseWeight: priorityWeight(subject.priority) * urgency * weakness * difficulty,
      remainingMinutes: projectedMinutes,
      daysUntilExam,
      lastPlannedOffset: -2
    };
  });

  const tasks = [];

  for (let dayOffset = 0; dayOffset < horizonDays; dayOffset += 1) {
    const date = addDays(today, dayOffset);
    let minutesLeft = dailyMinutes;
    const usedSubjectIds = new Set();

    while (minutesLeft >= 25) {
      const candidates = states
        .filter((state) => {
          if (state.remainingMinutes <= 0) {
            return false;
          }

          if (state.subject.examDate && startOfDay(state.subject.examDate) < date) {
            return false;
          }

          return true;
        })
        .map((state) => {
          const spacingBonus = Math.max(0.85, 1 + (dayOffset - state.lastPlannedOffset - 1) * 0.15);
          const deadlineBonus = state.daysUntilExam <= dayOffset + 3 ? 1.25 : 1;
          const diversityPenalty = usedSubjectIds.has(String(state.subject._id)) ? 0.72 : 1;

          return {
            ...state,
            dynamicScore: state.baseWeight * spacingBonus * deadlineBonus * diversityPenalty * (1 + state.remainingMinutes / 600)
          };
        })
        .sort((left, right) => right.dynamicScore - left.dynamicScore);

      if (!candidates.length) {
        break;
      }

      const pick = candidates[0];
      const blockMinutes = Math.min(
        90,
        Math.max(25, Math.round(Math.min(minutesLeft, pick.remainingMinutes, dailyMinutes / 2) / 5) * 5)
      );

      tasks.push({
        subject: pick.subject._id,
        subjectName: pick.subject.name,
        title: `${pick.subject.name} focus session`,
        plannedDate: date,
        durationMinutes: blockMinutes,
        pomodorosPlanned: Math.max(1, Math.round(blockMinutes / 25)),
        priorityScore: Number(pick.dynamicScore.toFixed(2)),
        notes: `${pick.subject.priority} priority with ${pick.daysUntilExam} day(s) until deadline.`
      });

      pick.remainingMinutes -= blockMinutes;
      pick.lastPlannedOffset = dayOffset;
      minutesLeft -= blockMinutes;
      usedSubjectIds.add(String(pick.subject._id));
    }
  }

  const groupedSchedule = tasks.reduce((accumulator, task) => {
    const key = formatDateKey(task.plannedDate);

    if (!accumulator[key]) {
      accumulator[key] = {
        date: key,
        label: buildDateLabel(task.plannedDate),
        totalMinutes: 0,
        tasks: []
      };
    }

    accumulator[key].tasks.push(task);
    accumulator[key].totalMinutes += task.durationMinutes;
    return accumulator;
  }, {});

  const suggestions = states
    .sort((left, right) => right.baseWeight - left.baseWeight)
    .slice(0, 4)
    .map((state) => buildSuggestion(state.subject, state.daysUntilExam));

  return {
    tasks,
    groupedSchedule: Object.values(groupedSchedule),
    suggestions,
    summary: {
      horizonDays,
      dailyStudyHours: studyHoursPerDay,
      totalTasks: tasks.length,
      totalMinutes: tasks.reduce((total, task) => total + task.durationMinutes, 0),
      subjectsCovered: new Set(tasks.map((task) => String(task.subject))).size
    }
  };
}

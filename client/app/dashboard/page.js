"use client";

import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { DashboardShell } from "@/components/dashboard-shell";
import { NotificationPanel } from "@/components/notification-panel";
import { PlannerOverview } from "@/components/planner-overview";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { SubjectForm } from "@/components/subject-form";
import { TaskBoard } from "@/components/task-board";
import { generateStudyPlan } from "@/lib/planner";
import {
  getSubjects,
  createSubject,
  getTasks,
  createTasks,
  updateTask,
  getProgress,
  logProgress,
  clearAllTasks,
  deleteSubject,
  getTodayCheckIn,
  logCheckIn,
  updateStreakIfNeeded,
  addXP,
  addBadge,
  getGamificationStats,
  getReflections,
  logReflection,
  getAdaptiveStudyHours,
  getWeeklyConsistency,
  moveTask
} from "@/lib/api";

export default function DashboardPage() {
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [status, setStatus] = useState({ savingSubject: false, generatingPlan: false, error: "", note: "" });

  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleTask, setRescheduleTask] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [gamification, setGamification] = useState({ xp: 0, level: 1, badges: [], streak: { current: 0, best: 0 }, consistency: 0 });

  const [todaySummary, setTodaySummary] = useState({ plannedMinutes: 0, subjectsCount: 0, pendingCount: 0, totalCount: 0 });

  const subjectFormRef = useRef(null);
  const pomodoroRef = useRef(null);
  const scheduleRef = useRef(null);

  function scrollToRef(ref) {
    if (!ref?.current) {
      return;
    }

    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function loadData() {
    try {
      const subs = getSubjects();
      const tasks = getTasks();
      const progs = getProgress();

      setSubjects(subs);
      setTasks(tasks);

      const grouped = tasks.reduce((accumulator, task) => {
        const key = new Date(task.plannedDate).toISOString().split("T")[0];
        if (!accumulator[key]) {
          accumulator[key] = { date: key, tasks: [] };
        }
        accumulator[key].tasks.push(task);
        return accumulator;
      }, {});

      setSchedule(Object.values(grouped));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasksToday = tasks.filter((t) => new Date(t.plannedDate).toDateString() === today.toDateString());
      const pendingToday = tasksToday.filter((t) => t.status !== "completed");

      const subjectsToday = new Set(tasksToday.map((t) => t.subject?._id || t.subject || t.subjectName).filter(Boolean));

      setTodaySummary({
        plannedMinutes: tasksToday.reduce((sum, t) => sum + (t.durationMinutes || 0), 0),
        subjectsCount: subjectsToday.size || subs.length,
        pendingCount: pendingToday.length,
        totalCount: tasksToday.length
      });
      const todayProgress = progs.filter((p) => new Date(p.createdAt).toDateString() === today.toDateString());

      setProgress({
        totalMinutes: todayProgress.reduce((sum, p) => sum + p.minutesStudied, 0),
        completedTasks: todayProgress.reduce((sum, p) => sum + 1, 0),
        plannedTasks: tasks.filter(
          (t) => new Date(t.plannedDate).toDateString() === today.toDateString()
        ).length
      });

      const reminderList = [];
      if (tasks.length) {
        const pendingToday = tasks.filter(
          (t) => new Date(t.plannedDate).toDateString() === today.toDateString() && t.status === "pending"
        );
        if (pendingToday.length) {
          reminderList.push(`You have ${pendingToday.length} pending study block(s) today.`);
        }
      }
      if (!todayProgress.length) {
        reminderList.push("No study time logged yet today. A single 25-minute Pomodoro keeps your streak alive.");
      }
      setReminders(reminderList);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  }

  useEffect(() => {
    loadData();
    const checkIn = getTodayCheckIn();
    setTodayCheckIn(checkIn);
    if (!checkIn) {
      setShowCheckInModal(true);
    }
    const gamStats = getGamificationStats();
    const consistency = getWeeklyConsistency();
    setGamification({ ...gamStats, consistency });
    updateStreakIfNeeded();
  }, []);

  function handleCreateSubject(payload) {
    setStatus((current) => ({ ...current, savingSubject: true, error: "" }));

    try {
      createSubject(payload);
      loadData();
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }

    setStatus((current) => ({ ...current, savingSubject: false }));
  }

  function handleGeneratePlan() {
    setStatus((current) => ({ ...current, generatingPlan: true, error: "" }));

    try {
      const subs = getSubjects();
      if (!subs.length) {
        throw new Error("Add at least one subject before creating your study plan");
      }

      const adaptive = getAdaptiveStudyHours(3);
      const result = generateStudyPlan(subs, adaptive.hours, { horizonDays: 14 });
      createTasks(result.tasks);
      loadData();

      let message = "Plan created! ✅";
      if (adaptive.adjustment === "increased") {
        message = `Plan boosted to ${adaptive.hours}h/day! You're crushing it 🚀 (${adaptive.completionRate}% completion)`;
      } else if (adaptive.adjustment === "decreased") {
        message = `Plan adjusted to ${adaptive.hours}h/day. Let's focus on quality 🎯 (${adaptive.completionRate}% completion)`;
      }
      setStatus((current) => ({ ...current, note: message }));
      window.setTimeout(() => {
        setStatus((current) => ({ ...current, note: "" }));
      }, 4000);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }

    setStatus((current) => ({ ...current, generatingPlan: false }));
  }

  function handleTaskComplete(task) {
    try {
      updateTask(task._id, { status: "completed" });
      logProgress({
        subjectId: task.subject,
        taskId: task._id,
        minutesStudied: task.durationMinutes,
        pomodoroSessions: task.pomodorosPlanned,
        completed: true
      });

      const xpEarned = task.durationMinutes > 30 ? 25 : 15;
      addXP(xpEarned);
      if (gamification.streak.current + 1 === 3) {
        addBadge("3-day streak 🔥");
      } else if (gamification.streak.current + 1 === 7) {
        addBadge("Week warrior 💪");
      }

      loadData();
      setStatus((current) => ({ ...current, note: "Nice work! ✅" }));
      window.setTimeout(() => {
        setStatus((current) => ({ ...current, note: "" }));
      }, 2500);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  }

  function handleCheckIn(feeling) {
    try {
      logCheckIn(feeling);
      setTodayCheckIn({ feeling, date: new Date().toISOString().split("T")[0] });
      setShowCheckInModal(false);
      setStatus((current) => ({ ...current, note: feeling === "good" ? "Let's make today great! 🚀" : "We'll take it easy today." }));
      window.setTimeout(() => {
        setStatus((current) => ({ ...current, note: "" }));
      }, 2500);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  }

  function handleReflection(difficulty) {
    try {
      logReflection(difficulty);
      setShowReflectionModal(false);
      setStatus((current) => ({ ...current, note: "Thanks for the feedback! We'll adjust your plan." }));
      window.setTimeout(() => {
        setStatus((current) => ({ ...current, note: "" }));
      }, 2500);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  }

  function handlePomodoroComplete() {
    if (!subjects[0]?._id) {
      return;
    }

    try {
      logProgress({
        subjectId: subjects[0]._id,
        minutesStudied: 25,
        pomodoroSessions: 1,
        completed: false
      });
      loadData();
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  }

  function handleClearSchedule() {
    if (window.confirm("Are you sure you want to delete the entire study plan? This cannot be undone.")) {
      try {
        clearAllTasks();
        loadData();
        setStatus((current) => ({ ...current, note: "Study plan cleared." }));
        window.setTimeout(() => {
          setStatus((current) => ({ ...current, note: "" }));
        }, 2500);
      } catch (error) {
        setStatus((current) => ({ ...current, error: error.message }));
      }
    }
  }

  function handleDeleteSubject(subjectId, subjectName) {
    if (window.confirm(`Remove "${subjectName}" from your subjects?`)) {
      try {
        deleteSubject(subjectId);
        loadData();
        setStatus((current) => ({ ...current, note: `"${subjectName}" removed.` }));
        window.setTimeout(() => {
          setStatus((current) => ({ ...current, note: "" }));
        }, 2500);
      } catch (error) {
        setStatus((current) => ({ ...current, error: error.message }));
      }
    }
  }

  function handleFocus(task) {
    window.location.href = `/focus?taskId=${task._id}`;
  }

  function handleRescheduleOpen(task) {
    setRescheduleTask(task);
    const taskDate = new Date(task.plannedDate);
    const year = taskDate.getFullYear();
    const month = String(taskDate.getMonth() + 1).padStart(2, "0");
    const day = String(taskDate.getDate()).padStart(2, "0");
    setRescheduleDate(`${year}-${month}-${day}`);
    setShowRescheduleModal(true);
  }

  function handleRescheduleSubmit() {
    if (!rescheduleTask || !rescheduleDate) return;
    try {
      moveTask(rescheduleTask._id, new Date(rescheduleDate));
      loadData();
      setShowRescheduleModal(false);
      setRescheduleTask(null);
      setStatus((current) => ({ ...current, note: `Task moved to ${rescheduleDate}` }));
      window.setTimeout(() => {
        setStatus((current) => ({ ...current, note: "" }));
      }, 2500);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  }

  const hasSubjects = subjects.length > 0;
  const hasPlan = tasks.length > 0;
  const showGettingStarted = !hasSubjects || !hasPlan;

  const plannedHours = todaySummary.plannedMinutes ? todaySummary.plannedMinutes / 60 : 0;
  const plannedHoursRounded = Math.round(plannedHours * 10) / 10;
  const plannedHoursLabel = plannedHoursRounded === 1 ? "1 hour" : `${plannedHoursRounded} hours`;
  const doneForToday = todaySummary.totalCount > 0 && todaySummary.pendingCount === 0;

  return (
    <>
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="panel m-4 max-w-md space-y-5 p-6">
            <h2 className="font-display text-2xl font-semibold">How are you feeling today?</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleCheckIn("good")}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-4 text-left font-medium hover:border-sunrise hover:bg-sunrise/5 dark:border-slate-700 dark:hover:bg-sunrise/10"
              >
                Good 🙂
              </button>
              <button
                type="button"
                onClick={() => handleCheckIn("okay")}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-4 text-left font-medium hover:border-sunrise hover:bg-sunrise/5 dark:border-slate-700 dark:hover:bg-sunrise/10"
              >
                Okay 😐
              </button>
              <button
                type="button"
                onClick={() => handleCheckIn("tired")}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-4 text-left font-medium hover:border-sunrise hover:bg-sunrise/5 dark:border-slate-700 dark:hover:bg-sunrise/10"
              >
                Tired 😴
              </button>
            </div>
          </div>
        </div>
      )}

      {showReflectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="panel m-4 max-w-md space-y-5 p-6">
            <h2 className="font-display text-2xl font-semibold">How was your study today?</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleReflection("easy")}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-4 text-left font-medium hover:border-sunrise hover:bg-sunrise/5 dark:border-slate-700 dark:hover:bg-sunrise/10"
              >
                Easy
              </button>
              <button
                type="button"
                onClick={() => handleReflection("okay")}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-4 text-left font-medium hover:border-sunrise hover:bg-sunrise/5 dark:border-slate-700 dark:hover:bg-sunrise/10"
              >
                Okay
              </button>
              <button
                type="button"
                onClick={() => handleReflection("hard")}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-4 text-left font-medium hover:border-sunrise hover:bg-sunrise/5 dark:border-slate-700 dark:hover:bg-sunrise/10"
              >
                Hard
              </button>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="panel m-4 max-w-md space-y-5 p-6">
            <h2 className="font-display text-2xl font-semibold">Reschedule task</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{rescheduleTask?.title}</p>
            <div className="space-y-3">
              <label className="block">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">New date</p>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 rounded-2xl border-2 border-slate-300 px-4 py-2 font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRescheduleSubmit}
                  className="flex-1 rounded-2xl bg-sunrise px-4 py-2 font-medium text-white hover:bg-sunrise/90"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardShell
        title="Dashboard"
        subtitle="Here's your plan for today."
      >
        <section className="grid gap-4 md:grid-cols-5">
          <div className="panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Streak</p>
            <p className="mt-2 font-display text-3xl font-semibold">{gamification.streak.current}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">days 🔥</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Level</p>
            <p className="mt-2 font-display text-3xl font-semibold">{gamification.level}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{gamification.xp} XP</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Consistency</p>
            <p className="mt-2 font-display text-3xl font-semibold">{gamification.consistency}%</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">this week</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Badges</p>
            <p className="mt-2 text-lg">{gamification.badges.length > 0 ? gamification.badges[gamification.badges.length - 1] : "—"}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Check-in</p>
            <p className="mt-2 text-2xl">{todayCheckIn?.feeling === "good" ? "🙂" : todayCheckIn?.feeling === "tired" ? "😴" : "😐"}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Done</p>
          </div>
        </section>

        <section className="panel p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Today’s plan</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start small. Stay consistent.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={() => scrollToRef(pomodoroRef)}>
              Start focus session
            </button>
            <button type="button" className="btn-secondary" onClick={() => scrollToRef(scheduleRef)}>
              View full schedule
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="panel-muted p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total study time</p>
            <p className="mt-2 font-display text-3xl font-semibold">{plannedHoursLabel}</p>
          </div>
          <div className="panel-muted p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Subjects</p>
            <p className="mt-2 font-display text-3xl font-semibold">{todaySummary.subjectsCount || subjects.length}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">You’re doing great 👍</p>
      </section>

      <section className="panel p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Quick actions</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Jump in wherever you are.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={() => scrollToRef(subjectFormRef)}>
              Add subject
            </button>
            <button type="button" className="btn-secondary" onClick={handleGeneratePlan} disabled={status.generatingPlan}>
              {status.generatingPlan ? "Creating..." : "Create today’s plan"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => scrollToRef(pomodoroRef)}>
              Start focus session
            </button>
          </div>
        </div>
      </section>

      {showGettingStarted ? (
        <section className="panel p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">👋 Let’s get you started</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                <li>Add your subjects</li>
                <li>Create your study plan</li>
                <li>Start your session</li>
              </ol>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!hasSubjects) {
                  scrollToRef(subjectFormRef);
                  return;
                }

                handleGeneratePlan();
                scrollToRef(scheduleRef);
              }}
            >
              Start here
            </button>
          </div>
        </section>
      ) : null}

      <PlannerOverview stats={progress} />
      {status.error ? <p className="mt-5 text-sm text-red-500">{status.error}</p> : null}
      {status.note ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{status.note}</p> : null}
      {doneForToday ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">You’re done for today 🎉</p> : null}
      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
        <div className="space-y-6">
          <div ref={(node) => (subjectFormRef.current = node)}>
            <SubjectForm onSubmit={handleCreateSubject} submitting={status.savingSubject} />
          </div>
          <NotificationPanel reminders={reminders} />
          <div ref={(node) => (pomodoroRef.current = node)}>
            <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
          </div>
        </div>
        <div className="space-y-6">
          <section className="panel p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold">Your subjects</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subjects.length} subject(s) available for the planner.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={handleGeneratePlan} className="btn-primary" disabled={status.generatingPlan}>
                  {status.generatingPlan ? "Creating..." : "Create today's plan"}
                </button>
                {hasPlan ? (
                  <button type="button" onClick={handleClearSchedule} className="btn-secondary">
                    Clear schedule
                  </button>
                ) : null}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <article key={subject._id} className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                        <p className="font-semibold">{subject.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(subject._id, subject.name)}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                        aria-label={`Remove ${subject.name}`}
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      {subject.priority} priority • {subject.weeklyTargetHours}h weekly • confidence {subject.currentConfidence}/5
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No subjects added yet.</p>
              )}
            </div>
          </section>
          <div ref={(node) => (scheduleRef.current = node)}>
            <TaskBoard schedule={schedule} onComplete={handleTaskComplete} onFocus={handleFocus} onReschedule={handleRescheduleOpen} />
          </div>
        </div>
      </div>
    </DashboardShell>
    </>
  );
}

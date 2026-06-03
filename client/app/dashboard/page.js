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

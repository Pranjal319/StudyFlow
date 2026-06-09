"use client";

import { useEffect, useState } from "react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { DashboardShell } from "@/components/dashboard-shell";
import { getSubjects, getTasks, getProgress, generateAnalyticsInsights } from "@/lib/api";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    weeklyProgress: [],
    timeBySubject: [],
    taskBreakdown: [],
    weakSubjects: [],
    insights: [],
    streak: { current: 0, best: 0 },
    achievements: []
  });
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const subs = getSubjects();
      const progs = getProgress();
      const tasks = getTasks();

      // Weekly progress
      const today = new Date();
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayStr = date.toDateString();
        const dayProgs = progs.filter((p) => new Date(p.createdAt).toDateString() === dayStr);
        const minutes = dayProgs.reduce((sum, p) => sum + p.minutesStudied, 0);
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
        weeklyData.push({ day, minutes, completedTasks: dayProgs.length });
      }

      // Time by subject
      const timeBySubject = subs.map((sub) => {
        const subProgs = progs.filter((p) => p.subjectId === sub._id);
        return {
          name: sub.name,
          color: sub.color,
          minutes: subProgs.reduce((sum, p) => sum + p.minutesStudied, 0),
          sessions: subProgs.length
        };
      });

      // Task breakdown
      const pending = tasks.filter((t) => t.status === "pending").length;
      const completed = tasks.filter((t) => t.status === "completed").length;
      const skipped = tasks.filter((t) => t.status === "skipped").length;
      const taskBreakdown = [
        { name: "pending", value: pending },
        { name: "completed", value: completed },
        { name: "skipped", value: skipped }
      ];

      const userData = JSON.parse(localStorage.getItem("ai-study-planner:user") || "{}");
      const streak = userData.streak || { current: 0, best: 0 };

      const insights = generateAnalyticsInsights();

      setAnalytics({
        weeklyProgress: weeklyData,
        timeBySubject,
        taskBreakdown,
        weakSubjects: [],
        insights,
        streak,
        achievements: userData.achievements || []
      });
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  return (
    <DashboardShell
      title="Analytics"
      subtitle="Measure execution quality, identify weak subjects, and showcase evidence that the planner changes behavior."
    >
      {error ? <p className="mb-6 text-sm text-red-400">{error}</p> : null}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <article className="panel p-6">
          <p className="text-sm text-[#9CA3AF]">Current streak</p>
          <p className="mt-3 font-display text-4xl font-semibold text-[#E5E7EB]">{analytics.streak.current} days</p>
        </article>
        <article className="panel p-6">
          <p className="text-sm text-[#9CA3AF]">Best streak</p>
          <p className="mt-3 font-display text-4xl font-semibold text-[#E5E7EB]">{analytics.streak.best} days</p>
        </article>
        <article className="panel p-6">
          <p className="text-sm text-[#9CA3AF]">Achievements</p>
          <p className="mt-3 font-display text-4xl font-semibold text-[#E5E7EB]">{analytics.achievements.length}</p>
        </article>
      </div>
      <AnalyticsCharts
        weeklyProgress={analytics.weeklyProgress}
        timeBySubject={analytics.timeBySubject}
        taskBreakdown={analytics.taskBreakdown}
      />
      <section className="panel mt-6 p-6">
        <h2 className="font-display text-2xl font-semibold">Insights</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {analytics.insights.length > 0 ? (
            analytics.insights.map((insight, idx) => (
              <article
                key={idx}
                className={`rounded-2xl border p-4 ${
                  insight.type === "positive"
                    ? "border-sunset/30 bg-sunset/5 dark:border-sunset/40 dark:bg-sunset/10"
                    : insight.type === "action"
                    ? "border-sunrise/30 bg-sunrise/5 dark:border-sunrise/40 dark:bg-sunrise/10"
                    : "border-slate-200/80 dark:border-slate-700"
                }`}
              >
                <p className="font-semibold">{insight.title}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{insight.message}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete tasks and build a consistent study routine to unlock insights.
            </p>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

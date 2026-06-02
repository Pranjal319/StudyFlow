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

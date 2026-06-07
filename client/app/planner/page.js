"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/calendar-view";
import { DashboardShell } from "@/components/dashboard-shell";
import { ExportPlanButton } from "@/components/export-plan-button";
import { TaskBoard } from "@/components/task-board";
import { generateStudyPlan } from "@/lib/planner";
import {
  getSubjects,
  getTasks,
  createTasks,
  updateTask
} from "@/lib/api";

export default function PlannerPage() {
  const [schedule, setSchedule] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  function loadPlan() {
    try {
      const tasks = getTasks();
      const grouped = tasks.reduce((accumulator, task) => {
        const key = new Date(task.plannedDate).toISOString().split("T")[0];
        if (!accumulator[key]) {
          accumulator[key] = { date: key, tasks: [] };
        }
        accumulator[key].tasks.push(task);
        return accumulator;
      }, {});
      setSchedule(Object.values(grouped));
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => {
    loadPlan();
  }, []);

  function handleRegenerate() {
    try {
      const subs = getSubjects();
      if (!subs.length) {
        throw new Error("Add subjects first");
      }
      const result = generateStudyPlan(subs, 3, { horizonDays: 21 });
      createTasks(result.tasks);
      setSuggestions([]);

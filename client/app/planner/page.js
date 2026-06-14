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
      loadPlan();
    } catch (generationError) {
      setError(generationError.message);
    }
  }

  function handleTaskComplete(task) {
    try {
      updateTask(task._id, { status: "completed" });
      loadPlan();
    } catch (taskError) {
      setError(taskError.message);
    }
  }

  return (
    <DashboardShell
      title="Study planner"
      subtitle="Visualize the AI-generated timetable, export it, and inspect the balance across the next few weeks."
    >
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <div className="mb-6 flex flex-wrap gap-3">
        <button type="button" onClick={handleRegenerate} className="btn-primary">
          Regenerate 21-day plan
        </button>
        <ExportPlanButton schedule={schedule} />
      </div>
      {suggestions.length ? (
        <section className="panel mb-6 p-6">
          <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">AI suggestions for weak subjects</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {suggestions.map((suggestion) => (
              <div key={suggestion} className="rounded-lg bg-[#1F2937] border border-[#1F2937] px-4 py-3 text-sm text-[#9CA3AF]">
                {suggestion}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <div className="space-y-6">
        <CalendarView schedule={schedule} />
        <TaskBoard schedule={schedule} onComplete={handleTaskComplete} />
      </div>
    </DashboardShell>
  );
}

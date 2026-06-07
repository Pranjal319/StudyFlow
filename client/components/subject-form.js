"use client";

import { useState } from "react";
import { priorityOptions, subjectColors } from "@/lib/constants";

const initialState = {
  name: "",
  priority: "medium",
  examDate: "",
  weeklyTargetHours: 4,
  difficulty: 3,
  currentConfidence: 3,
  color: subjectColors[0]
};

export function SubjectForm({ onSubmit, submitting }) {
  const [values, setValues] = useState(initialState);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(values);
    setValues(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">Add subject</h2>
          <p className="text-sm text-[#9CA3AF]">Tell us about your subject so we can plan better.</p>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#E5E7EB]" htmlFor="subject-name">
          Subject Name
        </label>
        <input
          id="subject-name"
          className="field"
          placeholder="e.g., Mathematics"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#E5E7EB]" htmlFor="subject-priority">
            Priority
          </label>
          <select
            id="subject-priority"
            className="field"
            value={values.priority}
            onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value }))}
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#6B7280]">Higher priority gets scheduled sooner.</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#E5E7EB]" htmlFor="subject-deadline">
            Deadline (Select date)
          </label>
          <input
            id="subject-deadline"
            className="field"
            type="date"
            value={values.examDate}
            onChange={(event) => setValues((current) => ({ ...current, examDate: event.target.value }))}
          />
          <p className="text-xs text-[#6B7280]">Optional, but helpful for planning.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#E5E7EB]" htmlFor="subject-hours">
            Study hours per week
          </label>
          <input
            id="subject-hours"
            className="field"
            type="number"
            min="1"
            max="40"
            value={values.weeklyTargetHours}
            onChange={(event) => setValues((current) => ({ ...current, weeklyTargetHours: Number(event.target.value) }))}
            placeholder="e.g., 4"
          />
          <p className="text-xs text-[#6B7280]">Be realistic — you can adjust later.</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#E5E7EB]" htmlFor="subject-difficulty">
            Difficulty (Easy / Medium / Hard)
          </label>
          <select
            id="subject-difficulty"
            className="field"
            value={values.difficulty}
            onChange={(event) => setValues((current) => ({ ...current, difficulty: Number(event.target.value) }))}
          >
            <option value={2}>Easy</option>
            <option value={3}>Medium</option>
            <option value={4}>Hard</option>
          </select>
          <p className="text-xs text-[#6B7280]">How challenging does it feel right now?</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#E5E7EB]" htmlFor="subject-confidence">
            Confidence level (1–5)
          </label>
          <select
            id="subject-confidence"
            className="field"
            value={values.currentConfidence}
            onChange={(event) => setValues((current) => ({ ...current, currentConfidence: Number(event.target.value) }))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#6B7280]">1 = not confident, 5 = very confident.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {subjectColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setValues((current) => ({ ...current, color }))}
            className={`h-10 w-10 rounded-lg border-2 transition duration-200 hover:scale-110 ${
              values.color === color ? "border-[#E5E7EB] shadow-lg" : "border-[#1F2937]"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Saving..." : "Add subject"}
      </button>
    </form>
  );
}

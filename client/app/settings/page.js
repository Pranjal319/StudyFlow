"use client";

import { useEffect, useState } from "react";
import { FiRotateCcw } from "react-icons/fi";
import { DashboardShell } from "@/components/dashboard-shell";
import { getUser, updateUser, clearAllTasks, clearAllData } from "@/lib/api";

const STUDY_STYLES = [
  { id: "deep", label: "Deep focus", description: "Long sessions, fewer breaks" },
  { id: "balanced", label: "Balanced", description: "Moderate sessions and breaks" },
  { id: "light", label: "Light & consistent", description: "Short sessions, more breaks" }
];

const ENERGY_PATTERNS = [
  { id: "morning", label: "Morning", description: "Best focus in the AM" },
  { id: "afternoon", label: "Afternoon", description: "Peak energy post-lunch" },
  { id: "night", label: "Night", description: "I'm a night owl" }
];

const GOAL_MODES = [
  { id: "exams", label: "Exams coming up", description: "Cramming before the big day" },
  { id: "consistency", label: "Daily consistency", description: "Build healthy habits" },
  { id: "starter", label: "Just getting started", description: "Learning the basics" }
];

const FOCUS_ENVIRONMENTS = [
  { id: "silent", label: "Silent", description: "Complete quiet" },
  { id: "ambient", label: "Light background noise", description: "Coffee shop vibes" },
  { id: "music", label: "Music-friendly", description: "Light music helps me focus" }
];

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    studyHoursPerDay: 3,
    darkMode: true,
    studyStyle: "balanced",
    energyPattern: "afternoon",
    goalMode: "consistency",
    focusEnvironment: "silent"
  });
  const [status, setStatus] = useState({ loading: true, saving: false, message: "", error: "" });

  useEffect(() => {
    const user = getUser();
    setForm((current) => ({
      ...current,
      name: user.name,
      studyHoursPerDay: user.studyHoursPerDay,
      darkMode: user.darkMode,
      studyStyle: user.preferences?.studyStyle || "balanced",
      energyPattern: user.preferences?.energyPattern || "afternoon",
      goalMode: user.preferences?.goalMode || "consistency",
      focusEnvironment: user.preferences?.focusEnvironment || "silent"
    }));
    setStatus((current) => ({ ...current, loading: false }));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: false, saving: true, message: "", error: "" });

    try {
      const updated = updateUser({
        name: form.name,
        studyHoursPerDay: Number(form.studyHoursPerDay),
        darkMode: form.darkMode,
        preferences: {
          studyStyle: form.studyStyle,
          energyPattern: form.energyPattern,
          goalMode: form.goalMode,
          focusEnvironment: form.focusEnvironment
        }
      });

      document.documentElement.classList.toggle("dark", updated.darkMode);
      window.localStorage.setItem("ai-study-planner-theme", updated.darkMode ? "dark" : "light");
      setStatus({ loading: false, saving: false, message: "Preferences updated ✅", error: "" });
      window.setTimeout(() => {
        setStatus((current) => ({ ...current, message: "" }));
      }, 3000);
    } catch (error) {
      setStatus({ loading: false, saving: false, message: "", error: error.message });
    }
  }

  function handleResetPlan() {
    if (window.confirm("Remove your current study plan? This cannot be undone.")) {
      try {
        clearAllTasks();
        setStatus((current) => ({ ...current, message: "Study plan cleared." }));
        window.setTimeout(() => {
          setStatus((current) => ({ ...current, message: "" }));
        }, 2500);
      } catch (error) {
        setStatus((current) => ({ ...current, error: error.message }));
      }
    }
  }

  function handleResetAll() {
    if (window.confirm("Clear all data? This will remove subjects, plans, and progress. This cannot be undone.")) {
      try {
        clearAllData();
        setStatus((current) => ({ ...current, message: "All data cleared." }));
        window.setTimeout(() => {
          setStatus((current) => ({ ...current, message: "" }));
        }, 2500);
      } catch (error) {
        setStatus((current) => ({ ...current, error: error.message }));
      }
    }
  }

  const studyStyleLabel = STUDY_STYLES.find((s) => s.id === form.studyStyle)?.label || "Balanced";
  const energyLabel = ENERGY_PATTERNS.find((e) => e.id === form.energyPattern)?.label || "Afternoon";
  const goalLabel = GOAL_MODES.find((g) => g.id === form.goalMode)?.label || "Daily consistency";
  const environmentLabel = FOCUS_ENVIRONMENTS.find((e) => e.id === form.focusEnvironment)?.label || "Silent";

  return (
    <DashboardShell
      title="Preferences"
      subtitle="Customize your study experience. We'll adjust your plan based on your settings."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          <div className="space-y-8">
            <section className="panel p-6">
              <h2 className="font-display text-xl font-semibold text-[#111827] dark:text-[#E5E7EB]">Your study style</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">We'll adjust your study sessions based on this.</p>
              <div className="mt-4 space-y-3">
                {STUDY_STYLES.map((style) => (
                  <label key={style.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                    form.studyStyle === style.id
                      ? "border-[#22C55E] bg-[#22C55E]/5 dark:border-[#22C55E] dark:bg-[#22C55E]/5"
                      : "border-[#D1D5DB] dark:border-[#1F2937] hover:border-[#D1D5DB]/70 dark:hover:border-[#1F2937]/70"
                  }`}>
                    <input
                      type="radio"
                      name="studyStyle"
                      value={style.id}
                      checked={form.studyStyle === style.id}
                      onChange={(event) => setForm((current) => ({ ...current, studyStyle: event.target.value }))}
                      className="h-5 w-5 accent-[#22C55E] cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-[#111827] dark:text-[#E5E7EB]">{style.label}</p>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{style.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="panel p-6">
              <h2 className="font-display text-xl font-semibold text-[#111827] dark:text-[#E5E7EB]">When do you feel most focused?</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">We'll schedule your harder subjects at your best time.</p>
              <div className="mt-4 space-y-3">
                {ENERGY_PATTERNS.map((pattern) => (
                  <label key={pattern.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                    form.energyPattern === pattern.id
                      ? "border-[#22C55E] bg-[#22C55E]/5 dark:border-[#22C55E] dark:bg-[#22C55E]/5"
                      : "border-[#D1D5DB] dark:border-[#1F2937] hover:border-[#D1D5DB]/70 dark:hover:border-[#1F2937]/70"
                  }`}>
                    <input
                      type="radio"
                      name="energyPattern"
                      value={pattern.id}
                      checked={form.energyPattern === pattern.id}
                      onChange={(event) => setForm((current) => ({ ...current, energyPattern: event.target.value }))}
                      className="h-5 w-5 accent-[#22C55E] cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-[#111827] dark:text-[#E5E7EB]">{pattern.label}</p>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{pattern.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="panel p-6">
              <h2 className="font-display text-xl font-semibold text-[#111827] dark:text-[#E5E7EB]">What are you aiming for?</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">Your plan will adjust based on your goal.</p>
              <div className="mt-4 space-y-3">
                {GOAL_MODES.map((goal) => (
                  <label key={goal.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                    form.goalMode === goal.id
                      ? "border-[#22C55E] bg-[#22C55E]/5 dark:border-[#22C55E] dark:bg-[#22C55E]/5"
                      : "border-[#D1D5DB] dark:border-[#1F2937] hover:border-[#D1D5DB]/70 dark:hover:border-[#1F2937]/70"
                  }`}>
                    <input
                      type="radio"
                      name="goalMode"
                      value={goal.id}
                      checked={form.goalMode === goal.id}
                      onChange={(event) => setForm((current) => ({ ...current, goalMode: event.target.value }))}
                      className="h-5 w-5 accent-[#22C55E] cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-[#111827] dark:text-[#E5E7EB]">{goal.label}</p>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{goal.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="panel p-6">
              <h2 className="font-display text-xl font-semibold text-[#111827] dark:text-[#E5E7EB]">How do you like to study?</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">This helps us personalize your focus sessions.</p>
              <div className="mt-4 space-y-3">
                {FOCUS_ENVIRONMENTS.map((env) => (
                  <label key={env.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                    form.focusEnvironment === env.id
                      ? "border-[#22C55E] bg-[#22C55E]/5 dark:border-[#22C55E] dark:bg-[#22C55E]/5"
                      : "border-[#D1D5DB] dark:border-[#1F2937] hover:border-[#D1D5DB]/70 dark:hover:border-[#1F2937]/70"
                  }`}>
                    <input
                      type="radio"
                      name="focusEnvironment"
                      value={env.id}
                      checked={form.focusEnvironment === env.id}
                      onChange={(event) => setForm((current) => ({ ...current, focusEnvironment: event.target.value }))}
                      className="h-5 w-5 accent-[#22C55E] cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-[#111827] dark:text-[#E5E7EB]">{env.label}</p>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{env.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="panel p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#111827] dark:text-[#E5E7EB]">Start fresh</h2>
                  <p className="mt-1 text-sm text-[#9CA3AF]">This will remove your current data.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={handleResetPlan}
                  className="flex w-full items-center gap-3 rounded-lg border border-[#D1D5DB] px-4 py-3 text-left text-sm text-[#111827] hover:bg-[#F3F4F6] transition dark:border-[#374151] dark:text-[#E5E7EB] dark:hover:bg-[#1F2937]"
                >
                  <FiRotateCcw size={18} />
                  <div>
                    <p className="font-medium text-[#111827] dark:text-[#E5E7EB]">Reset study plan</p>
                    <p className="text-xs text-[#6B7280]">Keep subjects, remove schedule</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="flex w-full items-center gap-3 rounded-lg border border-red-600/30 px-4 py-3 text-left text-sm hover:bg-red-600/10 transition"
                >
                  <FiRotateCcw size={18} className="text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-red-500">Clear all data</p>
                    <p className="text-xs text-red-400">Subjects, plans, progress</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <section className="panel sticky top-24 p-6">
              <h3 className="font-display text-lg font-semibold text-[#E5E7EB]">Your setup</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6B7280]">Study style</p>
                  <p className="mt-1 font-medium text-[#111827] dark:text-[#E5E7EB]">{studyStyleLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6B7280]">Best time</p>
                  <p className="mt-1 font-medium text-[#111827] dark:text-[#E5E7EB]">{energyLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6B7280]">Your goal</p>
                  <p className="mt-1 font-medium text-[#111827] dark:text-[#E5E7EB]">{goalLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6B7280]">Environment</p>
                  <p className="mt-1 font-medium text-[#111827] dark:text-[#E5E7EB]">{environmentLabel}</p>
                </div>
              </div>
              <p className="mt-6 text-xs text-[#6B7280]">You can change this anytime.</p>
            </section>

            <section className="panel p-6">
              <label className="flex items-center gap-3 rounded-lg border border-[#D1D5DB] px-4 py-4 hover:bg-[#F3F4F6] transition cursor-pointer dark:border-[#374151] dark:hover:bg-[#1F2937]">
                <input
                  type="checkbox"
                  checked={form.darkMode}
                  onChange={(event) => setForm((current) => ({ ...current, darkMode: event.target.checked }))}
                  className="accent-[#22C55E]"
                />
                <span className="text-sm font-medium text-[#111827] dark:text-[#E5E7EB]">Dark mode</span>
              </label>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-[#E5E7EB]">Your name</label>
                  <input
                    className="field"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    disabled={status.loading}
                    placeholder="e.g., Alex"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-[#E5E7EB]">Daily study hours</label>
                  <input
                    className="field"
                    type="number"
                    min="1"
                    max="12"
                    value={form.studyHoursPerDay}
                    onChange={(event) => setForm((current) => ({ ...current, studyHoursPerDay: event.target.value }))}
                    disabled={status.loading}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {status.error ? <p className="text-sm text-red-400">{status.error}</p> : null}
        {status.message ? <p className="text-sm text-green-400">{status.message}</p> : null}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={status.saving}>
            {status.saving ? "Saving..." : "Save preferences"}
          </button>
          <p className="flex items-center text-sm text-[#6B7280]">Start small. Stay consistent.</p>
        </div>
      </form>
    </DashboardShell>
  );
}
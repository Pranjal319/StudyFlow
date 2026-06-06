"use client";

import { FiCheckCircle, FiClock, FiTarget } from "react-icons/fi";

export function PlannerOverview({ stats }) {
  const items = [
    {
      label: "Today focus minutes",
      value: stats?.totalMinutes || 0,
      suffix: "min",
      icon: FiClock,
      color: "bg-[#22C55E]"
    },
    {
      label: "Completed tasks",
      value: stats?.completedTasks || 0,
      suffix: "done",
      icon: FiCheckCircle,
      color: "bg-[#10B981]"
    },
    {
      label: "Planned tasks",
      value: stats?.plannedTasks || 0,
      suffix: "queued",
      icon: FiTarget,
      color: "bg-[#3B82F6]"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.label} className="group panel p-6 transition duration-300 hover:border-[#22C55E]/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6B7280]">{item.label}</p>
                <p className="mt-4 font-display text-3xl font-semibold text-[#E5E7EB]">
                  {item.value}
                  <span className="ml-2 text-xs font-medium text-[#9CA3AF]">{item.suffix}</span>
                </p>
              </div>
              <div className={`${item.color} rounded-md p-2.5 text-white`}>
                <Icon size={20} />
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1 rounded-full bg-[#E5E7EB] dark:bg-[#1F2937] transition-colors duration-300">
              <div
                className={`${item.color} h-1 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((item.value / 100) * 100, 100)}%` }}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

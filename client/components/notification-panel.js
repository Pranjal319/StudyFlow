"use client";

export function NotificationPanel({ reminders = [] }) {
  return (
    <section className="panel p-6">
      <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">Daily reminders</h2>
      <div className="mt-4 space-y-3">
        {reminders.length ? (
          reminders.map((reminder) => (
            <div key={reminder} className="rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 px-4 py-3 text-sm text-[#22C55E]">
              {reminder}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-[#1F2937] px-4 py-3 text-sm text-[#6B7280] bg-[#0F1419]">
            No reminders yet. Generate today’s plan to activate guidance.
          </div>
        )}
      </div>
    </section>
  );
}

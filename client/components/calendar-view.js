"use client";

export function CalendarView({ schedule = [] }) {
  return (
    <section className="panel p-6">
      <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">Calendar view</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {schedule.map((day) => (
          <article key={day.date} className="rounded-lg border border-[#1F2937] bg-[#111827] p-4 transition duration-200 hover:border-[#22C55E]/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#E5E7EB]">{day.date}</p>
                <p className="text-xs text-[#6B7280]">{day.tasks.length} items</p>
              </div>
            </div>
            <div className="space-y-2">
              {day.tasks.slice(0, 4).map((task) => (
                <div key={task._id} className="rounded-md bg-[#1F2937] px-3 py-2 text-xs">
                  <p className="font-medium text-[#E5E7EB]">{task.subject?.name || task.subjectName}</p>
                  <p className="text-[#9CA3AF]">{task.durationMinutes} min</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

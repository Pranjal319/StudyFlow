"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function AnalyticsCharts({ weeklyProgress = [], timeBySubject = [], taskBreakdown = [] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr,0.9fr]">
      {/* Weekly Progress */}
      <section className="panel p-6">
        <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">Weekly Progress</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">Your study minutes over the past week</p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="0" stroke="rgba(31, 41, 55, 0.8)" vertical={false} />
              <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #1F2937",
                  borderRadius: "8px",
                  color: "#E5E7EB"
                }}
              />
              <Bar dataKey="minutes" radius={[8, 8, 0, 0]} fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Task Status */}
      <section className="panel p-6">
        <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">Task Status</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">Breakdown of your tasks</p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {taskBreakdown.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={["#22C55E", "#10B981", "#3B82F6"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #1F2937",
                  borderRadius: "8px",
                  color: "#E5E7EB"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Time by Subject */}
      <section className="panel p-6 lg:col-span-2">
        <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">Study Time by Subject</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">Where you're focusing your study efforts</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {timeBySubject.map((subject) => (
            <article
              key={subject.name}
              className="group rounded-lg border border-[#1F2937] bg-[#111827] p-4 transition duration-200 hover:border-[#22C55E]/30"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#E5E7EB]">{subject.name}</p>
                <span
                  className="h-3 w-3 rounded-full transition duration-200 group-hover:scale-110"
                  style={{ backgroundColor: subject.color }}
                />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-[#E5E7EB]">{subject.minutes}</p>
              <p className="mt-1 text-xs text-[#9CA3AF]">{subject.sessions} pomodoro session(s)</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

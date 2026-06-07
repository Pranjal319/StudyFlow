"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiBook } from "react-icons/fi";

export function TaskBoard({ schedule = [], onComplete, onFocus, onReschedule }) {
  const [showCompleted, setShowCompleted] = useState(true);

  const hasAnyTasks = useMemo(() => schedule.some((day) => day.tasks?.length), [schedule]);

  return (
    <section className="panel p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#E5E7EB]">Daily Schedule</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">Your focused study sessions for today</p>
        </div>
        {hasAnyTasks ? (
          <button
            type="button"
            className="btn-secondary px-4 py-2 text-sm"
            onClick={() => setShowCompleted((v) => !v)}
          >
            {showCompleted ? "Hide completed" : "Show completed"}
          </button>
        ) : null}
      </div>

      <div className="space-y-6">
        {schedule.length ? (
          schedule.map((day) => (
            <div key={day.date}>
              <div className="mb-4">
                <p className="font-semibold text-[#E5E7EB]">{day.date}</p>
                <p className="text-xs text-[#6B7280]">{day.tasks.length} session(s)</p>
              </div>
              <div className="space-y-3">
                {(() => {
                  const pendingTasks = (day.tasks || []).filter((t) => t.status !== "completed");
                  const completedTasks = (day.tasks || []).filter((t) => t.status === "completed");
                  const visibleTasks = showCompleted ? [...pendingTasks, ...completedTasks] : pendingTasks;

                  return visibleTasks.flatMap((task, index) => {
                    const isFirstCompleted =
                      showCompleted && index === pendingTasks.length && pendingTasks.length && completedTasks.length;

                    const maybeCompletedLabel = isFirstCompleted ? (
                      <p
                        key={`${day.date}-completed`}
                        className="pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]"
                      >
                        Completed
                      </p>
                    ) : null;

                    const taskCard = (
                      <article
                        key={task._id}
                        className={`group flex flex-col gap-4 rounded-lg border p-4 transition duration-200 md:flex-row md:items-center md:justify-between ${
                          task.status === "completed"
                            ? "border-[#1F2937] bg-[#0F1419] opacity-60"
                            : "border-[#1F2937] bg-[#111827] hover:border-[#22C55E]/30"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={task.status === "completed"}
                            onChange={() => onComplete(task)}
                            disabled={task.status === "completed"}
                            className="mt-1.5 cursor-pointer accent-[#22C55E]"
                            aria-label={task.status === "completed" ? "Completed" : "Mark complete"}
                          />
                          <div className="flex-1">
                            <p
                              className={`font-semibold transition duration-200 ${
                                task.status === "completed"
                                  ? "line-through text-[#6B7280]"
                                  : "text-[#E5E7EB]"
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#9CA3AF]">
                              <span className="flex items-center gap-1">
                                <FiBook size={14} />
                                {task.subject?.name || task.subjectName}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiClock size={14} />
                                {task.durationMinutes} min
                              </span>
                              <span>🍅 {task.pomodorosPlanned} session(s)</span>
                            </div>
                            {task.notes ? (
                              <p className="mt-2 text-xs text-[#6B7280] italic">{task.notes}</p>
                            ) : null}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {task.status !== "completed" && onReschedule ? (
                            <button type="button" onClick={() => onReschedule(task)} className="btn-secondary px-3 py-2 text-xs">
                              Reschedule
                            </button>
                          ) : null}
                          {task.status !== "completed" && onFocus ? (
                            <button
                              type="button"
                              onClick={() => onFocus(task)}
                              className="btn-secondary px-3 py-2 text-xs flex items-center gap-1"
                            >
                              <FiClock size={14} />
                              Focus
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => onComplete(task)}
                            disabled={task.status === "completed"}
                            className={`px-3 py-2 text-xs font-medium rounded-md transition duration-200 flex items-center gap-1 ${
                              task.status === "completed"
                                ? "cursor-not-allowed opacity-50 bg-[#1F2937] text-[#6B7280]"
                                : "btn-primary"
                            }`}
                          >
                            <FiCheckCircle size={14} />
                            {task.status === "completed" ? "Done" : "Done"}
                          </button>
                        </div>
                      </article>
                    );

                    return maybeCompletedLabel ? [maybeCompletedLabel, taskCard] : [taskCard];
                  });
                })()}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed bg-white dark:bg-[#0F1419] border-[#E5E7EB] dark:border-[#1F2937] p-6 text-center transition-colors duration-300">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">No plan yet. Create your plan to get started.</p>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { getTasks, updateTask, logProgress } from "@/lib/api";

export default function FocusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  
  const [task, setTask] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const focusContainerRef = useRef(null);

  useEffect(() => {
    try {
      const tasks = getTasks();
      const targetTask = tasks.find(t => t._id === taskId);
      if (!targetTask) {
        router.push("/dashboard");
        return;
      }
      setTask(targetTask);
    } catch (error) {
      console.error("Error loading task:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [taskId, router]);

  useEffect(() => {
    const enterFullscreen = async () => {
      if (focusContainerRef.current && document.fullscreenEnabled) {
        try {
          await focusContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } catch (error) {
          console.warn("Fullscreen request failed:", error);
        }
      }
    };

    if (!loading) {
      enterFullscreen();
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [loading]);

  function handleTaskComplete() {
    try {
      updateTask(task._id, { status: "completed" });
      logProgress({
        subjectId: task.subject,
        taskId: task._id,
        minutesStudied: task.durationMinutes,
        pomodoroSessions: task.pomodorosPlanned,
        completed: true
      });

      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      
      router.push("/dashboard?success=task-completed");
    } catch (error) {
      console.error("Error completing task:", error);
    }
  }

  function handleExit() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F1A]">
        <p className="text-[#9CA3AF]">Loading focus session...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F1A]">
        <p className="text-[#9CA3AF]">Task not found</p>
      </div>
    );
  }

  return (
    <div
      ref={focusContainerRef}
      className="flex h-screen flex-col items-center justify-center gap-8 bg-[#0B0F1A] px-4"
    >
      <div className="space-y-2 text-center">
        <p className="text-lg font-medium text-[#9CA3AF]">
          {task.subjectName || "Study Session"}
        </p>
        <h1 className="font-display text-5xl font-bold text-[#E5E7EB]">
          {task.title}
        </h1>
        <p className="mt-4 text-base text-[#6B7280]">
          Duration: {task.durationMinutes} minutes ({task.pomodorosPlanned} Pomodoro{task.pomodorosPlanned !== 1 ? "s" : ""})
        </p>
      </div>

      <div className="w-full max-w-md">
        <PomodoroTimer onSessionComplete={handleTaskComplete} />
      </div>

      <div className="space-y-3 pt-8">
        <button
          type="button"
          onClick={handleTaskComplete}
          className="btn-primary w-48 px-6 py-3"
        >
          Mark Complete ✅
        </button>
        <button
          type="button"
          onClick={handleExit}
          className="btn-secondary w-48 px-6 py-3"
        >
          Exit Focus
        </button>
      </div>

      {isFullscreen && (
        <p className="absolute bottom-4 right-4 text-xs text-[#6B7280]">
          Press ESC to exit fullscreen
        </p>
      )}
    </div>
  );
}

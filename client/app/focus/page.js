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

"use client";

import { useEffect, useRef, useState } from "react";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";

export function PomodoroTimer({ onSessionComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (secondsLeft !== 0 || notifiedRef.current) {
      return;
    }

    notifiedRef.current = true;
    setRunning(false);
    onSessionComplete?.();
  }, [onSessionComplete, secondsLeft]);

  function toggleTimer() {
    if (secondsLeft === 0) {
      setSecondsLeft(25 * 60);
      notifiedRef.current = false;
    }

    setRunning((current) => !current);
  }

  function resetTimer() {
    setRunning(false);
    setSecondsLeft(25 * 60);
    notifiedRef.current = false;
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const progress = ((25 * 60 - secondsLeft) / (25 * 60)) * 100;

  return (
    <section className="panel p-8">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#111827] dark:text-[#E5E7EB]">Focus Session</h2>
          <p className="mt-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">25 minutes of focused work</p>
        </div>
      </div>

      {/* Timer Display */}
      <div className="mt-8 rounded-lg bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#1F2937] p-12 text-center transition-colors duration-300">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280] dark:text-[#6B7280]">Time remaining</p>
        <p className="mt-4 font-display text-6xl font-bold text-[#22C55E]">
          {minutes}:{seconds}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1.5 rounded-full bg-[#E5E7EB] dark:bg-[#1F2937] transition-colors duration-300">
        <div
          className="h-1.5 rounded-full bg-[#22C55E] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={toggleTimer} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {running ? (
            <>
              <FiPause size={18} />
              Pause
            </>
          ) : secondsLeft === 0 ? (
            <>
              <FiPlay size={18} />
              Start Focus
            </>
          ) : secondsLeft < 25 * 60 ? (
            <>
              <FiPlay size={18} />
              Resume
            </>
          ) : (
            <>
              <FiPlay size={18} />
              Start Focus
            </>
          )}
        </button>
        <button type="button" onClick={resetTimer} className="btn-secondary flex items-center justify-center gap-2">
          <FiRotateCcw size={18} />
          Reset
        </button>
      </div>
    </section>
  );
}

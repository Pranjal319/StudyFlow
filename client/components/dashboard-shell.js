"use client";

import { useAuth } from "./auth-provider";
import { Sidebar } from "./sidebar";
import { SiteHeader } from "./site-header";

export function DashboardShell({ title, subtitle, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F1A] transition-colors duration-300">
        <SiteHeader />
        <div className="flex min-h-screen">
          <div className="hidden w-64 lg:block" />
          <div className="flex-1 items-center justify-center px-6 py-24">
            <div className="panel px-6 py-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">Loading your planner...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F1A] transition-colors duration-300">
      <Sidebar />
      <SiteHeader />
      <main className="lg:ml-64">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#22C55E]">Welcome back</p>
              <h1 className="mt-2 font-display text-4xl font-semibold text-[#111827] dark:text-[#E5E7EB]">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#6B7280] dark:text-[#9CA3AF]">{subtitle}</p>
            </div>
            <div className="panel px-5 py-4">
              <p className="font-semibold text-[#111827] dark:text-[#E5E7EB]">{user?.name || "Student"}</p>
              <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">{user?.studyHoursPerDay || 3} study hour(s) per day</p>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

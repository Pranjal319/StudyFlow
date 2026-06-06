"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { navItems } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('ai-study-planner-theme');
    const dark = stored ? stored === 'dark' : true;
    setIsDark(dark);
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle('dark', nextIsDark);
    localStorage.setItem('ai-study-planner-theme', nextIsDark ? 'dark' : 'light');
  }

  if (!mounted) return null;

  return (
    <header className={`sticky top-0 z-40 border-b transition duration-300 ${
      isDark
        ? 'border-[#1F2937] bg-[#0B0F1A]/95'
        : 'border-[#E5E7EB] bg-white/95'
    } backdrop-blur-sm`}>
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3 lg:ml-0">
        {/* Logo - Left */}
        <Link href="/" className={`font-display text-base font-semibold flex items-center gap-2 shrink-0 transition duration-300 ${
          isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
        }`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-md transition duration-300 ${
            isDark ? 'bg-[#22C55E]' : 'bg-green-500'
          }`}>
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <span className="hidden sm:inline">StudyFlow</span>
        </Link>

        {/* Navigation - Center, hidden on mobile */}
        <nav className="hidden items-center gap-2 lg:flex absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition duration-200 ${
                  isActive
                    ? isDark ? 'bg-[#22C55E] text-white' : 'bg-green-500 text-white'
                    : isDark ? 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1F2937]' : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle - Right */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`rounded-md border p-2 transition duration-200 shrink-0 ${
            isDark
              ? 'border-[#374151] text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E5E7EB]'
              : 'border-[#D1D5DB] text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>
    </header>
  );
}

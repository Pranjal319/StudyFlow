import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const featureCards = [
  "A study plan that fits your time and deadlines.",
  "Stay on track with simple daily goals.",
  "See how you’re improving, week by week."
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F1A] transition-colors duration-300">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-20">
        {/* Hero Section */}
        <section className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-6 fade-up">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#22C55E]">Just open and start.</p>
              <h1 className="font-display text-5xl font-semibold tracking-tight text-[#111827] dark:text-[#E5E7EB] md:text-6xl">
                Make studying feel manageable.
              </h1>
            </div>
            <p className="text-lg leading-relaxed text-[#6B7280] dark:text-[#9CA3AF] max-w-lg">
              Everything stays on your device. No sign-ups, no distractions — just open and begin.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/dashboard" className="btn-primary">
                Start planning
              </Link>
              <Link href="/analytics" className="btn-secondary">
                Check progress
              </Link>
            </div>
          </div>

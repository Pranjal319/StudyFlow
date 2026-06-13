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

          {/* Right Demo Card */}
          <div className="fade-up">
            <div className="panel p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] dark:text-[#9CA3AF]">Today's plan</p>
              </div>
              
              <div className="grid gap-3 grid-cols-2">
                <div className="rounded-md border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#0F1419] p-4 transition-colors duration-300">
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">You planned:</p>
                  <p className="mt-3 font-display text-3xl font-semibold text-[#22C55E]">3.5h</p>
                </div>
                <div className="rounded-md border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#0F1419] p-4 transition-colors duration-300">
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">Subjects:</p>
                  <p className="mt-3 font-display text-3xl font-semibold text-[#3B82F6]">4</p>
                </div>
              </div>

              <div className="rounded-md border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#0F1419] p-4 transition-colors duration-300">
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">Your data stays with you.</p>
                <p className="mt-2 text-lg font-semibold text-[#111827] dark:text-[#E5E7EB]">Always.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature} className="panel p-6 space-y-3 hover:shadow-md transition-shadow duration-200">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#22C55E]">How it helps</p>
              <p className="text-base leading-7 font-medium text-[#111827] dark:text-[#E5E7EB]">{feature}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

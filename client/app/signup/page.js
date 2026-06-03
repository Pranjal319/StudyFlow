import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#22C55E]">Signup</p>
            <h1 className="mt-4 font-display text-5xl font-semibold text-[#E5E7EB] leading-tight">Build a study system that adapts to you.</h1>
            <p className="mt-4 max-w-lg text-[#9CA3AF]">
              Define your availability, subjects, and deadlines. The planner handles the scheduling logic from there.
            </p>
          </div>
          <AuthForm mode="signup" />
        </div>
      </main>
    </div>
  );
}

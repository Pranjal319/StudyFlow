import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#22C55E]">Login</p>
            <h1 className="mt-4 font-display text-5xl font-semibold text-[#E5E7EB] leading-tight">Step back into your study cockpit.</h1>
            <p className="mt-4 max-w-lg text-[#9CA3AF]">
              Continue your focus streak, revisit today’s plan, and see where your time is going.
            </p>
          </div>
          <AuthForm mode="login" />
        </div>
      </main>
    </div>
  );
}

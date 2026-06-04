"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const { setUser } = useAuth();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    studyHoursPerDay: 3
  });
  const [status, setStatus] = useState({ loading: false, error: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup
        ? formState
        : { email: formState.email, password: formState.password };
      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      window.localStorage.setItem("ai-study-planner-token", data.token);
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      setStatus({ loading: false, error: error.message });
      return;
    }

    setStatus({ loading: false, error: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="panel mx-auto max-w-md space-y-4 p-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#E5E7EB]">{isSignup ? "Create account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          {isSignup ? "Start building AI-guided study plans in minutes." : "Access your planner, analytics, and daily focus system."}
        </p>
      </div>
      {isSignup && (
        <input
          className="field"
          placeholder="Full name"
          value={formState.name}
          onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
          required
        />
      )}
      <input
        className="field"
        type="email"
        placeholder="Email address"
        value={formState.email}
        onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
        required
      />
      <input
        className="field"
        type="password"
        placeholder="Password"
        value={formState.password}
        onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
        required
      />
      {isSignup && (
        <div>
          <label className="mb-2 block text-sm font-medium">Study hours per day</label>
          <input
            className="field"
            type="number"
            min="1"
            max="12"
            value={formState.studyHoursPerDay}
            onChange={(event) =>
              setFormState((current) => ({ ...current, studyHoursPerDay: Number(event.target.value) }))
            }
          />
        </div>
      )}
      {status.error ? <p className="text-sm text-red-500">{status.error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={status.loading}>
        {status.loading ? "Please wait..." : isSignup ? "Create my workspace" : "Login"}
      </button>
    </form>
  );
}

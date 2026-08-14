"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const data = Object.fromEntries(form.entries());

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setSuccess("Account created successfully! You can now sign in.");
      formElement.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 text-slate-800 antialiased">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <header className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
            ➕
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            SecureLife CRM
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Create Staff Account
          </p>
        </header>

        {success && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-800">
            <span>✅</span> {success}
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-sm font-medium text-rose-800">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Staff Role
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                required
                defaultValue="ADVISOR"
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50"
              >
                <option value="ADVISOR">Advisor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <footer className="mt-6 text-center text-sm">
          <span className="text-slate-500">Already have an account?</span>{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
            Sign In instead
          </Link>
        </footer>
      </div>
    </main>
  );
}

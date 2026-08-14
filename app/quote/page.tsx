"use client";

import { FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import { apiFetch } from "@/lib/api";

// Config array keeps code footprint small and easy to maintain
const FIELDS = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "phone", label: "Phone Number", type: "tel" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "occupation", label: "Occupation", type: "text" },
  { name: "annualIncome", label: "Annual Income (LKR)", type: "number" },
  { name: "desiredCoverage", label: "Desired Coverage (LKR)", type: "number" },
  { name: "policyTerm", label: "Policy Term (Years)", type: "number" },
];

export default function QuotePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    
    const data = Object.fromEntries(
      FIELDS.map(({ name, type }) => [
        name, 
        type === "number" ? Number(form.get(name)) : form.get(name)
      ])
    );

    try {
      const result = await apiFetch("/leads", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setSuccess(
        `Thank you! Request submitted successfully.${
          result.recommendedPlan ? ` Plan: ${result.recommendedPlan.name}` : ""
        }`
      );
      formElement.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
          <header className="border-b border-slate-100 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Get a Free Quote
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Provide your details below. An expert insurance advisor will review your profile and contact you shortly.
            </p>
          </header>

          {success && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 border border-emerald-100">
              <span>✅</span> {success}
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-800 border border-rose-100">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Grid layout optimizes scanning and cuts total page height in half */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
              >
                {loading ? "Submitting..." : "Request Free Quote"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

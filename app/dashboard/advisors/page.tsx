"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Advisor {
  _id: string;
  name: string;
  email: string;
  // we still fetch full object, but only display these two fields
}

export default function AdvisorsPage() {
  const router = useRouter();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("securelife_token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadAdvisors(token);
  }, []);

  async function loadAdvisors(token: string) {
    try {
      setLoading(true);
      const data = await apiFetch("/leads/advisors/list", { token });
      setAdvisors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load advisors");
    } finally {
      setLoading(false);
    }
  }

  const filtered = advisors.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-white md:text-3xl">Advisors</h1>
          <p className="mt-1 text-blue-200/70">View all advisors.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
            ❌ {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Advisors</h2>
              <p className="mt-1 text-sm text-gray-500">
                {filtered.length} advisor{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No advisors found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((advisor) => (
                    <tr
                      key={advisor._id}
                      className="border-b border-gray-50 transition hover:bg-blue-50/30 last:border-b-0"
                    >
                      <td className="px-6 py-5 font-medium text-gray-900">
                        {advisor.name}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">{advisor.email}</td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/dashboard/advisors/${advisor._id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
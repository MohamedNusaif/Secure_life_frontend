"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiFetch } from "@/lib/api";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  assignedAdvisor?: { name: string };
  recommendedPlan?: { name: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const token = localStorage.getItem("securelife_token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const data = await apiFetch("/leads", { token });
      setLeads(data);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("securelife_token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const contacted = leads.filter((l) => l.status === "CONTACTED").length;
  const qualified = leads.filter((l) => l.status === "QUALIFIED").length;
  const proposals = leads.filter((l) => l.status === "PROPOSAL").length;
  const converted = leads.filter((l) => l.status === "CONVERTED").length;
  const lost = leads.filter((l) => l.status === "LOST").length;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  const pipelineStages = [
    { title: "New", count: newLeads, color: "blue" },
    { title: "Contacted", count: contacted, color: "yellow" },
    { title: "Qualified", count: qualified, color: "purple" },
    { title: "Proposal", count: proposals, color: "orange" },
    { title: "Converted", count: converted, color: "green" },
    { title: "Lost", count: lost, color: "red" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Page Header – gradient bridge */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 px-6 py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Dashboard</h1>
            <p className="mt-1 text-blue-200/70">Overview of your insurance sales pipeline.</p>
          </div>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            View All Leads →
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Leads"
            value={total}
            description="All leads"
            emoji="📊"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="New Leads"
            value={newLeads}
            description="Need attention"
            emoji="✨"
            gradient="from-cyan-500 to-blue-500"
          />
          <StatCard
            title="Qualified"
            value={qualified}
            description="Potential customers"
            emoji="✅"
            gradient="from-purple-500 to-indigo-500"
          />
          <StatCard
            title="Converted"
            value={converted}
            description={`${conversionRate}% conversion rate`}
            emoji="🏆"
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Charts Row: Conversion Donut + Pipeline Bars */}
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Conversion Rate Donut */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-gray-700">Conversion Rate</h3>
            <div className="mt-4 flex flex-col items-center">
              <ConversionDonut percentage={conversionRate} />
              <p className="mt-3 text-sm text-gray-500">
                {converted} converted out of {total} leads
              </p>
            </div>
          </div>

          {/* Pipeline Bar Chart */}
          <div className="lg:col-span-3 rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-gray-700">Pipeline Distribution</h3>
            <div className="mt-4 space-y-3">
              {pipelineStages.map((stage) => {
                const barWidth = total > 0 ? (stage.count / total) * 100 : 0;
                const colorMap: Record<string, string> = {
                  blue: "bg-blue-500",
                  yellow: "bg-yellow-500",
                  purple: "bg-purple-500",
                  orange: "bg-orange-500",
                  green: "bg-green-500",
                  red: "bg-red-500",
                };
                return (
                  <div key={stage.title} className="flex items-center gap-3">
                    <span className="w-20 text-sm font-medium text-gray-600">{stage.title}</span>
                    <div className="flex-1">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full ${colorMap[stage.color]} transition-all duration-700`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right text-sm font-semibold text-gray-700">
                      {stage.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Leads Table */}
        <div className="mt-8 rounded-2xl border border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
              <p className="mt-1 text-sm text-gray-500">Latest customer enquiries.</p>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No leads available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Advisor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 8).map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-b border-gray-50 transition hover:bg-blue-50/30 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.recommendedPlan?.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.assignedAdvisor?.name || "Unassigned"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/leads/${lead._id}`}
                          className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
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

// ---------- Stat Card ----------
function StatCard({
  title,
  value,
  description,
  emoji,
  gradient,
}: {
  title: string;
  value: number;
  description: string;
  emoji: string;
  gradient: string;
}) {
  return (
    <div className="group rounded-2xl bg-white/90 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-2xl text-white shadow-lg transition group-hover:scale-105`}
        >
          {emoji}
        </div>
      </div>
    </div>
  );
}

// ---------- Conversion Rate Donut Chart (SVG) ----------
function ConversionDonut({ percentage }: { percentage: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#conversionGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="transition-all duration-1000"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="conversionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        <span className="text-xs text-gray-500">Converted</span>
      </div>
    </div>
  );
}

// ---------- Status Badge ----------
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    QUALIFIED: "bg-purple-100 text-purple-800",
    PROPOSAL: "bg-orange-100 text-orange-800",
    CONVERTED: "bg-green-100 text-green-800",
    LOST: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
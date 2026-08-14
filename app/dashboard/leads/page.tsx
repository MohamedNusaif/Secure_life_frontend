"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
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
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(searchValue) ||
      lead.email.toLowerCase().includes(searchValue) ||
      lead.phone.includes(searchValue);
    const matchesStatus = status === "ALL" || lead.status === status;
    return matchesSearch && matchesStatus;
  });

  // Counts per status
  const statusCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Page Header – gradient bridge */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 px-6 py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Lead Management</h1>
            <p className="mt-1 text-blue-200/70">Manage customer enquiries and sales opportunities.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            View Public Website →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {/* Status Summary Chips */}
        <div className="mb-6 flex flex-wrap gap-3">
          <StatusChip label="All" count={leads.length} active={status === "ALL"} onClick={() => setStatus("ALL")} />
          <StatusChip label="New" count={statusCounts.NEW || 0} active={status === "NEW"} onClick={() => setStatus("NEW")} />
          <StatusChip label="Contacted" count={statusCounts.CONTACTED || 0} active={status === "CONTACTED"} onClick={() => setStatus("CONTACTED")} />
          <StatusChip label="Qualified" count={statusCounts.QUALIFIED || 0} active={status === "QUALIFIED"} onClick={() => setStatus("QUALIFIED")} />
          <StatusChip label="Proposal" count={statusCounts.PROPOSAL || 0} active={status === "PROPOSAL"} onClick={() => setStatus("PROPOSAL")} />
          <StatusChip label="Converted" count={statusCounts.CONVERTED || 0} active={status === "CONVERTED"} onClick={() => setStatus("CONVERTED")} />
          <StatusChip label="Lost" count={statusCounts.LOST || 0} active={status === "LOST"} onClick={() => setStatus("LOST")} />
        </div>

        {/* Filters – glass card */}
        <div className="mb-6 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table – glass card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Leads</h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Advisor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-b border-gray-50 transition hover:bg-blue-50/30 last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">{lead.phone}</td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {lead.recommendedPlan?.name || "—"}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {lead.assignedAdvisor?.name || "Unassigned"}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/dashboard/leads/${lead._id}`}
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

// ---------- Status Chip for Summary ----------
function StatusChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white/80 text-gray-600 hover:bg-blue-50"
      }`}
    >
      {label} <span className="ml-1 rounded-full bg-white/20 px-2 text-xs">{count}</span>
    </button>
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
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Advisor {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Plan {
  _id: string;
  name: string;
  description?: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  occupation?: string;
  annualIncome?: number;
  desiredCoverage?: number;
  policyTerm?: number;
  status: string;
  source?: string;
  assignedAdvisor?: Advisor;
  recommendedPlan?: Plan;
  createdAt?: string;
}

interface Activity {
  _id: string;
  type: string;
  description: string;
  createdAt: string;
  user?: { name: string; email: string; role: string };
}

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "CONVERTED", "LOST"];
const activityTypes = ["CALL", "EMAIL", "MEETING", "NOTE"];

const statusColorMap: Record<string, string> = {
  NEW: "blue",
  CONTACTED: "yellow",
  QUALIFIED: "purple",
  PROPOSAL: "orange",
  CONVERTED: "green",
  LOST: "red",
};

const activityEmojiMap: Record<string, string> = {
  CALL: "📞",
  EMAIL: "✉️",
  MEETING: "🤝",
  NOTE: "📝",
};

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activityType, setActivityType] = useState("CALL");
  const [activityDescription, setActivityDescription] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("securelife_token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    loadData();
  }, [leadId]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [leadData, advisorData, activityData] = await Promise.all([
        apiFetch(`/leads/${leadId}`, { token: token || undefined }),
        apiFetch("/leads/advisors/list", { token: token || undefined }),
        apiFetch(`/leads/${leadId}/activities`, { token: token || undefined }),
      ]);
      setLead(leadData);
      setAdvisors(advisorData);
      setActivities(activityData);
      setSelectedAdvisor(leadData.assignedAdvisor?._id || "");
      setSelectedStatus(leadData.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lead");
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignAdvisor() {
    if (!selectedAdvisor) {
      setError("Please select an advisor.");
      return;
    }
    try {
      setMessage("");
      setError("");
      const result = await apiFetch(`/leads/${leadId}/assign`, {
        method: "POST",
        token: token || undefined,
        body: JSON.stringify({ advisorId: selectedAdvisor }),
      });
      setLead(result.lead);
      setMessage("Advisor assigned successfully.");
      await reloadActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign advisor");
    }
  }

  async function handleStatusChange() {
    try {
      setMessage("");
      setError("");
      const result = await apiFetch(`/leads/${leadId}/status`, {
        method: "PATCH",
        token: token || undefined,
        body: JSON.stringify({ status: selectedStatus }),
      });
      setLead(result.lead);
      setMessage("Lead status updated successfully.");
      await reloadActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleActivitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activityDescription.trim()) {
      setError("Please enter an activity description.");
      return;
    }
    try {
      setMessage("");
      setError("");
      await apiFetch(`/leads/${leadId}/activities`, {
        method: "POST",
        token: token || undefined,
        body: JSON.stringify({ type: activityType, description: activityDescription }),
      });
      setActivityDescription("");
      setMessage("Activity added successfully.");
      await reloadActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add activity");
    }
  }

  async function reloadActivities() {
    const data = await apiFetch(`/leads/${leadId}/activities`, {
      token: token || undefined,
    });
    setActivities(data);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Lead not found</h1>
          <Link href="/dashboard/leads" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = statusColorMap[lead.status] || "gray";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header – dark gradient */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-200/70 transition hover:text-white"
          >
            ← Back to Leads
          </Link>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">{lead.name}</h1>
              <p className="mt-1 text-sm text-blue-200/70">Lead ID: {lead._id}</p>
            </div>
            <StatusBadge status={lead.status} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200/80 bg-green-50/80 px-4 py-3 text-sm text-green-700 backdrop-blur-sm">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
            ❌ {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Information */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Info label="Full Name" value={lead.name} />
                <Info label="Email" value={lead.email} />
                <Info label="Phone" value={lead.phone} />
                <Info label="Occupation" value={lead.occupation || "—"} />
                <Info
                  label="Date of Birth"
                  value={lead.dateOfBirth ? new Date(lead.dateOfBirth).toLocaleDateString() : "—"}
                />
                <Info
                  label="Annual Income"
                  value={lead.annualIncome ? `LKR ${lead.annualIncome.toLocaleString()}` : "—"}
                />
                <Info
                  label="Desired Coverage"
                  value={lead.desiredCoverage ? `LKR ${lead.desiredCoverage.toLocaleString()}` : "—"}
                />
                <Info label="Policy Term" value={lead.policyTerm ? `${lead.policyTerm} years` : "—"} />
                <Info label="Lead Source" value={lead.source || "Website"} />
                <Info
                  label="Created"
                  value={lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                />
              </div>
            </div>

            {/* Insurance Recommendation */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-900">Insurance Recommendation</h2>
              {lead.recommendedPlan ? (
                <div className="mt-5 rounded-xl border border-blue-200/80 bg-blue-50/60 p-5 backdrop-blur-sm">
                  <p className="text-sm font-medium text-blue-600">Recommended Plan</p>
                  <h3 className="mt-1 text-2xl font-bold text-gray-900">{lead.recommendedPlan.name}</h3>
                  {lead.recommendedPlan.description && (
                    <p className="mt-2 text-gray-600">{lead.recommendedPlan.description}</p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">No insurance plan has been recommended.</p>
              )}
            </div>

            {/* Activity Form */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-900">Add Activity</h2>
              <form onSubmit={handleActivitySubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Activity Type</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  >
                    {activityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    rows={4}
                    placeholder="Enter activity details..."
                    className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-md"
                >
                  Add Activity
                </button>
              </form>
            </div>

            {/* Activity Timeline */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-900">Activity Timeline</h2>
              {activities.length === 0 ? (
                <p className="mt-6 text-gray-500">No activities yet.</p>
              ) : (
                <div className="mt-6 space-y-6">
                  {activities.map((activity) => {
                    const color = statusColorMap[activity.type] || "blue";
                    const dotColorMap: Record<string, string> = {
                      blue: "bg-blue-500 ring-blue-200",
                      yellow: "bg-yellow-500 ring-yellow-200",
                      purple: "bg-purple-500 ring-purple-200",
                      orange: "bg-orange-500 ring-orange-200",
                      green: "bg-green-500 ring-green-200",
                      red: "bg-red-500 ring-red-200",
                    };
                    return (
                      <div key={activity._id} className="relative border-l-2 border-gray-200 pl-6 pb-6 last:pb-0">
                        <div
                          className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ring-4 ${dotColorMap[color]}`}
                        />
                        <div className="flex flex-col justify-between gap-2 sm:flex-row">
                          <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                              {activityEmojiMap[activity.type] || "📌"} {activity.type}
                            </span>
                            <p className="mt-3 text-gray-800">{activity.description}</p>
                            {activity.user && (
                              <p className="mt-2 text-sm text-gray-500">By {activity.user.name}</p>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* Lead Status */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-900">Lead Status</h2>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-4 w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusChange}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-md"
              >
                Update Status
              </button>
            </div>

            {/* Assigned Advisor */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-900">Assigned Advisor</h2>
              {lead.assignedAdvisor && (
                <div className="mt-4 rounded-xl bg-blue-50/60 p-4 backdrop-blur-sm">
                  <p className="font-semibold text-gray-900">{lead.assignedAdvisor.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{lead.assignedAdvisor.email}</p>
                </div>
              )}
              <select
                value={selectedAdvisor}
                onChange={(e) => setSelectedAdvisor(e.target.value)}
                className="mt-4 w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select Advisor</option>
                {advisors.map((advisor) => (
                  <option key={advisor._id} value={advisor._id}>
                    {advisor.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignAdvisor}
                className="mt-4 w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 hover:shadow-md"
              >
                Assign Advisor
              </button>
            </div>

            {/* Lead Summary */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-900">Lead Summary</h2>
              <div className="mt-5 space-y-3">
                <SummaryRow label="Status" value={lead.status} />
                <SummaryRow label="Plan" value={lead.recommendedPlan?.name || "Not selected"} />
                <SummaryRow label="Advisor" value={lead.assignedAdvisor?.name || "Unassigned"} />
                <SummaryRow label="Source" value={lead.source || "Website"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-900">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

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
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}
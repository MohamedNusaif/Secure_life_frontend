"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

// --- Interface matching the flat API response ---
interface Plan {
  _id: string;
  name: string;
  description: string;
  benefits: string[];
  minAge: number;
  maxAge: number;
  minCoverage: number;
  maxCoverage: number;
  minPremium: number;
  maxPremium: number;
  minTerm: number;
  maxTerm: number;
  active: boolean;
}

// --- Form state (same fields, no nesting) ---
const emptyForm = {
  name: "",
  description: "",
  benefits: "",
  minAge: "",
  maxAge: "",
  minCoverage: "",
  maxCoverage: "",
  minPremium: "",
  maxPremium: "",
  minTerm: "",
  maxTerm: "",
  active: true,
};

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getToken = () => localStorage.getItem("securelife_token");

  const loadPlans = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const data = await apiFetch("/plans", { token });
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load insurance plans.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const resetModal = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      benefits: plan.benefits.join("\n"),
      minAge: String(plan.minAge),
      maxAge: String(plan.maxAge),
      minCoverage: String(plan.minCoverage),
      maxCoverage: String(plan.maxCoverage),
      minPremium: String(plan.minPremium),
      maxPremium: String(plan.maxPremium),
      minTerm: String(plan.minTerm),
      maxTerm: String(plan.maxTerm),
      active: plan.active,
    });
    setError("");
    setMessage("");
    setModalOpen(true);
  };

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Validate all numeric fields are filled
    const numericFields = [
      "minAge", "maxAge", "minCoverage", "maxCoverage",
      "minPremium", "maxPremium", "minTerm", "maxTerm"
    ];
    for (const field of numericFields) {
      if (form[field as keyof typeof form] === "") {
        setError(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      // Flat payload – exactly what your backend expects
      const payload = {
        name: form.name,
        description: form.description,
        benefits: form.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
        minAge: Number(form.minAge),
        maxAge: Number(form.maxAge),
        minCoverage: Number(form.minCoverage),
        maxCoverage: Number(form.maxCoverage),
        minPremium: Number(form.minPremium),
        maxPremium: Number(form.maxPremium),
        minTerm: Number(form.minTerm),
        maxTerm: Number(form.maxTerm),
        active: form.active,
      };

      if (editingPlan) {
        await apiFetch(`/plans/${editingPlan._id}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload),
        });
        setMessage("Insurance plan updated successfully.");
      } else {
        await apiFetch("/plans", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
        setMessage("Insurance plan created successfully.");
      }

      resetModal();
      await loadPlans();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save plan.";
      if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
        router.push("/login");
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this insurance plan?")) return;
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiFetch(`/plans/${id}`, { method: "DELETE", token });
      setMessage("Insurance plan deleted successfully.");
      await loadPlans();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete plan.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Plans</h1>
          <p className="mt-1 text-gray-500">Create and manage SecureLife insurance products.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Create Plan
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Plans list */}
      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500">Loading insurance plans...</div>
      ) : plans.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center">
          <p className="text-gray-500">No insurance plans found.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Create First Plan
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onEdit={() => openEditModal(plan)}
              onDelete={() => deletePlan(plan._id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingPlan ? "Edit Insurance Plan" : "Create Insurance Plan"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">Configure product benefits and eligibility.</p>
              </div>
              <button
                onClick={resetModal}
                className="text-2xl text-gray-400 hover:text-gray-700"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Basic information */}
              <section>
                <h3 className="mb-4 font-semibold">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Plan Name"
                    value={form.name}
                    onChange={(v) => updateField("name", v)}
                    placeholder="e.g. Premium"
                    required
                  />
                  <div className="flex items-center gap-3 pt-7">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => updateField("active", e.target.checked)}
                    />
                    <label className="text-sm font-medium">Active Plan</label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Describe this insurance plan..."
                  />
                </div>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium">Benefits</label>
                  <textarea
                    value={form.benefits}
                    onChange={(e) => updateField("benefits", e.target.value)}
                    rows={5}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder={`High life coverage\nEnhanced protection\nLong-term security`}
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter one benefit per line.</p>
                </div>
              </section>

              {/* Eligibility & Coverage (flat) */}
              <section>
                <h3 className="mb-4 font-semibold">Eligibility & Coverage</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberInput label="Minimum Age" value={form.minAge} onChange={(v) => updateField("minAge", v)} />
                  <NumberInput label="Maximum Age" value={form.maxAge} onChange={(v) => updateField("maxAge", v)} />
                  <NumberInput label="Minimum Coverage (LKR)" value={form.minCoverage} onChange={(v) => updateField("minCoverage", v)} />
                  <NumberInput label="Maximum Coverage (LKR)" value={form.maxCoverage} onChange={(v) => updateField("maxCoverage", v)} />
                </div>
              </section>

              {/* Premium (flat min/max) */}
              <section>
                <h3 className="mb-4 font-semibold">Premium Range</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberInput label="Minimum Premium (LKR)" value={form.minPremium} onChange={(v) => updateField("minPremium", v)} />
                  <NumberInput label="Maximum Premium (LKR)" value={form.maxPremium} onChange={(v) => updateField("maxPremium", v)} />
                </div>
              </section>

              {/* Term (flat) */}
              <section>
                <h3 className="mb-4 font-semibold">Policy Term</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberInput label="Minimum Term (Years)" value={form.minTerm} onChange={(v) => updateField("minTerm", v)} />
                  <NumberInput label="Maximum Term (Years)" value={form.maxTerm} onChange={(v) => updateField("maxTerm", v)} />
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-lg border px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Sub-components ----

function PlanCard({ plan, onEdit, onDelete }: { plan: Plan; onEdit: () => void; onDelete: () => void }) {
  // Use optional chaining just in case, with fallbacks
  const minAge = plan.minAge ?? 'N/A';
  const maxAge = plan.maxAge ?? 'N/A';
  const minCoverage = plan.minCoverage ?? 0;
  const maxCoverage = plan.maxCoverage ?? 0;
  const minPremium = plan.minPremium ?? 0;
  const maxPremium = plan.maxPremium ?? 0;
  const minTerm = plan.minTerm ?? 'N/A';
  const maxTerm = plan.maxTerm ?? 'N/A';

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              plan.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {plan.active ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-600">{plan.description}</p>
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold text-gray-900">Benefits</p>
        <ul className="mt-3 space-y-2">
          {plan.benefits.map((benefit, index) => (
            <li key={index} className="flex gap-2 text-sm text-gray-600">
              <span className="text-green-600">✓</span> {benefit}
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-3 border-t pt-5 text-sm">
          <InfoRow label="Age" value={`${minAge} - ${maxAge} years`} />
          <InfoRow label="Coverage" value={`LKR ${minCoverage.toLocaleString()} - ${maxCoverage.toLocaleString()}`} />
          <InfoRow label="Premium Range" value={`LKR ${minPremium.toLocaleString()} - ${maxPremium.toLocaleString()}`} />
          <InfoRow label="Policy Term" value={`${minTerm} - ${maxTerm} years`} />
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onEdit} className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">
            Edit
          </button>
          <button onClick={onDelete} className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
      />
    </div>
  );
}
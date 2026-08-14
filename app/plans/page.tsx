"use client";

import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Navbar from "../components/Navbar"; // <-- Import Navbar
import Footer from "../components/Footer";


// ---------- Static plan data (from your provided objects) ----------
const plans = [
  {
    _id: "6a7edcc09b619dc1abb970b0",
    name: "Basic",
    description: "Affordable life protection for individuals and families.",
    benefits: [
      "Funeral expenses covered",
      "Critical illness rider",
      "Accidental death benefit",
    ],
    eligibility: { minAge: 18, maxAge: 55 },
    coverage: { min: 1_000_000, max: 5_000_000 },
    premium: { min: 2_500, max: 7_000 },
    term: { min: 10, max: 20 },
  },
  {
    _id: "6a7edcd49b619dc1abb970b1",
    name: "Gold",
    description: "Enhanced protection for growing families.",
    benefits: [
      "Higher coverage limits",
      "Child education rider",
      "Waiver of premium",
    ],
    eligibility: { minAge: 18, maxAge: 60 },
    coverage: { min: 5_000_000, max: 15_000_000 },
    premium: { min: 5_000, max: 15_000 },
    term: { min: 10, max: 25 },
  },
  {
    _id: "6a7edce19b619dc1abb970b2",
    name: "Premium",
    description: "Comprehensive protection for higher coverage needs.",
    benefits: [
      "Maturity benefit",
      "Income protection",
      "Terminal illness cover",
    ],
    eligibility: { minAge: 21, maxAge: 65 },
    coverage: { min: 15_000_000, max: 50_000_000 },
    premium: { min: 10_000, max: 50_000 },
    term: { min: 15, max: 30 },
  },
];

// ---------- Page Component ----------
export default function PublicPlansPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar /> {/* <-- Navbar rendered here */}

      {/* Hero – dark gradient with gold accent, compact */}
      <section className="relative bg-gradient-to-br from-gray-900 to-blue-900 px-6 py-16 text-center text-white md:py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-300 backdrop-blur-sm">
            SecureLife Insurance
          </span>
          <h1 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl md:text-5xl">
            Choose the <span className="font-bold text-yellow-400">Right</span> Protection
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-blue-100/90">
            Flexible life insurance plans designed to protect you and your family.
          </p>
        </div>
      </section>

      {/* Plans Grid – compact cards with border and hover lift */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              {/* Plan name & description */}
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <p className="mt-2 text-sm text-gray-600">{plan.description}</p>

              {/* Price range */}
              <div className="mt-5 border-y border-gray-100 py-4">
                <p className="text-xs text-gray-500">Starting from</p>
                <p className="text-2xl font-bold text-blue-700">
                  LKR {plan.premium.min.toLocaleString()}
                  <span className="text-base font-normal text-gray-500">
                    –{plan.premium.max.toLocaleString()}
                  </span>
                </p>
                <p className="text-xs text-gray-500">per month</p>
              </div>

              {/* Benefits */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700">Benefits</h3>
                <ul className="mt-2 space-y-1.5">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Details grid – compact */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-xs">
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-medium">
                    {plan.eligibility.minAge}–{plan.eligibility.maxAge}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Coverage</p>
                  <p className="font-medium">
                    LKR {plan.coverage.min.toLocaleString()}+
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Term</p>
                  <p className="font-medium">
                    {plan.term.min}–{plan.term.max} yrs
                  </p>
                </div>
              </div>

              {/* CTA button */}
              <Link
                href="/quote"
                className="mt-5 block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-400"
              >
                Get Free Quote
              </Link>
            </div>
          ))}
        </div>
      </section>
        <Footer />
      
    </main>
  );
}
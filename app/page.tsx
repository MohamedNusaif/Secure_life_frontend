import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


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
    accent: "blue", // for styling
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
    accent: "gold",
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
    accent: "purple",
  },
];

// ---------- Accent color mapping ----------
const accentClasses = {
  blue: {
    border: "border-blue-200 hover:border-blue-400",
    badge: "bg-blue-100 text-blue-700",
    price: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
    ring: "ring-blue-400",
  },
  gold: {
    border: "border-yellow-200 hover:border-yellow-400",
    badge: "bg-yellow-100 text-yellow-700",
    price: "text-yellow-700",
    button: "bg-yellow-600 hover:bg-yellow-700",
    ring: "ring-yellow-400",
  },
  purple: {
    border: "border-purple-200 hover:border-purple-400",
    badge: "bg-purple-100 text-purple-700",
    price: "text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
    ring: "ring-purple-400",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero – dark gradient with gold accent, compact */}
      <section className="relative bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-300 backdrop-blur-sm">
              SecureLife Insurance PLC
            </span>
            <h1 className="mt-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Protect <span className="font-bold text-yellow-400">What Matters</span> Most
            </h1>
            <p className="mt-4 text-lg text-blue-100/90 sm:text-xl">
              Flexible life insurance plans designed to safeguard your family’s
              future – today and tomorrow.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-200">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
              <span>100% free quote · No obligation</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="transform rounded-lg bg-yellow-400 px-6 py-2.5 font-semibold text-gray-900 shadow-lg transition hover:scale-105 hover:shadow-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
              >
                Get Free Quote
              </Link>
              <Link
                href="/plans"
                className="transform rounded-lg border border-white/30 px-6 py-2.5 font-semibold text-white transition hover:bg-white/10 hover:shadow-lg"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section – concise */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="text-center text-3xl font-light text-gray-900 sm:text-4xl">
          Why <span className="font-bold">SecureLife</span>?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          We combine financial strength with compassionate service to give you
          peace of mind.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Family Protection"
            description="Ensure your loved ones are financially secure when they need it most."
            icon="🛡️"
          />
          <Feature
            title="Flexible Plans"
            description="Choose coverage amounts and terms that fit your unique lifestyle."
            icon="📋"
          />
          <Feature
            title="Trusted Advisors"
            description="Get one‑on‑one guidance from experienced insurance professionals."
            icon="🤝"
          />
        </div>
      </section>

      {/* Plans Section – new, with color accents */}
      <section className="bg-gray-50/80 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-light text-gray-900 sm:text-4xl">
              Our <span className="font-bold">Insurance Plans</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Choose the plan that fits your needs and budget – with coverage
              that grows with you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const accent = accentClasses[plan.accent as keyof typeof accentClasses];
              return (
                <div
                  key={plan._id}
                  className={`group rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg ${accent.border}`}
                >
                  {/* Plan name with accent badge */}
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${accent.badge}`}>
                      {plan.accent}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>

                  {/* Price range */}
                  <div className="mt-5 border-y border-gray-100 py-4">
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className={`text-2xl font-bold ${accent.price}`}>
                      LKR {plan.premium.min.toLocaleString()}
                      <span className="text-base font-normal text-gray-500">
                        –{plan.premium.max.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>

                  {/* Benefits */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700">Key Benefits</h4>
                    <ul className="mt-2 space-y-1.5">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Details grid */}
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

                  <Link
                    href="/quote"
                    className={`mt-5 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:shadow-md focus:ring-2 ${accent.button} ${accent.ring}`}
                  >
                    Get Free Quote
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/plans"
              className="inline-block rounded-lg border border-blue-600 px-6 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View All Plans →
            </Link>
          </div>
        </div>
      </section>
            <Footer />

    </main>
    
  );
}

// Feature card (kept as before)
function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl transition-colors group-hover:bg-blue-200">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-3 flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
        Learn more
        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  );
}
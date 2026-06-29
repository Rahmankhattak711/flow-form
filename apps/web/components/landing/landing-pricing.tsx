import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "./constants";

export function LandingPricing() {
  return (
    <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-2">Pricing</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Simple, transparent plans
        </h2>
        <p className="mt-3 text-neutral-600 max-w-lg mx-auto">
          Start free. Upgrade when you need scheduling, unlimited volume, and team features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-8 ${
              plan.comingSoon
                ? "chai-card opacity-90"
                : plan.highlighted
                  ? "border-orange-300 bg-linear-to-b from-orange-50 to-white shadow-xl shadow-orange-500/15 md:scale-[1.02]"
                  : "chai-card"
            }`}
          >
            {plan.comingSoon && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-800 text-white">
                Coming soon
              </span>
            )}
            {plan.highlighted && !plan.comingSoon && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full chai-gradient-bg text-white">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-neutral-900">{plan.price}</span>
              <span className="text-neutral-500 text-sm">{plan.period}</span>
            </div>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{plan.description}</p>
            <ul className="mt-8 space-y-3 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.comingSoon ? (
              <span
                className="mt-8 block text-center py-3 rounded-xl font-semibold text-sm border border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed"
                aria-disabled="true"
              >
                {plan.cta}
              </span>
            ) : (
              <Link
                href={plan.href}
                className={`mt-8 block text-center py-3 rounded-xl font-semibold text-sm transition ${
                  plan.highlighted
                    ? "chai-gradient-bg text-white shadow-md shadow-orange-500/25 hover:opacity-95"
                    : "border border-neutral-200 text-neutral-700 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

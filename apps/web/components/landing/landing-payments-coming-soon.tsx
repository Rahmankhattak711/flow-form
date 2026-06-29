import { CreditCard, Sparkles } from "lucide-react";

export function LandingPaymentsComingSoon() {
  return (
    <section id="payments" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-10 sm:p-14">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 border border-orange-200 rounded-full px-3 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Coming soon
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Payment gateways
            </h2>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Collect payments directly through your forms with Stripe and other gateways. Charge for
              registrations, donations, bookings, and more — all without leaving FlowForm.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start lg:items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-orange-200 shadow-sm flex items-center justify-center text-orange-500">
              <CreditCard className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 bg-white/80 border border-neutral-200 rounded-xl px-4 py-2.5">
              Stripe · PayPal · More
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

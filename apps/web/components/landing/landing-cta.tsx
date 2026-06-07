import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
      <div className="rounded-3xl border border-orange-200 bg-linear-to-br from-orange-50 via-amber-50/80 to-white p-10 sm:p-14 text-center shadow-lg shadow-orange-500/10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Ready to launch your first form?
        </h2>
        <p className="mt-3 text-neutral-600 max-w-md mx-auto">
          Create in minutes. Set your schedule. Share the link. Start collecting responses today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white chai-gradient-bg hover:opacity-95 rounded-xl shadow-md shadow-orange-500/25 transition"
          >
            Create your account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-neutral-700 border border-neutral-200 bg-white hover:border-orange-300 hover:bg-orange-50 rounded-xl transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

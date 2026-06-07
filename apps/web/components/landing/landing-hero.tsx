import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  FormInput,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-20 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold tracking-wide mb-8">
        <Sparkles className="w-3.5 h-3.5" />
        Professional form builder
      </div>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.05] text-neutral-900">
        Build forms that{" "}
        <span className="chai-gradient-text">convert</span>
        <br />
        on your schedule.
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
        Set a title, description, and open/close dates. Publish once, share your link, and collect
        submissions — respondents never need an account.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/sign-up"
          className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white chai-gradient-bg hover:opacity-95 rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02]"
        >
          Start building free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <a
          href="#how-it-works"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-neutral-700 border border-neutral-200 bg-white hover:border-orange-300 hover:bg-orange-50 rounded-xl transition shadow-sm"
        >
          See how it works
        </a>
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
        {[
          { label: "Title & description", icon: FormInput },
          { label: "Start & end dates", icon: CalendarRange },
          { label: "Public share links", icon: Zap },
          { label: "Secure submissions", icon: Shield },
        ].map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="chai-card px-4 py-3 flex items-center gap-3 hover:border-orange-300 transition"
          >
            <Icon className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-neutral-700">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-20 mx-auto max-w-4xl rounded-2xl border border-orange-100 bg-white p-2 shadow-xl shadow-orange-500/10">
        <div className="rounded-xl border border-orange-100 bg-linear-to-b from-orange-50/50 to-white overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-orange-100 bg-white">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-neutral-500 font-mono">flowform.app/f/demo</span>
          </div>
          <div className="p-8 sm:p-10 text-left">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Live form</p>
            <h3 className="mt-2 text-2xl font-bold text-neutral-900">Customer feedback survey</h3>
            <p className="mt-2 text-sm text-neutral-600 max-w-md">
              Help us improve — takes under 2 minutes. Open until Dec 31.
            </p>
            <div className="mt-8 space-y-4 max-w-md">
              <div>
                <label className="text-xs font-medium text-neutral-600">Full name *</label>
                <div className="mt-1.5 h-10 rounded-lg border border-neutral-200 bg-white" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Email *</label>
                <div className="mt-1.5 h-10 rounded-lg border border-neutral-200 bg-white" />
              </div>
              <div className="h-10 w-32 rounded-lg chai-gradient-bg opacity-90 text-white flex items-center justify-center" >Submit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

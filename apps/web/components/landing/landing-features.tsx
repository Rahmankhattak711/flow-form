import { Activity, FormInput, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: FormInput,
    title: "Structured form setup",
    body: "Define title, description, and optional start/end windows so forms only accept responses when you want.",
  },
  {
    icon: Zap,
    title: "One-click publishing",
    body: "Publish and copy a shareable link instantly. Respondents fill your form in a polished public experience.",
  },
  {
    icon: Activity,
    title: "Live response tracking",
    body: "See submission counts per form from your dashboard and know when campaigns are performing.",
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24 ">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-2">Features</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Built for modern teams
        </h2>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          Everything you need to launch, schedule, and measure forms without friction.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="group chai-card p-8 hover:border-orange-300 hover:shadow-lg transition duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-5 group-hover:scale-105 transition">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

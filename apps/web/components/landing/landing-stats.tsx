import { STATS } from "./constants";

export function LandingStats() {
  return (
    <section className="relative z-10 border-y border-orange-100 bg-linear-to-r from-orange-50 via-amber-50/50 to-orange-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight chai-gradient-text">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-neutral-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

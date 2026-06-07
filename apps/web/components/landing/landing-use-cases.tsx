import { USE_CASES } from "./constants";

export function LandingUseCases() {
  return (
    <section id="use-cases" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
      <div className="mb-14">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-2">
          Use cases
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Forms for every workflow
        </h2>
        <p className="mt-3 text-neutral-600 max-w-lg">
          Whether you run events, support customers, or capture leads — FlowForm adapts to how you work.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {USE_CASES.map((item) => (
          <article
            key={item.title}
            className="chai-card p-6 hover:border-orange-300 hover:shadow-md transition"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
              {item.tag}
            </span>
            <h3 className="mt-4 text-lg font-bold text-neutral-900">{item.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

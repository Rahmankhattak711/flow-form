import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "./constants";

export function LandingFaq() {
  return (
    <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-2">FAQ</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Common questions
        </h2>
        <p className="mt-3 text-neutral-600">Everything you need to know before you start building.</p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group chai-card open:border-orange-300 open:shadow-md transition"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 text-left font-semibold text-neutral-900 hover:text-orange-600 transition">
              {item.question}
              <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0 transition group-open:rotate-180 group-open:text-orange-500" />
            </summary>
            <div className="px-6 pb-5 text-sm text-neutral-600 leading-relaxed border-t border-orange-50 pt-4">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

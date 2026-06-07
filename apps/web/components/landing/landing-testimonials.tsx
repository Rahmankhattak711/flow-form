import { Quote } from "lucide-react";
import { TESTIMONIALS } from "./constants";

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-2">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Loved by builders worldwide
        </h2>
        <p className="mt-3 text-neutral-600 max-w-lg mx-auto">
          Teams use FlowForm to ship faster and collect better data.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <blockquote key={t.author} className="chai-card p-8 flex flex-col">
            <Quote className="w-8 h-8 text-orange-300 mb-4" />
            <p className="text-sm text-neutral-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-6 pt-6 border-t border-orange-100">
              <cite className="not-italic font-semibold text-neutral-900 text-sm">{t.author}</cite>
              <p className="text-xs text-neutral-500 mt-0.5">{t.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

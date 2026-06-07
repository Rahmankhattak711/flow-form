import { STEPS } from "./constants";

const STEP_STYLES = [
  { ring: "border-orange-300", bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
  { ring: "border-amber-300", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  { ring: "border-orange-400", bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-600" },
  { ring: "border-red-300", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
] as const;

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-2">
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          From idea to responses in four steps
        </h2>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          A straightforward workflow built for speed — no complex setup or technical skills
          required.
        </p>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-6 relative">
        <div
          className="absolute top-7 left-[12.5%] right-[12.5%] h-0.5 z-0 pointer-events-none rounded-full "
          aria-hidden
        />

        {STEPS.map((item, index) => {
          const style = STEP_STYLES[index]!;
          return (
            <div key={item.step} className="relative flex flex-col items-center z-10">

              <div
                className={`relative w-14 h-14 rounded-full border-2 ${style.ring} ${style.bg} flex items-center justify-center shadow-sm`}
              >
                <span className={`text-sm font-extrabold ${style.text}`}>{item.step}</span>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${style.dot} ring-2 ring-white`}
                />
              </div>

              <article className="mt-8 w-full chai-card p-6 h-full text-left hover:border-orange-300 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{item.description}</p>
              </article>
            </div>
          );
        })}
      </div>

      <div className="lg:hidden space-y-0 max-w-lg mx-auto">
        {STEPS.map((item, index) => {
          const style = STEP_STYLES[index]!;
          const isLast = index === STEPS.length - 1;

          return (
            <div key={item.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full border-2 ${style.ring} ${style.bg} flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <span className={`text-sm font-extrabold ${style.text}`}>{item.step}</span>
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 min-h-[2rem] my-1 rounded-full bg-linear-to-b from-orange-300 to-amber-400" />
                )}
              </div>
              <article className={`flex-1 chai-card p-5 ${!isLast ? "mb-6" : ""}`}>
                <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{item.description}</p>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

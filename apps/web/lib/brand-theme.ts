/** ChaiCode-inspired theme — warm light, amber → orange → coral */
export const brand = {
  pageBg: "bg-[#fafaf9]",
  surface: "bg-white border-orange-100/80",
  surfaceMuted: "bg-orange-50/50 border-orange-100",
  text: "text-neutral-900",
  textMuted: "text-neutral-600",
  textSubtle: "text-neutral-500",
  gradientText: "bg-clip-text text-transparent bg-linear-to-r from-amber-500 via-orange-500 to-red-500",
  gradientBg: "bg-linear-to-r from-amber-500 via-orange-500 to-orange-600",
  gradientSoft: "bg-linear-to-br from-amber-50 via-orange-50/80 to-white",
  gradientHero: "bg-linear-to-b from-amber-50/80 via-white to-[#fafaf9]",
  glow: "bg-orange-400/20",
  primary: "orange-500",
  primaryHover: "hover:bg-orange-600",
  accent: "text-orange-500",
  accentLight: "text-amber-600",
  badge: "text-orange-700 bg-orange-50 border-orange-200",
  activeNav: "bg-orange-50 text-orange-600 border-orange-200",
  activeNavIcon: "text-orange-500",
  btnPrimary:
    "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25",
  btnOutline:
    "border border-neutral-200 bg-white text-neutral-700 hover:border-orange-300 hover:bg-orange-50",
  card: "rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-500/5",
  cardHover: "hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/10",
  input:
    "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20",
  labelAccent: "text-orange-600",
} as const;

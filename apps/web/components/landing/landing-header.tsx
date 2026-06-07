import Link from "next/link";
import { FormInput } from "lucide-react";
import { NAV_LINKS } from "./constants";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/80 bg-white/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-neutral-900">
          <div className="w-9 h-9 rounded-xl chai-gradient-bg flex items-center justify-center shadow-md shadow-orange-500/20">
            <FormInput className="w-5 h-5 text-white" />
          </div>
          <span>
            Flow<span className="chai-gradient-text">Form</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-orange-600 transition">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden sm:inline text-sm font-medium text-neutral-600 hover:text-orange-600 transition px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-semibold text-white chai-gradient-bg hover:opacity-95 px-4 py-2 rounded-lg transition shadow-md shadow-orange-500/20"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { FormInput } from "lucide-react";
import { NAV_LINKS } from "./constants";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Use cases", href: "#use-cases" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
} as const;

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-orange-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900">
              <div className="w-8 h-8 rounded-lg chai-gradient-bg flex items-center justify-center">
                <FormInput className="w-4 h-4 text-white" />
              </div>
              FlowForm
            </Link>
            <p className="mt-4 text-sm text-neutral-500 leading-relaxed max-w-xs">
              Build, schedule, and share forms that convert — without code.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">{group}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-neutral-600 hover:text-orange-600 transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} FlowForm. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-orange-600 transition">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

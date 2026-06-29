"use client";

import React, { useEffect, useState } from "react";
import { useUser, useSignOut } from "~/hooks/api/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FormInput, LogOut, LayoutDashboard, ClipboardList, Menu, X, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading, isError } = useUser();
  const { mutateAsync: signOutAsync } = useSignOut();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.push("/sign-in");
    }
  }, [user, isLoading, isError, router]);

  const handleSignOut = async () => {
    try {
      await signOutAsync({});
      toast.success("Signed out", {
        description: "You have been signed out successfully.",
      });
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Failed to sign out", { description: message });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#fafaf9] text-neutral-900 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-4 z-10">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <h2 className="text-xl font-medium text-neutral-600 animate-pulse">Verifying credentials...</h2>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Forms", href: "/dashboard/forms", icon: ClipboardList },
    { name: "View Responses", href: "/dashboard/responses", icon: FormInput },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const navLinkClass = (active: boolean) =>
    active
      ? "bg-orange-50 text-orange-600 border-orange-200"
      : "text-neutral-600 hover:text-orange-600 hover:bg-orange-50/50 border-transparent";

  return (
    <div className="h-screen w-full bg-[#fafaf9] text-neutral-900 flex flex-col md:flex-row relative">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl" />

      <aside className="hidden md:flex flex-col w-64 border-r border-orange-100 bg-white/90 backdrop-blur-md p-6 shrink-0 z-10 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-2xl mb-10 text-neutral-900">
          <FormInput className="w-7 h-7 text-orange-500 stroke-[2.5]" />
          <span>
            Flow<span className="chai-gradient-text">Form</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-200 border group ${navLinkClass(isActive)}`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-neutral-400 group-hover:text-orange-500"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-orange-100 pt-6 mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full chai-gradient-bg flex items-center justify-center font-bold text-sm text-white shadow-md shadow-orange-500/20">
              {getInitials(user.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-neutral-900">{user.fullName}</p>
              <p className="text-xs truncate text-neutral-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <header className="md:hidden w-full border-b border-orange-100 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between z-30">
        <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-xl text-neutral-900">
          <FormInput className="w-6 h-6 text-orange-500 stroke-[2.5]" />
          <span>
            Flow<span className="chai-gradient-text">Form</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-[#fafaf9] z-20 flex flex-col p-6 space-y-6 border-t border-orange-100">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition border ${navLinkClass(isActive)}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-orange-100 pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full chai-gradient-bg flex items-center justify-center font-bold text-sm text-white">
                {getInitials(user.fullName)}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{user.fullName}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignOut();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto max-w-7xl mx-auto w-full z-10">
        {children}
      </main>
    </div>
  );
}

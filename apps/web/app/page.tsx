"use client";

import { useUser } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LandingBackground,
  LandingCta,
  LandingFaq,
  LandingFeatures,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingHowItWorks,
  LandingPaymentsComingSoon,
  LandingPricing,
  LandingStats,
  LandingTestimonials,
  LandingUseCases,
} from "~/components/landing";

export default function Home() {
  const { data, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      router.push("/dashboard");
    }
  }, [data, router]);

  // if (isLoading) {
  //   return (
  //     <main className="min-h-screen w-screen bg-[#fafaf9] text-neutral-900 flex flex-col justify-center items-center relative overflow-hidden">
  //       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
  //       <div className="flex flex-col items-center gap-4 z-10">
  //         <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
  //         {/* <h2 className="text-lg font-medium text-neutral-600">Loading FlowForm...</h2> */}
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main className="min-h-screen w-full bg-[#fafaf9] text-neutral-900 relative overflow-x-hidden">
      <LandingBackground />
      <LandingHeader />
      <LandingHero />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingPaymentsComingSoon />
      <LandingUseCases />
      <LandingStats />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}

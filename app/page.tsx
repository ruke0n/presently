import { HeroSection } from "@/components/hero-section";
import { SiteNav } from "@/components/site-nav";
import { CtaBand, Features, HowItWorks, UseCases } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main id="top" className="min-h-dvh bg-zinc-950 text-white antialiased">
      <SiteNav />
      <HeroSection />
      <HowItWorks />
      <Features />
      <UseCases />
      <CtaBand />
      <SiteFooter />
    </main>
  );
}

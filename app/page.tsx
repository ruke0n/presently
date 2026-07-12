import LiquidMetalHero from "@/components/ui/liquid-metal-hero";
import { SiteNav } from "@/components/site-nav";
import { CtaBand, Features, HowItWorks, UseCases } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main id="top" className="min-h-dvh bg-zinc-950 text-white antialiased">
      <SiteNav />
      <LiquidMetalHero
        badge="Live on Arc Testnet"
        title={
          <>
            Send USDC{" "}
            <span className="bg-gradient-to-br from-white via-[#ffe6b0] to-[#ffb057] bg-clip-text italic text-transparent">
              as a gift
            </span>
            .
          </>
        }
        subtitle="Lock USDC into a voucher, share a link or a code, and anyone can redeem it straight into their wallet. No account, no separate gas token, just USDC on Arc."
        primaryCtaLabel="Create a voucher"
        secondaryCtaLabel="Redeem a code"
        features={["USDC-native", "Instant redeem", "One-time claim"]}
      />
      <HowItWorks />
      <Features />
      <UseCases />
      <CtaBand />
      <SiteFooter />
    </main>
  );
}

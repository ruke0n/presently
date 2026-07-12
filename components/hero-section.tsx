"use client";

import LiquidMetalHero from "@/components/ui/liquid-metal-hero";
import { useVoucher } from "@/app/providers";

export function HeroSection() {
  const { open } = useVoucher();
  return (
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
      onPrimaryCtaClick={() => open("create")}
      onSecondaryCtaClick={() => open("redeem")}
      features={["USDC-native", "Instant redeem", "One-time claim"]}
    />
  );
}

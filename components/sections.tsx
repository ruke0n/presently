"use client";

import { Gift, Wallet, Share2, Sparkles, Cake, Trophy, Megaphone, HeartHandshake } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { useVoucher } from "@/app/providers";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="reveal" style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#ffcd75]">
      <span className="h-px w-6 bg-[#ffcd75]/60" />
      {children}
    </div>
  );
}

const STEPS = [
  { icon: Gift, title: "Create", body: "Pick an amount of USDC and generate a voucher with a secret code." },
  { icon: Wallet, title: "Fund", body: "Approve and lock the USDC into the voucher contract in one transaction." },
  { icon: Share2, title: "Share", body: "Send the claim link or the short code however you like." },
  { icon: Sparkles, title: "Redeem", body: "The recipient connects a wallet, enters the code, and the USDC lands instantly." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <Reveal>
        <Kicker>How it works</Kicker>
        <h2 className="max-w-[18ch] text-4xl font-medium tracking-tighter sm:text-5xl lg:text-6xl">
          A gift in four steps.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-4 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffcd75]/12 text-[#ffcd75] ring-1 ring-[#ffcd75]/20">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mb-1 font-mono text-xs text-[#ffcd75]">0{i + 1}</div>
              <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 border-t border-white/5 bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal>
          <Kicker>Why Presently</Kicker>
          <h2 className="max-w-[20ch] text-4xl font-medium tracking-tighter sm:text-5xl lg:text-6xl">
            Everything a voucher should be.
          </h2>
        </Reveal>
        <div className="mt-14">
          <Reveal>
            <BentoGrid />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const CASES = [
  { icon: Cake, title: "Birthdays & holidays", body: "Send money as an actual gift, not a bank transfer with a memo." },
  { icon: Trophy, title: "Rewards & bounties", body: "Drop a claimable code for contest winners or completed bounties." },
  { icon: Megaphone, title: "Promos & drops", body: "Hand out USDC vouchers at events or in campaigns, redeemable by anyone." },
  { icon: HeartHandshake, title: "Tips & thank-yous", body: "A quick way to pass value to someone without asking for their address first." },
];

export function UseCases() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <Reveal>
        <Kicker>Use cases</Kicker>
        <h2 className="max-w-[20ch] text-4xl font-medium tracking-tighter sm:text-5xl lg:text-6xl">
          Value, wrapped and handed over.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {CASES.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <div className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-[#ffcd75] ring-1 ring-white/10">
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{c.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CtaBand() {
  const { open } = useVoucher();
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ffcd75]/15 via-white/[0.03] to-transparent px-8 py-16 text-center sm:py-20">
          <h2 className="mx-auto max-w-[16ch] text-4xl font-medium tracking-tighter sm:text-5xl">
            Wrap some USDC and send it.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">
            Create your first voucher on Arc testnet in under a minute.
          </p>
          <button
            onClick={() => open("create")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02]"
          >
            <Gift className="h-4 w-4" />
            Create a voucher
          </button>
        </div>
      </Reveal>
    </section>
  );
}

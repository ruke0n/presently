"use client";

import { cn } from "@/lib/utils";
import { Link2, KeyRound, ShieldCheck, Undo2, Coins, Wallet } from "lucide-react";
import type { ReactNode } from "react";

interface BentoItem {
  title: string;
  description: string;
  icon: ReactNode;
  meta?: string;
  tags?: string[];
  colSpan?: number;
  highlight?: boolean;
}

const ITEMS: BentoItem[] = [
  {
    title: "Share by link or code",
    meta: "your choice",
    description:
      "Every voucher is a shareable link and a short human-readable code. Drop it in a message, print it on a card, or hand it over in person.",
    icon: <Link2 className="w-4 h-4 text-[#ffcd75]" />,
    tags: ["Link", "Code"],
    colSpan: 2,
    highlight: true,
  },
  {
    title: "One-time claim",
    meta: "no double spend",
    description: "A voucher can be redeemed exactly once. The contract marks it claimed atomically.",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    tags: ["Safe"],
  },
  {
    title: "Reclaim anytime",
    meta: "unclaimed only",
    description: "Changed your mind? The sender can sweep back any voucher that hasn't been redeemed yet.",
    icon: <Undo2 className="w-4 h-4 text-sky-400" />,
    tags: ["Refundable"],
    colSpan: 2,
  },
  {
    title: "USDC-native",
    meta: "6 decimals",
    description: "Amounts are real USDC on Arc, the same asset that pays gas.",
    icon: <Coins className="w-4 h-4 text-[#ffcd75]" />,
    tags: ["Arc"],
  },
  {
    title: "No account to redeem",
    meta: "just a wallet",
    description: "The recipient connects any wallet and claims. No signup, no email, no custody.",
    icon: <Wallet className="w-4 h-4 text-pink-400" />,
    tags: ["Self-custody"],
  },
  {
    title: "Secret-hash codes",
    meta: "on-chain proof",
    description: "The code hashes to a commitment stored on-chain; redeeming reveals the secret to unlock the funds.",
    icon: <KeyRound className="w-4 h-4 text-violet-400" />,
    tags: ["Cryptographic"],
    colSpan: 2,
  },
];

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {ITEMS.map((item, i) => (
        <div
          key={i}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300",
            "hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]",
            item.colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
            item.highlight && "border-[#ffcd75]/25 bg-gradient-to-br from-[#ffcd75]/10 to-transparent",
          )}
        >
          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                {item.icon}
              </div>
              {item.meta && (
                <span className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-medium text-white/50">
                  {item.meta}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[15px] font-semibold tracking-tight text-white">{item.title}</h3>
              <p className="text-sm leading-snug text-white/60">{item.description}</p>
            </div>
            {item.tags && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/45">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

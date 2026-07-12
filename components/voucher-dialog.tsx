"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { formatUnits, maxUint256, parseUnits } from "viem";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Gift, Loader2, Ticket, X } from "lucide-react";
import { erc20Abi, generateCode, giftVoucherAbi, GIFT_VOUCHER, hashCode, USDC } from "@/lib/chain";

type Mode = "create" | "redeem";
type Status = { kind: "idle" | "busy" | "ok" | "err"; msg?: string };

export function VoucherDialog({
  mode,
  onClose,
  onSwitch,
  initialCode = "",
}: {
  mode: Mode | null;
  onClose: () => void;
  onSwitch: (m: Mode) => void;
  initialCode?: string;
}) {
  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/12 bg-zinc-950 shadow-2xl"
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-white/8 p-5">
              <div className="flex gap-1 rounded-full bg-white/5 p-1">
                <Tab active={mode === "create"} onClick={() => onSwitch("create")} icon={<Gift className="h-4 w-4" />}>
                  Create
                </Tab>
                <Tab active={mode === "redeem"} onClick={() => onSwitch("redeem")} icon={<Ticket className="h-4 w-4" />}>
                  Redeem
                </Tab>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {mode === "create" ? <CreatePanel /> : <RedeemPanel initialCode={initialCode} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Tab({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active ? "bg-white text-zinc-950" : "text-white/60 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ConnectGate({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  if (isConnected) return <>{children}</>;
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-white/60">Connect a wallet on Arc testnet to continue.</p>
      <div className="flex justify-center">
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>
    </div>
  );
}

function StatusLine({ s }: { s: Status }) {
  if (s.kind === "idle") return null;
  const color = s.kind === "err" ? "#fb7185" : s.kind === "ok" ? "#4ade80" : "#a1a1aa";
  return (
    <p className="mt-3 flex items-center justify-center gap-2 text-center text-[13px]" style={{ color }}>
      {s.kind === "busy" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {s.msg}
    </p>
  );
}

function friendly(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  if (/rejected|denied/i.test(m)) return "Rejected in wallet.";
  if (/insufficient/i.test(m)) return "Insufficient balance.";
  return m.split("\n")[0].slice(0, 120);
}

const PRIMARY =
  "w-full rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white/90 disabled:opacity-40";

function CreatePanel() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [amount, setAmount] = useState("25");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [result, setResult] = useState<{ code: string } | null>(null);

  async function create() {
    if (!publicClient || !address) return;
    const amt = Number(amount);
    if (!(amt > 0)) return setStatus({ kind: "err", msg: "Enter an amount above zero." });
    const code = generateCode();
    const codeHash = hashCode(code);
    const value = parseUnits(amount, 6);
    try {
      setStatus({ kind: "busy", msg: "Checking allowance…" });
      const allowance = (await publicClient.readContract({
        address: USDC,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, GIFT_VOUCHER],
      })) as bigint;
      if (allowance < value) {
        setStatus({ kind: "busy", msg: "Approve USDC in your wallet…" });
        const a = await writeContractAsync({ address: USDC, abi: erc20Abi, functionName: "approve", args: [GIFT_VOUCHER, maxUint256] });
        await publicClient.waitForTransactionReceipt({ hash: a });
      }
      setStatus({ kind: "busy", msg: "Creating the voucher…" });
      const tx = await writeContractAsync({ address: GIFT_VOUCHER, abi: giftVoucherAbi, functionName: "createVoucher", args: [codeHash, value] });
      await publicClient.waitForTransactionReceipt({ hash: tx });
      setResult({ code });
      setStatus({ kind: "idle" });
    } catch (e) {
      setStatus({ kind: "err", msg: friendly(e) });
    }
  }

  if (result) return <CreatedResult code={result.code} amount={amount} />;

  return (
    <ConnectGate>
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">Gift amount</div>
          <div className="flex items-center rounded-xl border border-white/12 bg-white/[0.04] px-4 focus-within:border-[#ffb057]">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="w-full bg-transparent py-3.5 text-2xl font-semibold text-white outline-none"
            />
            <span className="text-sm font-medium text-white/50">USDC</span>
          </div>
        </div>
        <button onClick={create} disabled={status.kind === "busy"} className={PRIMARY}>
          {status.kind === "busy" ? "Working…" : "Lock USDC & get code"}
        </button>
        <StatusLine s={status} />
      </div>
    </ConnectGate>
  );
}

function CreatedResult({ code, amount }: { code: string; amount: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const link = useMemo(() => (typeof window !== "undefined" ? `${window.location.origin}/?claim=${code}` : ""), [code]);
  const copy = (text: string, which: "code" | "link") => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffb057]/15 text-[#ffcd75] ring-1 ring-[#ffb057]/30">
        <Gift className="h-7 w-7" />
      </div>
      <div>
        <div className="text-lg font-semibold">Voucher created</div>
        <p className="mt-1 text-sm text-white/60">{amount} USDC locked. Share the code or link, the first person to redeem gets it.</p>
      </div>
      <button
        onClick={() => copy(code, "code")}
        className="flex w-full items-center justify-between rounded-xl border border-dashed border-white/25 bg-white/[0.03] px-4 py-3 font-mono text-lg tracking-[0.15em]"
      >
        {code}
        {copied === "code" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/50" />}
      </button>
      <button onClick={() => copy(link, "link")} className={PRIMARY}>
        {copied === "link" ? "Link copied" : "Copy claim link"}
      </button>
    </div>
  );
}

function RedeemPanel({ initialCode }: { initialCode: string }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [done, setDone] = useState<{ amount: string } | null>(null);

  useEffect(() => setCode(initialCode), [initialCode]);

  async function redeem() {
    if (!publicClient || !address) return;
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return setStatus({ kind: "err", msg: "Enter a code." });
    try {
      setStatus({ kind: "busy", msg: "Looking up voucher…" });
      const [, amount, closed] = (await publicClient.readContract({
        address: GIFT_VOUCHER,
        abi: giftVoucherAbi,
        functionName: "vouchers",
        args: [hashCode(trimmed)],
      })) as [string, bigint, boolean];
      if (amount === 0n) return setStatus({ kind: "err", msg: "No voucher for that code." });
      if (closed) return setStatus({ kind: "err", msg: "This voucher was already claimed." });

      setStatus({ kind: "busy", msg: "Confirm redeem in your wallet…" });
      const tx = await writeContractAsync({ address: GIFT_VOUCHER, abi: giftVoucherAbi, functionName: "redeem", args: [trimmed] });
      await publicClient.waitForTransactionReceipt({ hash: tx });
      setDone({ amount: formatUnits(amount, 6) });
      setStatus({ kind: "idle" });
    } catch (e) {
      setStatus({ kind: "err", msg: friendly(e) });
    }
  }

  if (done)
    return (
      <div className="space-y-4 py-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
          <Check className="h-7 w-7" />
        </div>
        <div className="text-lg font-semibold">{done.amount} USDC redeemed</div>
        <p className="text-sm text-white/60">It landed in your wallet.</p>
      </div>
    );

  return (
    <ConnectGate>
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">Redeem code</div>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PRES-XXXX-XXXX"
            spellCheck={false}
            className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5 text-center font-mono text-lg uppercase tracking-[0.15em] text-white outline-none placeholder:text-white/30 focus:border-[#ffb057]"
          />
        </div>
        <button onClick={redeem} disabled={status.kind === "busy"} className={PRIMARY}>
          {status.kind === "busy" ? "Working…" : "Redeem to my wallet"}
        </button>
        <StatusLine s={status} />
      </div>
    </ConnectGate>
  );
}

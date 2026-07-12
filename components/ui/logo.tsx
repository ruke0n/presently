import { cn } from "@/lib/utils";

/**
 * Presently mark: a geometric ribbon bow (two loops meeting at a knot), reading
 * as a gift / present. Warm amber-to-coral gradient. Scales from favicon to hero.
 */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  const id = "presently-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="Presently"
    >
      <defs>
        <linearGradient id={id} x1="4" y1="8" x2="28" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffdd92" />
          <stop offset="0.55" stopColor="#ffb057" />
          <stop offset="1" stopColor="#ff7a54" />
        </linearGradient>
      </defs>
      {/* Two bow loops */}
      <g fill={`url(#${id})`} stroke={`url(#${id})`} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M14 16 L6.4 10.8 L6.4 21.2 Z" />
        <path d="M18 16 L25.6 10.8 L25.6 21.2 Z" />
      </g>
      {/* Knot */}
      <rect x="13" y="13" width="6" height="6" rx="2" fill="#e07a3a" />
      <rect x="14.6" y="14.6" width="2.8" height="2.8" rx="1" fill="#ffe6bf" />
    </svg>
  );
}

export function Logo({ className, wordmarkClassName }: { className?: string; wordmarkClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={26} />
      <span className={cn("text-lg font-semibold tracking-tight", wordmarkClassName)}>Presently</span>
    </span>
  );
}

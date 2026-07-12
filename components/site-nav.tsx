"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/logo";

const LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          scrolled ? "border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark size={26} />
            <span className="text-lg font-semibold tracking-tight text-white">Presently</span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href="#app"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02]"
          >
            Create a voucher
          </a>
        </nav>
      </div>
    </div>
  );
}

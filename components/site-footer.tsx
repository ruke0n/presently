import { LogoMark } from "@/components/ui/logo";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-zinc-950 px-4 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark size={26} />
              <span className="text-lg font-semibold tracking-tight">Presently</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              USDC gift vouchers on Arc. Lock USDC, share a code, redeem to any
              wallet. Experimental software on testnet.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Product"
              links={[
                { label: "How it works", href: "#how" },
                { label: "Features", href: "#features" },
                { label: "Create", href: "#app" },
              ]}
            />
            <FooterCol
              title="Network"
              links={[
                { label: "Arc testnet", href: "https://rpc.testnet.arc.network" },
                { label: "USDC", href: "#" },
              ]}
            />
            <FooterCol title="Legal" links={[{ label: "Testnet, unaudited", href: "#" }]} />
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="mt-16 flex w-full items-center justify-center">
          <h2 className="select-none bg-gradient-to-b from-white/12 to-white/[0.02] bg-clip-text text-center text-[22vw] font-semibold leading-none tracking-tighter text-transparent">
            presently
          </h2>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white/80">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm text-white/50 transition-colors hover:text-white">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

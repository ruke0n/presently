"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { arcTestnet } from "@/lib/chain";
import { VoucherDialog } from "@/components/voucher-dialog";

const config = getDefaultConfig({
  appName: "Presently",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID ?? "presently-demo",
  chains: [arcTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

type Mode = "create" | "redeem" | null;
const VoucherCtx = createContext<{ open: (m: Exclude<Mode, null>) => void }>({ open: () => {} });
export const useVoucher = () => useContext(VoucherCtx);

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(null);
  const [initialCode, setInitialCode] = useState("");
  const open = useCallback((m: Exclude<Mode, null>) => setMode(m), []);

  // Deep link: /?claim=CODE opens the redeem flow with the code prefilled.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("claim");
    if (c) {
      setInitialCode(c);
      setMode("redeem");
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={arcTestnet}
          theme={darkTheme({ accentColor: "#ffb057", accentColorForeground: "#1a1010", borderRadius: "large" })}
        >
          <VoucherCtx.Provider value={{ open }}>
            {children}
            <VoucherDialog mode={mode} onClose={() => setMode(null)} onSwitch={setMode} initialCode={initialCode} />
          </VoucherCtx.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

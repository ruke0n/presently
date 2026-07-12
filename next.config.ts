import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: no server routes, so the build emits a plain `out/` that
  // Cloudflare Pages serves directly.
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    // Optional deps wagmi / WalletConnect probe for but never need in-browser.
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
};

export default nextConfig;

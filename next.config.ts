import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: no server routes, so the build emits a plain `out/` that
  // Cloudflare Pages serves directly.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

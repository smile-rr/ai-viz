import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Data files served from public/data/
  trailingSlash: true,
};

export default nextConfig;

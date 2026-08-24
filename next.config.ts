import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ziporter",
  assetPrefix: "/ziporter",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? "/ziporter" : "",
  assetPrefix: isGithubActions ? "/ziporter" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

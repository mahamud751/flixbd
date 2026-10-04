import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained app with its own lockfile — stops Turbopack from walking up
  // to the stray ~/package-lock.json outside this git repo.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

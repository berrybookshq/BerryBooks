import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow serving the hero video from public/
  // Add any future image domains here for Firebase Storage later
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;

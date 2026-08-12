import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com"
      },
      {
        protocol: "https",
        hostname: "assets.leetcode.com"
      },
      {
        protocol: "https",
        hostname: "leetcode.com"
      }
    ]
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // à garder si vous en avez besoin
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Empêche webpack de chercher le module 'fs' dans le bundle client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;

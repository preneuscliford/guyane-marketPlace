// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'oidmaqovylsvbewsrlcb.supabase.co'
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Augmentez si nécessaire
      allowedOrigins: [
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SITE_URL || "",
      ].filter(Boolean),
    },
    optimizePackageImports: [
      "@supabase/supabase-js",
      "@radix-ui/react-dropdown-menu",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false, // Ajout important pour Netlify
      };
    }
    return config;
  },
  transpilePackages: [
    "@supabase/supabase-js",
    "react-hot-toast", // Exemple de package supplémentaire
  ],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [];
  },
  source: "/api/:path*",
  destination: "https://clinic-manager-backend.vercel.app/api/:path*",
  // Desabilitar o cache estático para desenvolvimento
  staticPageGenerationTimeout: 300,
  // Permitir imagens de qualquer domínio
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;

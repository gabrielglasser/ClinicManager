/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [];
  },
  // Desabilitar o cache estático para desenvolvimento
  staticPageGenerationTimeout: 0,
  // Permitir imagens de qualquer domínio
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;

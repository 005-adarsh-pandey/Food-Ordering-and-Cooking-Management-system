/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.cache = {
      type: 'memory'
    };
    return config;
  }
};

module.exports = nextConfig;
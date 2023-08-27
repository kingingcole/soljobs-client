/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          net: false,
          fs: false
        }
      };
    }
    return config;
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;

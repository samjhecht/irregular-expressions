const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.alias['next/dist/client/dev/error-overlay/websocket.js'] = 'next/dist/client/next.js';
    }

    return config;
  },
};

module.exports = withContentlayer(nextConfig);

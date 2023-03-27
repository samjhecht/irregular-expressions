const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
// };
const nextConfig = {
  experimental: {
    appDir: false,
  },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     require('./scripts/generate-sitemap')
  //   }

  //   return config
  // },
};

module.exports = withContentlayer(nextConfig);

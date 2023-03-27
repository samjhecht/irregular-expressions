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
  //   if (!isServer) {
  //     require('./scripts/sitemap.mjs')
  //     require('./scripts/rss.mjs')
  //   }
  //   return config
  // },
  // reactStrictMode: true,
};

module.exports = withContentlayer(nextConfig);

// /** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
// };


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
//   reactStrictMode: true,
// };

// module.exports = nextConfig;
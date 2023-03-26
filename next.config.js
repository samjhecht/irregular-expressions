const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
// };
const nextConfig = {
  experimental: {
    appDir: false,
  },
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
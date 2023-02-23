/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  exportPathMap: () => ({
    '/': { page: '/dashboard' },
  }),
}

module.exports = nextConfig

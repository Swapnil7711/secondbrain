/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    asyncWebAssembly: true
  },
}

module.exports = nextConfig

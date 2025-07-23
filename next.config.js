/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  swcMinify: false,
  experimental: {
    optimizePackageImports: ['@headlessui/react', '@heroicons/react']
  }
}

module.exports = nextConfig 
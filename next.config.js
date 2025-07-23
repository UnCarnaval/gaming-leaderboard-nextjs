/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Excluir archivos de datos del build
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    // Ignorar archivos de datos durante el build
    config.watchOptions = {
      ignored: ['**/data/**', '**/node_modules/**']
    }
    
    return config
  }
}

module.exports = nextConfig 
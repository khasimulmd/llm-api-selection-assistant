/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/llm-api-selection-assistant' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/llm-api-selection-assistant/' : '',
}

module.exports = nextConfig 
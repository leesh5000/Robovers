/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'example.com', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000',
  },  
}

module.exports = nextConfig
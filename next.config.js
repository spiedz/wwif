/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'variety.com',
      },
      {
        protocol: 'https',
        hostname: 'www.universalorlando.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    domains: ['upload.wikimedia.org', 'm.media-amazon.com', 'images.unsplash.com', 'via.placeholder.com'],
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during production builds
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // Format: /what-was-filmed-in-[location] -> /locations/[location]
      {
        source: '/what-was-filmed-in-:location',
        destination: '/locations/:location',
        permanent: true,
      },
      // Format: /locations/what-was-filmed-in-[location] -> /locations/[location]
      {
        source: '/locations/what-was-filmed-in-:location',
        destination: '/locations/:location',
        permanent: true,
      }
    ]
  },
  // Indicate that fs should only be available on the server side
  experimental: {
    serverComponentsExternalPackages: ['fs', 'path'],
  },
  // Add a webpack configuration to provide empty modules for fs on the client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 
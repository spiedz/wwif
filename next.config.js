/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const nextConfig = {
  reactStrictMode: true,
  
  // Note: Using output: 'export' is incompatible with API routes and redirects
  // output: 'export', 
  
  // Enable persistent caching for faster builds
  experimental: {
    // Updated for Next.js 14+ compatibility
    ...(process.env.NODE_ENV === 'production' ? {
      // Only use these in production to avoid development issues
      memoryBasedWorkersCount: true,
      optimizePackageImports: ['lodash', 'react-markdown'],
    } : {}),
  },
  
  // Improved image optimization options
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
    
    // Add image optimization settings
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Disable checks during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
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
    
    // Add optimization for production builds
    if (process.env.NODE_ENV === 'production') {
      // Use cache for modules
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // Add chunk optimization
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            // Create a specific chunk for react and related packages
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              chunks: 'all',
              priority: 20,
            },
            // Dedicated chunk for UI libraries
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](tailwindcss)[\\/]/,
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig); 
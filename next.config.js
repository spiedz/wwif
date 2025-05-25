/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const nextConfig = {
  reactStrictMode: true,
  
  experimental: {
    ...(process.env.NODE_ENV === 'production' ? {
      memoryBasedWorkersCount: true,
      optimizePackageImports: ['lodash', 'react-markdown'],
    } : {})
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    SERPAPI_API_KEY: 'afc5b1cf30cd04541864e0444a783188467b86b0fd25822657ffad843929257d',
  },
  
  async redirects() {
    return [
      {
        source: '/what-was-filmed-in-:location',
        destination: '/locations/:location',
        permanent: true,
      },
      {
        source: '/locations/what-was-filmed-in-:location',
        destination: '/locations/:location',
        permanent: true,
      }
    ]
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    if (process.env.NODE_ENV === 'production') {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
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
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              chunks: 'all',
              priority: 20,
            },
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
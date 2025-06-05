/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const nextConfig = {
  reactStrictMode: true,
  
  // Completely disable fast refresh and hot reloading
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable hot module replacement completely
      config.plugins = config.plugins.filter(plugin => 
        plugin.constructor.name !== 'HotModuleReplacementPlugin'
      );
      
      // Disable fast refresh
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-refresh/runtime': false,
        '@next/react-refresh-utils/runtime': false,
      };
      
      // Use polling for file watching
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
        ignored: /node_modules/,
      };
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
  
  // Disable experimental features that might cause issues
  experimental: {
    optimizeCss: false,
    scrollRestoration: false,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      'images.unsplash.com',
      'images.pexels.com',
      'cdn.mos.cms.futurecdn.net'
    ],
  },

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      if (process.env.NODE_ENV === 'development') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
  
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
        destination: '/locations/what-was-filmed-in-:location',
        permanent: true,
      }
    ]
  },
};

module.exports = withBundleAnalyzer(nextConfig); 
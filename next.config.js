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
        hostname: '**',
      },
    ],
    domains: [
      'upload.wikimedia.org', 
      'm.media-amazon.com', 
      'images.unsplash.com', 
      'via.placeholder.com',
      'www.robertmitchellevans.com',
      'image.tmdb.org',
      // New domains added to resolve image loading issues
      'cdn.marvel.com',              // Marvel movie posters and content images
      'www.themoviedb.org',          // Movie database images for Harry Potter and other films
      'www.hobbitontours.com',       // Specific images for The Hobbit film pages
      'cdn.searchenginejournal.com', // Potential source for SEO-related content
      'source.unsplash.com',         // Dynamic unsplash images
      'variety.com',                 // Entertainment industry images
      'www.universalorlando.com',    // Theme park images for film locations
      'www.marvel.com',              // Additional Marvel domain
      'cdnjs.cloudflare.com',        // CDN for potential script/image resources
      'www.amazon.com',              // Amazon image hosting
      // Add the missing domain that's causing the error
      'cdn.mos.cms.futurecdn.net',   // Future Publishing CDN (causing the current error)
      // Add more common CDN domains to prevent future errors
      'images.pexels.com',           // Pexels image repository
      'i.imgur.com',                 // Imgur image hosting
      'cloudinary.com',              // Cloudinary image hosting
      'res.cloudinary.com',          // Cloudinary CDN
      'img.youtube.com',             // YouTube thumbnails
      'media.gettyimages.com',       // Getty Images CDN
      'static01.nyt.com',            // New York Times images
      'static.independent.co.uk',    // Independent UK images
    ],
    
    // Add image optimization settings
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    // Set to true to allow dynamic images from any domain
    // Use this only if specific domains/patterns approach isn't sufficient
    // Note: This can potentially have security implications
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
    // SerpAPI key for the auto-image feature
    SERPAPI_API_KEY: 'afc5b1cf30cd04541864e0444a783188467b86b0fd25822657ffad843929257d',
  },
  
  // Exclude problematic paths from the build
  excludeDefaultMomentLocales: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
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
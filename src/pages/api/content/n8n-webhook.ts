import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface N8nWebhookRequest {
  // Google Sheets data
  filmTitle: string;
  year?: number;
  director?: string;
  genres?: string[];
  countries?: string[];
  
  // OpenRouter generated content
  aiGeneratedContent: string;
  description: string;
  coordinates?: Array<{
    lat: number;
    lng: number;
    name: string;
    description: string;
  }>;
  
  // Enhanced image collection
  images: {
    // IMDB API data (existing)
    imdbId?: string;
    posterImage?: string;
    trailer?: string;
    
    // Additional image sources
    locationImages?: Array<{
      url: string;
      source: 'unsplash' | 'pexels' | 'wikimedia' | 'google-places' | 'tmdb';
      alt: string;
      caption?: string;
      coordinates?: { lat: number; lng: number };
    }>;
    
    // AI-generated images
    aiGeneratedImages?: Array<{
      url: string;
      prompt: string;
      style: 'photorealistic' | 'cinematic' | 'artistic';
      type: 'location' | 'scene' | 'promotional';
    }>;
    
    // Processed images
    optimizedImages?: {
      hero: string;      // Main header image
      thumbnail: string; // Grid/card image  
      gallery: string[]; // Additional images
    };
  };
  
  // Processing metadata
  sourceSheet: string;
  processingTimestamp: string;
  aiModel: string;
  imageProcessingStatus: 'pending' | 'complete' | 'failed';
}

// Enhanced image automation suggestions for n8n workflow
const imageAutomationGuide = {
  
  // Step 1: Multiple Image Source APIs
  imageSources: {
    unsplash: {
      endpoint: 'https://api.unsplash.com/search/photos',
      searchTerms: ['filming location', 'movie set', 'cinematic landscape'],
      apiKey: 'UNSPLASH_ACCESS_KEY',
      benefits: 'High-quality, free stock photos'
    },
    
    pexels: {
      endpoint: 'https://api.pexels.com/v1/search',
      searchTerms: ['film production', 'movie locations', 'cinematic scenes'],
      apiKey: 'PEXELS_API_KEY', 
      benefits: 'Professional quality, commercial use allowed'
    },
    
    pixabay: {
      endpoint: 'https://pixabay.com/api/',
      searchTerms: ['cinema', 'film locations', 'movie sets'],
      apiKey: 'PIXABAY_API_KEY',
      benefits: 'Large selection, various image types'
    },

    tmdb: {
      endpoint: 'https://api.themoviedb.org/3',
      searchTerms: ['backdrops', 'stills', 'posters'],
      apiKey: 'TMDB_API_KEY',
      benefits: 'Official movie images, high resolution'
    },

    googlePlaces: {
      endpoint: 'https://maps.googleapis.com/maps/api/place',
      searchTerms: ['filming locations', 'landmarks'],
      apiKey: 'GOOGLE_PLACES_API_KEY',
      benefits: 'Actual location photos from the filming sites'
    }
  },

  // Step 2: AI Image Generation (for unique content)
  aiImageGeneration: {
    openai: {
      model: 'dall-e-3',
      prompts: [
        'Cinematic wide shot of {location} where {movie} was filmed, golden hour lighting',
        'Professional movie set photo of {location}, behind the scenes style',
        'Atmospheric landscape of {filming_location}, film photography style'
      ],
      benefits: 'Unique, copyright-free images tailored to your content'
    },
    
    midjourney: {
      style: '--style cinematic --ar 16:9 --q 2',
      prompts: [
        '{movie} filming location at {place}, professional photography',
        'Movie production set in {location}, dramatic lighting'
      ],
      benefits: 'Highest quality AI images, very cinematic'
    }
  },

  // Step 3: Image Processing Pipeline
  imageProcessing: {
    optimization: {
      formats: ['webp', 'jpg', 'avif'],
      sizes: {
        hero: '1920x1080',
        thumbnail: '400x225', 
        gallery: '800x450'
      },
      compression: 80
    },
    
    enhancement: {
      filters: ['cinematic color grading', 'contrast boost', 'sharpening'],
      watermark: 'wherewasitfilmed.co',
      altText: 'Auto-generated based on image content'
    }
  }
};

// Suggested n8n Workflow Enhancement
const n8nWorkflowEnhancement = {
  nodes: [
    {
      name: 'Google Sheets Trigger',
      description: 'Existing - gets film data'
    },
    {
      name: 'OpenRouter AI Content',
      description: 'Existing - generates content'
    },
    {
      name: 'IMDB API',
      description: 'Existing - gets poster'
    },
    
    // NEW IMAGE AUTOMATION NODES
    {
      name: 'Image Search Coordinator',
      type: 'Function',
      code: `
        // Create search terms based on film data
        const filmTitle = $json.filmTitle;
        const locations = $json.coordinates || [];
        
        const searchTerms = [
          \`\${filmTitle} filming location\`,
          \`\${filmTitle} behind the scenes\`,
          ...locations.map(loc => \`\${loc.name} cinematic\`)
        ];
        
        return { searchTerms, filmData: $json };
      `
    },
    
    {
      name: 'Unsplash Search',
      type: 'HTTP Request',
      method: 'GET',
      url: '={{$json.searchTerms.map(term => \`https://api.unsplash.com/search/photos?query=\${term}&per_page=3\`)}}'
    },
    
    {
      name: 'TMDB Images',
      type: 'HTTP Request', 
      method: 'GET',
      url: 'https://api.themoviedb.org/3/search/movie?query={{$json.filmTitle}}'
    },
    
    {
      name: 'Google Places Photos',
      type: 'Function',
      code: `
        // For each filming location, get place photos
        const locations = $json.coordinates || [];
        const placeRequests = locations.map(loc => ({
          location: loc.name,
          lat: loc.lat,
          lng: loc.lng
        }));
        return { placeRequests };
      `
    },
    
    {
      name: 'AI Image Generation (Optional)',
      type: 'HTTP Request',
      method: 'POST',
      url: 'https://api.openai.com/v1/images/generations',
      body: {
        prompt: 'Cinematic shot of {{$json.filmTitle}} filming location, professional photography style',
        n: 2,
        size: '1792x1024'
      }
    },
    
    {
      name: 'Image Optimizer',
      type: 'Function',
      code: `
        // Process and optimize all collected images
        const allImages = [
          ...$json.unsplashImages || [],
          ...$json.tmdbImages || [],
          ...$json.placesImages || [],
          ...$json.aiImages || []
        ];
        
        // Select best images and create size variants
        const selectedImages = {
          hero: allImages[0], // Best quality for header
          thumbnail: allImages[1], // For grid view
          gallery: allImages.slice(2, 6) // Additional images
        };
        
        return { optimizedImages: selectedImages };
      `
    },
    
    {
      name: 'Enhanced Markdown Generator',
      type: 'Function',
      code: `
        // Generate markdown with rich image content
        const images = $json.optimizedImages;
        const content = $json.aiGeneratedContent;
        
        const enhancedMarkdown = \`---
title: "\${$json.filmTitle}"
posterImage: "\${images.hero}"
gallery: 
\${images.gallery.map(img => \`  - "\${img}"\`).join('\\n')}
---

\${content}

## Photo Gallery
\${images.gallery.map((img, i) => \`![Location \${i+1}](\${img})\`).join('\\n\\n')}
        \`;
        
        return { enhancedMarkdown };
      `
    }
  ],
  
  benefits: [
    '5-10 high-quality images per article automatically',
    'Multiple fallback sources if one API fails',
    'Optimized images for web performance', 
    'Unique AI-generated content when needed',
    'Actual filming location photos via Google Places'
  ]
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      suggestion: 'Use POST to submit content from n8n workflow'
    });
  }

  try {
    const data: N8nWebhookRequest = req.body;
    
    // Validate required fields
    if (!data.filmTitle || !data.aiGeneratedContent) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['filmTitle', 'aiGeneratedContent']
      });
    }

    // Enhanced content creation with image optimization
    const slug = data.filmTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const frontmatter = {
      title: data.filmTitle,
      slug: slug,
      description: data.description,
      year: data.year,
      director: data.director,
      genres: data.genres,
      countries: data.countries,
      coordinates: data.coordinates,
      
      // Enhanced image fields
      posterImage: data.images?.posterImage,
      heroImage: data.images?.optimizedImages?.hero,
      thumbnail: data.images?.optimizedImages?.thumbnail,
      gallery: data.images?.optimizedImages?.gallery || [],
      
      // Image metadata
      imageCredits: data.images?.locationImages?.map(img => ({
        url: img.url,
        source: img.source,
        alt: img.alt
      })),
      
      // Processing metadata
      processedAt: new Date().toISOString(),
      imageProcessingStatus: data.imageProcessingStatus
    };

    const markdownContent = `---
${Object.entries(frontmatter)
  .filter(([_, value]) => value !== undefined)
  .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}`)
  .join('\n')}
---

${data.aiGeneratedContent}
`;

    // Save to content directory
    const contentDir = join(process.cwd(), 'content', 'films');
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true });
    }

    const filePath = join(contentDir, `where-was-${slug}-filmed.md`);
    writeFileSync(filePath, markdownContent, 'utf8');

    // 🚀 AUTOMATICALLY REQUEST INDEXING FOR NEW CONTENT
    let indexingResult = null;
    try {
      // Import and call the indexing function
      const { autoRequestIndexing } = await import('../../../utils/googleIndexingAPI');
      
      indexingResult = await autoRequestIndexing({
        title: data.filmTitle,
        slug: slug,
        type: 'film'
      });
      
      console.log('Auto-indexing result:', indexingResult);
    } catch (indexingError: any) {
      console.warn('Auto-indexing failed (non-critical):', indexingError.message);
      // Don't fail the whole request if indexing fails
    }

    return res.status(200).json({
      success: true,
      message: 'Content created successfully with enhanced image automation',
      file: `where-was-${slug}-filmed.md`,
      slug: slug,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co'}/films/${slug}`,
      imageCount: (data.images?.optimizedImages?.gallery?.length || 0) + 1,
      
      // Indexing results
      indexing: {
        attempted: true,
        success: indexingResult?.success || false,
        details: indexingResult
      },
      
      enhancementSuggestions: imageAutomationGuide
    });

  } catch (error: any) {
    console.error('N8n webhook error:', error);
    return res.status(500).json({
      error: 'Failed to process webhook',
      details: error.message
    });
  }
} 
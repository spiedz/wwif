import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { ContentMeta, FilmMeta, BlogMeta, SeriesMeta } from '../types/content';
import { 
  generateAutoMetaDescription, 
  validateMetaDescription,
  MetaDescriptionOptions 
} from '../utils/metaDescriptions';
import { getCanonicalUrl } from '../utils/canonicalUrl';

// Base schema interface
export interface SchemaObject {
  '@context': string;
  '@type': string | string[];
  [key: string]: any;
}

interface SEOProps {
  meta: FilmMeta | BlogMeta | SeriesMeta;
  imageUrl?: string;
  type?: 'website' | 'article' | 'movie' | 'tv_show';
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: SchemaObject | SchemaObject[] | string;
  additionalMetaTags?: Array<{ name: string; content: string }>;
  // New props for meta description optimization
  autoOptimizeDescription?: boolean;
  descriptionOptions?: MetaDescriptionOptions;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

/**
 * Enhanced SEO component that supports structured data and OpenGraph metadata
 * with automatic meta description optimization
 */
const SEO: React.FC<SEOProps> = ({
  meta,
  imageUrl,
  type = 'website',
  noindex = false,
  nofollow = false,
  jsonLd,
  additionalMetaTags = [],
  autoOptimizeDescription = true,
  descriptionOptions = {},
}) => {
  const router = useRouter();
  const canonicalUrl = getCanonicalUrl(router.asPath);
  
  // Check if the meta is for a film
  const isFilm = 'genre' in meta && 'director' in meta;
  
  // Check if the meta is for a blog
  const isBlog = 'author' in meta;
  
  // Check if the meta is for a series
  const isSeries = 'filmingLocations' in meta || ('network' in meta);
  
  // Determine content type for meta description generation
  const getContentType = (): 'film' | 'series' | 'blog' => {
    if (isFilm) return 'film';
    if (isSeries) return 'series';
    return 'blog';
  };

  // Generate optimized meta description
  const getOptimizedDescription = (): string => {
    const defaultDescription = 'Discover real-world filming locations from your favorite movies and TV shows';
    
    // If auto-optimization is disabled, use the original description
    if (!autoOptimizeDescription) {
      return meta.description || defaultDescription;
    }

    // If no description exists, auto-generate one
    if (!meta.description) {
      return generateAutoMetaDescription(meta, getContentType(), descriptionOptions);
    }

    // Validate existing description
    const validation = validateMetaDescription(meta.description);
    
    // If the existing description has significant issues (score < 70), regenerate
    if (validation.score < 70) {
      console.log(`SEO: Auto-generating improved description for "${meta.title}" (score: ${validation.score})`);
      return generateAutoMetaDescription(meta, getContentType(), descriptionOptions);
    }

    // Use the existing description if it's good enough
    return meta.description;
  };
  
  // Default title and description
  const title = `${meta.title} | Where Was It Filmed`;
  const description = getOptimizedDescription();
  
  // Process film genre to ensure it's an array
  const getGenreArray = (genre: string | string[] | undefined): string[] => {
    if (Array.isArray(genre)) {
      return genre;
    }
    return genre ? [genre] : [];
  };

  // Enhanced OpenGraph image selection with fallbacks
  const getOptimizedOGImage = (): string => {
    // Priority order: custom imageUrl > content-specific images > default
    if (imageUrl) return imageUrl;
    
    if (isFilm) {
      const filmMeta = meta as FilmMeta;
      return filmMeta.posterImage || 
             filmMeta.featuredImage || 
             `${BASE_URL}/images/og/film-default.jpg`;
    }
    
    if (isSeries) {
      const seriesMeta = meta as SeriesMeta;
      return seriesMeta.posterImage || 
             seriesMeta.featuredImage || 
             `${BASE_URL}/images/og/series-default.jpg`;
    }
    
    if (isBlog) {
      const blogMeta = meta as BlogMeta;
      return blogMeta.featuredImage || 
             `${BASE_URL}/images/og/blog-default.jpg`;
    }
    
    return `${BASE_URL}/images/og/default.jpg`;
  };

  // Generate content-specific OpenGraph titles
  const getOGTitle = (): string => {
    if (isFilm) {
      const filmMeta = meta as FilmMeta;
      return `${filmMeta.title} (${filmMeta.year}) Filming Locations | Where Was It Filmed`;
    }
    
    if (isSeries) {
      const seriesMeta = meta as SeriesMeta;
      return `${seriesMeta.title} TV Series Filming Locations | Where Was It Filmed`;
    }
    
    if (isBlog) {
      return `${meta.title} | Where Was It Filmed Blog`;
    }
    
    return title;
  };

  // Generate Twitter-specific descriptions (shorter for better display)
  const getTwitterDescription = (): string => {
    const maxLength = 200; // Twitter optimal length
    if (description.length <= maxLength) {
      return description;
    }
    
    // Truncate at word boundary
    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  };

  // Get content-specific Twitter card type
  const getTwitterCardType = (): string => {
    // Use summary_large_image for visual content, summary for text-heavy content
    if (isFilm || isSeries) return 'summary_large_image';
    if (isBlog) return 'summary_large_image'; // Blog posts benefit from large images
    return 'summary';
  };

  // Generate additional OpenGraph properties based on content type
  const getAdditionalOGProperties = () => {
    const properties: Array<{ property: string; content: string }> = [];
    
    if (isFilm) {
      const filmMeta = meta as FilmMeta;
      
      // Film-specific properties
      if (filmMeta.director) {
        properties.push({ property: 'og:movie:director', content: filmMeta.director });
      }
      if (filmMeta.year) {
        properties.push({ property: 'og:movie:release_date', content: String(filmMeta.year) });
      }
      
      // Add genre tags
      getGenreArray(filmMeta.genre).forEach(genre => {
        properties.push({ property: 'og:movie:tag', content: genre });
      });
      
      // Add location tags if available
      if (filmMeta.coordinates && Array.isArray(filmMeta.coordinates)) {
        filmMeta.coordinates.forEach(coord => {
          if (coord.name) {
            properties.push({ property: 'og:movie:tag', content: coord.name });
          }
        });
      }
    }
    
    if (isSeries) {
      const seriesMeta = meta as SeriesMeta;
      
      // Series-specific properties
      if (seriesMeta.creator) {
        properties.push({ property: 'og:tv_show:creator', content: seriesMeta.creator });
      }
      if (seriesMeta.network) {
        properties.push({ property: 'og:tv_show:network', content: seriesMeta.network });
      }
      
      // Add genre tags
      getGenreArray(seriesMeta.genre).forEach(genre => {
        properties.push({ property: 'og:tv_show:tag', content: genre });
      });
    }
    
    if (isBlog) {
      const blogMeta = meta as BlogMeta;
      
      // Article-specific properties
      if (blogMeta.author) {
        properties.push({ property: 'article:author', content: blogMeta.author });
      }
      if (blogMeta.date) {
        properties.push({ property: 'article:published_time', content: blogMeta.date });
      }
      
      // Add tags if available
      if (blogMeta.tags && Array.isArray(blogMeta.tags)) {
        blogMeta.tags.forEach(tag => {
          properties.push({ property: 'article:tag', content: tag });
        });
      }
    }
    
    return properties;
  };

  const ogImage = getOptimizedOGImage();
  const ogTitle = getOGTitle();
  const twitterDescription = getTwitterDescription();
  const twitterCardType = getTwitterCardType();
  const additionalOGProps = getAdditionalOGProperties();
  
  /**
   * Process and validate jsonLd data
   * Handles string, object, or array of objects
   */
  const processJsonLd = (): string | undefined => {
    if (!jsonLd) {
      return undefined;
    }
    
    // If it's already a string, validate it's proper JSON
    if (typeof jsonLd === 'string') {
      try {
        // Just parse to validate it's proper JSON
        JSON.parse(jsonLd);
        return jsonLd;
      } catch (error) {
        console.error('Invalid JSON-LD string:', error);
        return undefined;
      }
    }
    
    // If it's an object or array, stringify it
    try {
      // Basic validation for required schema.org fields
      const validateSchema = (schema: SchemaObject): boolean => {
        return (
          typeof schema === 'object' &&
          schema !== null &&
          '@context' in schema &&
          '@type' in schema
        );
      };
      
      // If array, validate each item
      if (Array.isArray(jsonLd)) {
        const validSchemas = jsonLd.filter(schema => validateSchema(schema));
        if (validSchemas.length !== jsonLd.length) {
          console.warn('Some schema objects were invalid and filtered out');
        }
        return JSON.stringify(validSchemas);
      }
      
      // Single schema object
      if (validateSchema(jsonLd as SchemaObject)) {
        return JSON.stringify(jsonLd);
      } else {
        console.error('Invalid schema object, missing required fields');
        return undefined;
      }
    } catch (error) {
      console.error('Error processing JSON-LD data:', error);
      return undefined;
    }
  };
  
  const jsonLdString = processJsonLd();
  
  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Robots Meta */}
        <meta 
          name="robots" 
          content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} 
        />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Enhanced Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${meta.title} - Where Was It Filmed`} />
        <meta property="og:site_name" content="Where Was It Filmed" />
        <meta property="og:locale" content="en_US" />
        
        {/* Enhanced Twitter Cards */}
        <meta name="twitter:card" content={twitterCardType} />
        <meta name="twitter:site" content="@wherewasitfilmed" />
        <meta name="twitter:creator" content="@wherewasitfilmed" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={twitterDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={`${meta.title} - Where Was It Filmed`} />
        
        {/* LinkedIn specific (uses OpenGraph but benefits from these) */}
        <meta property="og:image:type" content="image/jpeg" />
        
        {/* Pinterest specific */}
        <meta name="pinterest-rich-pin" content="true" />
        
        {/* Additional content-specific meta tags */}
        {additionalOGProps.map((prop, index) => (
          <meta key={`og-${index}`} property={prop.property} content={prop.content} />
        ))}
        
        {/* Content-specific additional tags */}
        {isFilm && (
          <>
            <meta name="movie:title" content={(meta as FilmMeta).title} />
            <meta name="movie:year" content={String((meta as FilmMeta).year || '')} />
            {(meta as FilmMeta).director && (
              <meta name="movie:director" content={(meta as FilmMeta).director} />
            )}
          </>
        )}
        
        {isSeries && (
          <>
            <meta name="tv:title" content={(meta as SeriesMeta).title} />
            {(meta as SeriesMeta).network && (
              <meta name="tv:network" content={(meta as SeriesMeta).network} />
            )}
          </>
        )}
        
        {/* Geographic meta tags for location-based content */}
        {isFilm && (meta as FilmMeta).coordinates && (
          <>
            <meta name="geo.region" content="US" />
            <meta name="geo.placename" content={(meta as FilmMeta).coordinates?.[0]?.name || ''} />
            {(meta as FilmMeta).coordinates?.[0]?.lat && (
              <>
                <meta name="geo.position" content={`${(meta as FilmMeta).coordinates?.[0]?.lat};${(meta as FilmMeta).coordinates?.[0]?.lng}`} />
                <meta name="ICBM" content={`${(meta as FilmMeta).coordinates?.[0]?.lat}, ${(meta as FilmMeta).coordinates?.[0]?.lng}`} />
              </>
            )}
          </>
        )}
        
        {/* Geographic meta tags for blog content with coordinates */}
        {isBlog && (meta as BlogMeta).coordinates && (
          <>
            <meta name="geo.region" content="US" />
            <meta name="geo.placename" content={(meta as BlogMeta).coordinates?.[0]?.name || ''} />
            {(meta as BlogMeta).coordinates?.[0]?.lat && (
              <>
                <meta name="geo.position" content={`${(meta as BlogMeta).coordinates?.[0]?.lat};${(meta as BlogMeta).coordinates?.[0]?.lng}`} />
                <meta name="ICBM" content={`${(meta as BlogMeta).coordinates?.[0]?.lat}, ${(meta as BlogMeta).coordinates?.[0]?.lng}`} />
              </>
            )}
          </>
        )}
        
        {/* Additional meta tags */}
        {additionalMetaTags.map((tag, index) => (
          <meta key={`meta-${index}`} name={tag.name} content={tag.content} />
        ))}
        
        {/* JSON-LD Schema */}
        {jsonLdString && (
          <script 
            type="application/ld+json" 
            dangerouslySetInnerHTML={{ __html: jsonLdString }} 
          />
        )}
      </Head>
      
      {/* Google AdSense Script - Using next/script */}
      <Script
        id="google-adsense"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1419518181504900"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
    </>
  );
};

export default SEO; 
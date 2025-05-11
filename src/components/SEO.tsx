import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { ContentMeta, FilmMeta, BlogMeta, SeriesMeta } from '../types/content';

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
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

/**
 * Enhanced SEO component that supports structured data and OpenGraph metadata
 */
const SEO: React.FC<SEOProps> = ({
  meta,
  imageUrl,
  type = 'website',
  noindex = false,
  nofollow = false,
  jsonLd,
  additionalMetaTags = [],
}) => {
  const router = useRouter();
  const canonicalUrl = `${BASE_URL}${router.asPath}`;
  
  // Check if the meta is for a film
  const isFilm = 'genre' in meta && 'director' in meta;
  
  // Check if the meta is for a blog
  const isBlog = 'author' in meta;
  
  // Default title and description
  const title = `${meta.title} | Where Was It Filmed`;
  const description = meta.description || 'Discover real-world filming locations from your favorite movies and TV shows';
  
  // Get the OpenGraph image URL
  const ogImage = imageUrl || 
    (isBlog && (meta as BlogMeta).featuredImage) || 
    (isFilm && (meta as FilmMeta).posterImage) ||
    `${BASE_URL}/images/default-og.jpg`;
  
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
  
  // Process film genre to ensure it's an array
  const getGenreArray = (genre: string | string[] | undefined): string[] => {
    if (Array.isArray(genre)) {
      return genre;
    }
    return genre ? [genre] : [];
  };
  
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
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Where Was It Filmed" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Film-specific meta tags */}
        {isFilm && (
          <>
            <meta property="og:movie:director" content={(meta as FilmMeta).director || ''} />
            <meta property="og:movie:release_date" content={String((meta as FilmMeta).year || '')} />
            {getGenreArray((meta as FilmMeta).genre).map((genre, index) => (
              <meta key={index} property="og:movie:tag" content={genre} />
            ))}
          </>
        )}
        
        {/* Blog-specific meta tags */}
        {isBlog && (meta as BlogMeta).author && (
          <meta property="article:author" content={(meta as BlogMeta).author} />
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
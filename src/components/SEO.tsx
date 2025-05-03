import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ContentMeta, FilmMeta, BlogMeta } from '../types/content';

interface SEOProps {
  meta: ContentMeta | FilmMeta | BlogMeta;
  imageUrl?: string;
  type?: 'website' | 'article' | 'movie';
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: Record<string, unknown> | string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.com';

const SEO: React.FC<SEOProps> = ({
  meta,
  imageUrl,
  type = 'website',
  noindex = false,
  nofollow = false,
  jsonLd,
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
    `${BASE_URL}/images/default-og.jpg`;
  
  // Convert jsonLd to string if it's an object
  const jsonLdString = typeof jsonLd === 'string' 
    ? jsonLd 
    : jsonLd 
      ? JSON.stringify(jsonLd) 
      : '';

  // Process film genre to ensure it's an array
  const getGenreArray = (genre: string | string[]): string[] => {
    if (Array.isArray(genre)) {
      return genre;
    }
    return [genre];
  };

  return (
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
          <meta property="og:movie:director" content={(meta as FilmMeta).director} />
          <meta property="og:movie:release_date" content={String((meta as FilmMeta).year)} />
          {getGenreArray((meta as FilmMeta).genre).map((genre, index) => (
            <meta key={index} property="og:movie:tag" content={genre} />
          ))}
        </>
      )}
      
      {/* Blog-specific meta tags */}
      {isBlog && (meta as BlogMeta).author && (
        <meta property="article:author" content={(meta as BlogMeta).author} />
      )}
      
      {/* JSON-LD Schema */}
      {jsonLdString && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: jsonLdString }} 
        />
      )}
    </Head>
  );
};

export default SEO; 
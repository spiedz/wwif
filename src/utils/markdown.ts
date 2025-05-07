/**
 * CLIENT-SAFE MARKDOWN UTILITIES
 * 
 * This file contains utilities for working with markdown content that are safe to use
 * in client components. All file system operations have been moved to serverMarkdown.ts.
 * 
 * Use these utilities for client-side operations on pre-fetched content that has been
 * passed from server components via props.
 */

import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import { BlogMeta, Content, ContentMeta, FilmMeta } from '../types/content';
import { TVSeries, SeriesMeta, Season, SeriesLocation } from '../types/series';

// Define custom types that extend the base types to include all possible properties
interface ExtendedBlogMeta extends BlogMeta {
  categories?: string[];
}

// Extend ContentMeta to ensure type constraint is satisfied
interface ExtendedContent<T extends ContentMeta> extends Content<T> {
  meta: T;
}

/**
 * Default rehype-pretty-code configuration options
 */
const prettycodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
};

/**
 * Processes markdown content to HTML with syntax highlighting
 */
export async function processMarkdown(content: string): Promise<string> {
  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypePrettyCode, prettycodeOptions)
    .use(rehypeStringify)
    .process(content);

  return processedContent.toString();
}

/**
 * Calculate estimated reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Gets related blog posts from a pre-fetched array
 */
export function getRelatedBlogPosts(
  allPosts: ExtendedContent<ExtendedBlogMeta>[], 
  currentSlug: string, 
  limit = 3
): ExtendedContent<ExtendedBlogMeta>[] {
  const currentPost = allPosts.find(post => post.meta.slug === currentSlug);
  
  if (!currentPost) return [];
  
  // Find posts with matching categories
  const relatedPosts = allPosts
    .filter(post => {
      if (post.meta.slug === currentSlug) return false;
      
      // Check for category overlap if categories exist
      if (
        currentPost.meta.categories && 
        Array.isArray(currentPost.meta.categories) && 
        post.meta.categories && 
        Array.isArray(post.meta.categories)
      ) {
        return currentPost.meta.categories.some((cat: string) => 
          post.meta.categories?.includes(cat)
        );
      }
      
      return false;
    })
    .slice(0, limit);
  
  // If not enough related posts by category, add recent posts
  if (relatedPosts.length < limit) {
    const recentPosts = allPosts
      .filter(post => 
        post.meta.slug !== currentSlug && 
        !relatedPosts.some(rp => rp.meta.slug === post.meta.slug)
      )
      .slice(0, limit - relatedPosts.length);

    return [...relatedPosts, ...recentPosts];
  }

  return relatedPosts;
}

/**
 * Format a film from raw data (for use with pre-fetched content)
 */
export function formatFilm(filmData: any): Content<FilmMeta> | null {
  if (!filmData || !filmData.meta) return null;
  
  return {
    meta: {
      ...filmData.meta,
      coordinates: filmData.meta.coordinates || [],
      posterImage: filmData.meta.posterImage || '',
      regions: filmData.meta.regions || [],
      travelTips: filmData.meta.travelTips || [],
      trivia: filmData.meta.trivia || [],
      useRegionLayout: filmData.meta.useRegionLayout || false,
      streamingServices: filmData.meta.streamingServices || [],
      bookingOptions: filmData.meta.bookingOptions || [],
    },
    content: filmData.content || '',
    html: filmData.html || ''
  };
}

/**
 * Format a TV series from raw data (for use with pre-fetched content)
 */
export function formatTVSeries(seriesData: any): TVSeries | null {
  if (!seriesData || !seriesData.meta) return null;
  
  // Create the SeriesMeta object first
  const seriesMeta: SeriesMeta = {
    slug: seriesData.meta.slug || '',
    title: seriesData.meta.title || '',
    description: seriesData.meta.description || '',
    overview: seriesData.meta.overview || '',
    releaseYearStart: seriesData.meta.releaseYearStart || 0,
    releaseYearEnd: seriesData.meta.releaseYearEnd || null,
    genres: seriesData.meta.genres || [],
    creator: seriesData.meta.creator || '',
    posterImage: seriesData.meta.posterImage || '',
    bannerImage: seriesData.meta.bannerImage || '',
    coordinates: seriesData.meta.coordinates || [],
    streamingServices: seriesData.meta.streamingServices || [],
    bookingOptions: seriesData.meta.bookingOptions || [],
    behindTheScenes: seriesData.meta.behindTheScenes || null,
  };

  // Then construct the full TVSeries object
  return {
    meta: seriesMeta,
    content: seriesData.content || '',
    html: seriesData.html || '',
    seasons: seriesData.seasons || [],
    locations: seriesData.locations || [],
  };
}

/**
 * Format an array of films from raw data
 */
export function formatFilms(filmsData: any[]): Content<FilmMeta>[] {
  if (!Array.isArray(filmsData)) return [];
  return filmsData.map(formatFilm).filter(Boolean) as Content<FilmMeta>[];
}

/**
 * Format an array of TV series from raw data
 */
export function formatTVSeriesArray(seriesData: any[]): TVSeries[] {
  if (!Array.isArray(seriesData)) return [];
  return seriesData.map(formatTVSeries).filter(Boolean) as TVSeries[];
} 
/**
 * SERVER-ONLY MARKDOWN UTILITIES
 * 
 * IMPORTANT: This file contains utilities that use Node.js fs module and should ONLY
 * be imported in server-side code (getStaticProps, getServerSideProps, API routes).
 * DO NOT import this file in client components or any file that may be used on the client.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import { BlogMeta, Content, FilmMeta } from '../../types/content';
import { TVSeries, SeriesMeta } from '../../types/series';

// Define content directories relative to project root
const filmsDirectory = path.join(process.cwd(), 'content/films');
const blogDirectory = path.join(process.cwd(), 'content/blog');
const seriesDirectory = path.join(process.cwd(), 'content/series');

/**
 * Default rehype-pretty-code configuration options
 */
const prettycodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
};

/**
 * SERVER-ONLY: Gets all film slugs from the films directory
 */
export function getFilmSlugs() {
  try {
    const fileNames = fs.readdirSync(filmsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading film slugs:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets all blog slugs from the blog directory
 */
export function getBlogSlugs() {
  try {
    const fileNames = fs.readdirSync(blogDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md') && fileName !== 'template.md')
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading blog slugs:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets all TV series slugs from the series directory
 */
export function getSeriesSlugs() {
  try {
    const fileNames = fs.readdirSync(seriesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading series slugs:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets a film by its slug
 */
export async function getFilmBySlug(slug: string): Promise<Content<FilmMeta> | null> {
  try {
    const fullPath = path.join(filmsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process content with remark
    const processedContent = await remark()
      .use(remarkRehype)
      .use(rehypePrettyCode, prettycodeOptions)
      .use(rehypeStringify)
      .process(content);

    const htmlContent = processedContent.toString();

    // Add helper functions for type-safe conversions
    function ensureStringArray(value: unknown): string[] {
      if (!value) return [];
      if (Array.isArray(value)) return value.map(String);
      return [String(value)];
    }

    return {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        coordinates: data.coordinates || [],
        location: data.location || '',
        year: data.year || '',
        director: data.director || '',
        genre: data.genre || '',
        featuredImage: data.featuredImage || '',
        gallery: ensureStringArray(data.gallery),
        posterImage: data.posterImage || '',
        regions: data.regions || [],
        travelTips: data.travelTips || [],
        trivia: data.trivia || [],
        useRegionLayout: Boolean(data.useRegionLayout),
        behindTheScenes: data.behindTheScenes || '',
        streamingServices: ensureStringArray(data.streamingServices),
        bookingOptions: ensureStringArray(data.bookingOptions),
      },
      content,
      html: htmlContent,
    };
  } catch (error) {
    console.error(`Error getting film by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SERVER-ONLY: Gets all films
 */
export async function getAllFilms(): Promise<Content<FilmMeta>[]> {
  const slugs = getFilmSlugs();
  const filmsPromises = slugs.map((slug) => getFilmBySlug(slug));
  const films = await Promise.all(filmsPromises);
  return films.filter(Boolean) as Content<FilmMeta>[];
}

/**
 * SERVER-ONLY: Gets a blog post by its slug with enhanced formatting
 */
export async function getBlogBySlug(slug: string): Promise<Content<BlogMeta> | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Clean and format the content before processing
    let formattedContent = content
      // Ensure proper line breaks around headers
      .replace(/\n(#{1,3}[^#\n]+)/g, '\n\n$1')
      // Format lists properly
      .replace(/\n(\s*[-*+])/g, '\n\n$1')
      .replace(/\n(\s*\d+\.)/g, '\n\n$1')
      // Format location sections
      .replace(/\n([0-9]+\.\s+[^\n]+)\n/g, '\n\n## $1\n\n')
      .replace(/\n(The Location:)/g, '\n\n### The Location\n\n')
      .replace(/\n(Where to Visit:)/g, '\n\n### Where to Visit\n\n')
      .replace(/\n(Visitor Experience:)/g, '\n\n### Visitor Experience\n\n')
      // Format callouts
      .replace(/\n(Tip:)/g, '\n\n**Tip:**')
      .replace(/\n(Note:)/g, '\n\n**Note:**')
      .replace(/\n(Warning:)/g, '\n\n**Warning:**')
      // Clean up extra line breaks
      .replace(/\n{3,}/g, '\n\n');

    // Process content with remark
    const processedContent = await remark()
      .use(remarkRehype)
      .use(rehypePrettyCode, prettycodeOptions)
      .use(rehypeStringify)
      .process(formattedContent);

    const htmlContent = processedContent.toString();

    // Handle featuredImage path - if it's relative, convert to absolute URL
    let featuredImage = data.featuredImage || '';
    if (featuredImage && !featuredImage.startsWith('http')) {
      // If it's a relative path, convert to absolute URL
      // For production, you might want to use a proper URL with your domain
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      featuredImage = `${baseUrl}${featuredImage.startsWith('/') ? '' : '/'}${featuredImage}`;
    }

    return {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        author: data.author || '',
        categories: data.categories || [],
        featuredImage,
        estimatedReadingTime: calculateReadingTime(content),
      },
      content: formattedContent,
      html: htmlContent,
    };
  } catch (error) {
    console.error(`Error getting blog by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SERVER-ONLY: Gets all blog posts
 */
export async function getAllBlogPosts(): Promise<Content<BlogMeta>[]> {
  const slugs = getBlogSlugs();
  const postsPromises = slugs.map((slug) => getBlogBySlug(slug));
  const posts = await Promise.all(postsPromises);
  
  // Filter out null values and sort by date (newest first)
  return posts
    .filter((post): post is Content<BlogMeta> => post !== null)
    .sort((a: Content<BlogMeta>, b: Content<BlogMeta>) => {
      if (!a.meta.date) return 1;
      if (!b.meta.date) return -1;
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });
}

/**
 * Calculate estimated reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * SERVER-ONLY: Gets related blog posts
 */
export async function getRelatedBlogPosts(currentSlug: string, limit = 3): Promise<Content<BlogMeta>[]> {
  const allPosts = await getAllBlogPosts();
  const currentPost = allPosts.find(post => post.meta.slug === currentSlug);
  
  if (!currentPost) return [];
  
  // Find posts with matching categories
  const relatedPosts = allPosts
    .filter(post => {
      if (post.meta.slug === currentSlug) return false;
      
      // Check for category overlap
      if (currentPost.meta.categories && post.meta.categories) {
        return currentPost.meta.categories.some(cat => 
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
 * SERVER-ONLY: Gets a TV series by its slug
 */
export async function getSeriesBySlug(slug: string): Promise<TVSeries | null> {
  try {
    const fullPath = path.join(seriesDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process content with remark
    const processedContent = await remark()
      .use(remarkRehype)
      .use(rehypePrettyCode, prettycodeOptions)
      .use(rehypeStringify)
      .process(content);

    const htmlContent = processedContent.toString();

    return {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        overview: data.overview || '',
        releaseYearStart: data.releaseYearStart || null,
        releaseYearEnd: data.releaseYearEnd === undefined ? null : data.releaseYearEnd,
        genres: data.genres || [],
        creator: data.creator || '',
        posterImage: data.posterImage || '',
        bannerImage: data.bannerImage || '',
        coordinates: data.coordinates || [],
        streamingServices: data.streamingServices || [],
        bookingOptions: data.bookingOptions || [],
        behindTheScenes: data.behindTheScenes || null,
        seasons: data.seasons || [],
        episodes: data.episodes || [],
        locations: data.locations || [],
      },
      content,
      html: htmlContent,
    };
  } catch (error) {
    console.error(`Error getting series by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SERVER-ONLY: Gets all TV series
 */
export async function getAllSeries(): Promise<TVSeries[]> {
  const slugs = getSeriesSlugs();
  const seriesPromises = slugs.map((slug) => getSeriesBySlug(slug));
  const allSeries = await Promise.all(seriesPromises);

  // Ensure all series have releaseYearEnd as null when undefined
  return allSeries
    .filter(Boolean)
    .map(series => {
      if (series) {
        return {
          ...series,
          meta: {
            ...series.meta,
            releaseYearEnd: series.meta.releaseYearEnd === undefined ? null : series.meta.releaseYearEnd
          }
        };
      }
      return series;
    }) as TVSeries[];
}

/**
 * SERVER-ONLY: Pre-processes all location data for client-side use
 * This function can be used in getStaticProps to fetch all location data
 */
export async function getAllLocationsData() {
  const films = await getAllFilms();
  const series = await getAllSeries();
  
  // Process the data to create location information
  const locationMap = new Map();
  
  // Process film locations
  films.forEach((film) => {
    if (film.meta.coordinates && film.meta.coordinates.length > 0) {
      film.meta.coordinates.forEach((coord) => {
        if (coord.name) {
          const locationName = coord.name.trim();
          const locationKey = locationName.toLowerCase();
          
          if (!locationMap.has(locationKey)) {
            locationMap.set(locationKey, {
              name: locationName,
              slug: locationKey,
              lat: coord.lat,
              lng: coord.lng,
              description: coord.description || undefined,
              image: coord.image || null,
              mediaItems: []
            });
          }
          
          // Add film to this location's media items
          const location = locationMap.get(locationKey);
          const existingItem = location.mediaItems.find(item => 
            item.type === 'film' && item.slug === film.meta.slug
          );
          
          if (!existingItem) {
            location.mediaItems.push({
              title: film.meta.title,
              slug: film.meta.slug,
              type: 'film',
              year: film.meta.year,
              posterImage: film.meta.posterImage || null,
              description: film.meta.description || undefined
            });
          }
        }
      });
    }
  });
  
  // Process series locations
  series.forEach((show) => {
    if (show.meta.coordinates && show.meta.coordinates.length > 0) {
      show.meta.coordinates.forEach((coord) => {
        if (coord.name) {
          const locationName = coord.name.trim();
          const locationKey = locationName.toLowerCase();
          
          if (!locationMap.has(locationKey)) {
            locationMap.set(locationKey, {
              name: locationName,
              slug: locationKey,
              lat: coord.lat,
              lng: coord.lng,
              description: coord.description || undefined,
              image: coord.image || null,
              mediaItems: []
            });
          }
          
          // Add series to this location's media items
          const location = locationMap.get(locationKey);
          const existingItem = location.mediaItems.find(item => 
            item.type === 'series' && item.slug === show.meta.slug
          );
          
          if (!existingItem) {
            location.mediaItems.push({
              title: show.meta.title,
              slug: show.meta.slug,
              type: 'series',
              year: show.meta.releaseYearStart || 'Unknown',
              posterImage: show.meta.posterImage || null,
              description: show.meta.description || undefined
            });
          }
        }
      });
    }
  });
  
  // Convert map to array and return
  return Array.from(locationMap.values());
} 
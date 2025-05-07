/**
 * Utility functions for working with location data
 * Note: This module should only be imported in server-side code (getStaticProps, getServerSideProps, API routes)
 * because it relies on server-side functions.
 */

import slugify from 'slugify';
// Import from server library instead of markdown
import { getAllFilms, getAllSeries, getAllLocationsData } from '../lib/server/serverMarkdown';
import { Content, FilmMeta, Coordinates } from '../types/content';
import { TVSeries } from '../types/series';

// Define LocationInfo interface if not available elsewhere
export interface LocationInfo {
  name: string;
  slug: string;
  formattedSlug?: string;
  lat: number;
  lng: number;
  description?: string;
  image: string | null;
  mediaItems: MediaItem[];
}

// Interface for media items (films or TV series) associated with a location
export interface MediaItem {
  title: string;
  slug: string;
  type: 'film' | 'series';
  year: number | string;
  posterImage: string | null;
  description?: string;
}

// Default location image to use when none is provided
export const DEFAULT_LOCATION_IMAGE = '/images/default-location.jpg';

/**
 * Get all unique filming locations from both films and series
 */
export async function getAllLocations(): Promise<LocationInfo[]> {
  // Use the pre-processed getAllLocationsData function that does all file reading server-side
  return await getAllLocationsData();
}

/**
 * Generate a SEO-friendly location slug
 */
export function generateLocationSlug(locationName: string): string {
  // Remove any parenthetical information
  const cleanName = locationName.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  
  // Generate the slug with 'what-was-filmed-in' prefix
  return `what-was-filmed-in-${slugify(cleanName, { lower: true, strict: true })}`;
}

/**
 * Get a specific location by its slug
 */
export async function getLocationBySlug(slug: string): Promise<LocationInfo | null> {
  // Get all the processed location data
  const locations = await getAllLocationsData();
  
  // First try to find by the direct slug (simple version)
  let location = locations.find(loc => loc.slug === slug);
  
  // If not found, try the full version with 'what-was-filmed-in' prefix
  if (!location) {
    // Strip the prefix if it exists to find the base location
    const baseSlug = slug.replace('what-was-filmed-in-', '');
    location = locations.find(loc => 
      loc.slug === baseSlug || 
      generateLocationSlug(loc.name) === slug
    );
  }
  
  return location || null;
}

/**
 * Get popular locations based on the number of media items
 */
export async function getPopularLocations(limit = 6): Promise<LocationInfo[]> {
  const allLocations = await getAllLocationsData();
  
  // Sort by number of media items (descending)
  return allLocations
    .sort((a, b) => b.mediaItems.length - a.mediaItems.length)
    .slice(0, limit);
}

/**
 * Extract locations from film or series content
 */
export function extractLocationsFromContent(content: Content<FilmMeta> | TVSeries): LocationInfo[] {
  if (!content.meta.coordinates) return [];

  // Filter out undefined names
  return content.meta.coordinates
    .filter(coord => coord.name) // Filter out coordinates with undefined names
    .map((coord: Coordinates) => ({
      name: coord.name!, // Non-null assertion because we filtered undefined names
      slug: slugify(coord.name!, { lower: true, strict: true }),
      formattedSlug: generateLocationSlug(coord.name!),
      lat: coord.lat,
      lng: coord.lng,
      description: coord.description,
      image: coord.image || DEFAULT_LOCATION_IMAGE,
      mediaItems: [{
        title: content.meta.title,
        slug: content.meta.slug,
        type: 'film' in content.meta ? 'film' : 'series',
        year: 'year' in content.meta ? content.meta.year : 
             ('releaseYearStart' in content.meta ? content.meta.releaseYearStart : 'Unknown'),
        posterImage: content.meta.posterImage || null,
        description: content.meta.description
      }]
    }));
}

/**
 * Get location backlinks for a given location name
 */
export async function getLocationBacklinks(locationName: string): Promise<string[]> {
  const allLocations = await getAllLocationsData();
  const matchingLocation = allLocations.find(loc => 
    loc.name.toLowerCase() === locationName.toLowerCase()
  );
  
  if (!matchingLocation) return [];
  
  return matchingLocation.mediaItems.map((item: MediaItem) => 
    `/${item.type}s/${item.slug}`
  );
}

/**
 * Add location backlinks to the content object (films or series)
 * Used for navigation between related content
 */
export async function addLocationBacklinks(content: any): Promise<any> {
  // If this is content without coordinates, return it unchanged
  if (!content || !content.meta || !content.meta.coordinates) {
    return content;
  }

  // Process each location mentioned in the content
  for (const coord of content.meta.coordinates) {
    if (coord.name) {
      // Get backlinks for this location (other films/series filmed there)
      const backlinks = await getLocationBacklinks(coord.name);
      // Add the backlinks to the location data
      coord.backlinks = backlinks.filter(link => 
        // Remove the current content from backlinks to avoid self-referencing
        !link.endsWith(`/${content.meta.slug}`)
      );
    }
  }

  return content;
}

/**
 * Get all location slugs for sitemap generation
 */
export async function getAllLocationSlugs(): Promise<string[]> {
  const locations = await getAllLocationsData();
  
  return locations.map(location => {
    // Create both normal and SEO-friendly versions of the slugs
    const normalSlug = location.slug;
    const seoSlug = generateLocationSlug(location.name);
    
    // Return both formats for the sitemap
    return [normalSlug, seoSlug];
  }).flat();
} 
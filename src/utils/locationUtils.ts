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
  city?: string;
  country?: string;
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

// Interface for a city with locations
export interface CityInfo {
  name: string;
  slug: string; 
  country: string;
  description?: string;
  image?: string | null;
  locationCount: number;
  mediaItemCount: number;
  topLocations: LocationInfo[];
  locations?: string[];
}

// Interface for a country with locations
export interface CountryInfo {
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  locationCount: number;
  mediaItemCount: number;
  cities: string[];
  topLocations: LocationInfo[];
  locations?: string[];
}

// Default location image to use when none is provided
export const DEFAULT_LOCATION_IMAGE = '/images/default-location.jpg';

// City-to-country mapping for normalization
const cityCountryMapping: Record<string, string> = {
  'london': 'United Kingdom',
  'edinburgh': 'United Kingdom',
  'glasgow': 'United Kingdom',
  'manchester': 'United Kingdom',
  'liverpool': 'United Kingdom',
  'new york': 'United States',
  'los angeles': 'United States',
  'chicago': 'United States',
  'san francisco': 'United States',
  'miami': 'United States',
  'las vegas': 'United States',
  'paris': 'France',
  'rome': 'Italy',
  'tokyo': 'Japan',
  'sydney': 'Australia',
  'toronto': 'Canada',
  'vancouver': 'Canada',
  'berlin': 'Germany',
  'madrid': 'Spain',
  'barcelona': 'Spain',
  'amsterdam': 'Netherlands',
  'dublin': 'Ireland',
  'vienna': 'Austria',
  'wellington': 'New Zealand',
  'auckland': 'New Zealand',
  'queenstown': 'New Zealand',
  'mexico city': 'Mexico',
  'rio de janeiro': 'Brazil',
  'cairo': 'Egypt',
  'prague': 'Czech Republic',
  'budapest': 'Hungary',
  'bangkok': 'Thailand',
  'beijing': 'China',
  'hong kong': 'China',
  'seoul': 'South Korea',
  'moscow': 'Russia',
  'mumbai': 'India',
  'dubai': 'United Arab Emirates',
  'athens': 'Greece',
  'venice': 'Italy',
  'florence': 'Italy',
  'montreal': 'Canada',
  'copenhagen': 'Denmark',
  'oslo': 'Norway',
  'stockholm': 'Sweden',
  'helsinki': 'Finland',
  'reykjavik': 'Iceland'
};

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
 * Generate a SEO-friendly city slug
 */
export function generateCitySlug(cityName: string): string {
  return `movies-filmed-in-${slugify(cityName, { lower: true, strict: true })}`;
}

/**
 * Generate a SEO-friendly country slug
 */
export function generateCountrySlug(countryName: string): string {
  return `movies-filmed-in-${slugify(countryName, { lower: true, strict: true })}`;
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

  // Handle both coordinate formats
  const extractedLocations: LocationInfo[] = [];
  
  // Process each coordinate
  for (const coordItem of content.meta.coordinates) {
    // Skip if no data
    if (!coordItem) continue;
    
    // Format will either be a [lat, lng] tuple or a Coordinate object
    let name: string | undefined;
    let lat: number;
    let lng: number;
    let description: string | undefined;
    let image: string | undefined;
    
    if (Array.isArray(coordItem)) {
      // It's a simple [lat, lng] tuple
      [lat, lng] = coordItem;
      name = "Unknown Location"; // Default name for simple coordinate
    } else {
      // It's a Coordinate object with additional data
      name = coordItem.name;
      lat = coordItem.lat;
      lng = coordItem.lng;
      description = coordItem.description;
      image = coordItem.image;
    }
    
    // Skip if no name
    if (!name) continue;
    
    // Create the location object
    const location: LocationInfo = {
      name,
      slug: slugify(name, { lower: true, strict: true }),
      formattedSlug: generateLocationSlug(name),
      lat,
      lng,
      description,
      image: image || DEFAULT_LOCATION_IMAGE,
      mediaItems: [{
        title: content.meta.title,
        slug: content.meta.slug,
        type: 'film' in content.meta ? 'film' : 'series',
        year: 'year' in content.meta ? content.meta.year || 'Unknown' : 
             ('releaseYearStart' in content.meta ? content.meta.releaseYearStart || 'Unknown' : 'Unknown'),
        posterImage: content.meta.posterImage || null,
        description: content.meta.description
      }],
      city: detectCity(name),
      country: detectCountry(name)
    };
    
    extractedLocations.push(location);
  }
  
  return extractedLocations;
}

/**
 * Attempt to detect city from a location name
 */
function detectCity(locationName: string): string | undefined {
  if (!locationName) return undefined;
  
  const lowerName = locationName.toLowerCase();
  
  // Check if the location name contains a known city
  for (const city of Object.keys(cityCountryMapping)) {
    // Check for exact matches or matches with common prefixes/suffixes
    const cityRegex = new RegExp(`\\b${city}\\b|\\b${city}\\s+(city|area|district|region)\\b`, 'i');
    if (cityRegex.test(lowerName)) {
      return capitalizeWords(city);
    }
  }
  
  // Handle common city formats like "Location, City"
  const commaParts = locationName.split(',');
  if (commaParts.length > 1) {
    const potentialCity = commaParts[1].trim().toLowerCase();
    // Check if it's a known city
    for (const city of Object.keys(cityCountryMapping)) {
      if (potentialCity.includes(city)) {
        return capitalizeWords(city);
      }
    }
    
    // If the second part is short (likely a city abbreviation or name), use it
    if (potentialCity.length > 0 && potentialCity.length < 20 && !potentialCity.includes("state") && !potentialCity.includes("province")) {
      return capitalizeWords(potentialCity);
    }
  }
  
  // Check for "City of X" format
  const cityOfMatch = lowerName.match(/city of ([a-z\s]+)(\W|$)/i);
  if (cityOfMatch && cityOfMatch[1]) {
    return capitalizeWords(cityOfMatch[1].trim());
  }
  
  return undefined;
}

/**
 * Attempt to detect country from a location name
 */
function detectCountry(locationName: string): string | undefined {
  if (!locationName) return undefined;
  
  const lowerName = locationName.toLowerCase();
  
  // Check if a name contains a known country directly
  const countries = [...new Set(Object.values(cityCountryMapping))];
  for (const country of countries) {
    // Check for exact matches or matches with common prefixes/suffixes
    const countryRegex = new RegExp(`\\b${country.toLowerCase()}\\b|\\b${country.toLowerCase()}\\s+(country|nation|kingdom|republic|state)\\b`, 'i');
    if (countryRegex.test(lowerName)) {
      return country;
    }
  }
  
  // Check if we can find a city and map it to a country
  const city = detectCity(locationName);
  if (city) {
    const country = cityCountryMapping[city.toLowerCase()];
    if (country) return country;
  }
  
  // Check common format "Location, City, Country"
  const commaParts = locationName.split(',');
  if (commaParts.length > 2) {
    const potentialCountry = commaParts[2].trim();
    // Check if it's a known country
    for (const country of countries) {
      if (potentialCountry.toLowerCase().includes(country.toLowerCase())) {
        return country;
      }
    }
    // If the third part is not too long, assume it's a country
    if (potentialCountry.length > 0 && potentialCountry.length < 30) {
      return capitalizeWords(potentialCountry);
    }
  }
  
  // Check for "X, Y" format where Y could be a country
  if (commaParts.length === 2) {
    const secondPart = commaParts[1].trim();
    // Common countries that might appear as second part
    const commonCountries = ["USA", "UK", "United States", "United Kingdom", "Canada", "Australia", "France", "Germany", "Italy", "Spain", "Japan"];
    
    for (const country of commonCountries) {
      if (secondPart.toLowerCase() === country.toLowerCase()) {
        return country === "USA" ? "United States" : (country === "UK" ? "United Kingdom" : country);
      }
    }
  }
  
  return undefined;
}

/**
 * Capitalize words in a string
 */
function capitalizeWords(str: string): string {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
  try {
    const locations = await getAllLocationsData();
    
    // Helper function to validate slugs
    const isValidSlug = (slug: string): boolean => {
      return Boolean(slug) && 
             /^[a-z0-9-]+$/.test(slug) &&  // Only allow alphanumeric chars and hyphens
             slug.length > 0 && 
             slug.length < 200; // Reasonable max length for a URL segment
    };
    
    const slugs = locations.map(location => {
      try {
        // Create both normal and SEO-friendly versions of the slugs
        const normalSlug = location.slug;
        const seoSlug = generateLocationSlug(location.name);
        
        // Validate slugs before returning
        const validSlugs: string[] = [];
        if (isValidSlug(normalSlug)) validSlugs.push(normalSlug);
        if (isValidSlug(seoSlug)) validSlugs.push(seoSlug);
        
        return validSlugs;
      } catch (error) {
        console.error(`Error processing location slug for ${location.name}:`, error);
        return [];
      }
    }).flat();
    
    // Remove duplicates (in case some slugs end up being the same after sanitizing)
    return [...new Set(slugs)];
  } catch (error) {
    console.error('Error getting all location slugs:', error);
    return [];
  }
}

/**
 * Get all locations grouped by city
 */
export async function getLocationsByCity(): Promise<CityInfo[]> {
  const allLocations = await getAllLocationsData();
  
  // Group locations by city
  const cityGroups: Record<string, LocationInfo[]> = {};
  
  allLocations.forEach(location => {
    if (location.city) {
      if (!cityGroups[location.city]) {
        cityGroups[location.city] = [];
      }
      cityGroups[location.city].push(location);
    }
  });
  
  // Create city info objects
  const cityInfos: CityInfo[] = Object.entries(cityGroups).map(([cityName, locations]) => {
    // Get country from first location with city
    const country = locations[0]?.country || 'Unknown';
    
    // Get set of unique media items
    const uniqueMediaItems = new Set();
    locations.forEach(location => {
      location.mediaItems.forEach(item => {
        uniqueMediaItems.add(`${item.type}-${item.slug}`); // Create unique identifier since MediaItem doesn't have id
      });
    });
    
    // Use first location image as city image
    const cityImage = locations.find(loc => loc.image)?.image || null;
    
    // Get top locations (most popular by media item count)
    const topLocations = [...locations]
      .sort((a, b) => b.mediaItems.length - a.mediaItems.length)
      .slice(0, 5);
    
    return {
      name: cityName,
      slug: slugify(cityName, { lower: true }),
      country,
      locationCount: locations.length,
      mediaItemCount: uniqueMediaItems.size,
      image: cityImage,
      topLocations,
      locations: locations.map(loc => loc.slug),
      description: locations[0]?.description || undefined
    };
  });
  
  // Sort cities by location count
  return cityInfos.sort((a, b) => b.locationCount - a.locationCount);
}

/**
 * Get city info by slug
 */
export async function getCityBySlug(slug: string): Promise<CityInfo | null> {
  const cities = await getLocationsByCity();
  return cities.find(city => city.slug === slug) || null;
}

/**
 * Get locations for a specific city
 */
export async function getLocationsForCity(cityName: string): Promise<LocationInfo[]> {
  const allLocations = await getAllLocationsData();
  
  // Filter locations by city
  return allLocations.filter(location => 
    location.city && location.city.toLowerCase() === cityName.toLowerCase()
  );
}

/**
 * Get all locations grouped by country
 */
export async function getLocationsByCountry(): Promise<CountryInfo[]> {
  const allLocations = await getAllLocationsData();
  
  // Group locations by country
  const countryGroups: Record<string, LocationInfo[]> = {};
  
  allLocations.forEach(location => {
    if (location.country) {
      if (!countryGroups[location.country]) {
        countryGroups[location.country] = [];
      }
      countryGroups[location.country].push(location);
    }
  });
  
  // Create country info objects
  const countryInfos: CountryInfo[] = Object.entries(countryGroups).map(([countryName, locations]) => {
    // Get unique cities in this country - filter out undefined values
    const uniqueCities = [...new Set(locations.map(loc => loc.city).filter(Boolean))] as string[];
    
    // Get set of unique media items
    const uniqueMediaItems = new Set();
    locations.forEach(location => {
      location.mediaItems.forEach(item => {
        uniqueMediaItems.add(`${item.type}-${item.slug}`); // Create unique identifier since MediaItem doesn't have id
      });
    });
    
    // Use first location image as country image
    const countryImage = locations.find(loc => loc.image)?.image || null;
    
    // Get top locations (most popular by media item count)
    const topLocations = [...locations]
      .sort((a, b) => b.mediaItems.length - a.mediaItems.length)
      .slice(0, 5);
    
    return {
      name: countryName,
      slug: slugify(countryName, { lower: true }),
      cities: uniqueCities,
      locationCount: locations.length,
      mediaItemCount: uniqueMediaItems.size,
      image: countryImage,
      topLocations,
      locations: locations.map(loc => loc.slug),
      description: locations[0]?.description || undefined
    };
  });
  
  // Sort countries by location count
  return countryInfos.sort((a, b) => b.locationCount - a.locationCount);
}

/**
 * Get country info by slug
 */
export async function getCountryBySlug(slug: string): Promise<CountryInfo | null> {
  const countries = await getLocationsByCountry();
  return countries.find(country => country.slug === slug) || null;
}

/**
 * Get locations for a specific country
 */
export async function getLocationsForCountry(countryName: string): Promise<LocationInfo[]> {
  const allLocations = await getAllLocationsData();
  
  // Filter locations by country
  return allLocations.filter(location => 
    location.country && location.country.toLowerCase() === countryName.toLowerCase()
  );
} 
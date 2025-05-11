/**
 * Film data utilities for working with film data across the application
 * 
 * This utility includes functions for working with film data, including
 * loading all films and selecting related films. It's designed to work
 * with both server-side rendering and client-side components.
 */

import { FilmMeta, Content } from '../types/content';

export interface RelatedFilmData {
  title: string;
  slug: string;
  posterImage?: string;
  description?: string;
  year?: string;
}

// Cache for storing film data to avoid redundant processing
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
let filmsCache: RelatedFilmData[] | null = null;
let lastCacheTime = 0;

// Dummy data for fallback when server functions aren't available
const FALLBACK_FILMS: RelatedFilmData[] = [
  {
    title: "Avatar",
    slug: "where-was-avatar-filmed",
    posterImage: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    description: "Discover the real-world inspiration for Pandora",
    year: "2009"
  },
  {
    title: "Harry Potter",
    slug: "where-was-harry-potter-filmed",
    posterImage: "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
    description: "Tour the magical filming locations throughout the UK",
    year: "2001"
  },
  {
    title: "Lord of the Rings",
    slug: "where-was-lord-of-the-rings-filmed", 
    posterImage: "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg",
    description: "Visit the spectacular New Zealand locations",
    year: "2001"
  },
  {
    title: "The Dark Knight",
    slug: "where-was-the-dark-knight-filmed",
    posterImage: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Visit Gotham City's real-world counterparts in Chicago and London",
    year: "2008"
  },
  {
    title: "Jurassic Park",
    slug: "where-was-jurassic-park-filmed",
    posterImage: "https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
    description: "Visit the tropical islands where dinosaurs roamed",
    year: "1993"
  },
  {
    title: "The Matrix",
    slug: "where-was-the-matrix-filmed",
    posterImage: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    description: "Experience the iconic locations from The Matrix",
    year: "1999"
  },
  {
    title: "Inception",
    slug: "where-was-inception-filmed",
    posterImage: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    description: "Visit the mind-bending real-world locations",
    year: "2010"
  },
  {
    title: "Indiana Jones",
    slug: "where-was-indiana-jones-filmed",
    posterImage: "https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
    description: "Explore the stunning filming locations of the Indiana Jones series",
    year: "1981"
  }
];

/**
 * Safely attempt to load film data from server or API
 * This is designed to be safe to call from both server and client contexts
 */
export const loadFilmData = async (): Promise<Content<FilmMeta>[]> => {
  try {
    // If we're on the server, dynamically import the server module
    if (typeof window === 'undefined') {
      console.log('Running on server - using direct imports');
      try {
        // Dynamic import to avoid bundling fs module with client code
        const { getAllFilms } = await import('../lib/server/serverMarkdown');
        return await getAllFilms();
      } catch (serverError) {
        console.error('Server import error:', serverError);
        return [];
      }
    } else {
      // We're on the client - use the API
      console.log('Running on client - using API call');
      try {
        const response = await fetch('/api/films');
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        return data.films || [];
      } catch (apiError) {
        console.error('API fetch error:', apiError);
        return [];
      }
    }
  } catch (error) {
    console.error('Error loading film data:', error);
    return [];
  }
};

/**
 * Convert Content<FilmMeta> to RelatedFilmData objects
 */
const convertToRelatedFilmData = (films: Content<FilmMeta>[]): RelatedFilmData[] => {
  return films.map(film => ({
    title: film.meta.title,
    slug: film.meta.slug,
    posterImage: film.meta.posterImage,
    description: film.meta.description,
    year: film.meta.year
  }));
};

/**
 * Gets related films for a given film slug
 */
export const getRelatedFilms = async (
  currentSlug: string,
  count: number = 4
): Promise<RelatedFilmData[]> => {
  try {
    console.log(`Getting related films for: ${currentSlug}, count: ${count}`);
    
    // Check cache first
    const now = Date.now();
    if (filmsCache && now - lastCacheTime < CACHE_DURATION_MS) {
      console.log('Using cached film data');
      // Filter cached data for related films
      const related = filmsCache
        .filter(film => film.slug !== currentSlug)
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
      
      if (related.length > 0) {
        return related;
      }
    }
    
    // Use fallback films as a backup
    const fallbackFilms = [...FALLBACK_FILMS]
      .filter(film => film.slug !== currentSlug)
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
    
    // Try to get all films
    const allFilms = await loadFilmData();
    
    if (!allFilms || allFilms.length === 0) {
      console.log('No films found, using fallback films');
      return fallbackFilms;
    }
    
    // Convert to our simplified format
    const allFilmsData = convertToRelatedFilmData(allFilms);
    
    // Update cache
    filmsCache = allFilmsData;
    lastCacheTime = now;
    
    // Get current film (if exists)
    const currentFilm = allFilms.find(film => film.meta.slug === currentSlug);
    
    if (!currentFilm) {
      console.log('Current film not found, using fallback films');
      return fallbackFilms;
    }
    
    // Get related films based on location and genre
    const relatedFilms = allFilms
      .filter(film => film.meta.slug !== currentSlug) // Exclude current film
      .sort((a, b) => {
        // Score films based on similarity
        let scoreA = 0;
        let scoreB = 0;
        
        // Same location(s)
        if (currentFilm.meta.location && a.meta.location) {
          const currentLocs = Array.isArray(currentFilm.meta.location) 
            ? currentFilm.meta.location 
            : [currentFilm.meta.location];
          
          const aLocs = Array.isArray(a.meta.location) 
            ? a.meta.location 
            : [a.meta.location];
          
          if (currentLocs.some(loc => aLocs.includes(loc))) {
            scoreA += 3;
          }
        }
        
        if (currentFilm.meta.location && b.meta.location) {
          const currentLocs = Array.isArray(currentFilm.meta.location) 
            ? currentFilm.meta.location 
            : [currentFilm.meta.location];
          
          const bLocs = Array.isArray(b.meta.location) 
            ? b.meta.location 
            : [b.meta.location];
          
          if (currentLocs.some(loc => bLocs.includes(loc))) {
            scoreB += 3;
          }
        }
        
        // Same genre
        if (currentFilm.meta.genre && a.meta.genre && 
            currentFilm.meta.genre === a.meta.genre) {
          scoreA += 2;
        }
        
        if (currentFilm.meta.genre && b.meta.genre && 
            currentFilm.meta.genre === b.meta.genre) {
          scoreB += 2;
        }
        
        // Same director
        if (currentFilm.meta.director && a.meta.director && 
            currentFilm.meta.director === a.meta.director) {
          scoreA += 2;
        }
        
        if (currentFilm.meta.director && b.meta.director && 
            currentFilm.meta.director === b.meta.director) {
          scoreB += 2;
        }
        
        // Similar year (within 5 years)
        if (currentFilm.meta.year && a.meta.year) {
          const currentYear = parseInt(currentFilm.meta.year);
          const aYear = parseInt(a.meta.year);
          
          if (!isNaN(currentYear) && !isNaN(aYear) && 
              Math.abs(currentYear - aYear) <= 5) {
            scoreA += 1;
          }
        }
        
        if (currentFilm.meta.year && b.meta.year) {
          const currentYear = parseInt(currentFilm.meta.year);
          const bYear = parseInt(b.meta.year);
          
          if (!isNaN(currentYear) && !isNaN(bYear) && 
              Math.abs(currentYear - bYear) <= 5) {
            scoreB += 1;
          }
        }
        
        // Sort by score (descending), then by title (ascending) for tiebreaker
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        
        return a.meta.title.localeCompare(b.meta.title);
      })
      .slice(0, count);
    
    // Convert to related film data format
    const relatedFilmsData = convertToRelatedFilmData(relatedFilms);
    
    if (relatedFilmsData.length === 0) {
      console.log('No related films found, using fallback films');
      return fallbackFilms;
    }
    
    return relatedFilmsData;
  } catch (error) {
    console.error('Error getting related films:', error);
    // Return fallback films on error
    return FALLBACK_FILMS
      .filter(film => film.slug !== currentSlug)
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }
};

/**
 * Gets a film by its slug with proper error handling
 */
export const getFilmBySlug = async (slug: string): Promise<Content<FilmMeta> | null> => {
  try {
    if (typeof window === 'undefined') {
      // Server-side: use direct filesystem access
      const { getFilmBySlug: getFilmBySlugServer } = require('../lib/server/serverMarkdown');
      return await getFilmBySlugServer(slug);
    } else {
      // Client-side: use API
      try {
        const response = await fetch(`/api/films/${slug}`);
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        return data.film;
      } catch (apiError) {
        console.error(`Error fetching film ${slug} from API:`, apiError);
        return null;
      }
    }
  } catch (error) {
    console.error(`Error getting film by slug (${slug}):`, error);
    return null;
  }
};

/**
 * Get related films, excluding the current film
 * Returns a randomly selected subset of films
 * 
 * @param currentSlug - Slug of the current film to exclude
 * @param count - Number of related films to return (default: 4)
 */
export async function getRelatedFilmsOld(currentSlug: string, count: number = 4): Promise<RelatedFilmData[]> {
  console.log(`getRelatedFilms: Finding related films for "${currentSlug}"`);
  
  if (!currentSlug) {
    console.error('getRelatedFilms: No currentSlug provided');
    return [];
  }
  
  try {
    // Load all film data
    const allFilms = await loadFilmData();
    console.log(`getRelatedFilms: Loaded ${allFilms.length} total films`);
    
    // Filter out the current film
    const otherFilms = allFilms.filter(film => film.slug !== currentSlug);
    console.log(`getRelatedFilms: ${otherFilms.length} films after filtering out current film`);
    
    if (otherFilms.length === 0) {
      console.warn(`getRelatedFilms: No other films found to relate to "${currentSlug}"`);
      return [];
    }
    
    // Always return some films, even if fewer than requested
    const selectedCount = Math.min(count, otherFilms.length);
    const selected = getRandomSelection(otherFilms, selectedCount);
    
    console.log(`getRelatedFilms: Returning ${selected.length} randomly selected films with titles:`, 
      selected.map(film => film.title).join(', '));
    
    return selected;
  } catch (error) {
    console.error('Error getting related films:', error);
    return [];
  }
}

/**
 * Helper function to select random items from an array
 */
export function getRandomSelection<T>(items: T[], count: number): T[] {
  // Create a copy of the array to avoid modifying the original
  const itemsCopy = [...items];
  const result: T[] = [];
  
  // Select 'count' random items
  for (let i = 0; i < count && itemsCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * itemsCopy.length);
    result.push(itemsCopy[randomIndex]);
    itemsCopy.splice(randomIndex, 1);
  }
  
  return result;
}

/**
 * Get film data by slug (single film)
 * Wrapper around the existing getFilmBySlug function
 */
export async function getFilmData(slug: string): Promise<Content<FilmMeta> | null> {
  if (!slug) {
    console.error('getFilmData: No slug provided');
    return null;
  }
  
  try {
    console.log(`getFilmData: Fetching film data for slug ${slug}`);
    return await getFilmBySlug(slug);
  } catch (error) {
    console.error(`Error getting film data for slug ${slug}:`, error);
    return null;
  }
} 
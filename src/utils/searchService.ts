import { FilmMeta, SearchResult } from '../types/content';
import Fuse from 'fuse.js';

/**
 * SearchService class for handling film search functionality
 */
class SearchService {
  private searchIndex: any[] = [];
  private fuseInstance: any = null;
  private initialized: boolean = false;
  
  /**
   * Initialize the search service with film data
   * @param films An array of film data to be indexed for search
   */
  public initialize(films: any[]): void {
    if (typeof Fuse === 'undefined') {
      console.error('Fuse.js not available. Search will not work.');
      return;
    }
    
    this.searchIndex = films;
    
    // Initialize Fuse with optimal settings for film search
    this.fuseInstance = new Fuse(films, {
      keys: [
        { name: 'meta.title', weight: 1.0 },
        { name: 'meta.director', weight: 0.7 },
        { name: 'meta.description', weight: 0.6 },
        { name: 'meta.year', weight: 0.5 },
        { name: 'meta.genre', weight: 0.5 },
        { name: 'meta.coordinates.name', weight: 0.9 },
        { name: 'meta.coordinates.description', weight: 0.7 },
      ],
      includeMatches: true,     // Include match indices for highlighting
      threshold: 0.3,           // Lower threshold means closer match required
      distance: 100,            // How far to look for matching patterns
      useExtendedSearch: true,  // Enable extended search features 
      ignoreLocation: true,     // Don't penalize matches based on position
      findAllMatches: true,     // Continue searching even after first match
      ignoreFieldNorm: true,    // Ignore field length normalization
    });
    
    this.initialized = true;
  }
  
  /**
   * Check if the search service has been initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Perform a search with the given query
   * @param query The search query
   * @returns Search results with matching films
   */
  public search(query: string): Array<{
    item: { meta: FilmMeta; content?: string; html?: string };
    matches?: Array<{ indices: number[][]; key: string; value: string }>;
  }> {
    if (!this.initialized || !this.fuseInstance) {
      console.warn('Search not initialized yet');
      return [];
    }
    
    if (!query || !query.trim()) {
      return [];
    }
    
    try {
      return this.fuseInstance.search(query.trim());
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
  
  /**
   * Get film suggestions based on a partial query
   * @param query The partial search query
   * @param limit Maximum number of suggestions to return
   * @returns Matching film suggestions
   */
  public getSuggestions(query: string, limit: number = 5): Array<{
    item: { meta: FilmMeta; content?: string; html?: string };
    matches?: Array<{ indices: number[][]; key: string; value: string }>;
  }> {
    if (!query || !query.trim() || !this.initialized) {
      return [];
    }
    
    try {
      const results = this.search(query);
      const limitedResults = results.slice(0, Math.max(1, Math.min(limit, 20))); // Limit between 1 and 20
      return limitedResults;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
  
  /**
   * Get popular searches or top films
   * @param limit Maximum number of films to return
   * @returns Popular films
   */
  public getPopularFilms(limit: number = 5): FilmMeta[] {
    if (!this.initialized || !this.searchIndex?.length) {
      return [];
    }
    
    try {
      // In a real implementation, we might sort by popularity metrics
      // For now, just return the first few films
      return this.searchIndex
        .slice(0, Math.min(limit, this.searchIndex.length))
        .map(item => item.meta)
        .filter(Boolean); // Filter out null/undefined items
    } catch (error) {
      console.error('Error getting popular films:', error);
      return [];
    }
  }
  
  /**
   * Search for films by location
   * @param locationName The name of the location to search for
   * @returns Films with matching locations
   */
  public searchByLocation(locationName: string): FilmMeta[] {
    if (!this.initialized || !this.fuseInstance || !locationName || !locationName.trim()) {
      return [];
    }
    
    try {
      const normalizedLocation = locationName.trim();
      
      // Create a temporary Fuse instance optimized for location search
      const locationFuse = new Fuse(this.searchIndex, {
        keys: [
          { name: 'meta.coordinates.name', weight: 1.0 },
          { name: 'meta.coordinates.description', weight: 0.7 },
        ],
        threshold: 0.3,
        includeMatches: true,
      });
      
      return locationFuse
        .search(normalizedLocation)
        .map((result: any) => result.item?.meta)
        .filter(Boolean); // Filter out null/undefined items
    } catch (error) {
      console.error('Error searching by location:', error);
      return [];
    }
  }
  
  /**
   * Filter films by genre
   * @param genre The genre to filter by
   * @returns Films of the specified genre
   */
  public filterByGenre(genre: string): FilmMeta[] {
    if (!this.initialized || !this.searchIndex?.length || !genre || !genre.trim()) {
      return [];
    }
    
    try {
      const normalizedGenre = genre.trim().toLowerCase();
      
      return this.searchIndex
        .filter(item => {
          try {
            if (!item?.meta) return false;
            
            const filmGenres = item.meta.genre;
            
            // Handle different genre data types
            if (Array.isArray(filmGenres)) {
              return filmGenres.some(g => 
                g && typeof g === 'string' && g.toLowerCase().includes(normalizedGenre)
              );
            } else if (typeof filmGenres === 'string') {
              return filmGenres.toLowerCase().includes(normalizedGenre);
            }
            
            return false;
          } catch (error) {
            console.error('Error filtering genre for item:', error);
            return false; // Skip items with invalid genre data
          }
        })
        .map(item => item.meta)
        .filter(Boolean); // Filter out null/undefined items
    } catch (error) {
      console.error('Error filtering by genre:', error);
      return [];
    }
  }
  
  /**
   * Filter films by year or year range
   * @param yearOrRange A year or year range (e.g. "2000" or "2000-2010")
   * @returns Films from the specified year(s)
   */
  public filterByYear(yearOrRange: string): FilmMeta[] {
    if (!this.initialized || !this.searchIndex?.length || !yearOrRange) {
      return [];
    }
    
    try {
      let startYear: number;
      let endYear: number;
      
      // Clean the input by removing any non-digit or hyphen characters
      const cleanYearOrRange = yearOrRange.replace(/[^\d-]/g, '');
      
      if (cleanYearOrRange.includes('-')) {
        // Split year range and handle invalid formats
        const parts = cleanYearOrRange.split('-').filter(Boolean);
        if (parts.length !== 2) return [];
        
        const [start, end] = parts.map(y => parseInt(y.trim(), 10));
        
        if (isNaN(start) || isNaN(end)) {
          return [];
        }
        
        // Ensure logical year order (start <= end)
        startYear = Math.min(start, end);
        endYear = Math.max(start, end);
      } else {
        startYear = parseInt(cleanYearOrRange.trim(), 10);
        if (isNaN(startYear)) {
          return [];
        }
        endYear = startYear;
      }
      
      // Use reasonable constraints for movie years (e.g., not future years)
      const currentYear = new Date().getFullYear();
      if (startYear < 1890 || endYear > currentYear + 5 || startYear > endYear) {
        // First movies ~1890, allow some buffer for future films
        return [];
      }
      
      return this.searchIndex
        .filter(item => {
          try {
            if (!item?.meta) return false;
            
            // Handle different data types for year
            const year = typeof item.meta.year === 'string' 
              ? parseInt(item.meta.year, 10) 
              : item.meta.year;
            
            return !isNaN(year) && year >= startYear && year <= endYear;
          } catch (error) {
            console.error('Error filtering year for item:', error);
            return false; // Skip items with invalid year data
          }
        })
        .map(item => item.meta)
        .filter(Boolean); // Filter out null/undefined items
    } catch (error) {
      console.error('Error filtering by year:', error);
      return [];
    }
  }
}

// Export as a singleton
const searchService = new SearchService();
export default searchService; 
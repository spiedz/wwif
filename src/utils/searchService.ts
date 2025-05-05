import { FilmMeta, SearchResult } from '../types/content';
import { SeriesMeta, TVSeries } from '../types/series';
import Fuse from 'fuse.js';

// Define content type enum
export enum ContentType {
  FILM = 'film',
  SERIES = 'series'
}

// Define unified search item type
export type SearchItem = {
  meta: FilmMeta | SeriesMeta;
  content?: string;
  html?: string;
  type: ContentType; // Add content type field
};

/**
 * SearchService class for handling film and TV series search functionality
 */
class SearchService {
  private searchIndex: SearchItem[] = [];
  private fuseInstance: any = null;
  private initialized: boolean = false;
  
  /**
   * Initialize the search service with film and series data
   * @param films An array of film data to be indexed for search
   * @param series An array of TV series data to be indexed for search
   */
  public initialize(films: any[] = [], series: any[] = []): void {
    if (typeof Fuse === 'undefined') {
      console.error('Fuse.js not available. Search will not work.');
      return;
    }
    
    // Convert films and series to SearchItems with type field
    const filmItems = films.map(film => ({
      ...film,
      type: ContentType.FILM
    }));
    
    const seriesItems = series.map(seriesItem => ({
      ...seriesItem,
      type: ContentType.SERIES
    }));
    
    // Combine both content types
    this.searchIndex = [...filmItems, ...seriesItems];
    
    // Initialize Fuse with settings for both films and series
    this.fuseInstance = new Fuse(this.searchIndex, {
      keys: [
        { name: 'meta.title', weight: 1.0 },
        { name: 'meta.director', weight: 0.7 }, // For films
        { name: 'meta.creator', weight: 0.7 },  // For series
        { name: 'meta.description', weight: 0.6 },
        { name: 'meta.year', weight: 0.5 },     // For films
        { name: 'meta.releaseYearStart', weight: 0.5 }, // For series
        { name: 'meta.genre', weight: 0.5 },    // For films
        { name: 'meta.genres', weight: 0.5 },   // For series
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
   * @param contentType Optional filter for specific content type (film or series)
   * @returns Search results with matching content
   */
  public search(query: string, contentType?: ContentType): Array<{
    item: SearchItem;
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
      let results = this.fuseInstance.search(query.trim());
      
      // Filter by content type if specified
      if (contentType) {
        results = results.filter(result => result.item.type === contentType);
      }
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
  
  /**
   * Get content suggestions based on a partial query
   * @param query The partial search query
   * @param contentType Optional filter for specific content type
   * @param limit Maximum number of suggestions to return
   * @returns Matching suggestions
   */
  public getSuggestions(query: string, contentType?: ContentType, limit: number = 5): Array<{
    item: SearchItem;
    matches?: Array<{ indices: number[][]; key: string; value: string }>;
  }> {
    if (!query || !query.trim() || !this.initialized) {
      return [];
    }
    
    try {
      const results = this.search(query, contentType);
      const limitedResults = results.slice(0, Math.max(1, Math.min(limit, 20))); // Limit between 1 and 20
      return limitedResults;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
  
  /**
   * Get popular content items
   * @param contentType Optional filter for specific content type
   * @param limit Maximum number of items to return
   * @returns Popular items
   */
  public getPopularItems(contentType?: ContentType, limit: number = 5): SearchItem[] {
    if (!this.initialized || !this.searchIndex?.length) {
      return [];
    }
    
    try {
      let filteredItems = this.searchIndex;
      
      // Filter by content type if specified
      if (contentType) {
        filteredItems = filteredItems.filter(item => item.type === contentType);
      }
      
      // In a real implementation, we might sort by popularity metrics
      return filteredItems
        .slice(0, Math.min(limit, filteredItems.length))
        .filter(Boolean); // Filter out null/undefined items
    } catch (error) {
      console.error('Error getting popular items:', error);
      return [];
    }
  }
  
  /**
   * Search for content by location
   * @param locationName The name of the location to search for
   * @param contentType Optional filter for specific content type
   * @returns Content with matching locations
   */
  public searchByLocation(locationName: string, contentType?: ContentType): SearchItem[] {
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
      
      let results = locationFuse
        .search(normalizedLocation)
        .map((result: any) => result.item)
        .filter(Boolean); // Filter out null/undefined items
      
      // Filter by content type if specified
      if (contentType) {
        results = results.filter(item => item.type === contentType);
      }
      
      return results;
    } catch (error) {
      console.error('Error searching by location:', error);
      return [];
    }
  }
  
  /**
   * Filter content by genre
   * @param genre The genre to filter by
   * @param contentType Optional filter for specific content type
   * @returns Content of the specified genre
   */
  public filterByGenre(genre: string, contentType?: ContentType): SearchItem[] {
    if (!this.initialized || !this.searchIndex?.length || !genre || !genre.trim()) {
      return [];
    }
    
    try {
      const normalizedGenre = genre.trim().toLowerCase();
      
      let results = this.searchIndex
        .filter(item => {
          try {
            if (!item?.meta) return false;
            
            // Filter by content type if specified
            if (contentType && item.type !== contentType) {
              return false;
            }
            
            // Check appropriate genre field based on content type
            if (item.type === ContentType.FILM) {
              const filmGenres = (item.meta as FilmMeta).genre;
              
              // Handle different genre data types for films
              if (Array.isArray(filmGenres)) {
                return filmGenres.some(g => 
                  g && typeof g === 'string' && g.toLowerCase().includes(normalizedGenre)
                );
              } else if (typeof filmGenres === 'string') {
                return filmGenres.toLowerCase().includes(normalizedGenre);
              }
            } else if (item.type === ContentType.SERIES) {
              const seriesGenres = (item.meta as SeriesMeta).genres || [];
              
              // Handle genres for series (always array)
              return seriesGenres.some(g => 
                g && typeof g === 'string' && g.toLowerCase().includes(normalizedGenre)
              );
            }
            
            return false;
          } catch (error) {
            console.error('Error filtering genre for item:', error);
            return false; // Skip items with invalid genre data
          }
        })
        .filter(Boolean); // Filter out null/undefined items
      
      return results;
    } catch (error) {
      console.error('Error filtering by genre:', error);
      return [];
    }
  }
  
  /**
   * Filter content by year or year range
   * @param yearOrRange A year or year range (e.g. "2000" or "2000-2010")
   * @param contentType Optional filter for specific content type
   * @returns Content from the specified year(s)
   */
  public filterByYear(yearOrRange: string, contentType?: ContentType): SearchItem[] {
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
      
      // Use reasonable constraints for years (e.g., not future years)
      const currentYear = new Date().getFullYear();
      if (startYear < 1890 || endYear > currentYear + 5 || startYear > endYear) {
        // First movies ~1890, allow some buffer for future
        return [];
      }
      
      let results = this.searchIndex
        .filter(item => {
          try {
            if (!item?.meta) return false;
            
            // Filter by content type if specified
            if (contentType && item.type !== contentType) {
              return false;
            }
            
            // Check appropriate year field based on content type
            if (item.type === ContentType.FILM) {
              const filmYear = parseInt(String((item.meta as FilmMeta).year), 10);
              return !isNaN(filmYear) && filmYear >= startYear && filmYear <= endYear;
            } else if (item.type === ContentType.SERIES) {
              const seriesMeta = item.meta as SeriesMeta;
              const startSeriesYear = seriesMeta.releaseYearStart;
              const endSeriesYear = seriesMeta.releaseYearEnd || currentYear; // If still ongoing
              
              // Series release period overlaps with search range
              return (
                !isNaN(startSeriesYear) && 
                (
                  // Series started within the range
                  (startSeriesYear >= startYear && startSeriesYear <= endYear) ||
                  // Series ended within the range
                  (endSeriesYear >= startYear && endSeriesYear <= endYear) ||
                  // Series spans the entire range
                  (startSeriesYear <= startYear && endSeriesYear >= endYear)
                )
              );
            }
            
            return false;
          } catch (error) {
            console.error('Error filtering year for item:', error);
            return false; // Skip items with invalid year data
          }
        })
        .filter(Boolean); // Filter out null/undefined items
      
      return results;
    } catch (error) {
      console.error('Error filtering by year:', error);
      return [];
    }
  }
  
  // Backwards compatibility methods
  
  /**
   * Get popular films (legacy support)
   */
  public getPopularFilms(limit: number = 5): FilmMeta[] {
    return this.getPopularItems(ContentType.FILM, limit)
      .map(item => item.meta as FilmMeta);
  }
}

// Singleton instance
const searchService = new SearchService();
export default searchService; 
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllFilms, getAllSeries } from '../../../lib/server/serverMarkdown';
import searchService, { ContentType, SearchItem } from '../../../utils/searchService';
import { FilmMeta } from '../../../types/content';
import { SeriesMeta } from '../../../types/series';

// Define a type for search results with matches from Fuse.js
type SearchResultWithMatches = {
  item: SearchItem;
  matches?: Array<{ indices: number[][]; key: string; value: string }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get query params
    const { q, type, filter, contentType, page = '1', limit = '12' } = req.query;
    
    // Parse pagination params
    const parsedPage = parseInt(page as string, 10) || 1;
    const parsedLimit = parseInt(limit as string, 10) || 12;
    const offset = (parsedPage - 1) * parsedLimit;
    
    // Get content type if specified
    let selectedContentType: ContentType | undefined;
    if (contentType === 'films') {
      selectedContentType = ContentType.FILM;
    } else if (contentType === 'series') {
      selectedContentType = ContentType.SERIES;
    }
    
    // Initialize search service if needed
    if (!searchService.isInitialized()) {
      const films = await getAllFilms();
      const series = await getAllSeries();
      searchService.initialize(films, series);
    }
    
    // Handle different search types
    let results: SearchResultWithMatches[] | SearchItem[] = [];
    let totalResults = 0;
    
    if (!q || typeof q !== 'string' || !q.trim()) {
      // If no query provided, return empty results
      results = [];
    } else if (type === 'location' && typeof q === 'string') {
      // Search by location
      const locationResults = searchService.searchByLocation(q, selectedContentType);
      results = locationResults;
      totalResults = locationResults.length;
    } else if (type === 'genre' && typeof q === 'string') {
      // Filter by genre
      const genreResults = searchService.filterByGenre(q, selectedContentType);
      results = genreResults;
      totalResults = genreResults.length;
    } else if (type === 'year' && typeof q === 'string') {
      // Filter by year or year range
      const yearResults = searchService.filterByYear(q, selectedContentType);
      results = yearResults;
      totalResults = yearResults.length;
    } else {
      // Standard search
      const searchResults = searchService.search(q as string, selectedContentType);
      results = searchResults;
      totalResults = searchResults.length;
    }
    
    // Apply pagination
    const paginatedResults = Array.isArray(results) 
      ? results.slice(offset, offset + parsedLimit)
      : [];
    
    // Return search results with pagination metadata
    return res.status(200).json({
      query: q,
      contentType: contentType || 'all',
      totalResults,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(totalResults / parsedLimit),
      results: paginatedResults
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      results: [] 
    });
  }
} 
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllFilms } from '../../../utils/markdown';
import searchService from '../../../utils/searchService';
import { FilmMeta } from '../../../types/content';

// Define a type for search results
type SearchResultItem = {
  item: { meta: FilmMeta; content?: string; html?: string };
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
    const { q, type, filter, page = '1', limit = '12' } = req.query;
    
    // Parse pagination params
    const parsedPage = parseInt(page as string, 10) || 1;
    const parsedLimit = parseInt(limit as string, 10) || 12;
    const offset = (parsedPage - 1) * parsedLimit;
    
    // Initialize search service if needed
    if (!searchService.isInitialized()) {
      const films = await getAllFilms();
      searchService.initialize(films);
    }
    
    // Handle different search types
    let results: SearchResultItem[] | FilmMeta[] = [];
    let totalResults = 0;
    
    if (!q || typeof q !== 'string' || !q.trim()) {
      // If no query provided, return empty results
      results = [];
    } else if (type === 'location' && typeof q === 'string') {
      // Search by location
      const locationResults = searchService.searchByLocation(q);
      results = locationResults;
      totalResults = locationResults.length;
    } else if (type === 'genre' && typeof q === 'string') {
      // Filter by genre
      const genreResults = searchService.filterByGenre(q);
      results = genreResults;
      totalResults = genreResults.length;
    } else if (type === 'year' && typeof q === 'string') {
      // Filter by year or year range
      const yearResults = searchService.filterByYear(q);
      results = yearResults;
      totalResults = yearResults.length;
    } else {
      // Standard search
      const searchResults = searchService.search(q as string);
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
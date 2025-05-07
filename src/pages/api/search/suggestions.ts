import { NextApiRequest, NextApiResponse } from 'next';
import { getAllFilms, getAllSeries } from '../../../lib/server/serverMarkdown';
import searchService, { ContentType } from '../../../utils/searchService';

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
    const { q, limit = '5', contentType } = req.query;
    
    // Query must be provided
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({ 
        message: 'Query parameter "q" is required',
        suggestions: [] 
      });
    }
    
    // Parse limit
    const parsedLimit = parseInt(limit as string, 10);
    const maxSuggestions = !isNaN(parsedLimit) ? Math.min(parsedLimit, 10) : 5;
    
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
    
    // Get suggestions
    const suggestions = searchService.getSuggestions(q, selectedContentType, maxSuggestions);
    
    return res.status(200).json({
      query: q,
      contentType: contentType || 'all',
      count: suggestions.length,
      suggestions
    });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      suggestions: [] 
    });
  }
} 
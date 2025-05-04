import { NextApiRequest, NextApiResponse } from 'next';
import { getAllFilms } from '../../../utils/markdown';
import searchService from '../../../utils/searchService';

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
    const { q, limit = '5' } = req.query;
    
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
    
    // Initialize search service if needed
    if (!searchService.isInitialized()) {
      const films = await getAllFilms();
      searchService.initialize(films);
    }
    
    // Get suggestions
    const suggestions = searchService.getSuggestions(q, maxSuggestions);
    
    return res.status(200).json({
      query: q,
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
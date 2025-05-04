import { NextApiRequest, NextApiResponse } from 'next';
import { getAllFilms } from '../../../utils/markdown';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get all films
    const films = await getAllFilms();
    
    return res.status(200).json(films);
  } catch (error) {
    console.error('Error fetching films:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllSeries } from '../../../utils/markdown';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get all series
    const series = await getAllSeries();
    
    return res.status(200).json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 
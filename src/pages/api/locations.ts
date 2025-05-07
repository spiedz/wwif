import { NextApiRequest, NextApiResponse } from 'next';
import { getAllLocations } from '../../utils/locationUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const locations = await getAllLocations();
    
    // Return the full location data
    res.status(200).json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
} 
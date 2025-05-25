import type { NextApiRequest, NextApiResponse } from 'next';
import { getGSCConfig, validateGSCConfig, getSearchPerformance } from '../../../utils/googleSearchConsole';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { urls, startDate, endDate } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        error: 'URLs array is required in request body'
      });
    }

    const config = getGSCConfig();
    const validation = validateGSCConfig(config);

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid GSC configuration',
        errors: validation.errors
      });
    }

    console.log(`Getting search performance for ${urls.length} URLs`);
    const performance = await getSearchPerformance(urls, config, startDate, endDate);

    // Calculate summary statistics
    const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);
    const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
    const avgCTR = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const avgPosition = performance.reduce((sum, p) => sum + p.position, 0) / performance.length;

    return res.json({
      success: true,
      total: performance.length,
      summary: {
        totalImpressions,
        totalClicks,
        avgCTR: Math.round(avgCTR * 10000) / 100, // Convert to percentage
        avgPosition: Math.round(avgPosition * 10) / 10,
      },
      performance,
      dateRange: {
        startDate: startDate || 'Last 90 days',
        endDate: endDate || 'Today'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search performance error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to get search performance data'
    });
  }
} 
import type { NextApiRequest, NextApiResponse } from 'next';
import { getGSCConfig, validateGSCConfig, bulkCheckIndexing } from '../../../utils/googleSearchConsole';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { urls } = req.body;

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

    console.log(`Starting bulk indexing check for ${urls.length} URLs`);
    const result = await bulkCheckIndexing(urls, config);

    return res.json({
      success: true,
      total: urls.length,
      indexed: result.indexed.length,
      notIndexed: result.notIndexed.length,
      errors: result.errors.length,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Bulk indexing check error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check indexing status'
    });
  }
} 
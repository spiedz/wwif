import type { NextApiRequest, NextApiResponse } from 'next';
import { autoRequestIndexing, requestFilmIndexing, requestBulkContentIndexing } from '../../../utils/googleIndexingAPI';

interface IndexingRequest {
  action: 'single' | 'bulk' | 'auto';
  
  // For single URL
  url?: string;
  slug?: string;
  type?: 'film' | 'series' | 'blog';
  
  // For bulk indexing
  urls?: string[];
  contentItems?: Array<{slug: string, type: 'film' | 'series' | 'blog'}>;
  
  // For auto indexing (new content)
  contentData?: {
    title: string;
    slug: string;
    type: 'film' | 'series' | 'blog';
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Use POST to request indexing'
    });
  }

  try {
    const { action, url, slug, type, urls, contentItems, contentData }: IndexingRequest = req.body;

    if (!action) {
      return res.status(400).json({
        error: 'Missing required field: action',
        validActions: ['single', 'bulk', 'auto']
      });
    }

    let result;

    switch (action) {
      case 'single':
        if (slug && type) {
          // Request indexing by slug and type
          result = await requestFilmIndexing(slug, type);
        } else if (url) {
          // Request indexing by direct URL
          const { indexingAPI } = await import('../../../utils/googleIndexingAPI');
          result = await indexingAPI.requestIndexing(url);
        } else {
          return res.status(400).json({
            error: 'For single indexing, provide either (slug + type) or url'
          });
        }
        break;

      case 'bulk':
        if (contentItems) {
          // Bulk index by content items
          result = await requestBulkContentIndexing(contentItems);
        } else if (urls) {
          // Bulk index by URLs
          const { indexingAPI } = await import('../../../utils/googleIndexingAPI');
          result = await indexingAPI.requestBatchIndexing(urls);
        } else {
          return res.status(400).json({
            error: 'For bulk indexing, provide either contentItems or urls array'
          });
        }
        break;

      case 'auto':
        if (!contentData) {
          return res.status(400).json({
            error: 'For auto indexing, provide contentData with title, slug, and type'
          });
        }
        result = await autoRequestIndexing(contentData);
        break;

      default:
        return res.status(400).json({
          error: 'Invalid action',
          validActions: ['single', 'bulk', 'auto']
        });
    }

    return res.status(200).json({
      success: true,
      action: action,
      result: result,
      message: 'Indexing request processed successfully'
    });

  } catch (error: any) {
    console.error('Indexing request failed:', error);
    return res.status(500).json({
      error: 'Failed to process indexing request',
      details: error.message
    });
  }
} 
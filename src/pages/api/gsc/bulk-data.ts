import type { NextApiRequest, NextApiResponse } from 'next';
import { bulkCheckIndexing, getSearchPerformance, getGSCConfig } from '../../../utils/googleSearchConsole';

interface BulkDataRequest {
  urls: string[];
  startDate?: string;
  endDate?: string;
}

interface BulkDataResponse {
  success: boolean;
  data?: {
    [url: string]: {
      isIndexed: boolean;
      impressions: number;
      clicks: number;
      ctr: number;
      position: number;
    };
  };
  error?: string;
  summary?: {
    totalUrls: number;
    validUrls: number;
    invalidUrls: number;
    indexedCount: number;
    totalImpressions: number;
    totalClicks: number;
    avgCTR: number;
    avgPosition: number;
  };
  skippedUrls?: string[];
}

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const isValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    const hasValidPath = !urlObj.pathname.includes('undefined') && !urlObj.pathname.includes('null');
    return isValidProtocol && hasValidPath;
  } catch {
    return false;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BulkDataResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { urls, startDate, endDate }: BulkDataRequest = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'URLs array is required' 
      });
    }

    console.log(`Processing ${urls.length} URLs for GSC data...`);

    // Filter out invalid URLs
    const validUrls = urls.filter(url => {
      if (!url || url.includes('undefined') || url.includes('null') || !isValidUrl(url)) {
        console.warn(`Skipping invalid URL: ${url}`);
        return false;
      }
      return true;
    });

    const skippedUrls = urls.filter(url => !validUrls.includes(url));

    if (validUrls.length === 0) {
      return res.json({
        success: false,
        error: 'No valid URLs provided',
        skippedUrls,
        summary: {
          totalUrls: urls.length,
          validUrls: 0,
          invalidUrls: skippedUrls.length,
          indexedCount: 0,
          totalImpressions: 0,
          totalClicks: 0,
          avgCTR: 0,
          avgPosition: 0
        }
      });
    }

    console.log(`Processing ${validUrls.length} valid URLs (skipped ${skippedUrls.length} invalid URLs)`);

    // Get GSC configuration
    const config = getGSCConfig();

    // Set default date range (last 90 days)
    const defaultStartDate = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultEndDate = endDate || new Date().toISOString().split('T')[0];

    // Process in smaller batches to avoid overwhelming the API
    const batchSize = 50; // Process 50 URLs at a time
    const combinedData: { [url: string]: any } = {};
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalPosition = 0;
    let indexedCount = 0;
    let urlsWithPerformance = 0;

    // Initialize all valid URLs with default values
    validUrls.forEach(url => {
      combinedData[url] = {
        isIndexed: false,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        position: 0
      };
    });

    try {
      // Try to get performance data for all URLs at once first
      console.log('Fetching search performance data for all URLs...');
      const performanceResult = await getSearchPerformance(validUrls, config, defaultStartDate, defaultEndDate);

      // Add performance data
      performanceResult.forEach((item) => {
        if (combinedData[item.url]) {
          combinedData[item.url] = {
            ...combinedData[item.url],
            impressions: item.impressions || 0,
            clicks: item.clicks || 0,
            ctr: item.ctr || 0,
            position: item.position || 0
          };

          // If has performance data, it's definitely indexed
          if (item.impressions > 0 || item.clicks > 0) {
            combinedData[item.url].isIndexed = true;
            indexedCount++;
          }

          totalImpressions += item.impressions || 0;
          totalClicks += item.clicks || 0;
          totalPosition += item.position || 0;
          urlsWithPerformance++;
        }
      });

      console.log(`Performance data complete: ${urlsWithPerformance} URLs have search data`);

    } catch (error) {
      console.error('Error fetching performance data:', error);
      // Continue with indexing check even if performance data fails
    }

    // Try indexing check for URLs that don't have performance data (in smaller batches)
    const urlsNeedingIndexCheck = validUrls.filter(url => !combinedData[url].isIndexed);
    
    if (urlsNeedingIndexCheck.length > 0 && urlsNeedingIndexCheck.length <= 25) {
      console.log(`Checking indexing status for ${urlsNeedingIndexCheck.length} URLs without performance data...`);
      
      try {
        const indexingResult = await bulkCheckIndexing(urlsNeedingIndexCheck, config);
        
        // Add indexing status (only for URLs that don't already have performance data indicating indexing)
        indexingResult.indexed.forEach((url: string) => {
          if (combinedData[url] && !combinedData[url].isIndexed) {
            combinedData[url].isIndexed = true;
            indexedCount++;
          }
        });

        console.log(`Indexing check complete: ${indexingResult.indexed.length} additional URLs confirmed indexed`);
        
      } catch (error) {
        console.error('Error checking indexing status:', error);
        // Don't fail the entire request if indexing check fails
      }
    } else if (urlsNeedingIndexCheck.length > 25) {
      console.log(`Skipping indexing check for ${urlsNeedingIndexCheck.length} URLs (too many for rate limits)`);
    }

    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgPosition = urlsWithPerformance > 0 ? totalPosition / urlsWithPerformance : 0;

    console.log(`Completed GSC data fetch: ${validUrls.length} URLs processed, ${indexedCount} indexed, ${totalImpressions} total impressions`);

    return res.json({
      success: true,
      data: combinedData,
      skippedUrls,
      summary: {
        totalUrls: urls.length,
        validUrls: validUrls.length,
        invalidUrls: skippedUrls.length,
        indexedCount,
        totalImpressions,
        totalClicks,
        avgCTR: Number(avgCTR.toFixed(2)),
        avgPosition: Number(avgPosition.toFixed(1))
      }
    });

  } catch (error: any) {
    console.error('Bulk data API error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch bulk GSC data'
    });
  }
} 
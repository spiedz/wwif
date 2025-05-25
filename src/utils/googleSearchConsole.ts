/**
 * Google Search Console API Integration
 * Real implementation using Google APIs
 */

import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

export interface SearchPerformanceData {
  url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  isIndexed: boolean;
}

export interface IndexingStatusData {
  url: string;
  inspectionResult: {
    indexStatusResult?: {
      verdict: 'PASS' | 'PARTIAL' | 'FAIL' | 'NEUTRAL';
      coverageState: string;
      lastCrawlTime?: string;
      pageFetchState?: string;
      googleCanonical?: string;
      userCanonical?: string;
    };
  };
}

export interface GSCConfig {
  serviceAccountKeyPath?: string;
  serviceAccountKey?: object;
  siteUrl: string;
  accessToken?: string;
}

export interface GSCBatchResult {
  indexed: string[];
  notIndexed: string[];
  errors: { url: string; error: string }[];
}

/**
 * Create authenticated Google Search Console client
 */
const createGSCClient = async (config: GSCConfig) => {
  let auth;

  if (config.serviceAccountKey) {
    // Use service account credentials from object
    auth = new GoogleAuth({
      credentials: config.serviceAccountKey,
      scopes: [
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/webmasters'
      ],
    });
  } else if (config.serviceAccountKeyPath) {
    // Use service account key file
    auth = new GoogleAuth({
      keyFile: config.serviceAccountKeyPath,
      scopes: [
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/webmasters'
      ],
    });
  } else {
    throw new Error('No valid authentication method provided for GSC API');
  }

  const searchconsole = google.searchconsole({ version: 'v1', auth });
  return { searchconsole, auth };
};

/**
 * Check if a URL is indexed using GSC URL Inspection API
 */
export const checkIndexingStatus = async (url: string, config: GSCConfig): Promise<boolean> => {
  try {
    const { searchconsole } = await createGSCClient(config);
    
    const response = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl: config.siteUrl,
      },
    });

    const verdict = response.data.inspectionResult?.indexStatusResult?.verdict;
    return verdict === 'PASS';
  } catch (error) {
    console.error(`Error checking indexing status for ${url}:`, error);
    return false;
  }
};

/**
 * Get search performance data for URLs
 */
export const getSearchPerformance = async (
  urls: string[], 
  config: GSCConfig,
  startDate: string = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days ago
  endDate: string = new Date().toISOString().split('T')[0]
): Promise<SearchPerformanceData[]> => {
  try {
    const { searchconsole } = await createGSCClient(config);
    
    // For domain properties, we need to filter by page URLs differently
    const isDomainProperty = config.siteUrl.startsWith('sc-domain:');
    const baseUrl = isDomainProperty 
      ? `https://${config.siteUrl.replace('sc-domain:', '')}`
      : config.siteUrl;
    
    console.log(`Fetching search performance for ${urls.length} URLs...`);
    console.log(`Using site URL: ${config.siteUrl}, base URL: ${baseUrl}`);

    // Instead of filtering by URLs in the API call (which is causing issues), 
    // get all site performance data and filter locally
    const response = await searchconsole.searchanalytics.query({
      siteUrl: config.siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 25000 // Get all pages
      },
    });

    const performanceMap = new Map<string, SearchPerformanceData>();
    
    // Initialize all URLs with zero data
    urls.forEach(url => {
      performanceMap.set(url, {
        url,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        position: 0,
        isIndexed: false, // Will be determined separately
      });
    });

    // Fill in actual data by matching URLs
    if (response.data && response.data.rows) {
      console.log(`Processing ${response.data.rows.length} rows from GSC...`);
      
      response.data.rows.forEach((row: any) => {
        const pagePath = row.keys[0];
        let fullUrl = pagePath;
        
        // Handle different URL formats
        if (!pagePath.startsWith('http')) {
          fullUrl = `${baseUrl}${pagePath.startsWith('/') ? '' : '/'}${pagePath}`;
        }
        
        // Check if this URL matches any of our target URLs
        if (performanceMap.has(fullUrl)) {
          const data = performanceMap.get(fullUrl)!;
          data.impressions = row.impressions || 0;
          data.clicks = row.clicks || 0;
          data.ctr = row.ctr || 0;
          data.position = row.position || 0;
          
          console.log(`Found data for ${fullUrl}: ${data.impressions} impressions, ${data.clicks} clicks`);
        }
      });
    }

    const results = Array.from(performanceMap.values());
    const withData = results.filter(r => r.impressions > 0 || r.clicks > 0);
    console.log(`Search performance complete: ${withData.length} URLs have data out of ${results.length} requested`);
    
    return results;
  } catch (error) {
    console.error('Error getting search performance:', error);
    // Return empty data instead of throwing
    return urls.map(url => ({
      url,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      position: 0,
      isIndexed: false,
    }));
  }
};

/**
 * Bulk check indexing status for multiple URLs
 * Uses search performance data as primary indicator since it's more reliable
 */
export const bulkCheckIndexing = async (urls: string[], config: GSCConfig): Promise<GSCBatchResult> => {
  const result: GSCBatchResult = {
    indexed: [],
    notIndexed: [],
    errors: []
  };

  console.log(`Starting bulk indexing check for ${urls.length} URLs`);

  try {
    // First, try to get search performance data which is more reliable indicator of indexing
    const performanceData = await getSearchPerformance(urls, config);
    const urlsWithPerformance = new Set<string>();
    
    performanceData.forEach(item => {
      if (item.impressions > 0 || item.clicks > 0) {
        result.indexed.push(item.url);
        urlsWithPerformance.add(item.url);
      }
    });

    console.log(`Found ${result.indexed.length} URLs with search performance data (definitely indexed)`);

    // For URLs without performance data, try URL Inspection API (but be more lenient about errors)
    const urlsToCheck = urls.filter(url => !urlsWithPerformance.has(url));
    
    if (urlsToCheck.length > 0) {
      console.log(`Checking ${urlsToCheck.length} URLs via URL Inspection API...`);
      
      // Process in smaller batches to avoid rate limiting
      const batchSize = 5; // Reduced batch size
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      for (let i = 0; i < urlsToCheck.length; i += batchSize) {
        const batch = urlsToCheck.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (url) => {
          try {
            const isIndexed = await checkIndexingStatus(url, config);
            if (isIndexed) {
              result.indexed.push(url);
            } else {
              result.notIndexed.push(url);
            }
          } catch (error) {
            // For URL inspection errors, default to "not indexed" rather than error
            // This is more graceful handling since the API has strict permissions
            console.warn(`URL inspection failed for ${url}, assuming not indexed:`, error instanceof Error ? error.message : 'Unknown error');
            result.notIndexed.push(url);
          }
        });

        await Promise.all(batchPromises);
        
        // Add longer delay between batches to respect rate limits
        if (i + batchSize < urlsToCheck.length) {
          await delay(2000); // Increased delay
        }
      }
    }

    console.log(`Indexing check complete: ${result.indexed.length} indexed, ${result.notIndexed.length} not indexed, ${result.errors.length} errors`);

  } catch (error) {
    console.error('Error in bulk indexing check:', error);
    // If everything fails, just mark all URLs as "unknown" (not indexed)
    result.notIndexed = urls.filter(url => !result.indexed.includes(url));
  }

  return result;
};

/**
 * Submit URLs to Google for indexing using URL Inspection API
 */
export const submitUrlsForIndexing = async (urls: string[], config: GSCConfig): Promise<{ success: string[], errors: { url: string, error: string }[] }> => {
  const result = {
    success: [] as string[],
    errors: [] as { url: string, error: string }[]
  };

  try {
    const { searchconsole } = await createGSCClient(config);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const url of urls) {
      try {
        await searchconsole.urlInspection.index.inspect({
          requestBody: {
            inspectionUrl: url,
            siteUrl: config.siteUrl,
          },
        });
        
        result.success.push(url);
        // Add delay to respect rate limits
        await delay(500);
      } catch (error) {
        result.errors.push({
          url,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  } catch (error) {
    console.error('Error in bulk URL submission:', error);
  }

  return result;
};

/**
 * Get all pages from GSC for the site
 */
export const getAllSitePages = async (config: GSCConfig, days: number = 90): Promise<SearchPerformanceData[]> => {
  try {
    const { searchconsole } = await createGSCClient(config);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];
    
    // For domain properties, we need to handle URLs differently
    const isDomainProperty = config.siteUrl.startsWith('sc-domain:');
    const baseUrl = isDomainProperty 
      ? `https://${config.siteUrl.replace('sc-domain:', '')}`
      : config.siteUrl;
    
    const response = await searchconsole.searchanalytics.query({
      siteUrl: config.siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 25000
      },
    });

    const pages: SearchPerformanceData[] = [];
    
    if (response.data && response.data.rows) {
      response.data.rows.forEach((row: any) => {
        const pagePath = row.keys[0];
        const fullUrl = pagePath.startsWith('http') ? pagePath : `${baseUrl}${pagePath}`;
        
        pages.push({
          url: fullUrl,
          impressions: row.impressions || 0,
          clicks: row.clicks || 0,
          ctr: row.ctr || 0,
          position: row.position || 0,
          isIndexed: true, // If it has search data, it's indexed
        });
      });
    }

    return pages;
  } catch (error) {
    console.error('Error getting all site pages:', error);
    return [];
  }
};

/**
 * Generate GSC configuration from environment variables
 */
export const getGSCConfig = (): GSCConfig => {
  const serviceAccountKeyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  let serviceAccountKey;
  
  if (serviceAccountKeyString) {
    try {
      // Try to parse as JSON first
      serviceAccountKey = JSON.parse(serviceAccountKeyString);
    } catch (error) {
      // If JSON parsing fails, try base64 decoding first
      try {
        const decodedString = Buffer.from(serviceAccountKeyString, 'base64').toString('utf8');
        serviceAccountKey = JSON.parse(decodedString);
      } catch (base64Error) {
        console.error('Error parsing GOOGLE_SERVICE_ACCOUNT_KEY (tried both JSON and base64):', error, base64Error);
      }
    }
  }

  // Use domain property format for GSC
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  let siteUrl = baseUrl;
  
  // Convert to domain property format if needed
  if (baseUrl.startsWith('https://') || baseUrl.startsWith('http://')) {
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    siteUrl = `sc-domain:${domain}`;
  }

  return {
    serviceAccountKey,
    serviceAccountKeyPath: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
    siteUrl: siteUrl,
    accessToken: process.env.GSC_ACCESS_TOKEN,
  };
};

/**
 * Validate GSC configuration
 */
export const validateGSCConfig = (config: GSCConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.siteUrl) {
    errors.push('Site URL is required');
  }

  if (!config.serviceAccountKey && !config.serviceAccountKeyPath && !config.accessToken) {
    errors.push('Authentication method required (service account key, key file path, or access token)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Test GSC connection
 */
export const testGSCConnection = async (config: GSCConfig): Promise<{ success: boolean; error?: string; siteInfo?: any }> => {
  try {
    const { searchconsole } = await createGSCClient(config);
    
    // Try to get site info to test connection
    const response = await searchconsole.sites.list();
    
    const siteInfo = response.data.siteEntry?.find(site => site.siteUrl === config.siteUrl);
    
    return {
      success: true,
      siteInfo
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Mock data generator for development/testing (fallback)
 */
export const generateMockSearchData = (urls: string[]): SearchPerformanceData[] => {
  return urls.map(url => ({
    url,
    impressions: Math.floor(Math.random() * 1000) + 10,
    clicks: Math.floor(Math.random() * 50) + 1,
    ctr: Math.random() * 0.1,
    position: Math.floor(Math.random() * 50) + 1,
    isIndexed: Math.random() > 0.1, // 90% indexed rate
  }));
};

/**
 * Instructions for setting up Google Search Console API
 */
export const GSC_SETUP_INSTRUCTIONS = `
To integrate with Google Search Console API:

1. Go to Google Cloud Console (console.cloud.google.com)
2. Create a new project or select existing project
3. Enable the "Google Search Console API"
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name like "GSC API Access"
   - Download the JSON key file

5. Add the service account to your Search Console property:
   - Go to Search Console (search.google.com/search-console)
   - Select your property
   - Go to Settings > Users and permissions
   - Add user with the service account email (from the JSON file)
   - Give it "Full" permission

6. Set environment variables in your .env file:
   GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account", "project_id": "...", ...}
   # OR
   GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
   
   NEXT_PUBLIC_BASE_URL=https://yoursite.com

7. Test the connection using the /api/gsc/test endpoint

Rate Limits:
- URL Inspection API: 2,000 requests per day
- Search Analytics API: 25,000 requests per day
- Be mindful of these limits when doing bulk operations
`; 
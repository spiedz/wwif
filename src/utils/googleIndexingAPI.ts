import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

// Google Indexing API utility
export class GoogleIndexingAPI {
  private auth: GoogleAuth;
  private indexing: any;

  constructor() {
    // Use the same service account configuration as GSC
    const serviceAccountKeyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    let serviceAccountKey;
    
    if (serviceAccountKeyString) {
      try {
        serviceAccountKey = JSON.parse(serviceAccountKeyString);
      } catch (error) {
        console.error('Error parsing GOOGLE_SERVICE_ACCOUNT_KEY for indexing:', error);
        throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format');
      }
    } else {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is required for indexing API');
    }

    this.auth = new GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });

    this.indexing = google.indexing({ version: 'v3', auth: this.auth });
  }

  /**
   * Request indexing for a single URL
   */
  async requestIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
    try {
      console.log(`Requesting indexing for: ${url}`);
      
      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: type
        }
      });

      console.log(`Indexing requested successfully for ${url}:`, response.data);
      return {
        success: true,
        url: url,
        response: response.data
      };

    } catch (error: any) {
      console.error(`Failed to request indexing for ${url}:`, error.message);
      return {
        success: false,
        url: url,
        error: error.message
      };
    }
  }

  /**
   * Request indexing for multiple URLs (batch)
   */
  async requestBatchIndexing(urls: string[], type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
    const results = [];
    
    // Process in small batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchPromises = batch.map(url => this.requestIndexing(url, type));
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Wait between batches to respect rate limits
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get indexing status for URLs
   */
  async getIndexingStatus(urls: string[]) {
    try {
      const results = [];
      
      for (const url of urls) {
        try {
          const response = await this.indexing.urlNotifications.getMetadata({
            url: url
          });
          
          results.push({
            url: url,
            status: response.data
          });
        } catch (error: any) {
          results.push({
            url: url,
            error: error.message
          });
        }
      }

      return results;
    } catch (error: any) {
      console.error('Failed to get indexing status:', error.message);
      throw error;
    }
  }
}

// Helper functions for common use cases
let indexingAPIInstance: GoogleIndexingAPI | null = null;

function getIndexingAPI(): GoogleIndexingAPI {
  if (!indexingAPIInstance) {
    indexingAPIInstance = new GoogleIndexingAPI();
  }
  return indexingAPIInstance;
}

/**
 * Request indexing for a new film/series page
 */
export async function requestFilmIndexing(slug: string, type: 'film' | 'series' | 'blog' = 'film') {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const urlPath = type === 'film' ? 'films' : type === 'series' ? 'series' : 'blog';
  const url = `${baseUrl}/${urlPath}/${slug}`;
  
  const api = getIndexingAPI();
  return await api.requestIndexing(url);
}

/**
 * Request indexing for multiple content pieces
 */
export async function requestBulkContentIndexing(contentItems: Array<{slug: string, type: 'film' | 'series' | 'blog'}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  
  const urls = contentItems.map(item => {
    const urlPath = item.type === 'film' ? 'films' : item.type === 'series' ? 'series' : 'blog';
    return `${baseUrl}/${urlPath}/${item.slug}`;
  });
  
  const api = getIndexingAPI();
  return await api.requestBatchIndexing(urls);
}

/**
 * Automatically request indexing after content creation
 */
export async function autoRequestIndexing(contentData: {
  title: string;
  slug: string;
  type: 'film' | 'series' | 'blog';
}) {
  try {
    // Request indexing for the new content
    const result = await requestFilmIndexing(contentData.slug, contentData.type);
    
    // Also request indexing for related pages that might need updating
    const relatedUrls = [
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co'}/${contentData.type}s`, // Category page
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co'}/sitemap.xml` // Sitemap
    ];
    
    const api = getIndexingAPI();
    const relatedResults = await api.requestBatchIndexing(relatedUrls);
    
    return {
      mainContent: result,
      relatedPages: relatedResults,
      success: result.success
    };
    
  } catch (error: any) {
    console.error('Auto indexing failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
} 
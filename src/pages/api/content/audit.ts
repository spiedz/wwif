import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllFilms, getAllSeries, getAllBlogPosts } from '../../../lib/server/serverMarkdown';
import { Content, FilmMeta, BlogMeta } from '../../../types/content';
import { TVSeries } from '../../../types/series';
import { getSearchPerformance, getGSCConfig, bulkCheckIndexing } from '../../../utils/googleSearchConsole';

interface ContentAuditItem {
  id: string;
  title: string;
  slug: string;
  type: 'film' | 'series' | 'blog';
  url: string;
  description?: string;
  wordCount: number;
  qualityScore: number;
  lastModified: string;
  hasImages: boolean;
  hasVideo: boolean;
  internalLinks: number;
  externalLinks: number;
  metaDescription?: string;
  genres?: string[];
  countries?: string[];
  categories?: string[];
  tags?: string[];
  // GSC data
  isIndexed?: boolean;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  position?: number;
}

// Content quality scoring algorithm (same as in component)
const calculateQualityScore = (item: any, type: string): number => {
  let score = 0;
  
  const content = item.content || '';
  const wordCount = content.split(/\s+/).length;
  
  // Word count scoring (0-30 points)
  if (wordCount > 2000) score += 30;
  else if (wordCount > 1000) score += 25;
  else if (wordCount > 500) score += 15;
  else if (wordCount > 200) score += 10;
  else score += 5;
  
  // Meta description (0-15 points)
  if (item.meta?.description) {
    const metaLength = item.meta.description.length;
    if (metaLength >= 120 && metaLength <= 160) score += 15;
    else if (metaLength >= 100 && metaLength <= 180) score += 10;
    else if (metaLength > 0) score += 5;
  }
  
  // Images (0-15 points)
  const hasImages = content.includes('<img') || content.includes('![') || item.meta?.posterImage;
  if (hasImages) score += 15;
  
  // Structure and headings (0-15 points)
  const headingCount = (content.match(/#+ /g) || []).length;
  if (headingCount >= 5) score += 15;
  else if (headingCount >= 3) score += 10;
  else if (headingCount >= 1) score += 5;
  
  // Links (0-15 points)
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount >= 10) score += 15;
  else if (linkCount >= 5) score += 10;
  else if (linkCount >= 2) score += 5;
  
  // Type-specific scoring (0-10 points)
  if (type === 'film' || type === 'series') {
    if (item.meta?.genres && item.meta.genres.length > 0) score += 5;
    if (item.meta?.countries && item.meta.countries.length > 0) score += 5;
  } else if (type === 'blog') {
    if (item.meta?.tags && item.meta.tags.length > 0) score += 5;
    if (item.meta?.category) score += 5;
  }
  
  return Math.min(100, score);
};

const convertToAuditItem = (item: any, type: 'film' | 'series' | 'blog', baseUrl: string): ContentAuditItem => {
  const content = item.content || '';
  const wordCount = content.split(/\s+/).length;
  const qualityScore = calculateQualityScore(item, type);
  
  // Use correct URL paths - films should be plural
  const urlPath = type === 'film' ? 'films' : type;
  
  return {
    id: `${type}-${item.meta.slug}`,
    title: item.meta.title,
    slug: item.meta.slug,
    type,
    url: `${baseUrl}/${urlPath}/${item.meta.slug}`,
    description: item.meta.description || item.meta.overview,
    wordCount,
    qualityScore,
    lastModified: item.meta.dateModified || item.meta.datePublished || new Date().toISOString(),
    hasImages: content.includes('<img') || content.includes('![') || !!item.meta?.posterImage,
    hasVideo: content.includes('<video') || content.includes('youtube') || content.includes('vimeo'),
    internalLinks: (content.match(/\[.*?\]\(\/.*?\)/g) || []).length,
    externalLinks: (content.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length,
    metaDescription: item.meta.description,
    genres: item.meta?.genres,
    countries: item.meta?.countries,
    categories: item.meta?.categories,
    tags: item.meta?.tags,
  };
};

// URL validation helper (from bulk-data.ts)
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

// Bulk GSC data fetching function (replicated from bulk-data.ts)
const getBulkGSCData = async (urls: string[]) => {
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
    return { success: false, data: {}, skippedUrls };
  }

  console.log(`Processing ${validUrls.length} valid URLs (skipped ${skippedUrls.length} invalid URLs)`);

  // Get GSC configuration
  const config = getGSCConfig();

  // Set default date range (last 90 days)
  const defaultStartDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEndDate = new Date().toISOString().split('T')[0];

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

  console.log(`Completed GSC data fetch: ${validUrls.length} URLs processed, ${indexedCount} indexed, ${totalImpressions} total impressions`);

  return {
    success: true,
    data: combinedData,
    skippedUrls
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { format = 'json', quality, type, exportAll = false, includeGSC = false } = req.query;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

    // Get all content
    const [films, series, blogPosts] = await Promise.all([
      getAllFilms(),
      getAllSeries(),
      getAllBlogPosts()
    ]);

    // Convert to audit format
    const filmItems = films.map(film => convertToAuditItem(film, 'film', baseUrl));
    const seriesItems = series.map(s => convertToAuditItem(s, 'series', baseUrl));
    const blogItems = blogPosts.map(post => convertToAuditItem(post, 'blog', baseUrl));
    
    let allContent = [...filmItems, ...seriesItems, ...blogItems];

    // Get GSC data if requested (for CSV exports, always include)
    if (format === 'csv' || includeGSC === 'true') {
      console.log('Fetching GSC data for content audit export...');
      try {
        // Use the same bulk data logic directly (no HTTP call)
        const bulkDataResult = await getBulkGSCData(allContent.map(item => item.url));
        
        console.log('Bulk data result:', {
          success: bulkDataResult.success,
          dataKeys: bulkDataResult.data ? Object.keys(bulkDataResult.data).length : 0,
          sampleData: bulkDataResult.data ? Object.entries(bulkDataResult.data).slice(0, 3) : []
        });
        
        if (bulkDataResult.success && bulkDataResult.data) {
          // Count items before and after
          let itemsWithData = 0;
          let totalImpressions = 0;
          
          // Add GSC data to content items
          allContent.forEach(item => {
            const gscData = bulkDataResult.data[item.url];
            if (gscData) {
              item.isIndexed = gscData.isIndexed;
              item.impressions = gscData.impressions;
              item.clicks = gscData.clicks;
              item.ctr = gscData.ctr;
              item.position = gscData.position;
              
              if (gscData.impressions > 0) {
                itemsWithData++;
                totalImpressions += gscData.impressions;
              }
            } else {
              item.isIndexed = false;
              item.impressions = 0;
              item.clicks = 0;
              item.ctr = 0;
              item.position = 0;
            }
          });
          
          console.log(`GSC data added to ${allContent.length} content items: ${itemsWithData} items have impressions, ${totalImpressions} total impressions`);
        } else {
          throw new Error(`Bulk data function failed: ${bulkDataResult.success ? 'No data returned' : 'Function returned false'}`);
        }
      } catch (error) {
        console.error('Error fetching GSC data via direct function:', error);
        // Set default values if GSC fetch fails
        allContent.forEach(item => {
          item.isIndexed = false;
          item.impressions = 0;
          item.clicks = 0;
          item.ctr = 0;
          item.position = 0;
        });
      }
    }

    // Apply filters only if not exporting all
    if (!exportAll || exportAll === 'false') {
      if (type && type !== 'all') {
        allContent = allContent.filter(item => item.type === type);
      }

      if (quality) {
        switch (quality) {
          case 'excellent':
            allContent = allContent.filter(item => item.qualityScore >= 80);
            break;
          case 'good':
            allContent = allContent.filter(item => item.qualityScore >= 60 && item.qualityScore < 80);
            break;
          case 'fair':
            allContent = allContent.filter(item => item.qualityScore >= 40 && item.qualityScore < 60);
            break;
          case 'poor':
            allContent = allContent.filter(item => item.qualityScore < 40);
            break;
        }
      }
    }

    // Sort by quality score (highest first)
    allContent.sort((a, b) => b.qualityScore - a.qualityScore);

    // Generate statistics
    const stats = {
      total: allContent.length,
      avgQuality: Math.round(allContent.reduce((sum, item) => sum + item.qualityScore, 0) / allContent.length),
      byType: {
        films: allContent.filter(item => item.type === 'film').length,
        series: allContent.filter(item => item.type === 'series').length,
        blog: allContent.filter(item => item.type === 'blog').length,
      },
      byQuality: {
        excellent: allContent.filter(item => item.qualityScore >= 80).length,
        good: allContent.filter(item => item.qualityScore >= 60 && item.qualityScore < 80).length,
        fair: allContent.filter(item => item.qualityScore >= 40 && item.qualityScore < 60).length,
        poor: allContent.filter(item => item.qualityScore < 40).length,
      },
      lowQualityUrls: allContent
        .filter(item => item.qualityScore < 60)
        .map(item => item.url)
        .slice(0, 50), // Limit to 50 for performance
    };

    const response = {
      stats,
      content: allContent,
      generatedAt: new Date().toISOString(),
    };

    // Handle different output formats
    if (format === 'csv') {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = exportAll === 'true' ? `content-audit-full-${timestamp}.csv` : `content-audit-filtered-${timestamp}.csv`;
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Generate comprehensive CSV with all relevant data
      const headers = [
        'Type', 'Title', 'Slug', 'URL', 'Quality Score', 'Word Count', 
        'Has Images', 'Has Video', 'Internal Links', 'External Links',
        'Meta Description', 'Meta Description Length', 'Genres', 'Countries',
        'Categories', 'Tags', 'Last Modified', 'Content Preview',
        'Indexed', 'Impressions', 'Clicks', 'CTR', 'Position'
      ];
      
      const csvRows = [
        headers.join(','),
        ...allContent.map(item => [
          item.type,
          `"${item.title.replace(/"/g, '""')}"`,
          item.slug,
          item.url,
          item.qualityScore,
          item.wordCount,
          item.hasImages ? 'Yes' : 'No',
          item.hasVideo ? 'Yes' : 'No',
          item.internalLinks,
          item.externalLinks,
          `"${(item.metaDescription || '').replace(/"/g, '""')}"`,
          item.metaDescription?.length || 0,
          `"${(item.genres || []).join('; ')}"`,
          `"${(item.countries || []).join('; ')}"`,
          `"${(item.categories || []).join('; ')}"`,
          `"${(item.tags || []).join('; ')}"`,
          item.lastModified,
          `"${(item.description || '').substring(0, 200).replace(/"/g, '""')}${(item.description || '').length > 200 ? '...' : ''}"`,
          item.isIndexed ? 'Yes' : 'No',
          item.impressions || 0,
          item.clicks || 0,
          item.ctr || 0,
          item.position || 0
        ].join(','))
      ];
      
      return res.send('\uFEFF' + csvRows.join('\n')); // Add BOM for proper UTF-8 handling
    }

    if (format === 'urls') {
      // Return just URLs for GSC submission
      return res.json({
        urls: allContent.map(item => item.url),
        count: allContent.length,
        generatedAt: new Date().toISOString(),
      });
    }

    if (format === 'gsc-sitemap') {
      // Generate XML sitemap format for GSC submission
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allContent.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${item.qualityScore >= 80 ? '0.9' : item.qualityScore >= 60 ? '0.7' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename="sitemap-content.xml"');
      return res.send(sitemap);
    }

    // Default JSON response
    res.json(response);

  } catch (error) {
    console.error('Error generating content audit:', error);
    res.status(500).json({ error: 'Failed to generate content audit' });
  }
} 
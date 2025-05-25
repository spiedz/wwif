import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Content, FilmMeta, BlogMeta } from '../../types/content';
import { TVSeries } from '../../types/series';
import { getAllFilms, getAllSeries, getAllBlogPosts } from '../../lib/server/serverMarkdown';

// Type alias for blog posts
type BlogPost = Content<BlogMeta>;

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: 'film' | 'series' | 'blog';
  description?: string;
  wordCount: number;
  qualityScore: number;
  lastModified: string;
  hasImages: boolean;
  hasVideo: boolean;
  internalLinks: number;
  externalLinks: number;
  metaDescription?: string;
  isIndexed?: boolean; // This would come from GSC API
  searchImpressions?: number;
  searchClicks?: number;
  avgPosition?: number;
  url?: string;
}

interface GSCData {
  [url: string]: {
    isIndexed: boolean;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  };
}

interface ContentAuditProps {
  films: Content<FilmMeta>[];
  series: TVSeries[];
  blogPosts: BlogPost[];
}

// Content quality scoring algorithm
const calculateQualityScore = (item: any, type: string): number => {
  let score = 0;
  
  // Title quality (0-20 points)
  if (item.title && item.title.length > 0) {
    score += item.title.length >= 10 && item.title.length <= 60 ? 20 : 10;
  }
  
  // Description quality (0-20 points)
  if (item.description) {
    score += item.description.length >= 120 && item.description.length <= 160 ? 20 : 10;
  }
  
  // Content length (0-25 points)
  const wordCount = item.content ? item.content.split(' ').length : 0;
  if (wordCount > 1000) score += 25;
  else if (wordCount > 500) score += 20;
  else if (wordCount > 300) score += 15;
  else if (wordCount > 100) score += 10;
  
  // Media presence (0-15 points)
  if (item.meta?.posterImage || item.posterImage) score += 10;
  if (item.meta?.coordinates && item.meta.coordinates.length > 0) score += 5;
  
  // SEO elements (0-20 points)
  if (item.meta?.genre && item.meta.genre.length > 0) score += 5;
  if (item.meta?.director || item.meta?.author) score += 5;
  if (item.meta?.year || item.meta?.date) score += 5;
  if (item.slug && item.slug.length > 0) score += 5;
  
  return Math.min(Math.round(score), 100);
};

const convertToContentItem = (item: any, type: 'film' | 'series' | 'blog'): ContentItem | null => {
  // Debug: Log the first few items to see the data structure
  if (Math.random() < 0.02) { // Log roughly 2% of items to avoid spam
    console.log(`Sample ${type} item structure:`, {
      title: item.title,
      slug: item.slug,
      meta_title: item.meta?.title,
      meta_slug: item.meta?.slug,
      filename: item.filename,
      fullItem: Object.keys(item)
    });
  }

  // Get data from the correct structure - data is in meta object
  const slug = item.meta?.slug || item.slug;
  const title = item.meta?.title || item.title;
  const description = item.meta?.description || item.description;
  const posterImage = item.meta?.posterImage || item.posterImage;
  const coordinates = item.meta?.coordinates || [];
  const director = item.meta?.director;
  const author = item.meta?.author;
  const year = item.meta?.year;
  const date = item.meta?.date;
  const genre = item.meta?.genre || item.meta?.genres;
  const trailer = item.meta?.trailer;

  // Generate slug from filename or title if missing
  let finalSlug = slug;
  if (!finalSlug || finalSlug === 'undefined') {
    // Try to extract slug from filename
    if (item.filename) {
      finalSlug = item.filename.replace(/\.(md|mdx)$/, '');
    } else if (title) {
      // Generate slug from title
      finalSlug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    } else {
      // Last resort: use a generated ID
      finalSlug = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    console.warn(`Generated slug for ${type}:`, {
      originalSlug: slug,
      generatedSlug: finalSlug,
      fromFilename: item.filename,
      fromTitle: title || 'No title'
    });
  }

  const wordCount = item.content ? item.content.split(' ').length : 0;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  
  return {
    id: `${type}-${finalSlug}`,
    title: title || 'Untitled',
    slug: finalSlug,
    type,
    description: description,
    wordCount,
    qualityScore: calculateQualityScore({
      title,
      description,
      content: item.content,
      meta: {
        posterImage,
        coordinates,
        genre: genre || [],
        director,
        author,
        year,
        date
      }
    }, type),
    lastModified: date || new Date().toISOString(),
    hasImages: !!posterImage,
    hasVideo: !!trailer,
    internalLinks: 0, // Could be calculated from content
    externalLinks: 0, // Could be calculated from content
    metaDescription: description,
    url: `${baseUrl}/${type === 'film' ? 'films' : type === 'series' ? 'series' : 'blog'}/${finalSlug}`,
    isIndexed: false, // Will be populated from GSC
    searchImpressions: 0,
    searchClicks: 0,
    avgPosition: 0
  };
};

const QualityBadge: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${getColor(score)}`}>
      {score}/100 - {getLabel(score)}
    </span>
  );
};

const IndexedBadge: React.FC<{ isIndexed?: boolean; isLoading?: boolean }> = ({ isIndexed, isLoading }) => {
  if (isLoading) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
        Checking...
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isIndexed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isIndexed ? '✅ Indexed' : '❌ Not Indexed'}
    </span>
  );
};

const SearchPerformanceDisplay: React.FC<{ 
  impressions?: number; 
  clicks?: number; 
  position?: number; 
  isLoading?: boolean 
}> = ({ impressions, clicks, position, isLoading }) => {
  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!impressions && !clicks && !position) {
    return <div className="text-sm text-gray-400">No data</div>;
  }

  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between">
        <span className="text-gray-600">Impressions:</span>
        <span className="font-medium">{impressions?.toLocaleString() || 0}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Clicks:</span>
        <span className="font-medium">{clicks?.toLocaleString() || 0}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Avg Position:</span>
        <span className="font-medium">{position ? position.toFixed(1) : '-'}</span>
      </div>
    </div>
  );
};

// Password protection component
const PasswordProtection = ({ onUnlock }: { onUnlock: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'mikemike') {
      localStorage.setItem('content-audit-auth', 'true');
      onUnlock();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Protected Area
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter password to access Content Audit Dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              placeholder="Enter password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Access Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ContentAudit({ films, series, blogPosts }: ContentAuditProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // All other state hooks - moved to top
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'film' | 'series' | 'blog'>('all');
  const [filterQuality, setFilterQuality] = useState<'all' | 'excellent' | 'good' | 'fair' | 'poor'>('all');
  const [filterIndexed, setFilterIndexed] = useState<'all' | 'indexed' | 'not-indexed'>('all');
  const [sortBy, setSortBy] = useState<'quality' | 'title' | 'wordCount' | 'lastModified' | 'impressions' | 'clicks' | 'position'>('quality');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  // GSC integration state
  const [gscConnected, setGscConnected] = useState(false);
  const [loadingGSCData, setLoadingGSCData] = useState(false);
  const [gscData, setGscData] = useState<Record<string, any>>({});
  const [gscError, setGscError] = useState<string | null>(null);

  // Indexing request functions
  const [isRequestingIndexing, setIsRequestingIndexing] = useState(false);
  const [indexingResults, setIndexingResults] = useState<any>(null);

  // Convert all content to unified format - moved to top
  const allContent = useMemo(() => {
    console.log('Processing content data:', {
      films: films.length,
      series: series.length, 
      blogPosts: blogPosts.length
    });

    const filmItems = films.map(film => convertToContentItem(film, 'film')).filter(Boolean) as ContentItem[];
    const seriesItems = series.map(s => convertToContentItem(s, 'series')).filter(Boolean) as ContentItem[];
    const blogItems = blogPosts.map(post => convertToContentItem(post, 'blog')).filter(Boolean) as ContentItem[];
    
    console.log('Processed content items:', {
      filmItems: filmItems.length,
      seriesItems: seriesItems.length,
      blogItems: blogItems.length,
      total: filmItems.length + seriesItems.length + blogItems.length
    });

    return [...filmItems, ...seriesItems, ...blogItems];
  }, [films, series, blogPosts]);

  // Enhanced content with GSC data - moved to top
  const enhancedContent = useMemo(() => {
    return allContent.map(item => {
      const url = item.url;
      const urlData = url && typeof url === 'string' ? gscData[url] : null;
      
      return {
        ...item,
        isIndexed: urlData ? urlData.isIndexed : false,
        searchImpressions: urlData ? urlData.impressions : 0,
        searchClicks: urlData ? urlData.clicks : 0,
        avgPosition: urlData ? urlData.position : 0
      };
    });
  }, [allContent, gscData]);

  // Filter and sort content - moved to top
  const filteredContent = useMemo(() => {
    let filtered = enhancedContent.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;
      
      // Quality filter
      if (filterQuality === 'excellent' && item.qualityScore < 80) return false;
      if (filterQuality === 'good' && (item.qualityScore < 60 || item.qualityScore >= 80)) return false;
      if (filterQuality === 'fair' && (item.qualityScore < 40 || item.qualityScore >= 60)) return false;
      if (filterQuality === 'poor' && item.qualityScore >= 40) return false;
      
      // Indexed filter
      if (filterIndexed === 'indexed' && !item.isIndexed) return false;
      if (filterIndexed === 'not-indexed' && item.isIndexed) return false;
      
      // Search filter
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.slug.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'quality':
          comparison = a.qualityScore - b.qualityScore;
          break;
        case 'wordCount':
          comparison = a.wordCount - b.wordCount;
          break;
        case 'lastModified':
          comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
          break;
        case 'impressions':
          comparison = (a.searchImpressions || 0) - (b.searchImpressions || 0);
          break;
        case 'clicks':
          comparison = (a.searchClicks || 0) - (b.searchClicks || 0);
          break;
        case 'position':
          comparison = (a.avgPosition || 0) - (b.avgPosition || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [enhancedContent, sortBy, sortOrder, filterType, filterQuality, filterIndexed, searchTerm]);

  // Pagination - moved to top
  const paginatedContent = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredContent.slice(start, end);
  }, [filteredContent, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  // Statistics - moved to top
  const stats = useMemo(() => {
    const total = enhancedContent.length;
    const avgQuality = enhancedContent.reduce((sum, item) => sum + item.qualityScore, 0) / total;
    const indexed = enhancedContent.filter(item => item.isIndexed).length;
    const indexedPercentage = Math.round((indexed / total) * 100);
    const needsImprovement = enhancedContent.filter(item => item.qualityScore < 60).length;
    const improvementPercentage = Math.round((needsImprovement / total) * 100);
    const totalImpressions = enhancedContent.reduce((sum, item) => sum + (item.searchImpressions || 0), 0);
    const totalClicks = enhancedContent.reduce((sum, item) => sum + (item.searchClicks || 0), 0);
    
    return {
      total,
      avgQuality: Math.round(avgQuality),
      indexed,
      indexedPercentage,
      needsImprovement,
      improvementPercentage,
      totalImpressions,
      totalClicks
    };
  }, [enhancedContent]);

  // Function definitions - moved before useEffect
  const testGSCConnection = async () => {
    setLoadingGSCData(true);
    setGscError(null);
    
    try {
      const response = await fetch('/api/gsc/test');
      const data = await response.json();
      
      if (data.success) {
        setGscConnected(true);
        setGscError(null);
        // Auto-load data after successful connection
        loadAllGSCData();
      } else {
        setGscConnected(false);
        setGscError(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('GSC connection test failed:', error);
      setGscConnected(false);
      setGscError('Failed to test GSC connection');
    } finally {
      setLoadingGSCData(false);
    }
  };

  const loadAllGSCData = async () => {
    if (!gscConnected || loadingGSCData) return;
    
    setLoadingGSCData(true);
    try {
      const urls = allContent.map(item => item.url).filter(Boolean) as string[];
      
      console.log(`Loading GSC data for ${urls.length} URLs...`);
      
      // Use the new bulk-data endpoint for better performance
      const response = await fetch('/api/gsc/bulk-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          urls,
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days ago
          endDate: new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();

      if (data.success && data.data) {
        setGscData(data.data);
        
        // Log summary for debugging
        if (data.summary) {
          console.log('GSC Data Summary:', {
            totalUrls: data.summary.totalUrls,
            validUrls: data.summary.validUrls,
            invalidUrls: data.summary.invalidUrls,
            indexedCount: data.summary.indexedCount,
            totalImpressions: data.summary.totalImpressions.toLocaleString(),
            totalClicks: data.summary.totalClicks.toLocaleString()
          });
        }
        
        if (data.skippedUrls && data.skippedUrls.length > 0) {
          console.warn('Skipped invalid URLs:', data.skippedUrls);
        }
        
        setGscError(null);
      } else {
        console.error('Failed to load GSC data:', data.error);
        setGscError(data.error || 'Failed to load GSC data');
      }
    } catch (error) {
      console.error('Error loading GSC data:', error);
      setGscError('Failed to connect to GSC API');
    } finally {
      setLoadingGSCData(false);
    }
  };

  const handleExportCSV = (exportAll: boolean = false) => {
    const params = new URLSearchParams({
      format: 'csv',
      exportAll: exportAll.toString()
    });

    if (!exportAll) {
      if (filterType !== 'all') params.append('type', filterType);
      if (filterQuality !== 'all') params.append('quality', filterQuality);
    }

    window.open(`/api/content/audit?${params.toString()}`, '_blank');
  };

  const handleExportSitemap = () => {
    window.open('/api/content/audit?format=gsc-sitemap', '_blank');
  };

  const handleBulkGSCCheck = async () => {
    if (selectedItems.size === 0) {
      alert('Please select items to check');
      return;
    }

    setLoadingGSCData(true);
    try {
      const selectedUrls = paginatedContent
        .filter(item => selectedItems.has(item.id))
        .map(item => item.url)
        .filter(Boolean) as string[];

      const response = await fetch('/api/gsc/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: selectedUrls })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local GSC data
        const newGscData = { ...gscData };
        data.result.indexed.forEach((url: string) => {
          newGscData[url] = { ...gscData[url], isIndexed: true };
        });
        data.result.notIndexed.forEach((url: string) => {
          newGscData[url] = { ...gscData[url], isIndexed: false };
        });
        setGscData(newGscData);
        
        alert(`Indexing check complete!\nIndexed: ${data.result.indexed.length}\nNot Indexed: ${data.result.notIndexed.length}\nErrors: ${data.result.errors.length}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to check indexing status');
    } finally {
      setLoadingGSCData(false);
    }
  };

  const handleBulkPerformanceCheck = async () => {
    if (selectedItems.size === 0) {
      alert('Please select items to check');
      return;
    }

    setLoadingGSCData(true);
    try {
      const selectedUrls = paginatedContent
        .filter(item => selectedItems.has(item.id))
        .map(item => item.url)
        .filter(Boolean) as string[];

      const response = await fetch('/api/gsc/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: selectedUrls })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local GSC data with performance info
        const newGscData = { ...gscData };
        data.performance.forEach((item: any) => {
          newGscData[item.url] = {
            ...gscData[item.url],
            impressions: item.impressions,
            clicks: item.clicks,
            ctr: item.ctr,
            position: item.position
          };
        });
        setGscData(newGscData);
        
        alert(`Performance data retrieved!\nTotal Impressions: ${data.summary.totalImpressions.toLocaleString()}\nTotal Clicks: ${data.summary.totalClicks.toLocaleString()}\nAvg CTR: ${data.summary.avgCTR}%\nAvg Position: ${data.summary.avgPosition}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to get performance data');
    } finally {
      setLoadingGSCData(false);
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedContent.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedContent.map(item => item.id)));
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('content-audit-auth') === 'true';
      setIsAuthenticated(isAuth);
      setIsCheckingAuth(false);
    };
    
    // Small delay to avoid hydration mismatch
    setTimeout(checkAuth, 100);
  }, []);

  // Test GSC connection on component mount
  useEffect(() => {
    testGSCConnection();
  }, []);

  // Auto-refresh GSC data if enabled
  useEffect(() => {
    if (gscConnected) {
      const interval = setInterval(() => {
        loadAllGSCData();
      }, 300000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [gscConnected]);

  // Request indexing for selected or all content
  const requestIndexing = async (scope: 'selected' | 'all' | 'unindexed') => {
    setIsRequestingIndexing(true);
    setIndexingResults(null);
    
    try {
      let contentItems: Array<{slug: string, type: 'film' | 'series' | 'blog'}> = [];
      
      if (scope === 'selected') {
        contentItems = filteredContent
          .filter(item => selectedItems.has(item.id))
          .map(item => ({
            slug: item.slug,
            type: item.type
          }));
      } else if (scope === 'all') {
        contentItems = filteredContent.map(item => ({
          slug: item.slug,
          type: item.type
        }));
      } else if (scope === 'unindexed') {
        contentItems = filteredContent
          .filter(item => {
            if (!item.url) return false; // Skip items without URL
            const itemGscData = gscData[item.url];
            return !itemGscData?.isIndexed;
          })
          .map(item => ({
            slug: item.slug,
            type: item.type
          }));
      }
      
      if (contentItems.length === 0) {
        alert('No content items to index');
        return;
      }
      
      const response = await fetch('/api/indexing/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk',
          contentItems: contentItems
        })
      });
      
      const result = await response.json();
      setIndexingResults(result);
      
      if (result.success) {
        alert(`Successfully requested indexing for ${contentItems.length} items`);
      } else {
        alert(`Indexing request failed: ${result.error}`);
      }
      
    } catch (error: any) {
      console.error('Indexing request failed:', error);
      alert(`Indexing request failed: ${error.message}`);
    } finally {
      setIsRequestingIndexing(false);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <Head>
        <title>Content Audit Dashboard | Where Was It Filmed</title>
        <meta name="description" content="Comprehensive content audit and management dashboard for analyzing content quality, tracking indexing status, and managing bulk operations." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Content Audit Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Analyze content quality, track indexing status, and manage your content efficiently with real-time Google Search Console data.
          </p>
          
          {/* GSC Connection Status */}
          <div className="mt-4 p-4 rounded-lg border">
            {gscConnected === null ? (
              <div className="flex items-center text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Testing Google Search Console connection...
              </div>
            ) : gscConnected ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Google Search Console connected successfully
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={loadAllGSCData}
                      disabled={loadingGSCData}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loadingGSCData ? 'Loading...' : 'Refresh GSC Data'}
                    </button>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={gscConnected}
                        onChange={(e) => setGscConnected(e.target.checked)}
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-600">Auto-refresh</span>
                    </label>
                  </div>
                </div>
                {loadingGSCData && (
                  <div className="text-sm text-gray-600">
                    Loading indexing status and search performance data...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-orange-600">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Google Search Console not connected
                </div>
                {gscError && <div className="text-sm text-gray-600">Error: {gscError}</div>}
                <div className="text-sm text-gray-600 mt-1">
                  Set up GSC integration to get real indexing data and search performance metrics.
                  <Link href="/GSC-SETUP-GUIDE.md" className="text-blue-600 hover:underline ml-1">
                    View setup guide
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Quality</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.avgQuality}/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Indexed Content</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.indexedPercentage}%</p>
                <p className="text-xs text-gray-500">{stats.indexed} of {stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalImpressions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Last 90 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Last 90 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Controls & GSC Tools */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">CSV Exports</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleExportCSV(false)}
                  className="block w-full px-4 py-2 text-left bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
                >
                  Export Filtered Results
                </button>
                <button
                  onClick={() => handleExportCSV(true)}
                  className="block w-full px-4 py-2 text-left bg-green-50 text-green-700 rounded hover:bg-green-100 text-sm font-medium"
                >
                  Export ALL Content ({stats.total.toLocaleString()} items)
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">GSC Tools</h4>
              <div className="space-y-2">
                <button
                  onClick={testGSCConnection}
                  className="block w-full px-4 py-2 text-left bg-purple-50 text-purple-700 rounded hover:bg-purple-100 text-sm"
                >
                  Test GSC Connection
                </button>
                <button
                  onClick={handleExportSitemap}
                  className="block w-full px-4 py-2 text-left bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 text-sm"
                >
                  Download Sitemap XML
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Bulk GSC Operations</h4>
              <div className="space-y-2">
                <button
                  onClick={handleBulkGSCCheck}
                  disabled={!gscConnected || loadingGSCData || selectedItems.size === 0}
                  className="block w-full px-4 py-2 text-left bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingGSCData ? 'Checking...' : 'Check Indexing Status'}
                </button>
                <button
                  onClick={handleBulkPerformanceCheck}
                  disabled={!gscConnected || loadingGSCData || selectedItems.size === 0}
                  className="block w-full px-4 py-2 text-left bg-orange-50 text-orange-700 rounded hover:bg-orange-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingGSCData ? 'Loading...' : 'Get Performance Data'}
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => window.open('/api/content/audit?format=urls', '_blank')}
                  className="block w-full px-4 py-2 text-left bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm"
                >
                  Export URL List
                </button>
                <button
                  onClick={() => setFilterQuality('poor')}
                  className="block w-full px-4 py-2 text-left bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm"
                >
                  Show Low Quality (&lt;40)
                </button>
              </div>
            </div>
          </div>
          
          {selectedItems.size > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected. 
                {!gscConnected && ' Connect GSC to enable bulk operations.'}
              </p>
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search titles or slugs..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'film' | 'series' | 'blog')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Types</option>
                <option value="film">Films</option>
                <option value="series">TV Series</option>
                <option value="blog">Blog Posts</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value={filterQuality}
                onChange={(e) => setFilterQuality(e.target.value as 'all' | 'excellent' | 'good' | 'fair' | 'poor')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Quality</option>
                <option value="excellent">Excellent (80+)</option>
                <option value="good">Good (60-79)</option>
                <option value="fair">Fair (40-59)</option>
                <option value="poor">Poor (&lt;40)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Indexing Status</label>
              <select
                value={filterIndexed}
                onChange={(e) => setFilterIndexed(e.target.value as 'all' | 'indexed' | 'not-indexed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Status</option>
                <option value="indexed">Indexed</option>
                <option value="not-indexed">Not Indexed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'quality' | 'title' | 'wordCount' | 'lastModified' | 'impressions' | 'clicks' | 'position')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="quality">Quality Score</option>
                <option value="title">Title</option>
                <option value="type">Type</option>
                <option value="wordCount">Word Count</option>
                <option value="lastModified">Last Modified</option>
                <option value="impressions">Impressions</option>
                <option value="clicks">Clicks</option>
                <option value="position">Avg Position</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {paginatedContent.length} of {filteredContent.length} items
              {filteredContent.length !== allContent.length && ` (filtered from ${allContent.length} total)`}
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                {selectedItems.size === paginatedContent.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === paginatedContent.length && paginatedContent.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indexing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Search Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.type === 'film' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'series' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/${item.type === 'film' ? 'films' : item.type === 'series' ? 'series' : 'blog'}/${item.slug}`} className="hover:text-primary">
                              {item.title}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">
                            /{item.slug} • {item.wordCount} words
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-md truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <QualityBadge score={item.qualityScore} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <IndexedBadge 
                        isIndexed={item.isIndexed} 
                        isLoading={loadingGSCData && !gscData[item.url || '']} 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <SearchPerformanceDisplay
                        impressions={item.searchImpressions}
                        clicks={item.searchClicks}
                        position={item.avgPosition}
                        isLoading={loadingGSCData && !gscData[item.url || '']}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/${item.type === 'film' ? 'films' : item.type === 'series' ? 'series' : 'blog'}/${item.slug}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        {item.url && (
                          <button
                            onClick={() => window.open(item.url, '_blank')}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Open
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredContent.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredContent.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Operations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bulk Operations</h2>
          <div className="space-y-4">
            {/* Export Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Export Data</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleExportCSV(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  Export ALL Content ({stats.total.toLocaleString()} items)
                </button>
                <button
                  onClick={() => handleExportCSV(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  Export Filtered Results
                </button>
              </div>
            </div>

            {/* Indexing Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Request Google Indexing</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => requestIndexing('unindexed')}
                  disabled={isRequestingIndexing}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  {isRequestingIndexing ? 'Requesting...' : 'Index Unindexed Content'}
                </button>
                <button
                  onClick={() => requestIndexing('selected')}
                  disabled={isRequestingIndexing || selectedItems.size === 0}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 text-sm"
                >
                  {isRequestingIndexing ? 'Requesting...' : `Index Selected (${selectedItems.size})`}
                </button>
                <button
                  onClick={() => requestIndexing('all')}
                  disabled={isRequestingIndexing}
                  className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50 text-sm"
                >
                  {isRequestingIndexing ? 'Requesting...' : 'Index All Content'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Automatically notify Google to crawl and index your content faster
              </p>
            </div>

            {/* GSC Data Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Google Search Console</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleBulkGSCCheck}
                  disabled={!gscConnected || loadingGSCData || selectedItems.size === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  {loadingGSCData ? 'Checking...' : 'Check Indexing Status'}
                </button>
                <button
                  onClick={handleBulkPerformanceCheck}
                  disabled={!gscConnected || loadingGSCData || selectedItems.size === 0}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 text-sm"
                >
                  {loadingGSCData ? 'Loading...' : 'Refresh Performance Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Load only essential data to stay under 128KB limit
  const [films, series, blogPosts] = await Promise.all([
    getAllFilms(),
    getAllSeries(), 
    getAllBlogPosts()
  ]);

  // Reduce data size by removing large content fields and keeping only essential metadata
  const optimizedFilms = films.map(film => ({
    meta: {
      title: film.meta.title,
      slug: film.meta.slug,
      description: film.meta.description,
      year: film.meta.year,
      director: film.meta.director,
      posterImage: film.meta.posterImage,
      genre: film.meta.genre,
      coordinates: film.meta.coordinates?.length || 0, // Just count, not full array
    },
    content: film.content ? film.content.substring(0, 500) + '...' : '', // Truncate content
  }));

  const optimizedSeries = series.map(show => ({
    meta: {
      title: show.meta.title,
      slug: show.meta.slug,
      description: show.meta.description,
      creator: show.meta.creator,
      posterImage: show.meta.posterImage,
      genres: show.meta.genres,
      seasons: show.seasons?.length || 0, // Just count
    },
    content: show.content ? show.content.substring(0, 500) + '...' : '',
  }));

  const optimizedBlogPosts = blogPosts.map(post => ({
    meta: {
      title: post.meta.title,
      slug: post.meta.slug,
      description: post.meta.description,
      author: post.meta.author,
      date: post.meta.date,
      tags: post.meta.tags,
    },
    content: post.content ? post.content.substring(0, 500) + '...' : '',
  }));

  return {
    props: {
      films: optimizedFilms,
      series: optimizedSeries,
      blogPosts: optimizedBlogPosts,
    },
    revalidate: 3600, // Regenerate every hour
  };
}; 
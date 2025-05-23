/**
 * Canonical URL utilities for SEO optimization
 * Handles duplicate content prevention and URL normalization
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

/**
 * Parameters that should be preserved in canonical URLs
 * These are meaningful for content differentiation
 */
const PRESERVE_PARAMS = new Set([
  'page',     // Pagination
  'category', // Content filtering
  'genre',    // Genre filtering
  'year',     // Year filtering
  'country',  // Location filtering
]);

/**
 * Parameters that should be removed from canonical URLs
 * These are tracking/session parameters that create duplicate content
 */
const REMOVE_PARAMS = new Set([
  'utm_source',
  'utm_medium', 
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'ref',
  'source',
  'campaign',
  'medium',
  'content',
  'term',
  'sort',      // Sorting doesn't change content semantically
  'order',     // Order doesn't change content semantically
  'view',      // View mode doesn't change content
  'display',   // Display mode doesn't change content
  'search',    // Search queries create infinite variations
  'q',         // Search queries
  'filter',    // Dynamic filters create too many variations
]);

/**
 * Clean and normalize a URL path for canonical use
 */
export function cleanUrlPath(path: string): string {
  // Remove trailing slashes except for root
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  return path;
}

/**
 * Generate a canonical URL from the current router path
 * Removes tracking parameters and normalizes the URL
 */
export function generateCanonicalUrl(asPath: string): string {
  try {
    // Split path and query string
    const [pathname, queryString] = asPath.split('?');
    
    // Clean the pathname
    const cleanPath = cleanUrlPath(pathname);
    
    // If no query string, return clean path
    if (!queryString) {
      return `${BASE_URL}${cleanPath}`;
    }
    
    // Parse query parameters
    const params = new URLSearchParams(queryString);
    const preservedParams = new URLSearchParams();
    
    // Only preserve meaningful parameters
    for (const [key, value] of params.entries()) {
      if (PRESERVE_PARAMS.has(key) && !REMOVE_PARAMS.has(key)) {
        preservedParams.set(key, value);
      }
    }
    
    // Build final URL
    const finalQuery = preservedParams.toString();
    const finalPath = finalQuery ? `${cleanPath}?${finalQuery}` : cleanPath;
    
    return `${BASE_URL}${finalPath}`;
    
  } catch (error) {
    console.error('Error generating canonical URL:', error);
    // Fallback to simple path cleaning
    const cleanPath = cleanUrlPath(asPath.split('?')[0]);
    return `${BASE_URL}${cleanPath}`;
  }
}

/**
 * Generate canonical URL for paginated content
 * Handles pagination properly for SEO
 */
export function generatePaginatedCanonicalUrl(
  basePath: string, 
  currentPage: number = 1
): string {
  const cleanPath = cleanUrlPath(basePath);
  
  // For page 1, use the base path without page parameter
  if (currentPage <= 1) {
    return `${BASE_URL}${cleanPath}`;
  }
  
  // For other pages, include the page parameter
  return `${BASE_URL}${cleanPath}?page=${currentPage}`;
}

/**
 * Generate canonical URL for filtered content
 * Handles category/genre/location filtering
 */
export function generateFilteredCanonicalUrl(
  basePath: string,
  filters: Record<string, string | number>
): string {
  const cleanPath = cleanUrlPath(basePath);
  const params = new URLSearchParams();
  
  // Add meaningful filters only
  Object.entries(filters).forEach(([key, value]) => {
    if (PRESERVE_PARAMS.has(key) && value) {
      params.set(key, String(value));
    }
  });
  
  const queryString = params.toString();
  const finalPath = queryString ? `${cleanPath}?${queryString}` : cleanPath;
  
  return `${BASE_URL}${finalPath}`;
}

/**
 * Check if two URLs are canonical duplicates
 * Useful for identifying potential duplicate content issues
 */
export function areCanonicalDuplicates(url1: string, url2: string): boolean {
  try {
    const canonical1 = generateCanonicalUrl(url1.replace(BASE_URL, ''));
    const canonical2 = generateCanonicalUrl(url2.replace(BASE_URL, ''));
    return canonical1 === canonical2;
  } catch (error) {
    console.error('Error comparing canonical URLs:', error);
    return false;
  }
}

/**
 * Get the canonical URL for the current page
 * This is the main function to use in components
 */
export function getCanonicalUrl(asPath: string): string {
  return generateCanonicalUrl(asPath);
}

/**
 * Validate that a URL is properly formatted for canonical use
 */
export function validateCanonicalUrl(url: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  try {
    const urlObj = new URL(url);
    
    // Check for common issues
    if (url !== url.toLowerCase()) {
      issues.push('URL contains uppercase characters');
      suggestions.push('Use lowercase URLs for consistency');
    }
    
    if (urlObj.pathname.endsWith('/') && urlObj.pathname !== '/') {
      issues.push('URL has trailing slash');
      suggestions.push('Remove trailing slashes except for root');
    }
    
    if (urlObj.search) {
      const params = new URLSearchParams(urlObj.search);
      for (const [key] of params.entries()) {
        if (REMOVE_PARAMS.has(key)) {
          issues.push(`Contains tracking parameter: ${key}`);
          suggestions.push(`Remove tracking parameter: ${key}`);
        }
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
    
  } catch (error) {
    return {
      isValid: false,
      issues: ['Invalid URL format'],
      suggestions: ['Ensure URL is properly formatted']
    };
  }
} 
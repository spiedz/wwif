import { getFilmPageKeywords, getLocationPageKeywords, getFranchisePageKeywords } from './seoKeywords';

/**
 * Format a page title with the site name
 */
export function formatPageTitle(title: string): string {
  return `${title} | Where Was It Filmed`;
}

/**
 * Convert a pathname to a breadcrumb-friendly title
 */
export function pathToTitle(path: string): string {
  if (!path || path === '/') return 'Home';
  
  const segment = path.split('/').pop() || '';
  const withoutSlug = segment.split('-').join(' ');
  
  return withoutSlug.charAt(0).toUpperCase() + withoutSlug.slice(1);
}

/**
 * Generate canonical URL for SEO
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  return `${baseUrl}${path}`;
}

/**
 * Generate a meta description based on location information
 */
export function getLocationMetaDescription(locationName: string, mediaCount: number): string {
  // Get keyword-optimized template
  const keywords = getLocationPageKeywords(locationName).primary;
  const primaryKeyword = keywords[0].value;
  
  // Template with keyword optimization
  return `Discover ${mediaCount} films and TV series filmed at ${locationName}. Explore ${primaryKeyword}, get travel tips, and plan your visit.`;
}

/**
 * Generate a meta description for a film page
 */
export function getFilmMetaDescription(filmTitle: string, year: string, locations: string[]): string {
  // Get keyword-optimized data
  const keywords = getFilmPageKeywords(filmTitle).primary;
  const primaryKeyword = keywords[0].value;
  
  // Use the location count or the first few location names
  const locationText = locations.length > 3 
    ? `${locations.length} real-world locations`
    : locations.slice(0, 3).join(', ');
  
  // Template with keyword optimization
  return `${primaryKeyword}? Discover the real locations from ${filmTitle} (${year}) including ${locationText}. Interactive maps and visitor information.`;
}

/**
 * Generate a meta description for a franchise page
 */
export function getFranchiseMetaDescription(franchiseName: string, filmCount: number, locationCount: number): string {
  // Get keyword-optimized data
  const keywords = getFranchisePageKeywords(franchiseName).primary;
  const primaryKeyword = keywords[0].value;
  
  // Template with keyword optimization
  return `Complete guide to ${primaryKeyword}. Discover all ${locationCount} real-world locations from ${filmCount} films in the ${franchiseName} series with maps and visitor tips.`;
}

/**
 * Truncate text to specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate optimized keywords meta tag content
 */
export function getKeywordsMetaContent(type: 'film' | 'location' | 'franchise', name: string): string {
  let keywords: string[] = [];
  
  switch (type) {
    case 'film':
      const filmKeywords = getFilmPageKeywords(name);
      keywords = [
        ...filmKeywords.primary.map(k => k.value),
        ...filmKeywords.secondary.filter(k => k.priority === 'high').map(k => k.value)
      ];
      break;
    case 'location':
      const locationKeywords = getLocationPageKeywords(name);
      keywords = [
        ...locationKeywords.primary.map(k => k.value),
        ...locationKeywords.secondary.filter(k => k.priority === 'high').map(k => k.value)
      ];
      break;
    case 'franchise':
      const franchiseKeywords = getFranchisePageKeywords(name);
      keywords = [
        ...franchiseKeywords.primary.map(k => k.value),
        ...franchiseKeywords.secondary.filter(k => k.priority === 'high').map(k => k.value)
      ];
      break;
  }
  
  // Return comma-separated keywords
  return keywords.join(', ');
} 
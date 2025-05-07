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
  return `Discover ${mediaCount} films and TV series filmed at ${locationName}. Explore film locations, get travel tips, and plan your visit.`;
}

/**
 * Truncate text to specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
} 
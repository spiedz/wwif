/**
 * Shared interfaces for blog components
 */

/**
 * Author interface for consistent author information across components
 */
export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  socialLinks?: SocialLink[];
}

/**
 * Social link interface for author profiles
 */
export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

/**
 * Related post interface for consistent post references
 */
export interface RelatedPost {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  featuredImage?: string;
  categories?: string[];
  excerpt?: string;
  author?: string | Author;
}

/**
 * Table of contents item interface
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Location marker interface for maps
 */
export interface MapMarker {
  title: string;
  lat: number;
  lng: number;
  description?: string;
  image?: string;
}

/**
 * Image gallery item interface
 */
export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
} 
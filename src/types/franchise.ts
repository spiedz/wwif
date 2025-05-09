/**
 * Type definitions for the Franchise Template System
 */

/**
 * Main franchise data interface
 */
export interface FranchiseData {
  slug: string;
  title: string;
  description: string;
  bannerImage: string;
  logoImage?: string;
  overview: string;
  films: FranchiseFilm[];
  mapLocations: Location[];
  travelGuides?: TravelGuide[];
  galleryImages?: GalleryImage[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/**
 * Film within a franchise
 */
export interface FranchiseFilm {
  id: string;
  title: string;
  slug: string;
  year: number;
  posterImage: string;
  description: string;
  locationCount?: number; // Optional count of filming locations
}

/**
 * Location within a franchise
 */
export interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  filmSlugs: string[]; // References to films shot at this location
  address?: string;
  isVisitable?: boolean;
  visitInfo?: string;
}

/**
 * Travel guide recommendation
 */
export interface TravelGuide {
  title: string;
  description: string;
  link: string;
  image?: string;
  type?: 'tour' | 'accommodation' | 'transportation' | 'general';
}

/**
 * Gallery image for franchise
 */
export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  filmSlug?: string;
  width?: number;
  height?: number;
  isHero?: boolean;
}

/**
 * Frontmatter structure for franchise markdown files
 */
export interface FranchiseFrontmatter {
  slug: string;
  title: string;
  description: string;
  bannerImage: string;
  logoImage?: string;
  films: {
    id: string;
    title: string;
    slug: string;
    year: number;
    posterImage: string;
    description: string;
  }[];
  mapLocations: {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    filmSlugs: string[];
    address?: string;
    isVisitable?: boolean;
    visitInfo?: string;
  }[];
  travelGuides?: {
    title: string;
    description: string;
    link: string;
    image?: string;
    type?: 'tour' | 'accommodation' | 'transportation' | 'general';
  }[];
  galleryImages?: {
    src: string;
    alt: string;
    caption?: string;
    filmSlug?: string;
    width?: number;
    height?: number;
    isHero?: boolean;
  }[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
} 
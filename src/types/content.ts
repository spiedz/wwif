export interface Coordinates {
  lat: number;
  lng: number;
  name?: string;
  description?: string;
  image?: string;
}

// Interface for a location within a region
export interface FilmLocation {
  name: string;
  description: string;
  coordinates: Coordinates;
  image?: string;
}

// Interface for a geographical region containing multiple locations
export interface FilmRegion {
  name: string;
  description: string;
  image?: string;
  locations: FilmLocation[];
}

// Interface for travel tips
export interface TravelTip {
  text: string;
  icon?: string;
}

// Interface for film trivia
export interface FilmTrivia {
  text: string;
  icon?: string;
}

// Interface for behind the scenes data
export interface BehindTheScenes {
  intro: string;
  facts?: string[];
}

export interface ContentMeta {
  title: string;
  description?: string;
  slug: string;
  date?: string;
}

export interface StreamingService {
  name: string;
  url: string;
  logo?: string;
}

export interface BookingOption {
  name: string;
  url: string;
  type: 'booking' | 'tour';
  price?: string;
  discount?: string;
  isPartner?: boolean;
  logo?: string;
}

export interface Coordinate {
  lat: number;
  lng: number;
  name: string;
  description?: string;
  image?: string;
}

export interface FilmMeta extends ContentMeta {
  year: number;
  director: string;
  genre: string | string[];
  posterImage?: string;
  coordinates?: Coordinate[];
}

export interface BlogMeta extends ContentMeta {
  author: string;
  featuredImage?: string;
  tags?: string[];
}

export interface SearchResult {
  meta: FilmMeta;
  content?: string;
  html?: string;
}

export interface Content<T extends ContentMeta> {
  meta: T;
  content: string;
  html: string;
} 
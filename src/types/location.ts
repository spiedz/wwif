// Types for location-based content

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationMediaItem {
  type: 'film' | 'series' | 'blog' | 'tv';
  slug: string;
  title: string;
}

export interface LocationMeta {
  slug: string;
  name: string;
  metaTitle?: string;
  description: string;
  keywords?: string[];
  address: string;
  city: string;
  state?: string;
  country: string;
  coordinates: LocationCoordinates;
  image?: string;
  mediaItems: LocationMediaItem[];
  population?: number;
  timezone?: string;
  bestTimeToVisit?: string;
  travelTips?: string[];
  nearbyAttractions?: string[];
  localEvents?: string[];
}

export interface LocationContent {
  meta: LocationMeta;
  content: string;
  html: string;
}

export interface LocationListItem {
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  coordinates: LocationCoordinates;
  image?: string;
  filmCount: number;
  seriesCount: number;
} 
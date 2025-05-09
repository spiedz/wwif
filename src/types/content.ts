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

/**
 * Film metadata information.
 * Contains essential fields for displaying film details and optional properties
 * that may not be available for all films.
 */
export interface FilmMeta extends ContentMeta {
  title: string;
  description: string;
  director?: string;
  year?: string;
  genre?: string;
  coordinates?: [number, number][];
  location?: string | string[];
  posterImage?: string;
  featuredImage?: string;
  gallery?: string[];
  regions?: FilmRegion[];
  travelTips?: TravelTip[];
  trivia?: FilmTrivia[];
  useRegionLayout?: boolean;
  behindTheScenes?: string;
  streamingServices?: StreamingService[];
  bookingOptions?: BookingOption[];
  trailer?: VideoContent;
}

/**
 * Video content metadata for trailers and clips
 */
export interface VideoContent {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  embedUrl?: string;
  contentUrl?: string;
  duration?: string;
}

export interface BlogMeta extends ContentMeta {
  author: string;
  featuredImage?: string;
  tags?: string[];
  categories?: string[];
  content?: string;
  date?: string;
  estimatedReadingTime?: number;
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

// Define SeriesFilmingLocation interface
export interface SeriesFilmingLocation {
  name: string;
  description?: string;
  coordinates?: [number, number];
  address?: string;
  image?: string;
  realLocation?: string;
  travelTips?: string[];
  episodeNumbers?: number[];
  seasonNumbers?: number[];
}

// Update SeriesMeta to include seasons property
export interface SeriesMeta extends ContentMeta {
  title: string;
  description: string;
  network?: string;
  creator?: string;
  startYear?: string;
  endYear?: string;
  genre?: string[];
  featuredImage?: string;
  posterImage?: string;
  mainLocation?: string;
  filmingLocations?: SeriesFilmingLocation[];
  seasons?: number | SeriesSeason[];
  behindTheScenes?: {
    intro?: string;
    facts?: string[];
  };
  streamingServices?: StreamingService[];
  trailer?: VideoContent;
}

// Define SeriesSeason interface if it doesn't exist
export interface SeriesSeason {
  number: number;
  episodes: SeriesEpisode[];
  year?: string;
  title?: string;
}

// Define SeriesEpisode interface if it doesn't exist
export interface SeriesEpisode {
  number: number;
  title: string;
  description?: string;
  locations?: SeriesFilmingLocation[];
} 
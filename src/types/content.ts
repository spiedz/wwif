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
  /** Release year of the film */
  year: number;
  /** Film director name */
  director: string;
  /** Film genre(s) - can be a single string or array of genres */
  genre: string | string[];
  /** URL to the film's poster image */
  posterImage?: string;
  /** Array of filming locations with coordinates - if undefined, no map will be shown */
  coordinates?: Coordinate[];
  /** Available streaming services for the film - if undefined, default services will be shown */
  streamingServices?: StreamingService[];
  /** Booking options related to film locations - if undefined, default options will be shown */
  bookingOptions?: BookingOption[];
  /** Special components to include in the film page rendering */
  components?: string[];
  /** Whether to use the region-based layout - defaults to false if undefined */
  useRegionLayout?: boolean;
  /** Behind-the-scenes information about the film - if undefined, this section won't be shown */
  behindTheScenes?: string | BehindTheScenes;
  /** Predefined regions for grouping locations - if undefined, regions will be auto-generated */
  regions?: FilmRegion[];
  /** Travel tips related to the film locations - if undefined, generic tips will be generated */
  travelTips?: TravelTip[];
  /** Trivia facts about the film - if undefined, this section won't be shown */
  trivia?: FilmTrivia[];
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
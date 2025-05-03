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
  description: string;
  slug: string;
  date?: string;
  categories?: string[];
  components?: string[];
  featuredImage?: string;
  gallery?: string[];
  content?: string;
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

export interface FilmMeta extends ContentMeta {
  year: number | string;
  genre: string[] | string;
  director: string;
  coordinates: Coordinates[];
  regions?: FilmRegion[];
  travelTips?: TravelTip[];
  trivia?: FilmTrivia[];
  useRegionLayout?: boolean;
  behindTheScenes?: string | BehindTheScenes;
  streamingServices?: StreamingService[];
  bookingOptions?: BookingOption[];
  posterImage?: string;
  location?: string;
}

export interface BlogMeta extends ContentMeta {
  author?: string;
  featuredImage?: string;
  estimatedReadingTime?: number;
  gallery?: string[];
  relatedPosts?: string[];
  location?: string;
}

export interface Content<T extends ContentMeta> {
  meta: T;
  content: string;
  html: string;
} 
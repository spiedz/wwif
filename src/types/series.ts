import { ContentMeta, Coordinate, StreamingService, BookingOption, VideoContent } from './content';

/**
 * Interface for a TV series episode
 */
export interface Episode {
  number: number;
  title: string;
  description?: string;
  airDate?: string;
  locations?: string[]; // References to location IDs
}

/**
 * Interface for a TV series season
 */
export interface Season {
  number: number;
  episodeCount: number;
  releaseYear: number;
  episodes: Episode[];
}

/**
 * Interface for a location where a TV series was filmed
 */
export interface SeriesLocation {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  episodes: EpisodeReference[];
}

/**
 * Interface for a reference to an episode within a location
 */
export interface EpisodeReference {
  season: number;
  episode: number;
  sceneDescription?: string;
}

/**
 * Interface for behind the scenes data
 */
export interface SeriesBehindTheScenes {
  intro: string;
  facts?: string[];
}

/**
 * Interface for the TV series metadata
 */
export interface SeriesMeta extends ContentMeta {
  title: string;
  overview: string;
  releaseYearStart: number;
  releaseYearEnd: number | null; // null if still ongoing
  genres: string[];
  creator: string;
  posterImage?: string;
  bannerImage?: string;
  coordinates?: Coordinate[];
  streamingServices?: StreamingService[];
  bookingOptions?: BookingOption[];
  behindTheScenes?: SeriesBehindTheScenes;
  trailer?: VideoContent;
  seasons?: Season[];
  episodes?: Episode[];
}

/**
 * Interface for a complete TV series
 */
export interface TVSeries {
  meta: SeriesMeta;
  seasons: Season[];
  locations: SeriesLocation[];
  content: string;
  html: string;
} 
import { FilmMeta, BlogMeta, Coordinates } from '../types/content';
import { LocationInfo, MediaItem } from './locationUtils';

// Base URL for the website
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

// Schema interfaces
interface PlaceSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  geo: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  image?: string;
}

interface MediaItemSchema {
  '@type': string;
  name: string;
  url: string;
  image?: string;
}

interface ListItemSchema {
  '@type': string;
  position: number;
  item: MediaItemSchema;
}

// Helper to generate organization schema
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Where Was It Filmed',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    sameAs: [
      'https://twitter.com/wherewasitfilmed',
      'https://facebook.com/wherewasitfilmed',
      'https://instagram.com/wherewasitfilmed'
    ]
  };
};

// Helper to generate breadcrumb schema
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

// Generate Movie schema for film pages
export const getFilmSchema = (film: FilmMeta, url: string) => {
  // Base movie schema
  const movieSchema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.description,
    datePublished: film.date || `${film.year}-01-01`,
    director: {
      '@type': 'Person',
      name: film.director
    },
    genre: film.genre,
    url: url
  };

  return movieSchema;
};

// Generate FilmingLocation schema for the locations
export const getFilmingLocationSchema = (filmTitle: string, locations: Coordinates[]) => {
  if (!locations || locations.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${BASE_URL}#filmingLocations`,
    name: `Filming Locations for ${filmTitle}`,
    containsPlace: locations.map((location, index) => ({
      '@type': 'Place',
      name: location.name || `Location ${index + 1}`,
      description: location.description || `A filming location for ${filmTitle}`,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location.lat,
        longitude: location.lng
      }
    }))
  };
};

// Generate Article schema for blog posts
export const getBlogSchema = (blog: BlogMeta, url: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: blog.featuredImage || `${BASE_URL}/images/default-blog.jpg`,
    url: url,
    datePublished: blog.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author || 'Where Was It Filmed'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Where Was It Filmed',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
};

// Generate WebPage schema for general pages
export const getWebPageSchema = (title: string, description: string, url: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url
  };
};

// Generate Schema for location pages
export const getLocationPageSchema = (location: LocationInfo, url: string) => {
  // Create the place schema
  const placeSchema: PlaceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: location.name,
    description: location.description || `Films and TV series filmed in ${location.name}`,
    url: url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.lat,
      longitude: location.lng
    }
  };

  // Add image only if it exists
  if (location.image) {
    placeSchema.image = location.image;
  }

  // Create itemList schema for the media items
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: location.mediaItems.map((item, index) => {
      const listItem: ListItemSchema = {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': item.type === 'film' ? 'Movie' : 'TVSeries',
          name: item.title,
          url: `${BASE_URL}/${item.type === 'film' ? 'films' : 'series'}/${item.slug}`
        }
      };
      
      // Add image only if it exists
      if (item.posterImage) {
        listItem.item.image = item.posterImage;
      }
      
      return listItem;
    })
  };

  return [placeSchema, itemListSchema];
}; 
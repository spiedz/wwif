import { FilmMeta, BlogMeta, Coordinates } from '../types/content';
import { LocationInfo, MediaItem } from './locationUtils';

// Base URL for the website
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

// Schema interfaces
interface PlaceSchema {
  '@context': string;
  '@type': string | string[];
  name: string;
  description: string;
  url: string;
  geo: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  image?: string;
  photo?: ImageObjectSchema;
  address?: string | AddressSchema;
  telephone?: string;
  openingHoursSpecification?: any[];
  mainEntityOfPage?: any;
  containedInPlace?: PlaceSchema;
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

interface VideoObjectSchema {
  '@context'?: string;
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  publisher?: OrganizationSchema;
}

interface ImageObjectSchema {
  '@type': 'ImageObject';
  url: string;
  width?: string | number;
  height?: string | number;
  caption?: string;
}

interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  logo?: ImageObjectSchema;
  url?: string;
  sameAs?: string[];
}

interface AddressSchema {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

interface FAQPageSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: FAQItemSchema[];
}

interface FAQItemSchema {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

// Helper to generate organization schema
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Where Was It Filmed',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo.png`,
      width: '112',
      height: '112'
    },
    sameAs: [
      'https://twitter.com/wherewasitfilmed',
      'https://facebook.com/wherewasitfilmed',
      'https://instagram.com/wherewasitfilmed'
    ]
  };
};

// Helper to generate breadcrumb schema with enhanced properties
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item: { name: string; url: string }, index: number) => {
      // Convert relative URLs to absolute URLs for schema.org compliance
      let absoluteUrl = item.url;
      if (item.url.startsWith('/')) {
        absoluteUrl = `${BASE_URL}${item.url}`;
      } else if (!item.url.startsWith('http')) {
        // Handle other relative URLs (but not already absolute URLs)
        absoluteUrl = `${BASE_URL}/${item.url}`;
      }
      
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'WebPage',
          '@id': absoluteUrl,
          name: item.name
        }
      };
    })
  };
};

// Generate Movie schema for film pages with enhanced properties
export const getFilmSchema = (film: FilmMeta, url: string) => {
  // Base movie schema
  const movieSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.description,
    datePublished: film.date || `${film.year}-01-01`,
    director: {
      '@type': 'Person',
      name: film.director
    },
    genre: Array.isArray(film.genre) ? film.genre : [film.genre],
    url: url
  };

  // Add image if available
  if (film.posterImage) {
    movieSchema.image = {
      '@type': 'ImageObject',
      url: film.posterImage,
      width: '500',
      height: '750'
    };
  }

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
      },
      ...(location.image && {
        photo: {
          '@type': 'ImageObject',
          url: location.image,
          caption: location.name || `Filming location for ${filmTitle}`
        }
      })
    }))
  };
};

// Generate Article schema for blog posts
export const getBlogSchema = (blog: BlogMeta, url: string) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: blog.featuredImage ? {
      '@type': 'ImageObject',
      url: blog.featuredImage,
      width: '1200',
      height: '630'
    } : `${BASE_URL}/images/default-blog.jpg`,
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
        url: `${BASE_URL}/images/logo.png`,
        width: '112',
        height: '112'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
  
  // Add dateModified if it exists in the blog meta
  if ('updatedDate' in blog) {
    schema.dateModified = blog.updatedDate || blog.date || new Date().toISOString();
  } else {
    schema.dateModified = blog.date || new Date().toISOString();
  }
  
  return schema;
};

// Generate WebPage schema for general pages
export const getWebPageSchema = (title: string, description: string, url: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'Where Was It Filmed',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`
      }
    },
    inLanguage: 'en-US'
  };
};

// Generate Schema for location pages
export const getLocationPageSchema = (location: LocationInfo, url: string) => {
  // Create the place schema
  const placeSchema: PlaceSchema = {
    '@context': 'https://schema.org',
    '@type': ['Place', 'TouristAttraction'],
    name: location.name,
    description: location.description || `Films and TV series filmed in ${location.name}`,
    url: url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.lat,
      longitude: location.lng
    }
  };

  // Add image as both image and photo
  if (location.image) {
    placeSchema.image = location.image;
    placeSchema.photo = {
      '@type': 'ImageObject',
      url: location.image,
      caption: `Image of ${location.name}`
    };
  }

  // Add mainEntityOfPage
  placeSchema.mainEntityOfPage = {
    '@type': 'WebPage',
    '@id': url
  };

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

// Generate VideoObject schema for video content
export const getVideoObjectSchema = (
  videoData: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    contentUrl?: string;
    embedUrl?: string;
    duration?: string;
  }
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videoData.name,
    description: videoData.description,
    thumbnailUrl: videoData.thumbnailUrl,
    uploadDate: videoData.uploadDate,
    ...(videoData.contentUrl && { contentUrl: videoData.contentUrl }),
    ...(videoData.embedUrl && { embedUrl: videoData.embedUrl }),
    ...(videoData.duration && { duration: videoData.duration }),
    publisher: {
      '@type': 'Organization',
      name: 'Where Was It Filmed',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
        width: '112',
        height: '112'
      }
    }
  };
};

// Generate FAQ schema for FAQ sections
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

// Generate image object schema
export const getImageObjectSchema = (
  imageData: {
    url: string;
    width?: string | number;
    height?: string | number;
    caption?: string;
  }
) => {
  return {
    '@type': 'ImageObject',
    url: imageData.url,
    ...(imageData.width && { width: imageData.width }),
    ...(imageData.height && { height: imageData.height }),
    ...(imageData.caption && { caption: imageData.caption })
  };
};

// Utility function to combine multiple schemas into a single array
export const combineSchemas = (...schemas: any[]) => {
  return schemas.filter(Boolean);
}; 
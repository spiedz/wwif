import { LocationMeta } from '../types/location';

/**
 * Generate enhanced JSON-LD schema for location pages
 */
export function generateLocationSchema(location: LocationMeta, currentUrl: string) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": location.name,
    "description": location.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.city,
      "addressRegion": location.state,
      "addressCountry": location.country,
      "streetAddress": location.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.coordinates.lat,
      "longitude": location.coordinates.lng
    },
    "url": currentUrl,
    "sameAs": [
      currentUrl
    ]
  };

  // Add optional fields if they exist
  const enhancedSchema: any = { ...baseSchema };

  if (location.image) {
    enhancedSchema.image = location.image;
  }

  if (location.population) {
    enhancedSchema.additionalProperty = [
      {
        "@type": "PropertyValue",
        "name": "Population",
        "value": location.population
      }
    ];
  }

  if (location.timezone) {
    enhancedSchema.timeZone = location.timezone;
  }

  return enhancedSchema;
}

/**
 * Generate filming location schema for movies/series shot at this location
 */
export function generateFilmingLocationSchema(location: LocationMeta, currentUrl: string) {
  if (!location.mediaItems || location.mediaItems.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": `${location.name} Filming Locations`,
    "description": `Discover movies and TV shows filmed in ${location.name}, ${location.country}`,
    "location": {
      "@type": "Place",
      "name": location.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location.city,
        "addressRegion": location.state,
        "addressCountry": location.country
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.coordinates.lat,
        "longitude": location.coordinates.lng
      }
    },
    "url": currentUrl,
    "touristType": [
      "Film Tourism",
      "Cultural Tourism"
    ]
  };
}

/**
 * Generate breadcrumb schema for location pages
 */
export function generateLocationBreadcrumbSchema(location: LocationMeta, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Filming Locations",
        "item": `${baseUrl}/locations`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": location.name,
        "item": `${baseUrl}/locations/${location.slug}`
      }
    ]
  };
}

/**
 * Generate SEO-optimized title for location pages
 */
export function generateLocationTitle(location: LocationMeta): string {
  // Use custom metaTitle if provided, otherwise generate one
  if (location.metaTitle) {
    return location.metaTitle;
  }

  const filmCount = location.mediaItems.filter(item => item.type === 'film').length;
  const seriesCount = location.mediaItems.filter(item => item.type === 'series' || item.type === 'tv').length;
  
  // Different title formats based on content
  if (filmCount > 0 && seriesCount > 0) {
    return `What Was Filmed in ${location.name}, ${location.country} | Movies & TV Shows | Where Was It Filmed`;
  } else if (filmCount > 0) {
    return `Movies Filmed in ${location.name}, ${location.country} | Film Locations | Where Was It Filmed`;
  } else if (seriesCount > 0) {
    return `TV Shows Filmed in ${location.name}, ${location.country} | Series Locations | Where Was It Filmed`;
  } else {
    return `${location.name} Filming Locations | ${location.country} | Where Was It Filmed`;
  }
}

/**
 * Generate SEO-optimized meta description for location pages
 */
export function generateLocationDescription(location: LocationMeta): string {
  const filmCount = location.mediaItems.filter(item => item.type === 'film').length;
  const seriesCount = location.mediaItems.filter(item => item.type === 'series').length;
  const totalCount = filmCount + seriesCount;

  let description = `Discover what was filmed in ${location.name}, ${location.country}. `;

  if (totalCount > 0) {
    if (filmCount > 0 && seriesCount > 0) {
      description += `${filmCount} movies and ${seriesCount} TV shows were shot here. `;
    } else if (filmCount > 0) {
      description += `${filmCount} movies were filmed here. `;
    } else if (seriesCount > 0) {
      description += `${seriesCount} TV shows were filmed here. `;
    }
  }

  description += `${location.description} `;
  
  // Add travel-focused keywords
  description += `Find filming locations, travel tips, and plan your film tourism visit to ${location.name}.`;

  // Ensure description is within optimal length (150-160 characters)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  return description;
}

/**
 * Generate location-specific keywords for the page
 */
export function generateLocationKeywords(location: LocationMeta): string[] {
  // Use custom keywords if provided
  if (location.keywords && location.keywords.length > 0) {
    return location.keywords;
  }

  // Fallback to generated keywords
  const keywords = [
    `what was filmed in ${location.name.toLowerCase()}`,
    `${location.name.toLowerCase()} filming locations`,
    `movies filmed in ${location.name.toLowerCase()}`,
    `${location.name.toLowerCase()} film tourism`,
    `${location.name.toLowerCase()} ${location.country.toLowerCase()}`,
    `visit ${location.name.toLowerCase()}`,
    `${location.name.toLowerCase()} travel guide`,
    `${location.name.toLowerCase()} attractions`
  ];

  // Add media-specific keywords
  const hasFilms = location.mediaItems.some(item => item.type === 'film');
  const hasSeries = location.mediaItems.some(item => item.type === 'series' || item.type === 'tv');

  if (hasFilms) {
    keywords.push(`${location.name.toLowerCase()} movie locations`);
  }
  
  if (hasSeries) {
    keywords.push(`${location.name.toLowerCase()} tv series locations`);
  }

  // Add state/region specific keywords if available
  if (location.state) {
    keywords.push(`${location.name.toLowerCase()} ${location.state.toLowerCase()}`);
    keywords.push(`filming locations ${location.state.toLowerCase()}`);
  }

  return keywords;
}

/**
 * Generate FAQ schema for location pages
 */
export function generateLocationFAQSchema(location: LocationMeta) {
  const faqs = [
    {
      "@type": "Question",
      "name": `What movies and TV shows were filmed in ${location.name}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${location.mediaItems.length} productions have been filmed in ${location.name}, ${location.country}. The location offers diverse filming opportunities from its ${location.description.toLowerCase()}.`
      }
    },
    {
      "@type": "Question", 
      "name": `How do I visit ${location.name} filming locations?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${location.name} is located in ${location.city}, ${location.country}. ${location.bestTimeToVisit ? `The best time to visit is ${location.bestTimeToVisit}.` : ''} Check our travel tips for transportation and accommodation options.`
      }
    }
  ];

  // Add location-specific FAQ if population data is available
  if (location.population) {
    faqs.push({
      "@type": "Question",
      "name": `What is ${location.name} known for?`,
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": `${location.name} is a ${location.description.toLowerCase()} with a population of ${location.population.toLocaleString()}. It has become a popular filming destination due to its scenic beauty and authentic character.`
      }
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs
  };
}

/**
 * Combine all schemas into one JSON-LD script
 */
export function combineLocationSchemas(
  locationSchema: any,
  filmingLocationSchema: any,
  breadcrumbSchema: any,
  faqSchema: any
): string {
  const schemas = [locationSchema, filmingLocationSchema, breadcrumbSchema, faqSchema]
    .filter(Boolean);
  
  return JSON.stringify(schemas);
} 
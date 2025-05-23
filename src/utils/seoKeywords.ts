/**
 * SEO Keywords for the Where Was It Filmed website
 * This file contains structured keyword data for use in SEO optimization
 */

import { FilmMeta, BlogMeta, SeriesMeta } from '../types/content';

// Comprehensive keyword research data for film locations
export interface KeywordData {
  primary: string[];
  secondary: string[];
  longTail: string[];
  location: string[];
  genre: string[];
  semantic: string[];
}

// Film location keyword categories
export const FILM_LOCATION_KEYWORDS = {
  primary: [
    'filming locations',
    'where was filmed',
    'movie locations',
    'film sites',
    'filming spots',
    'shooting locations'
  ],
  secondary: [
    'behind the scenes',
    'production locations',
    'real locations',
    'actual filming sites',
    'movie sets',
    'filming destinations'
  ],
  longTail: [
    'exact filming location',
    'visit filming locations',
    'film location guide',
    'movie tourism destinations',
    'where to visit filming sites',
    'film location travel guide'
  ],
  actionWords: [
    'discover',
    'explore',
    'visit',
    'find',
    'uncover',
    'journey to'
  ],
  callToActions: [
    'Plan your visit',
    'Explore the locations',
    'Discover the magic',
    'Visit these iconic spots',
    'See where it was filmed'
  ]
};

// Location-specific keyword patterns
export const LOCATION_KEYWORDS = {
  countries: {
    'new zealand': ['middle earth', 'lord of the rings', 'hobbiton'],
    'uk': ['british locations', 'england filming', 'scotland locations'],
    'usa': ['hollywood locations', 'american filming', 'los angeles sets'],
    'ireland': ['irish landscapes', 'emerald isle filming'],
    'iceland': ['nordic locations', 'game of thrones'],
    'spain': ['spanish locations', 'european filming'],
    'france': ['french filming', 'paris locations'],
    'germany': ['german locations', 'european productions'],
    'canada': ['canadian filming', 'vancouver productions'],
    'australia': ['australian locations', 'sydney filming']
  },
  cities: {
    'london': ['london filming', 'british capital', 'uk movie locations'],
    'new york': ['nyc filming', 'manhattan locations', 'big apple sets'],
    'los angeles': ['hollywood filming', 'la locations', 'california sets'],
    'paris': ['paris filming', 'french locations', 'city of light'],
    'sydney': ['sydney filming', 'australian locations', 'harbor city'],
    'dublin': ['dublin filming', 'irish capital', 'ireland locations'],
    'berlin': ['berlin filming', 'german capital', 'european locations'],
    'toronto': ['toronto filming', 'canadian locations', 'ontario sets']
  }
};

// Genre-specific keywords
export const GENRE_KEYWORDS = {
  action: ['action sequences', 'stunts', 'chase scenes', 'explosive'],
  adventure: ['epic journeys', 'exploration', 'quest locations', 'adventure'],
  drama: ['dramatic scenes', 'emotional', 'powerful locations', 'intimate'],
  fantasy: ['magical locations', 'enchanting', 'mystical', 'otherworldly'],
  horror: ['spooky locations', 'haunting', 'eerie', 'terrifying scenes'],
  comedy: ['comedic scenes', 'funny moments', 'lighthearted', 'amusing'],
  thriller: ['suspenseful', 'tense locations', 'edge-of-seat', 'gripping'],
  scifi: ['futuristic', 'sci-fi locations', 'otherworldly', 'cutting-edge'],
  romance: ['romantic locations', 'love scenes', 'beautiful', 'enchanting'],
  war: ['historical locations', 'battlefield', 'wartime', 'historical']
};

// Seasonal and travel-related keywords
export const TRAVEL_KEYWORDS = {
  accessibility: ['visit', 'tour', 'accessible', 'open to public'],
  planning: ['travel guide', 'visit planning', 'tour options', 'how to get there'],
  seasonal: ['best time to visit', 'year-round', 'seasonal access'],
  experience: ['film location tours', 'behind-the-scenes tours', 'guided visits']
};

/**
 * Extract keywords based on content type and metadata
 */
export function extractContentKeywords(
  meta: FilmMeta | BlogMeta | SeriesMeta,
  contentType: 'film' | 'series' | 'blog'
): KeywordData {
  const keywords: KeywordData = {
    primary: [...FILM_LOCATION_KEYWORDS.primary],
    secondary: [...FILM_LOCATION_KEYWORDS.secondary],
    longTail: [...FILM_LOCATION_KEYWORDS.longTail],
    location: [],
    genre: [],
    semantic: []
  };

  // Add content-specific keywords
  if (contentType === 'film' || contentType === 'series') {
    const content = meta as FilmMeta;
    
    // Add title variations
    keywords.primary.push(`${content.title.toLowerCase()} filming locations`);
    keywords.primary.push(`where was ${content.title.toLowerCase()} filmed`);
    
    // Add genre keywords
    if (content.genre) {
      const genres = Array.isArray(content.genre) ? content.genre : [content.genre];
      genres.forEach(genre => {
        const genreKey = genre.toLowerCase() as keyof typeof GENRE_KEYWORDS;
        if (GENRE_KEYWORDS[genreKey]) {
          keywords.genre.push(...GENRE_KEYWORDS[genreKey]);
        }
      });
    }

    // Add director keywords
    if (content.director) {
      keywords.secondary.push(`${content.director} filming locations`);
    }

    // Add year keywords
    if (content.year) {
      keywords.secondary.push(`${content.year} filming locations`);
    }
  }

  // Extract location keywords from coordinates
  if ('coordinates' in meta && meta.coordinates) {
    meta.coordinates.forEach(coord => {
      if (coord.name) {
        // Extract city/country from location names
        const locationParts = coord.name.toLowerCase().split(',').map(s => s.trim());
        locationParts.forEach(part => {
          // Check if it matches known countries/cities
          Object.entries(LOCATION_KEYWORDS.countries).forEach(([country, countryKeywords]) => {
            if (part.includes(country)) {
              keywords.location.push(...countryKeywords);
            }
          });
          
          Object.entries(LOCATION_KEYWORDS.cities).forEach(([city, cityKeywords]) => {
            if (part.includes(city)) {
              keywords.location.push(...cityKeywords);
            }
          });
        });
      }
    });
  }

  // Add semantic/related keywords
  keywords.semantic.push(
    'movie tourism',
    'film tourism',
    'cinematic locations',
    'movie destinations',
    'film travel guide',
    'movie set visits'
  );

  // Remove duplicates
  Object.keys(keywords).forEach(key => {
    keywords[key as keyof KeywordData] = [...new Set(keywords[key as keyof KeywordData])];
  });

  return keywords;
}

/**
 * Generate keyword-optimized content snippets
 */
export function generateKeywordSnippets(title: string, keywords: KeywordData): {
  titleVariations: string[];
  descriptionStarters: string[];
  callToActions: string[];
} {
  const titleVariations = [
    `Where Was ${title} Filmed?`,
    `${title} Filming Locations`,
    `${title} Movie Locations Guide`,
    `Discover ${title} Film Sites`,
    `${title} Behind the Scenes Locations`
  ];

  const descriptionStarters = [
    `Discover the breathtaking filming locations of ${title}`,
    `Explore where ${title} was filmed`,
    `Visit the iconic locations from ${title}`,
    `Uncover the real-world filming sites of ${title}`,
    `Journey to the stunning locations where ${title} was shot`,
    `Find the exact filming locations from ${title}`
  ];

  const callToActions = [
    'Plan your visit to these iconic film locations',
    'Explore the filming sites with our complete guide',
    'Discover the magic behind the movie locations',
    'Visit these stunning filming destinations',
    'See where the movie magic happened'
  ];

  return {
    titleVariations,
    descriptionStarters,
    callToActions
  };
}

/**
 * Optimize text for specific keywords while maintaining readability
 */
export function optimizeTextForKeywords(
  text: string,
  targetKeywords: string[],
  maxLength: number = 160
): string {
  let optimizedText = text;
  
  // Ensure primary keywords are included
  const textLower = text.toLowerCase();
  
  // Add missing high-priority keywords if there's space
  const missingKeywords = targetKeywords.filter(keyword => 
    !textLower.includes(keyword.toLowerCase())
  );

  if (missingKeywords.length > 0 && optimizedText.length < maxLength - 20) {
    const keywordToAdd = missingKeywords[0];
    optimizedText = `${optimizedText} ${keywordToAdd}`;
  }

  // Trim to max length
  if (optimizedText.length > maxLength) {
    optimizedText = optimizedText.substring(0, maxLength - 3) + '...';
  }

  return optimizedText;
}

/**
 * Calculate keyword density and SEO score
 */
export function calculateSEOScore(text: string, keywords: KeywordData): {
  score: number;
  suggestions: string[];
  keywordDensity: { [key: string]: number };
} {
  const textLower = text.toLowerCase();
  const words = textLower.split(/\s+/);
  const totalWords = words.length;
  
  let score = 0;
  const suggestions: string[] = [];
  const keywordDensity: { [key: string]: number } = {};

  // Check for primary keywords (high weight)
  keywords.primary.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const occurrences = (textLower.match(new RegExp(keywordLower, 'g')) || []).length;
    keywordDensity[keyword] = (occurrences / totalWords) * 100;
    
    if (occurrences > 0) {
      score += 20;
    } else {
      suggestions.push(`Consider adding primary keyword: "${keyword}"`);
    }
  });

  // Check for secondary keywords (medium weight)
  keywords.secondary.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const occurrences = (textLower.match(new RegExp(keywordLower, 'g')) || []).length;
    keywordDensity[keyword] = (occurrences / totalWords) * 100;
    
    if (occurrences > 0) {
      score += 10;
    }
  });

  // Length optimization
  if (text.length >= 150 && text.length <= 160) {
    score += 20;
  } else if (text.length < 150) {
    suggestions.push('Description could be longer for better SEO (150-160 chars optimal)');
  } else {
    suggestions.push('Description too long - may be truncated by search engines');
  }

  // Readability check
  if (text.includes('discover') || text.includes('explore') || text.includes('visit')) {
    score += 10;
  } else {
    suggestions.push('Consider adding action words like "discover", "explore", or "visit"');
  }

  return {
    score: Math.min(score, 100),
    suggestions,
    keywordDensity
  };
}

/**
 * Get location-specific SEO recommendations
 */
export function getLocationSEORecommendations(locationName: string): {
  keywords: string[];
  phrases: string[];
  localSEO: string[];
} {
  const location = locationName.toLowerCase();
  let keywords: string[] = [];
  let phrases: string[] = [];
  let localSEO: string[] = [];

  // Check for known locations
  Object.entries(LOCATION_KEYWORDS.countries).forEach(([country, countryKeywords]) => {
    if (location.includes(country)) {
      keywords.push(...countryKeywords);
      phrases.push(`filming in ${country}`, `${country} movie locations`);
      localSEO.push(`${country} film tourism`, `visit ${country} filming sites`);
    }
  });

  Object.entries(LOCATION_KEYWORDS.cities).forEach(([city, cityKeywords]) => {
    if (location.includes(city)) {
      keywords.push(...cityKeywords);
      phrases.push(`${city} filming locations`, `movies filmed in ${city}`);
      localSEO.push(`${city} movie tours`, `${city} film sites guide`);
    }
  });

  // Generic location keywords if no specific match
  if (keywords.length === 0) {
    keywords.push('filming locations', 'movie locations', 'film sites');
    phrases.push(`${locationName} filming`, `movies filmed at ${locationName}`);
    localSEO.push(`visit ${locationName}`, `${locationName} tours`);
  }

  return {
    keywords: [...new Set(keywords)],
    phrases: [...new Set(phrases)],
    localSEO: [...new Set(localSEO)]
  };
} 
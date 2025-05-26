import { FilmMeta, BlogMeta, SeriesMeta } from '../types/content';
import { 
  extractContentKeywords, 
  generateKeywordSnippets, 
  optimizeTextForKeywords,
  getLocationSEORecommendations,
  FILM_LOCATION_KEYWORDS 
} from './seoKeywords';

export interface MetaDescriptionOptions {
  maxLength?: number;
  includeCallToAction?: boolean;
  emphasizeLocation?: boolean;
  includeYear?: boolean;
  style?: 'discovery' | 'guide' | 'exploration' | 'travel';
}

const DEFAULT_OPTIONS: MetaDescriptionOptions = {
  maxLength: 160,
  includeCallToAction: true,
  emphasizeLocation: true,
  includeYear: false,
  style: 'discovery'
};

/**
 * Generate optimized meta description for film pages
 */
export function generateFilmMetaDescription(
  meta: FilmMeta,
  options: MetaDescriptionOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxLength = opts.maxLength || 160;
  const keywords = extractContentKeywords(meta, 'film');
  const snippets = generateKeywordSnippets(meta.title, keywords);

  // Get primary location for emphasis
  const primaryLocation = meta.coordinates?.[0]?.name || '';
  const locationInfo = primaryLocation ? getLocationSEORecommendations(primaryLocation) : null;

  // Build description based on style
  let description = '';

  switch (opts.style) {
    case 'discovery':
      description = `Discover where ${meta.title} was filmed. `;
      break;
    case 'guide':
      description = `Complete filming locations guide for ${meta.title}. `;
      break;
    case 'exploration':
      description = `Explore the stunning filming locations of ${meta.title}. `;
      break;
    case 'travel':
      description = `Visit the real filming locations from ${meta.title}. `;
      break;
  }

  // Add location emphasis if available and requested
  if (opts.emphasizeLocation && primaryLocation) {
    const locationParts = primaryLocation.split(',');
    const mainLocation = locationParts[locationParts.length - 1]?.trim() || locationParts[0];
    description += `From ${mainLocation} to `;
  }

  // Add genre/theme context
  if (meta.genre) {
    const genres = Array.isArray(meta.genre) ? meta.genre : [meta.genre];
    const primaryGenre = genres[0]?.toLowerCase();
    
    if (primaryGenre) {
      const genreDescriptors = {
        action: 'action-packed scenes',
        adventure: 'epic adventures',
        drama: 'powerful dramatic moments',
        fantasy: 'magical landscapes',
        horror: 'spine-chilling locations',
        comedy: 'hilarious moments',
        thriller: 'suspenseful sequences',
        scifi: 'futuristic settings',
        romance: 'romantic backdrops',
        war: 'historic battlefields',
        'post-apocalyptic': 'post-apocalyptic landscapes'
      };

      const descriptor = genreDescriptors[primaryGenre as keyof typeof genreDescriptors] || 'stunning scenes';
      description += `${descriptor}, `;
    }
  }

  // Add location count if multiple locations
  const locationCount = meta.coordinates?.length || 0;
  if (locationCount > 1) {
    description += `explore ${locationCount} filming locations `;
  } else {
    description += 'iconic filming locations ';
  }

  // Add year if requested
  if (opts.includeYear && meta.year) {
    description += `from this ${meta.year} `;
  }

  // Add director if available and space permits
  if (meta.director && description.length < maxLength - 40) {
    description += `${meta.director} `;
  }

  description += 'film.';

  // Add call to action if requested and space permits
  if (opts.includeCallToAction && description.length < maxLength - 25) {
    const ctas = [
      ' Plan your visit today.',
      ' See where movie magic happened.',
      ' Complete travel guide included.',
      ' Interactive maps & directions.'
    ];
    
    const availableSpace = maxLength - description.length;
    const shortestCTA = ctas.find(cta => cta.length <= availableSpace);
    if (shortestCTA) {
      description += shortestCTA;
    }
  }

  // Optimize for keywords and length
  const targetKeywords = [
    ...keywords.primary.slice(0, 2),
    ...keywords.location.slice(0, 1)
  ];

  return optimizeTextForKeywords(description, targetKeywords, maxLength);
}

/**
 * Generate optimized meta description for series pages
 */
export function generateSeriesMetaDescription(
  meta: SeriesMeta,
  options: MetaDescriptionOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxLength = opts.maxLength || 160;
  const keywords = extractContentKeywords(meta, 'series');

  let description = '';

  switch (opts.style) {
    case 'discovery':
      description = `Discover where ${meta.title} was filmed across multiple seasons. `;
      break;
    case 'guide':
      description = `Complete ${meta.title} filming locations guide with episode breakdowns. `;
      break;
    case 'exploration':
      description = `Explore every filming location from ${meta.title}. `;
      break;
    case 'travel':
      description = `Visit the real locations from ${meta.title} TV series. `;
      break;
  }

  // Add location count from filmingLocations
  const locationCount = meta.filmingLocations?.length || 0;
  if (locationCount > 1) {
    description += `${locationCount} locations, `;
  }

  // Calculate total episodes from seasons if available
  let totalEpisodes = 0;
  if (meta.seasons && Array.isArray(meta.seasons)) {
    totalEpisodes = meta.seasons.reduce((total, season) => {
      return total + (season.episodes?.length || 0);
    }, 0);
  }

  if (totalEpisodes > 0) {
    description += `${totalEpisodes} episodes, `;
  }

  // Add genre context
  if (meta.genre) {
    const genres = Array.isArray(meta.genre) ? meta.genre : [meta.genre];
    const primaryGenre = genres[0]?.toLowerCase();
    if (primaryGenre) {
      description += `${primaryGenre} series. `;
    } else {
      description += 'complete series guide. ';
    }
  } else {
    description += 'complete series guide. ';
  }

  // Add call to action
  if (opts.includeCallToAction) {
    description += 'Maps, photos & travel tips included.';
  }

  const targetKeywords = [
    `${meta.title.toLowerCase()} filming locations`,
    'tv series locations',
    ...keywords.location.slice(0, 1)
  ];

  return optimizeTextForKeywords(description, targetKeywords, maxLength);
}

/**
 * Generate optimized meta description for blog posts
 */
export function generateBlogMetaDescription(
  meta: BlogMeta,
  options: MetaDescriptionOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxLength = opts.maxLength || 160;

  // Use existing description if it's well-optimized
  if (meta.description && meta.description.length >= 140 && meta.description.length <= 160) {
    return meta.description;
  }

  let description = '';

  // Analyze title for content type
  const title = meta.title.toLowerCase();
  
  if (title.includes('best') || title.includes('top')) {
    description = `Discover the ${meta.title.toLowerCase()}. `;
  } else if (title.includes('guide') || title.includes('how')) {
    description = `Complete guide: ${meta.title}. `;
  } else if (title.includes('visit') || title.includes('travel')) {
    description = `Plan your trip with our ${meta.title.toLowerCase()}. `;
  } else {
    description = `${meta.title}. `;
  }

  // Add category context if available (using categories array)
  if (meta.categories && meta.categories.length > 0) {
    description += `Essential ${meta.categories[0]} information `;
  }

  // Add location context if coordinates exist
  if (meta.coordinates && meta.coordinates.length > 0) {
    const locationCount = meta.coordinates.length;
    description += `covering ${locationCount} locations. `;
  }

  // Add call to action
  if (opts.includeCallToAction) {
    description += 'Expert tips, maps & insider advice.';
  }

  // Target keywords for blog posts
  const targetKeywords = [
    'filming locations',
    'movie locations',
    'travel guide'
  ];

  return optimizeTextForKeywords(description, targetKeywords, maxLength);
}

/**
 * Generate optimized meta description for location index pages
 */
export function generateLocationIndexMetaDescription(
  locationName: string,
  type: 'city' | 'country',
  filmCount: number,
  options: MetaDescriptionOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxLength = opts.maxLength || 160;
  const locationSEO = getLocationSEORecommendations(locationName);

  let description = '';

  switch (opts.style) {
    case 'discovery':
      description = `Discover all movies and TV shows filmed in ${locationName}. `;
      break;
    case 'guide':
      description = `Complete ${locationName} filming locations guide. `;
      break;
    case 'exploration':
      description = `Explore where your favorite films were shot in ${locationName}. `;
      break;
    case 'travel':
      description = `Visit famous filming locations across ${locationName}. `;
      break;
  }

  // Add film count
  description += `${filmCount} productions, `;

  // Add interactive features
  description += 'interactive maps, ';

  // Add value proposition
  if (type === 'city') {
    description += 'local tours & travel tips. ';
  } else {
    description += 'travel guides & booking options. ';
  }

  // Add call to action
  if (opts.includeCallToAction) {
    description += 'Start exploring now!';
  }

  // Target location-specific keywords
  const targetKeywords = [
    `${locationName.toLowerCase()} filming locations`,
    `movies filmed in ${locationName.toLowerCase()}`,
    ...locationSEO.keywords.slice(0, 1)
  ];

  return optimizeTextForKeywords(description, targetKeywords, maxLength);
}

/**
 * Generate optimized meta description for franchise pages
 */
export function generateFranchiseMetaDescription(
  franchiseName: string,
  filmCount: number,
  options: MetaDescriptionOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxLength = opts.maxLength || 160;

  let description = `Explore all ${franchiseName} filming locations across ${filmCount} films. `;
  description += 'Complete guides, interactive maps, behind-the-scenes insights. ';
  
  if (opts.includeCallToAction) {
    description += 'Plan your ultimate fan journey!';
  }

  const targetKeywords = [
    `${franchiseName.toLowerCase()} filming locations`,
    'franchise filming sites',
    'movie tourism'
  ];

  return optimizeTextForKeywords(description, targetKeywords, maxLength);
}

/**
 * Auto-generate meta description based on content type and metadata
 */
export function generateAutoMetaDescription(
  meta: FilmMeta | BlogMeta | SeriesMeta,
  contentType: 'film' | 'series' | 'blog',
  options: MetaDescriptionOptions = {}
): string {
  switch (contentType) {
    case 'film':
      return generateFilmMetaDescription(meta as FilmMeta, options);
    case 'series':
      return generateSeriesMetaDescription(meta as SeriesMeta, options);
    case 'blog':
      return generateBlogMetaDescription(meta as BlogMeta, options);
    default:
      return meta.description || 'Discover filming locations from your favorite movies and TV shows.';
  }
}

/**
 * Validate and improve existing meta descriptions
 */
export function validateMetaDescription(description: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  score: number;
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Length validation
  if (description.length < 120) {
    issues.push('Description too short - may not provide enough information');
    suggestions.push('Expand description to 150-160 characters for optimal SEO');
    score -= 20;
  } else if (description.length > 160) {
    issues.push('Description too long - may be truncated by search engines');
    suggestions.push('Shorten description to under 160 characters');
    score -= 15;
  }

  // Keyword presence
  const descLower = description.toLowerCase();
  const hasFilmKeywords = FILM_LOCATION_KEYWORDS.primary.some(keyword => 
    descLower.includes(keyword.toLowerCase())
  );
  
  if (!hasFilmKeywords) {
    issues.push('Missing key filming location keywords');
    suggestions.push('Include keywords like "filming locations", "where was filmed", or "movie locations"');
    score -= 25;
  }

  // Action words
  const actionWords = ['discover', 'explore', 'visit', 'find', 'uncover', 'journey'];
  const hasActionWord = actionWords.some(word => descLower.includes(word));
  
  if (!hasActionWord) {
    issues.push('Missing action words for user engagement');
    suggestions.push('Add action words like "discover", "explore", or "visit"');
    score -= 10;
  }

  // Uniqueness check (basic)
  const commonPhrases = ['this film', 'this movie', 'this show'];
  const hasGenericPhrases = commonPhrases.some(phrase => descLower.includes(phrase));
  
  if (hasGenericPhrases) {
    issues.push('Contains generic phrases that could apply to any content');
    suggestions.push('Make description more specific to this content');
    score -= 5;
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
    score: Math.max(score, 0)
  };
} 
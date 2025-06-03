import { TVSeries, Season, Episode } from '../types/series';

/**
 * Generate comprehensive JSON-LD structured data for TV series
 */
export function generateSeriesStructuredData(series: TVSeries, selectedSeason?: number) {
  const { meta } = series;
  
  // Base TV Series schema
  const tvSeriesSchema = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    'name': meta.title,
    'headline': meta.title,
    'description': meta.description || meta.overview,
    'image': meta.posterImage || meta.bannerImage || '',
    'genre': meta.genres || [],
    'startDate': meta.releaseYearStart ? `${meta.releaseYearStart}-01-01` : undefined,
    'endDate': meta.releaseYearEnd ? `${meta.releaseYearEnd}-12-31` : undefined,
    'numberOfSeasons': series.seasons?.length || 0,
    'numberOfEpisodes': series.seasons?.reduce((total, season) => total + season.episodeCount, 0) || 0,
    'creator': meta.creator ? {
      '@type': 'Person',
      'name': meta.creator
    } : undefined,
    'productionCompany': {
      '@type': 'Organization',
      'name': 'Production Company' // This could be made dynamic
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Where Was It Filmed',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://wherewasitfilmed.co/logo.png'
      }
    },
    'url': `https://wherewasitfilmed.co/series/${meta.slug}`,
    'sameAs': meta.streamingServices?.map(service => service.url) || [],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.5', // This could be made dynamic
      'reviewCount': '100', // This could be made dynamic
      'bestRating': '5',
      'worstRating': '1'
    },
    'containsSeason': series.seasons?.map(season => generateSeasonSchema(series, season)),
    'filmingLocation': series.locations?.map(location => ({
      '@type': 'Place',
      'name': location.name,
      'description': location.description,
      'geo': location.coordinates ? {
        '@type': 'GeoCoordinates',
        'latitude': location.coordinates.lat,
        'longitude': location.coordinates.lng
      } : undefined,
      'image': location.image
    }))
  };

  // If a specific season is selected, add season-specific schema
  if (selectedSeason && series.seasons) {
    const season = series.seasons.find(s => s.number === selectedSeason);
    if (season) {
      const seasonSchema = generateSeasonSchema(series, season);
      return [tvSeriesSchema, seasonSchema];
    }
  }

  return tvSeriesSchema;
}

/**
 * Generate TV Season structured data
 */
export function generateSeasonSchema(series: TVSeries, season: Season) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeason',
    'name': `${series.meta.title} - Season ${season.number}`,
    'seasonNumber': season.number,
    'numberOfEpisodes': season.episodeCount,
    'datePublished': `${season.releaseYear}-01-01`,
    'partOfSeries': {
      '@type': 'TVSeries',
      'name': series.meta.title,
      'url': `https://wherewasitfilmed.co/series/${series.meta.slug}`
    },
    'episode': season.episodes?.map(episode => generateEpisodeSchema(series, season, episode)),
    'image': season.posterImage || series.meta.posterImage,
    'url': `https://wherewasitfilmed.co/series/${series.meta.slug}?season=${season.number}`
  };
}

/**
 * Generate TV Episode structured data
 */
export function generateEpisodeSchema(series: TVSeries, season: Season, episode: Episode) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVEpisode',
    'name': episode.title,
    'episodeNumber': episode.number,
    'description': episode.description,
    'datePublished': episode.airDate || `${season.releaseYear}-01-01`,
    'partOfSeason': {
      '@type': 'TVSeason',
      'seasonNumber': season.number,
      'partOfSeries': {
        '@type': 'TVSeries',
        'name': series.meta.title
      }
    },
    'image': episode.thumbnail || season.posterImage || series.meta.posterImage,
    'url': `https://wherewasitfilmed.co/series/${series.meta.slug}?season=${season.number}#episodes`
  };
}

/**
 * Generate breadcrumb structured data for series pages
 */
export function generateSeriesBreadcrumbs(series: TVSeries, selectedSeason?: number, activeTab?: string) {
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://wherewasitfilmed.co'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'TV Series',
      'item': 'https://wherewasitfilmed.co/series'
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': series.meta.title,
      'item': `https://wherewasitfilmed.co/series/${series.meta.slug}`
    }
  ];

  // Add season-specific breadcrumb if applicable
  if (selectedSeason) {
    breadcrumbs.push({
      '@type': 'ListItem',
      'position': 4,
      'name': `Season ${selectedSeason}`,
      'item': `https://wherewasitfilmed.co/series/${series.meta.slug}?season=${selectedSeason}`
    });
  }

  // Add tab-specific breadcrumb if applicable
  if (activeTab && activeTab !== 'overview') {
    const tabNames = {
      'locations': 'Filming Locations',
      'episodes': 'Episodes',
      'gallery': 'Gallery'
    };
    
    breadcrumbs.push({
      '@type': 'ListItem',
      'position': breadcrumbs.length + 1,
      'name': tabNames[activeTab as keyof typeof tabNames] || activeTab,
      'item': `https://wherewasitfilmed.co/series/${series.meta.slug}${selectedSeason ? `?season=${selectedSeason}` : ''}#${activeTab}`
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs
  };
}

/**
 * Generate optimized meta tags for series pages
 */
export function generateSeriesMetaTags(series: TVSeries, selectedSeason?: number, activeTab?: string) {
  const { meta } = series;
  
  // Base title and description
  let title = meta.title;
  let description = meta.description || meta.overview || '';
  
  // Customize based on season and tab
  if (selectedSeason) {
    title += ` - Season ${selectedSeason}`;
    description = `Explore Season ${selectedSeason} of ${meta.title}. ${description}`;
  }
  
  if (activeTab && activeTab !== 'overview') {
    const tabTitles = {
      'locations': 'Filming Locations',
      'episodes': 'Episodes Guide',
      'gallery': 'Photo Gallery'
    };
    
    const tabTitle = tabTitles[activeTab as keyof typeof tabTitles];
    if (tabTitle) {
      title += ` - ${tabTitle}`;
      
      const tabDescriptions = {
        'locations': `Discover the real filming locations of ${meta.title}${selectedSeason ? ` Season ${selectedSeason}` : ''}. Complete location guide with maps and travel tips.`,
        'episodes': `Complete episode guide for ${meta.title}${selectedSeason ? ` Season ${selectedSeason}` : ''}. Episode summaries, filming locations, and behind-the-scenes details.`,
        'gallery': `Photo gallery for ${meta.title}${selectedSeason ? ` Season ${selectedSeason}` : ''}. High-quality images from filming locations, posters, and behind-the-scenes photos.`
      };
      
      description = tabDescriptions[activeTab as keyof typeof tabDescriptions] || description;
    }
  }
  
  // Ensure title is not too long
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  // Ensure description is optimal length
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return {
    title,
    description,
    keywords: [
      meta.title,
      'filming locations',
      'where was it filmed',
      ...(meta.genres || []),
      ...(selectedSeason ? [`season ${selectedSeason}`] : []),
      'TV series',
      'behind the scenes'
    ].join(', '),
    ogTitle: title,
    ogDescription: description,
    ogImage: meta.posterImage || meta.bannerImage || '',
    ogType: 'video.tv_show',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: meta.posterImage || meta.bannerImage || ''
  };
}

/**
 * Generate canonical URL for series pages
 */
export function generateSeriesCanonicalUrl(series: TVSeries, selectedSeason?: number, activeTab?: string) {
  let url = `https://wherewasitfilmed.co/series/${series.meta.slug}`;
  
  // Add season parameter if not the first season
  if (selectedSeason && selectedSeason !== series.seasons?.[0]?.number) {
    url += `?season=${selectedSeason}`;
  }
  
  // Add tab hash if not overview
  if (activeTab && activeTab !== 'overview') {
    url += `#${activeTab}`;
  }
  
  return url;
}

/**
 * Generate FAQ structured data for series pages
 */
export function generateSeriesFAQSchema(series: TVSeries) {
  const faqs = [
    {
      '@type': 'Question',
      'name': `Where was ${series.meta.title} filmed?`,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': `${series.meta.title} was filmed in ${series.locations?.slice(0, 3).map(loc => loc.name).join(', ')}${series.locations && series.locations.length > 3 ? ' and other locations' : ''}. Our comprehensive guide covers all filming locations with detailed information and travel tips.`
      }
    },
    {
      '@type': 'Question',
      'name': `How many seasons does ${series.meta.title} have?`,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': `${series.meta.title} has ${series.seasons?.length || 0} season${series.seasons?.length !== 1 ? 's' : ''} with a total of ${series.seasons?.reduce((total, season) => total + season.episodeCount, 0) || 0} episodes.`
      }
    },
    {
      '@type': 'Question',
      'name': `Can I visit the filming locations of ${series.meta.title}?`,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': `Yes, many of the filming locations for ${series.meta.title} are accessible to the public. Our location guide provides detailed information about visiting each location, including addresses, opening hours, and travel tips.`
      }
    }
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs
  };
} 
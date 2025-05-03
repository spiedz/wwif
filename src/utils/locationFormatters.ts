import { Coordinates, FilmLocation, FilmRegion, FilmMeta, TravelTip, FilmTrivia } from '../types/content';

/**
 * Groups a film's coordinates into region-based location groups
 * If no explicit region data is provided, creates a single default region
 */
export const groupLocationsByRegion = (film: FilmMeta): FilmRegion[] => {
  // If film already has regions defined, use those
  if (film.regions && film.regions.length > 0) {
    return film.regions;
  }

  // If no coordinates, return empty array
  if (!film.coordinates || film.coordinates.length === 0) {
    return [];
  }

  // Group by location name prefix (e.g., "London - Big Ben" and "London - Tower Bridge" -> "London" region)
  const regionMap = new Map<string, FilmLocation[]>();
  
  film.coordinates.forEach(coord => {
    if (!coord.name) return;
    
    // Try to extract region name from location name
    let regionName = 'Featured Locations';
    
    // Look for location names with format "RegionName - LocationName"
    if (coord.name.includes(' - ')) {
      regionName = coord.name.split(' - ')[0].trim();
    } else if (coord.name.includes(', ')) {
      // Or "LocationName, RegionName"
      const parts = coord.name.split(', ');
      if (parts.length > 1) {
        regionName = parts[parts.length - 1].trim();
      }
    }
    
    // Create location object
    const location: FilmLocation = {
      name: coord.name.includes(' - ') ? coord.name.split(' - ')[1].trim() : coord.name,
      description: coord.description || '',
      coordinates: coord,
      image: coord.image
    };
    
    // Add to region map
    if (regionMap.has(regionName)) {
      regionMap.get(regionName)!.push(location);
    } else {
      regionMap.set(regionName, [location]);
    }
  });
  
  // Convert map to array of regions
  return Array.from(regionMap.entries()).map(([name, locations]) => ({
    name,
    description: `Explore the filming locations in ${name}`,
    locations
  }));
};

/**
 * Creates a single default region from coordinates
 */
export const createDefaultRegion = (film: FilmMeta): FilmRegion => {
  const locations = film.coordinates.map(coord => ({
    name: coord.name || 'Unnamed Location',
    description: coord.description || '',
    coordinates: coord,
    image: coord.image
  }));
  
  return {
    name: 'Featured Locations',
    description: `Explore the filming locations of ${film.title}`,
    locations
  };
};

/**
 * Extracts travel tips from film metadata or creates default ones
 */
export const extractTravelTips = (film: FilmMeta): TravelTip[] => {
  // If film already has travel tips defined, use those
  if (film.travelTips && film.travelTips.length > 0) {
    return film.travelTips;
  }
  
  // Otherwise create some generic ones based on film data
  const defaultTips: TravelTip[] = [
    {
      text: `Best time to visit most of these locations is during spring or fall for mild weather.`
    },
    {
      text: `Consider booking accommodations in advance, especially during tourist season.`
    }
  ];
  
  // Add location-specific tips if available
  if (film.coordinates && film.coordinates.length > 0) {
    const locationNames = film.coordinates
      .filter(coord => coord.name)
      .map(coord => coord.name)
      .slice(0, 3);
      
    if (locationNames.length > 0) {
      defaultTips.push({
        text: `Guided tours are available that cover ${locationNames.join(', ')} in one day.`
      });
    }
  }
  
  return defaultTips;
};

/**
 * Extracts trivia from film metadata or creates default ones
 */
export const extractTrivia = (film: FilmMeta): FilmTrivia[] => {
  // If film already has trivia defined, use those
  if (film.trivia && film.trivia.length > 0) {
    return film.trivia;
  }
  
  // Check if there's behind the scenes content that could be used for trivia
  const defaultTrivia: FilmTrivia[] = [];
  
  if (film.behindTheScenes) {
    if (typeof film.behindTheScenes === 'string') {
      defaultTrivia.push({
        text: film.behindTheScenes
      });
    } else if (film.behindTheScenes.facts && film.behindTheScenes.facts.length > 0) {
      film.behindTheScenes.facts.forEach(fact => {
        defaultTrivia.push({
          text: fact
        });
      });
    }
  }
  
  // Add generic trivia if we don't have enough
  if (defaultTrivia.length === 0) {
    defaultTrivia.push({
      text: `${film.title} was directed by ${film.director} and released in ${film.year}.`
    });
    defaultTrivia.push({
      text: `The film was shot in multiple locations, including ${film.coordinates.slice(0, 3).map(c => c.name).join(', ')}.`
    });
  }
  
  return defaultTrivia;
};

/**
 * Prepares all location data for the FilmLocationsGuide component
 */
export const prepareFilmLocationData = (film: FilmMeta) => {
  // Only process regions if this is a region-based layout
  const useRegionLayout = film.useRegionLayout === true;
  
  // For region-based layouts, ensure we have properly structured coordinates
  let regions: FilmRegion[] = [];
  
  if (useRegionLayout) {
    // First try to use explicitly defined regions if available
    if (film.regions && film.regions.length > 0) {
      regions = film.regions;
    } else {
      // Otherwise, generate regions from coordinates
      regions = groupLocationsByRegion(film);
      
      // Add images to regions based on the first location in each region if possible
      regions = regions.map(region => {
        if (!region.image && region.locations.length > 0) {
          const firstLocationWithImage = region.locations.find(loc => loc.image);
          if (firstLocationWithImage) {
            return {
              ...region,
              image: firstLocationWithImage.image
            };
          }
        }
        return region;
      });
    }
  } else {
    // For non-region layouts, create a simple default region
    regions = [createDefaultRegion(film)];
  }
  
  // Generate travel tips and trivia for all layouts
  const travelTips = extractTravelTips(film);
  const trivia = extractTrivia(film);
  
  return {
    regions,
    travelTips,
    trivia,
    useRegionLayout // Pass this flag to the component
  };
}; 
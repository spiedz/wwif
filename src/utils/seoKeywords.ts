/**
 * SEO Keywords for the Where Was It Filmed website
 * This file contains structured keyword data for use in SEO optimization
 */

// Keyword types for different page types
export interface Keyword {
  value: string;
  volume: 'very high' | 'high' | 'medium' | 'low' | 'very low';
  priority: 'very high' | 'high' | 'medium' | 'low' | 'very low';
}

// Page type keyword structures
export interface FilmPageKeywords {
  primary: Keyword[];
  secondary: Keyword[];
  longTail: Keyword[];
}

export interface LocationPageKeywords {
  primary: Keyword[];
  secondary: Keyword[];
  longTail: Keyword[];
}

export interface FranchisePageKeywords {
  primary: Keyword[];
  secondary: Keyword[];
  longTail: Keyword[];
}

// Generic film location keywords
export const genericFilmLocationKeywords: Keyword[] = [
  { value: "filming locations", volume: 'high', priority: 'high' },
  { value: "where was [film] filmed", volume: 'high', priority: 'high' },
  { value: "movie filming locations", volume: 'medium', priority: 'high' },
  { value: "real life movie locations", volume: 'medium', priority: 'high' },
  { value: "film location tours", volume: 'medium', priority: 'medium' },
  { value: "visit movie sets", volume: 'medium', priority: 'medium' },
  { value: "famous film locations", volume: 'medium', priority: 'medium' },
  { value: "movie scene locations", volume: 'low', priority: 'medium' },
  { value: "film tourism", volume: 'low', priority: 'low' },
  { value: "behind the scenes locations", volume: 'low', priority: 'low' }
];

// Franchise-specific keywords
export const franchiseKeywords: Record<string, Keyword[]> = {
  'harryPotter': [
    { value: "harry potter filming locations", volume: 'very high', priority: 'very high' },
    { value: "where was harry potter filmed", volume: 'very high', priority: 'very high' },
    { value: "hogwarts filming location", volume: 'high', priority: 'high' },
    { value: "harry potter film locations london", volume: 'medium', priority: 'high' },
    { value: "harry potter studio tour", volume: 'high', priority: 'high' }
  ],
  'lordOfTheRings': [
    { value: "lord of the rings filming locations", volume: 'high', priority: 'high' },
    { value: "where was lord of the rings filmed", volume: 'high', priority: 'high' },
    { value: "hobbiton movie set", volume: 'medium', priority: 'high' },
    { value: "new zealand lotr locations", volume: 'medium', priority: 'high' },
    { value: "mount doom filming location", volume: 'low', priority: 'medium' }
  ],
  'gameOfThrones': [
    { value: "game of thrones filming locations", volume: 'high', priority: 'high' },
    { value: "where was game of thrones filmed", volume: 'high', priority: 'high' },
    { value: "winterfell filming location", volume: 'medium', priority: 'high' },
    { value: "king's landing filming location", volume: 'medium', priority: 'high' },
    { value: "game of thrones locations ireland", volume: 'medium', priority: 'medium' }
  ],
  'starWars': [
    { value: "star wars filming locations", volume: 'medium', priority: 'high' },
    { value: "where was star wars filmed", volume: 'medium', priority: 'medium' },
    { value: "tatooine filming location", volume: 'low', priority: 'medium' },
    { value: "star wars tunisia locations", volume: 'low', priority: 'medium' },
    { value: "star wars ireland filming", volume: 'low', priority: 'medium' }
  ],
  'marvel': [
    { value: "marvel movie locations", volume: 'medium', priority: 'high' },
    { value: "avengers filming locations", volume: 'medium', priority: 'high' },
    { value: "wakanda filming location", volume: 'low', priority: 'medium' },
    { value: "where was black panther filmed", volume: 'medium', priority: 'medium' },
    { value: "thor new asgard filming location", volume: 'low', priority: 'medium' }
  ]
};

// Geographic location keywords
export const locationKeywords: Record<string, Keyword[]> = {
  'newYork': [
    { value: "movies filmed in new york", volume: 'high', priority: 'high' },
    { value: "new york filming locations", volume: 'medium', priority: 'high' },
    { value: "famous movie scenes new york", volume: 'medium', priority: 'medium' },
    { value: "tv shows filmed in nyc", volume: 'medium', priority: 'medium' },
    { value: "central park movie locations", volume: 'low', priority: 'medium' }
  ],
  'london': [
    { value: "movies filmed in london", volume: 'high', priority: 'high' },
    { value: "london filming locations", volume: 'medium', priority: 'high' },
    { value: "british movie locations", volume: 'low', priority: 'medium' },
    { value: "harry potter locations london", volume: 'high', priority: 'high' },
    { value: "sherlock holmes filming locations", volume: 'medium', priority: 'medium' }
  ],
  'losAngeles': [
    { value: "movies filmed in los angeles", volume: 'medium', priority: 'high' },
    { value: "hollywood filming locations", volume: 'medium', priority: 'high' },
    { value: "la la land filming locations", volume: 'medium', priority: 'medium' },
    { value: "famous movie studios los angeles", volume: 'low', priority: 'medium' },
    { value: "movies filmed in beverly hills", volume: 'low', priority: 'low' }
  ],
  'newZealand': [
    { value: "movies filmed in new zealand", volume: 'medium', priority: 'medium' },
    { value: "new zealand lord of the rings locations", volume: 'high', priority: 'high' },
    { value: "hobbiton movie set visit", volume: 'medium', priority: 'high' },
    { value: "wellington film locations", volume: 'low', priority: 'low' },
    { value: "avatar filming locations nz", volume: 'low', priority: 'medium' }
  ]
};

// Long-tail keywords
export const longTailKeywords: Keyword[] = [
  { value: "how to visit hogwarts filming location", volume: 'medium', priority: 'high' },
  { value: "where was the mountain scene in lord of the rings filmed", volume: 'low', priority: 'high' },
  { value: "can you visit the real jurassic park location", volume: 'low', priority: 'high' },
  { value: "game of thrones filming locations you can actually visit", volume: 'low', priority: 'medium' },
  { value: "best harry potter filming locations to visit in london", volume: 'low', priority: 'medium' },
  { value: "is the joker stairs a real location in new york", volume: 'low', priority: 'medium' },
  { value: "how to take photos at famous movie locations", volume: 'very low', priority: 'low' },
  { value: "filming locations from [movie] that are now abandoned", volume: 'very low', priority: 'low' },
  { value: "secret filming locations tourists don't know about", volume: 'very low', priority: 'low' },
  { value: "how to plan a trip to visit movie filming locations", volume: 'very low', priority: 'low' }
];

// Travel-related keywords
export const travelKeywords: Keyword[] = [
  { value: "film location tours", volume: 'medium', priority: 'high' },
  { value: "movie location vacation ideas", volume: 'low', priority: 'high' },
  { value: "visit game of thrones filming locations", volume: 'medium', priority: 'high' },
  { value: "harry potter studio tour tickets", volume: 'high', priority: 'high' },
  { value: "film location travel guide", volume: 'low', priority: 'medium' },
  { value: "best movie locations to visit in europe", volume: 'low', priority: 'medium' },
  { value: "movie location road trip", volume: 'very low', priority: 'medium' },
  { value: "budget travel to film locations", volume: 'very low', priority: 'low' },
  { value: "family friendly movie location tours", volume: 'very low', priority: 'low' },
  { value: "film location photography tips", volume: 'very low', priority: 'low' }
];

/**
 * Generate film page keywords by substituting the film name
 */
export function getFilmPageKeywords(filmName: string): FilmPageKeywords {
  return {
    primary: [
      { value: `where was ${filmName} filmed`, volume: 'high', priority: 'high' },
      { value: `${filmName} filming locations`, volume: 'high', priority: 'high' },
      { value: `${filmName} movie locations`, volume: 'medium', priority: 'high' }
    ],
    secondary: [
      { value: `${filmName} film locations to visit`, volume: 'medium', priority: 'medium' },
      { value: `${filmName} behind the scenes locations`, volume: 'low', priority: 'medium' },
      { value: `where to find ${filmName} filming sites`, volume: 'low', priority: 'medium' }
    ],
    longTail: [
      { value: `how to visit ${filmName} filming locations`, volume: 'low', priority: 'high' },
      { value: `is ${filmName} filmed in real locations`, volume: 'low', priority: 'medium' },
      { value: `${filmName} location tour guide`, volume: 'very low', priority: 'medium' }
    ]
  };
}

/**
 * Generate location page keywords by substituting the location name
 */
export function getLocationPageKeywords(locationName: string): LocationPageKeywords {
  return {
    primary: [
      { value: `movies filmed in ${locationName}`, volume: 'high', priority: 'high' },
      { value: `${locationName} filming locations`, volume: 'high', priority: 'high' },
      { value: `films shot in ${locationName}`, volume: 'medium', priority: 'high' }
    ],
    secondary: [
      { value: `famous scenes filmed in ${locationName}`, volume: 'medium', priority: 'medium' },
      { value: `${locationName} in movies`, volume: 'medium', priority: 'medium' },
      { value: `${locationName} movie tour`, volume: 'medium', priority: 'medium' }
    ],
    longTail: [
      { value: `best filming locations to visit in ${locationName}`, volume: 'low', priority: 'high' },
      { value: `self guided movie tour of ${locationName}`, volume: 'low', priority: 'medium' },
      { value: `hidden movie locations in ${locationName}`, volume: 'very low', priority: 'medium' }
    ]
  };
}

/**
 * Generate franchise page keywords by substituting the franchise name
 */
export function getFranchisePageKeywords(franchiseName: string): FranchisePageKeywords {
  return {
    primary: [
      { value: `${franchiseName} filming locations`, volume: 'high', priority: 'high' },
      { value: `where was ${franchiseName} filmed`, volume: 'high', priority: 'high' },
      { value: `${franchiseName} movie locations`, volume: 'medium', priority: 'high' }
    ],
    secondary: [
      { value: `visit ${franchiseName} locations`, volume: 'medium', priority: 'medium' },
      { value: `${franchiseName} filming sites`, volume: 'medium', priority: 'medium' },
      { value: `real ${franchiseName} locations`, volume: 'medium', priority: 'medium' }
    ],
    longTail: [
      { value: `complete guide to ${franchiseName} filming locations`, volume: 'low', priority: 'high' },
      { value: `best ${franchiseName} locations to visit`, volume: 'low', priority: 'medium' },
      { value: `${franchiseName} filming locations map`, volume: 'low', priority: 'medium' }
    ]
  };
}

/**
 * Get optimal keywords for meta description based on page type and name
 */
export function getOptimalMetaKeywords(pageType: 'film' | 'location' | 'franchise', name: string): string[] {
  switch (pageType) {
    case 'film':
      return getFilmPageKeywords(name).primary.map(k => k.value);
    case 'location':
      return getLocationPageKeywords(name).primary.map(k => k.value);
    case 'franchise':
      return getFranchisePageKeywords(name).primary.map(k => k.value);
    default:
      return [];
  }
} 
import { Content, FilmMeta } from '../types/content';
import { TVSeries } from '../types/series';
import { ActiveFilters, FilterOptions } from '../components/filtering/FilterSortPanel';

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Extract filter options from content
export function extractFilterOptions(
  films: Content<FilmMeta>[], 
  series: TVSeries[]
): FilterOptions {
  const allGenres = new Set<string>();
  const allYears = new Set<number>();
  const allCountries = new Set<string>();

  // Extract from films
  films.forEach(film => {
    // Handle genres
    if (Array.isArray(film.meta.genre)) {
      film.meta.genre.forEach(genre => allGenres.add(genre));
    } else if (film.meta.genre) {
      allGenres.add(film.meta.genre.toString());
    }

    // Handle years
    if (film.meta.year) {
      const yearNum = typeof film.meta.year === 'string' ? parseInt(film.meta.year) : film.meta.year;
      if (!isNaN(yearNum)) {
        allYears.add(yearNum);
      }
    }

    // Extract countries from filming locations if available
    if (film.meta.location) {
      if (Array.isArray(film.meta.location)) {
        film.meta.location.forEach(loc => allCountries.add(loc));
      } else {
        allCountries.add(film.meta.location);
      }
    }

    // Extract countries from regions if available
    if (film.meta.regions) {
      film.meta.regions.forEach(region => {
        allCountries.add(region.name);
      });
    }
  });

  // Extract from series
  series.forEach(show => {
    // Handle genres
    if (show.meta.genres) {
      show.meta.genres.forEach(genre => allGenres.add(genre));
    }

    // Handle years
    if (show.meta.releaseYearStart) {
      allYears.add(show.meta.releaseYearStart);
    }
    if (show.meta.releaseYearEnd) {
      allYears.add(show.meta.releaseYearEnd);
    }

    // Extract countries from locations if available
    if (show.locations) {
      show.locations.forEach(location => {
        // Extract potential country from location name
        allCountries.add(location.name);
      });
    }
  });

  return {
    genres: Array.from(allGenres).sort(),
    years: Array.from(allYears).sort((a, b) => b - a), // Most recent first
    countries: Array.from(allCountries).sort()
  };
}

// Filter films based on active filters
export function filterFilms(films: Content<FilmMeta>[], filters: ActiveFilters): Content<FilmMeta>[] {
  return films.filter(film => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        film.meta.title.toLowerCase().includes(searchTerm) ||
        film.meta.description?.toLowerCase().includes(searchTerm) ||
        film.meta.director?.toLowerCase().includes(searchTerm) ||
        (Array.isArray(film.meta.genre) 
          ? film.meta.genre.some(g => g.toLowerCase().includes(searchTerm))
          : film.meta.genre?.toString().toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Genre filter
    if (filters.genres.length > 0) {
      const filmGenres = Array.isArray(film.meta.genre) 
        ? film.meta.genre.map(g => g.toLowerCase())
        : [film.meta.genre?.toString().toLowerCase()].filter(Boolean);
      
      const hasMatchingGenre = filters.genres.some(filterGenre => 
        filmGenres.includes(filterGenre.toLowerCase())
      );
      
      if (!hasMatchingGenre) return false;
    }

    // Year range filter
    if (filters.yearRange[0] !== null || filters.yearRange[1] !== null) {
      const filmYear = film.meta.year;
      if (!filmYear) return false;
      
      const yearNum = typeof filmYear === 'string' ? parseInt(filmYear) : filmYear;
      if (isNaN(yearNum)) return false;
      
      if (filters.yearRange[0] !== null && yearNum < filters.yearRange[0]) return false;
      if (filters.yearRange[1] !== null && yearNum > filters.yearRange[1]) return false;
    }

    // Country filter
    if (filters.countries.length > 0) {
      const filmLocations = new Set<string>();
      
      // Add from meta.location if exists
      if (film.meta.location) {
        if (Array.isArray(film.meta.location)) {
          film.meta.location.forEach(loc => filmLocations.add(loc.toLowerCase()));
        } else {
          filmLocations.add(film.meta.location.toLowerCase());
        }
      }
      
      // Add from regions if exists
      if (film.meta.regions) {
        film.meta.regions.forEach(region => {
          filmLocations.add(region.name.toLowerCase());
        });
      }
      
      const hasMatchingLocation = filters.countries.some(filterCountry => 
        filmLocations.has(filterCountry.toLowerCase()) ||
        Array.from(filmLocations).some(loc => loc.includes(filterCountry.toLowerCase()))
      );
      
      if (!hasMatchingLocation) return false;
    }

    return true;
  });
}

// Filter series based on active filters
export function filterSeries(series: TVSeries[], filters: ActiveFilters): TVSeries[] {
  return series.filter(show => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        show.meta.title.toLowerCase().includes(searchTerm) ||
        show.meta.overview?.toLowerCase().includes(searchTerm) ||
        show.meta.creator?.toLowerCase().includes(searchTerm) ||
        show.meta.genres?.some(g => g.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Genre filter
    if (filters.genres.length > 0) {
      const showGenres = show.meta.genres?.map(g => g.toLowerCase()) || [];
      
      const hasMatchingGenre = filters.genres.some(filterGenre => 
        showGenres.includes(filterGenre.toLowerCase())
      );
      
      if (!hasMatchingGenre) return false;
    }

    // Year range filter
    if (filters.yearRange[0] !== null || filters.yearRange[1] !== null) {
      const startYear = show.meta.releaseYearStart;
      const endYear = show.meta.releaseYearEnd || new Date().getFullYear();
      
      if (!startYear) return false;
      
      // Check if the series overlaps with the filter range
      if (filters.yearRange[0] !== null && endYear < filters.yearRange[0]) return false;
      if (filters.yearRange[1] !== null && startYear > filters.yearRange[1]) return false;
    }

    // Country filter
    if (filters.countries.length > 0) {
      const showLocations = new Set<string>();
      
      // Add from locations if exists
      if (show.locations) {
        show.locations.forEach(location => {
          showLocations.add(location.name.toLowerCase());
        });
      }
      
      const hasMatchingLocation = filters.countries.some(filterCountry => 
        showLocations.has(filterCountry.toLowerCase()) ||
        Array.from(showLocations).some(loc => loc.includes(filterCountry.toLowerCase()))
      );
      
      if (!hasMatchingLocation) return false;
    }

    return true;
  });
}

// Sort films based on sort option
export function sortFilms(films: Content<FilmMeta>[], sortBy: string): Content<FilmMeta>[] {
  const sortedFilms = [...films];
  
  switch (sortBy) {
    case 'popular':
      // For now, we'll use a placeholder. In a real app, this would use page view data
      return sortedFilms.sort((a, b) => Math.random() - 0.5); // Random for demo
    
    case 'recent':
      return sortedFilms.sort((a, b) => {
        // Sort by date if available
        const dateA = new Date(a.meta.date || '').getTime();
        const dateB = new Date(b.meta.date || '').getTime();
        return dateB - dateA;
      });
    
    case 'alphabetical':
      return sortedFilms.sort((a, b) => a.meta.title.localeCompare(b.meta.title));
    
    case 'alphabetical-desc':
      return sortedFilms.sort((a, b) => b.meta.title.localeCompare(a.meta.title));
    
    case 'year-desc':
      return sortedFilms.sort((a, b) => {
        const yearA = a.meta.year ? (typeof a.meta.year === 'string' ? parseInt(a.meta.year) : a.meta.year) : 0;
        const yearB = b.meta.year ? (typeof b.meta.year === 'string' ? parseInt(b.meta.year) : b.meta.year) : 0;
        return yearB - yearA;
      });
    
    case 'year-asc':
      return sortedFilms.sort((a, b) => {
        const yearA = a.meta.year ? (typeof a.meta.year === 'string' ? parseInt(a.meta.year) : a.meta.year) : 0;
        const yearB = b.meta.year ? (typeof b.meta.year === 'string' ? parseInt(b.meta.year) : b.meta.year) : 0;
        return yearA - yearB;
      });
    
    default:
      return sortedFilms;
  }
}

// Sort series based on sort option
export function sortSeries(series: TVSeries[], sortBy: string): TVSeries[] {
  const sortedSeries = [...series];
  
  switch (sortBy) {
    case 'popular':
      // For now, we'll use a placeholder. In a real app, this would use page view data
      return sortedSeries.sort((a, b) => Math.random() - 0.5); // Random for demo
    
    case 'recent':
      return sortedSeries.sort((a, b) => {
        // Sort by date if available
        const dateA = new Date(a.meta.date || '').getTime();
        const dateB = new Date(b.meta.date || '').getTime();
        return dateB - dateA;
      });
    
    case 'alphabetical':
      return sortedSeries.sort((a, b) => a.meta.title.localeCompare(b.meta.title));
    
    case 'alphabetical-desc':
      return sortedSeries.sort((a, b) => b.meta.title.localeCompare(a.meta.title));
    
    case 'year-desc':
      return sortedSeries.sort((a, b) => (b.meta.releaseYearStart || 0) - (a.meta.releaseYearStart || 0));
    
    case 'year-asc':
      return sortedSeries.sort((a, b) => (a.meta.releaseYearStart || 0) - (b.meta.releaseYearStart || 0));
    
    default:
      return sortedSeries;
  }
}

// Paginate items
export function paginateItems<T>(
  items: T[], 
  currentPage: number, 
  itemsPerPage: number = 10
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage: validCurrentPage,
    itemsPerPage
  };
}

// URL state management helpers
export function encodeFilterState(filters: ActiveFilters, sortBy: string, currentPage: number): string {
  const params = new URLSearchParams();
  
  if (filters.search) params.set('search', filters.search);
  if (filters.genres.length > 0) params.set('genres', filters.genres.join(','));
  if (filters.countries.length > 0) params.set('countries', filters.countries.join(','));
  if (filters.yearRange[0] !== null) params.set('yearFrom', filters.yearRange[0].toString());
  if (filters.yearRange[1] !== null) params.set('yearTo', filters.yearRange[1].toString());
  if (sortBy !== 'alphabetical') params.set('sort', sortBy);
  if (currentPage > 1) params.set('page', currentPage.toString());
  
  return params.toString();
}

export function decodeFilterState(searchParams: URLSearchParams): {
  filters: ActiveFilters;
  sortBy: string;
  currentPage: number;
} {
  const filters: ActiveFilters = {
    search: searchParams.get('search') || '',
    genres: searchParams.get('genres')?.split(',').filter(Boolean) || [],
    countries: searchParams.get('countries')?.split(',').filter(Boolean) || [],
    yearRange: [
      searchParams.get('yearFrom') ? parseInt(searchParams.get('yearFrom')!) : null,
      searchParams.get('yearTo') ? parseInt(searchParams.get('yearTo')!) : null
    ]
  };
  
  const sortBy = searchParams.get('sort') || 'alphabetical';
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  return { filters, sortBy, currentPage };
} 
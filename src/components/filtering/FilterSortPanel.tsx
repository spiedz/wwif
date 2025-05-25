import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface FilterOptions {
  genres: string[];
  years: number[];
  countries: string[];
}

export interface SortOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ActiveFilters {
  genres: string[];
  yearRange: [number | null, number | null];
  countries: string[];
  search: string;
}

export interface FilterSortState {
  filters: ActiveFilters;
  sortBy: string;
  currentPage: number;
}

interface FilterSortPanelProps {
  filterOptions: FilterOptions;
  sortOptions: SortOption[];
  state: FilterSortState;
  onStateChange: (newState: FilterSortState) => void;
  totalResults: number;
  isLoading?: boolean;
  contentType: 'films' | 'series';
}

const FilterSortPanel: React.FC<FilterSortPanelProps> = ({
  filterOptions,
  sortOptions,
  state,
  onStateChange,
  totalResults,
  isLoading = false,
  contentType
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    years: false,
    countries: false
  });

  // Update state helper
  const updateState = (updates: Partial<FilterSortState>) => {
    onStateChange({
      ...state,
      ...updates,
      currentPage: updates.currentPage !== undefined ? updates.currentPage : 1 // Reset to page 1 when filters change
    });
  };

  // Toggle filter section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle genre filter
  const handleGenreChange = (genre: string) => {
    const newGenres = state.filters.genres.includes(genre)
      ? state.filters.genres.filter(g => g !== genre)
      : [...state.filters.genres, genre];
    
    updateState({
      filters: { ...state.filters, genres: newGenres }
    });
  };

  // Handle country filter
  const handleCountryChange = (country: string) => {
    const newCountries = state.filters.countries.includes(country)
      ? state.filters.countries.filter(c => c !== country)
      : [...state.filters.countries, country];
    
    updateState({
      filters: { ...state.filters, countries: newCountries }
    });
  };

  // Handle year range change
  const handleYearRangeChange = (type: 'min' | 'max', value: string) => {
    const yearValue = value ? parseInt(value) : null;
    const currentRange = state.filters.yearRange;
    
    const newRange: [number | null, number | null] = type === 'min' 
      ? [yearValue, currentRange[1]]
      : [currentRange[0], yearValue];
    
    updateState({
      filters: { ...state.filters, yearRange: newRange }
    });
  };

  // Handle search change
  const handleSearchChange = (search: string) => {
    updateState({
      filters: { ...state.filters, search }
    });
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    updateState({ sortBy });
  };

  // Clear all filters
  const clearAllFilters = () => {
    updateState({
      filters: {
        genres: [],
        yearRange: [null, null],
        countries: [],
        search: ''
      }
    });
  };

  // Check if any filters are active
  const hasActiveFilters = state.filters.genres.length > 0 || 
                          state.filters.countries.length > 0 || 
                          state.filters.yearRange[0] !== null || 
                          state.filters.yearRange[1] !== null ||
                          state.filters.search.trim() !== '';

  const getYearRange = () => {
    const years = filterOptions.years;
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  };

  const yearRange = getYearRange();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter & Sort {contentType === 'films' ? 'Films' : 'Series'}
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="sm:hidden flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? 'Hide' : 'Show'} Filters
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              )}
            </button>
          </div>

          {/* Results count and clear filters */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `${totalResults} results`}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-red-700 font-medium flex items-center"
              >
                Clear all
                <XMarkIcon className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={`Search ${contentType}...`}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={state.filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
          <select
            value={state.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter sections */}
      <div className={`${isExpanded ? 'block' : 'hidden'} sm:block p-4 space-y-6`}>
        {/* Genres Filter */}
        <div>
          <button
            onClick={() => toggleSection('genres')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-md font-medium text-gray-900">Genres</h4>
            {expandedSections.genres ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.genres && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filterOptions.genres.map((genre) => (
                <label key={genre} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.filters.genres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Year Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('years')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-md font-medium text-gray-900">Release Year</h4>
            {expandedSections.years ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.years && (
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <select
                  value={state.filters.yearRange[0] || ''}
                  onChange={(e) => handleYearRangeChange('min', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Any</option>
                  {filterOptions.years.sort((a, b) => a - b).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <select
                  value={state.filters.yearRange[1] || ''}
                  onChange={(e) => handleYearRangeChange('max', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Any</option>
                  {filterOptions.years.sort((a, b) => b - a).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Countries Filter */}
        <div>
          <button
            onClick={() => toggleSection('countries')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-md font-medium text-gray-900">Countries</h4>
            {expandedSections.countries ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.countries && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filterOptions.countries.map((country) => (
                <label key={country} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.filters.countries.includes(country)}
                    onChange={() => handleCountryChange(country)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">{country}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {state.filters.genres.map((genre) => (
                <span key={genre} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {genre}
                  <button
                    onClick={() => handleGenreChange(genre)}
                    className="ml-1 text-primary/60 hover:text-primary"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {state.filters.countries.map((country) => (
                <span key={country} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {country}
                  <button
                    onClick={() => handleCountryChange(country)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(state.filters.yearRange[0] || state.filters.yearRange[1]) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {state.filters.yearRange[0] || 'Any'} - {state.filters.yearRange[1] || 'Any'}
                  <button
                    onClick={() => updateState({ filters: { ...state.filters, yearRange: [null, null] } })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSortPanel; 
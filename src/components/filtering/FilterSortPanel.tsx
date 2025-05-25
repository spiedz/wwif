import React, { useState, useEffect } from 'react';
// Temporarily remove heroicons to fix null component issue
// import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

// Simple SVG icons to replace heroicons
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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
    if (years.length === 0) {
      return { min: 1900, max: new Date().getFullYear() };
    }
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
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
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
                <XMarkIcon />
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
      </div>

      {/* Filters and Sort Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden'} sm:block`}>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sort Options */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
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

          {/* Genre Filter */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Genres
              </label>
              <button
                onClick={() => toggleSection('genres')}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                {expandedSections.genres ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
            </div>
            {expandedSections.genres && (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                {filterOptions.genres.slice(0, 10).map((genre) => (
                  <label key={genre} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.filters.genres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{genre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Year Range Filter */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Year Range
              </label>
              <button
                onClick={() => toggleSection('years')}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                {expandedSections.years ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
            </div>
            {expandedSections.years && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="number"
                    min={yearRange.min}
                    max={yearRange.max}
                    value={state.filters.yearRange[0] || ''}
                    onChange={(e) => handleYearRangeChange('min', e.target.value)}
                    placeholder="Min year"
                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="number"
                    min={yearRange.min}
                    max={yearRange.max}
                    value={state.filters.yearRange[1] || ''}
                    onChange={(e) => handleYearRangeChange('max', e.target.value)}
                    placeholder="Max year"
                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Country Filter */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Countries
              </label>
              <button
                onClick={() => toggleSection('countries')}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                {expandedSections.countries ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
            </div>
            {expandedSections.countries && (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                {filterOptions.countries.slice(0, 10).map((country) => (
                  <label key={country} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.filters.countries.includes(country)}
                      onChange={() => handleCountryChange(country)}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSortPanel; 
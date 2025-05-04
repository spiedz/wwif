import React, { useState, useRef, useCallback, useEffect } from 'react';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import useClickOutside from '../../hooks/useClickOutside';
import { FilmMeta } from '../../types/content';
import debounce from 'lodash.debounce';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  results?: Array<{
    item: {
      meta: FilmMeta;
      content?: string;
      html?: string;
    };
    matches?: Array<{ indices: number[][], key: string, value: string }>;
  }>;
  isLoading?: boolean;
  className?: string;
  initialValue?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  onSuggestionSelect?: (film: FilmMeta) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  results = [],
  isLoading = false,
  className = '',
  initialValue = '',
  autoFocus = false,
  showSuggestions = false,
  onSuggestionSelect,
  placeholder,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Reset query state when initialValue prop changes
  useEffect(() => {
    if (initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Create debounced search function only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300),
    [onSearch]
  );

  // Handle input change
  const handleChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = () => {
    setFocused(false);
  };

  // Handle direct search submission
  const handleSearch = (searchQuery: string) => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  // Handle film selection
  const handleFilmSelect = (film: FilmMeta) => {
    setFocused(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(film);
    }
  };

  // Handle focus events
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    // Don't blur immediately to allow clicks on suggestions
    setTimeout(() => {
      if (document.activeElement !== wrapperRef.current && 
         !wrapperRef.current?.contains(document.activeElement)) {
        setFocused(false);
      }
    }, 150);
  };

  // Close suggestions when clicking outside
  useClickOutside(wrapperRef, () => {
    setFocused(false);
  });

  // Determine whether to show suggestions
  const shouldShowSuggestions = showSuggestions && focused && query.trim().length > 0 && results.length > 0;

  return (
    <div 
      ref={wrapperRef} 
      className={`relative ${className}`}
    >
      <SearchInput
        placeholder={placeholder}
        initialValue={query}
        onSearch={handleSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        autoFocus={autoFocus}
      />

      {shouldShowSuggestions && (
        <div className="absolute z-20 left-0 right-0 mt-1">
          <SearchSuggestions 
            results={results}
            query={query}
            onSelect={handleSuggestionSelect}
            onItemClick={handleFilmSelect}
            isLoading={isLoading}
            className="shadow-lg border border-gray-200 rounded-lg bg-white"
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar; 
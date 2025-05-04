import React, { useState } from 'react';

interface RecentSearchesProps {
  searches: string[];
  onSearchSelect: (query: string) => void;
  className?: string;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSearchSelect,
  className = '',
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>(searches);

  // If there are no recent searches, don't render anything
  if (!recentSearches.length) {
    return null;
  }

  // Clear all recent searches
  const clearAllSearches = () => {
    try {
      localStorage.removeItem('recentSearches');
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing searches:', error);
    }
  };

  // Remove a single search
  const removeSearch = (index: number) => {
    try {
      const updatedSearches = [...recentSearches];
      updatedSearches.splice(index, 1);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Error removing search:', error);
    }
  };

  return (
    <div className={`bg-white p-4 rounded-md border border-gray-200 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Recent Searches</h2>
        <button
          onClick={clearAllSearches}
          className="text-xs text-primary hover:text-primary-dark"
        >
          Clear All
        </button>
      </div>
      
      <ul className="space-y-2">
        {recentSearches.map((search, index) => (
          <li key={index} className="flex items-center justify-between">
            <button
              onClick={() => onSearchSelect(search)}
              className="text-sm text-gray-700 hover:text-primary flex items-center"
            >
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate max-w-[80%]">{search}</span>
            </button>
            
            <button
              onClick={() => removeSearch(index)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Remove search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches; 
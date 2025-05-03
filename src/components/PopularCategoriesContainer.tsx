import React, { useState, useEffect } from 'react';
import PopularCategories from './PopularCategories';
import categoryAnalyticsService, { CategoryCount, CategorySortOrder, CategoryFilterOptions } from '../utils/categoryAnalytics';

interface PopularCategoriesContainerProps {
  title?: string;
  showViewAll?: boolean;
  maxCategories?: number;
  sortOrder?: CategorySortOrder;
  filterOptions?: CategoryFilterOptions;
  refreshInterval?: number; // In milliseconds, refresh data periodically
}

const PopularCategoriesContainer: React.FC<PopularCategoriesContainerProps> = ({
  title,
  showViewAll,
  maxCategories = 6,
  sortOrder = CategorySortOrder.POPULARITY,
  filterOptions,
  refreshInterval = 0, // Default: no auto-refresh
}) => {
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Method to fetch categories that can be called manually or by useEffect
  const fetchCategories = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Force refresh cache if requested
      if (forceRefresh) {
        await categoryAnalyticsService.refreshCache();
      }
      
      const popularCategories = await categoryAnalyticsService.getPopularCategories(
        maxCategories,
        sortOrder,
        filterOptions
      );
      
      setCategories(popularCategories);
    } catch (err) {
      console.error('Error fetching popular categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount and when props change
  useEffect(() => {
    // Reset state when props change
    setCategories([]);
    setLoading(true);
    setError(null);
    
    fetchCategories();
    
    // Set up periodic refresh if requested
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchCategories(true);
      }, refreshInterval);
      
      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [maxCategories, sortOrder, filterOptions, refreshInterval]);

  // Retry logic with exponential backoff
  useEffect(() => {
    // If there's an error and we haven't exceeded retry limit (3 attempts)
    if (error && retryCount < 3) {
      const backoffTime = Math.pow(2, retryCount) * 1000; // 2^n seconds
      
      const retryTimer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchCategories();
      }, backoffTime);
      
      return () => clearTimeout(retryTimer);
    }
  }, [error, retryCount]);

  // Manual refresh handler - useful for adding to a refresh button
  const handleRefresh = () => {
    setRetryCount(0); // Reset retry count
    fetchCategories(true);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <p>Error: {error}</p>
          <button 
            onClick={handleRefresh}
            className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PopularCategories 
      categories={categories} 
      title={title} 
      showViewAll={showViewAll} 
      maxCategories={maxCategories}
      loading={loading}
    />
  );
};

export default PopularCategoriesContainer; 
import { Content, FilmMeta } from '../types/content';

export interface CategoryCount {
  name: string;
  count: number;
}

export enum CategorySortOrder {
  POPULARITY = 'popularity',
  ALPHABETICAL = 'alphabetical',
  REVERSE_ALPHABETICAL = 'reverse_alphabetical',
}

export interface CategoryFilterOptions {
  minCount?: number;
  excludeCategories?: string[];
  includeOnlyCategories?: string[];
}

/**
 * Service for analyzing film categories and extracting popularity data
 */
export class CategoryAnalyticsService {
  private static instance: CategoryAnalyticsService;
  private cachedCategories: CategoryCount[] | null = null;
  private lastCacheTime: number = 0;
  private cacheDuration: number = 1000 * 60 * 60; // 1 hour cache

  /**
   * Get singleton instance
   */
  public static getInstance(): CategoryAnalyticsService {
    if (!CategoryAnalyticsService.instance) {
      CategoryAnalyticsService.instance = new CategoryAnalyticsService();
    }
    return CategoryAnalyticsService.instance;
  }

  /**
   * Fetch categories from API endpoint
   */
  private async fetchCategories(): Promise<CategoryCount[]> {
    try {
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
  
  /**
   * Normalize category name to handle case differences and whitespace
   */
  private normalizeCategory(category: string): string {
    return category.trim().toLowerCase();
  }
  
  /**
   * Apply filters to categories
   */
  private filterCategories(
    categories: CategoryCount[], 
    filterOptions?: CategoryFilterOptions
  ): CategoryCount[] {
    if (!filterOptions) return categories;
    
    let filteredCategories = [...categories]; // Create a copy to avoid modifying original
    
    // Filter by minimum count
    if (typeof filterOptions.minCount === 'number') {
      filteredCategories = filteredCategories.filter(cat => cat.count >= filterOptions.minCount!);
    }
    
    // Filter out excluded categories
    if (filterOptions.excludeCategories && filterOptions.excludeCategories.length > 0) {
      const normalizedExcludes = filterOptions.excludeCategories.map(cat => 
        this.normalizeCategory(cat)
      );
      
      filteredCategories = filteredCategories.filter(cat => 
        !normalizedExcludes.includes(this.normalizeCategory(cat.name))
      );
    }
    
    // Filter to include only specified categories
    if (filterOptions.includeOnlyCategories && filterOptions.includeOnlyCategories.length > 0) {
      const normalizedIncludes = filterOptions.includeOnlyCategories.map(cat => 
        this.normalizeCategory(cat)
      );
      
      filteredCategories = filteredCategories.filter(cat => 
        normalizedIncludes.includes(this.normalizeCategory(cat.name))
      );
    }
    
    return filteredCategories;
  }
  
  /**
   * Sort categories based on specified order
   */
  private sortCategories(
    categories: CategoryCount[], 
    sortOrder: CategorySortOrder = CategorySortOrder.POPULARITY
  ): CategoryCount[] {
    const sortedCategories = [...categories]; // Create a copy to avoid modifying original
    
    switch (sortOrder) {
      case CategorySortOrder.ALPHABETICAL:
        sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case CategorySortOrder.REVERSE_ALPHABETICAL:
        sortedCategories.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case CategorySortOrder.POPULARITY:
      default:
        sortedCategories.sort((a, b) => b.count - a.count);
        break;
    }
    
    return sortedCategories;
  }
  
  /**
   * Get popular categories with optional limit, sort order, and filters
   */
  public async getPopularCategories(
    limit: number = 10,
    sortOrder: CategorySortOrder = CategorySortOrder.POPULARITY,
    filterOptions?: CategoryFilterOptions
  ): Promise<CategoryCount[]> {
    try {
      // Check if cache is still valid
      const now = Date.now();
      if (!this.cachedCategories || (now - this.lastCacheTime > this.cacheDuration)) {
        // Cache expired or doesn't exist, fetch fresh data
        this.cachedCategories = await this.fetchCategories();
        this.lastCacheTime = now;
      }
      
      if (!this.cachedCategories || this.cachedCategories.length === 0) {
        return [];
      }
      
      // Apply filters
      const filteredCategories = this.filterCategories(this.cachedCategories, filterOptions);
      
      // Apply sort order
      const sortedCategories = this.sortCategories(filteredCategories, sortOrder);
      
      // Return limited number of categories
      return sortedCategories.slice(0, limit);
    } catch (error) {
      console.error('Error getting popular categories:', error);
      return [];
    }
  }
  
  /**
   * Force refresh the category cache
   */
  public async refreshCache(): Promise<void> {
    try {
      this.cachedCategories = await this.fetchCategories();
      this.lastCacheTime = Date.now();
    } catch (error) {
      console.error('Error refreshing category cache:', error);
      // Keep the old cache if refresh fails
    }
  }
  
  /**
   * Get films by category name
   */
  public async getFilmsByCategory(categoryName: string): Promise<Content<FilmMeta>[]> {
    try {
      const encodedName = encodeURIComponent(categoryName.toLowerCase());
      const response = await fetch(`/api/categories/${encodedName}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.films || [];
    } catch (error) {
      console.error(`Error getting films by category (${categoryName}):`, error);
      return [];
    }
  }
  
  /**
   * Get category counts for analytics purposes
   */
  public async getCategoryCounts(): Promise<Record<string, number>> {
    try {
      // Check if cache is still valid
      const now = Date.now();
      if (!this.cachedCategories || (now - this.lastCacheTime > this.cacheDuration)) {
        // Cache expired or doesn't exist, fetch fresh data
        this.cachedCategories = await this.fetchCategories();
        this.lastCacheTime = now;
      }
      
      // Convert to record object
      return this.cachedCategories.reduce((acc, { name, count }) => {
        acc[name] = count;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('Error getting category counts:', error);
      return {};
    }
  }
}

// Export a default instance for easy imports
export default CategoryAnalyticsService.getInstance(); 
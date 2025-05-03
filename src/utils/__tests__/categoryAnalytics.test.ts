/**
 * Unit tests for the CategoryAnalyticsService
 * 
 * To run: npm test
 */
import categoryAnalyticsService, { CategoryAnalyticsService, CategoryCount, CategorySortOrder, CategoryFilterOptions } from '../categoryAnalytics';
import { Content, FilmMeta } from '../../types/content';

// Mock fetch globally
global.fetch = jest.fn();

// Sample category data for API response
const mockCategoriesResponse = {
  categories: [
    { name: 'Action', count: 3 },
    { name: 'Drama', count: 3 },
    { name: 'Adventure', count: 2 },
    { name: 'Sci-Fi', count: 2 },
    { name: 'Comedy', count: 1 },
    { name: 'Romance', count: 1 },
    { name: 'Thriller', count: 1 },
  ],
  total: 7
};

// Sample films by category data for API response
const mockFilmsByCategoryResponse = {
  category: 'action',
  count: 3,
  films: [
    {
      meta: {
        title: 'Film 1',
        slug: 'film-1',
        categories: ['Action', 'Adventure'],
        genre: ['Action', 'Adventure']
      },
      content: '',
      html: ''
    },
    {
      meta: {
        title: 'Film 3',
        slug: 'film-3',
        categories: ['Action', 'Sci-Fi'],
        genre: ['Action', 'Sci-Fi']
      },
      content: '',
      html: ''
    },
    {
      meta: {
        title: 'Film 6',
        slug: 'film-6',
        categories: ['Action', 'Thriller'],
        genre: ['Action', 'Thriller']
      },
      content: '',
      html: ''
    }
  ]
};

describe('CategoryAnalyticsService', () => {
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the fetch mock
    (global.fetch as jest.Mock).mockReset();
    
    // Mock the fetch for categories endpoint
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategoriesResponse),
          status: 200,
        });
      } else if (url.startsWith('/api/categories/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFilmsByCategoryResponse),
          status: 200,
        });
      }
      
      // Default response for unknown URLs
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Not found' }),
        status: 404,
      });
    });
    
    // Reset service internal state
    categoryAnalyticsService.refreshCache();
  });

  it('should fetch categories from the API', async () => {
    const categories = await categoryAnalyticsService.getPopularCategories();
    
    // Verify fetch was called with the right URL
    expect(global.fetch).toHaveBeenCalledWith('/api/categories');
    
    // We should get the categories from our mock response
    expect(categories.length).toBe(7);
    
    // Verify first few categories match expected data
    expect(categories[0].name).toBe('Action');
    expect(categories[0].count).toBe(3);
    expect(categories[1].name).toBe('Drama');
    expect(categories[1].count).toBe(3);
  });

  it('should limit the number of categories returned', async () => {
    const categories = await categoryAnalyticsService.getPopularCategories(3);
    
    // Should only return 3 categories
    expect(categories.length).toBe(3);
    
    // Should be the top 3 by popularity
    expect(categories[0].name).toBe('Action');
    expect(categories[1].name).toBe('Drama');
    expect(categories[2].name).toBe('Adventure');
  });

  it('should sort categories alphabetically when specified', async () => {
    const categories = await categoryAnalyticsService.getPopularCategories(
      10, // Get all categories
      CategorySortOrder.ALPHABETICAL
    );
    
    // Categories should be in alphabetical order
    const categoryNames = categories.map(cat => cat.name);
    const sortedNames = [...categoryNames].sort();
    
    expect(categoryNames).toEqual(sortedNames);
  });

  it('should filter categories by minimum count', async () => {
    const filterOptions: CategoryFilterOptions = {
      minCount: 2, // Only categories with count >= 2
    };
    
    const categories = await categoryAnalyticsService.getPopularCategories(
      10,
      CategorySortOrder.POPULARITY,
      filterOptions
    );
    
    // Only categories with count >= 2 should be included
    expect(categories.every((cat: CategoryCount) => cat.count >= 2)).toBeTruthy();
    
    // Check Action, Drama, Adventure, and Sci-Fi are included (all have count >= 2)
    const categoryNames = categories.map((cat: CategoryCount) => cat.name);
    expect(categoryNames).toContain('Action');
    expect(categoryNames).toContain('Drama');
    expect(categoryNames).toContain('Adventure');
    expect(categoryNames).toContain('Sci-Fi');
    
    // Comedy, Romance, and Thriller should be excluded (count = 1)
    expect(categoryNames).not.toContain('Comedy');
    expect(categoryNames).not.toContain('Romance');
    expect(categoryNames).not.toContain('Thriller');
  });

  it('should find films by category', async () => {
    const actionFilms = await categoryAnalyticsService.getFilmsByCategory('Action');
    
    // Verify fetch was called with the right URL (encoded)
    expect(global.fetch).toHaveBeenCalledWith('/api/categories/action');
    
    // Should have 3 action films based on our mock response
    expect(actionFilms.length).toBe(3);
    
    // Film titles should match our mock data
    const actionFilmTitles = actionFilms.map((film: Content<FilmMeta>) => film.meta.title);
    expect(actionFilmTitles).toContain('Film 1');
    expect(actionFilmTitles).toContain('Film 3');
    expect(actionFilmTitles).toContain('Film 6');
  });

  it('should handle API errors gracefully', async () => {
    // Clear the existing cache first to ensure we make a new API call
    await categoryAnalyticsService.refreshCache();
    
    // Override the fetch mock specifically for this test
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    );
    
    // Fetch new categories - this should trigger a new API call since we cleared the cache
    const categories = await categoryAnalyticsService.getPopularCategories();
    
    // Verify the error API call was made
    expect(global.fetch).toHaveBeenCalledWith('/api/categories');
    
    // Should return an empty array when API fails
    expect(categories).toEqual([]);
  });

  it('should use the cache for subsequent calls', async () => {
    // First call to get initial data
    await categoryAnalyticsService.getPopularCategories();
    
    // Fetch should be called once
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // Calling again should use cache
    await categoryAnalyticsService.getPopularCategories();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // Refresh cache
    await categoryAnalyticsService.refreshCache();
    
    // Fetch should be called again after cache refresh
    expect(global.fetch).toHaveBeenCalledTimes(2);
    
    // Getting categories should not call fetch again (using the refreshed cache)
    await categoryAnalyticsService.getPopularCategories();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
}); 
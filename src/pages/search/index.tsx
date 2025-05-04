import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import SearchBar from '../../components/search/SearchBar';
import RecentSearches from '../../components/search/RecentSearches';
import Image from 'next/image';
import Link from 'next/link';
import { FilmMeta } from '../../types/content';
import Head from 'next/head';
import debounce from 'lodash.debounce';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { q: queryParam } = router.query;
  
  const [query, setQuery] = useState(typeof queryParam === 'string' ? queryParam : '');
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Page meta for SEO
  const pageTitle = query ? `Search results for "${query}" | Where Was It Filmed` : "Search Films | Where Was It Filmed";
  const pageDescription = "Search for films by title, filming locations, directors and more";

  // Update query when URL param changes
  useEffect(() => {
    if (typeof queryParam === 'string' && queryParam !== query) {
      setQuery(queryParam);
    }
  }, [queryParam]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem('recentSearches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Save a search term to recent searches
  const saveSearch = (term: string) => {
    try {
      if (!term.trim()) return;
      
      const newSearches = [
        term,
        ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())
      ].slice(0, 5);
      
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  // Fetch search results
  const fetchResults = useCallback(async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=12`);
      const data = await res.json();
      
      if (data && Array.isArray(data.results)) {
        setResults(data.results);
        setTotalResults(data.totalResults || 0);
        setTotalPages(data.totalPages || 1);
        if (page !== currentPage) {
          setCurrentPage(page);
        }
        
        // Save search to recent searches
        saveSearch(searchQuery);
      } else {
        setResults([]);
        setTotalResults(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, recentSearches]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      // Update URL without refreshing the page
      router.replace({
        pathname: '/search',
        query: searchQuery ? { q: searchQuery } : {},
      }, undefined, { shallow: true });
      
      fetchResults(searchQuery, 1);
    }, 300),
    [fetchResults, router]
  );

  // Handle search input
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchResults(query, page);
    } catch (error) {
      console.error('Error changing page:', error);
    }
  };

  // Initial search when query param is present
  useEffect(() => {
    if (query) {
      fetchResults(query, 1);
    }
  }, []);

  // Generate pagination links
  const getPaginationLinks = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Show current page neighborhood
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Always show last page for pages > 1
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    // Sort pages and add ellipses
    const sortedPages = [...new Set(pages)].sort((a, b) => a - b);
    const paginationItems = [];
    
    for (let i = 0; i < sortedPages.length; i++) {
      // Add ellipsis if there's a gap
      if (i > 0 && sortedPages[i] > sortedPages[i-1] + 1) {
        paginationItems.push('...');
      }
      paginationItems.push(sortedPages[i]);
    }
    
    return paginationItems;
  };

  // Extract film data from search result item
  const getFilmData = (result: any) => {
    // Handle different result formats
    if (result.item && result.item.meta) {
      return result.item.meta;
    } else if (result.meta) {
      return result.meta;
    } else {
      return result;
    }
  };

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Search Films</h1>
            
            <SearchBar 
              initialValue={query}
              onSearch={handleSearch}
              autoFocus={true}
              placeholder="Search for films, locations, directors..."
              className="mb-4"
            />
            
            {recentSearches.length > 0 && !query && (
              <div className="mt-4">
                <RecentSearches 
                  searches={recentSearches} 
                  onSearchSelect={handleSearch}
                />
              </div>
            )}
          </div>
          
          {query && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {loading ? 'Searching...' : totalResults 
                  ? `Found ${totalResults} ${totalResults === 1 ? 'result' : 'results'} for "${query}"`
                  : `No results found for "${query}"`
                }
              </h2>
              
              {loading ? (
                <div className="flex justify-center my-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {totalResults > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {results.map((result, index) => {
                        // Get film data with fallback for different structures
                        const film = getFilmData(result);
                        
                        // Ensure film data is valid
                        if (!film) return null;

                        // Create a safe slug for the link
                        const filmSlug = film.slug || `unknown-${index}`;
                        
                        return (
                          <Link 
                            href={`/films/${filmSlug}`} 
                            key={`film-${index}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="aspect-video relative bg-gray-200">
                              {film.posterImage ? (
                                <div className="relative w-full h-40">
                                  <Image 
                                    src={film.posterImage} 
                                    alt={film.title || 'Film poster'}
                                    fill
                                    className="object-cover" 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-40 flex items-center justify-center text-gray-400">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-1 line-clamp-2">
                                {film.title || 'Untitled Film'}
                              </h3>
                              
                              {film.year && (
                                <p className="text-gray-600 mb-1">{film.year}</p>
                              )}
                              
                              {film.director && (
                                <p className="text-sm text-gray-600 mb-2">Director: {film.director}</p>
                              )}
                              
                              {film.genre && (
                                <div className="flex flex-wrap gap-1 mt-1 mb-3">
                                  {Array.isArray(film.genre) 
                                    ? film.genre.filter(Boolean).map((genre: string, idx: number) => (
                                        <span 
                                          key={`genre-${idx}`} 
                                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                        >
                                          {genre}
                                        </span>
                                      ))
                                    : typeof film.genre === 'string' ? (
                                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                          {film.genre}
                                        </span>
                                      ) : null
                                  }
                                </div>
                              )}
                              
                              {film.description && (
                                <p className="text-gray-700 text-sm line-clamp-2">
                                  {film.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : query && (
                    <div className="text-center my-12">
                      <p className="text-gray-600 mb-4">No results found for your search.</p>
                      <p className="text-gray-600">Try different keywords or check for spelling errors.</p>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md 
                            ${currentPage === 1 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          Previous
                        </button>
                        
                        {getPaginationLinks().map((page, index) => 
                          page === '...' ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700"
                            >
                              {page}
                            </span>
                          ) : (
                            <button
                              key={`page-${page}`}
                              onClick={() => handlePageChange(page as number)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium 
                                ${currentPage === page
                                  ? 'bg-primary text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              aria-current={currentPage === page ? 'page' : undefined}
                            >
                              {page}
                            </button>
                          )
                        )}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md 
                            ${currentPage === totalPages 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage; 
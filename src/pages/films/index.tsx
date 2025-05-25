import React, { useState, useEffect, useMemo } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAllFilms, getAllSeries } from '../../lib/server/serverMarkdown';
import { Content, FilmMeta } from '../../types/content';
import { TVSeries } from '../../types/series';
import FilterSortPanel, { 
  FilterSortState, 
  SortOption 
} from '../../components/filtering/FilterSortPanel';
import Pagination from '../../components/pagination/Pagination';
import { 
  extractFilterOptions,
  filterFilms,
  sortFilms,
  paginateItems,
  encodeFilterState,
  decodeFilterState
} from '../../utils/contentFiltering';
// import BannerAd from '../../components/ads/BannerAd';
// import { AD_SLOTS } from '../../utils/adManager';

interface FilmsPageProps {
  allFilms: Content<FilmMeta>[];
  allSeries: TVSeries[];
}

const ITEMS_PER_PAGE = 10;

const sortOptions: SortOption[] = [
  { label: 'A-Z', value: 'alphabetical' },
  { label: 'Z-A', value: 'alphabetical-desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Newest Films', value: 'year-desc' },
  { label: 'Oldest Films', value: 'year-asc' }
];

export default function FilmsPage({ allFilms, allSeries }: FilmsPageProps) {
  const router = useRouter();
  
  // Initialize state from URL parameters
  const [filterSortState, setFilterSortState] = useState<FilterSortState>(() => {
    const { filters, sortBy, currentPage } = decodeFilterState(new URLSearchParams(router.asPath.split('?')[1] || ''));
    return {
      filters,
      sortBy,
      currentPage
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  // Extract filter options from all content
  const filterOptions = useMemo(() => {
    return extractFilterOptions(allFilms, allSeries);
  }, [allFilms, allSeries]);

  // Apply filters and sorting
  const processedFilms = useMemo(() => {
    setIsLoading(true);
    try {
      // Filter films
      const filtered = filterFilms(allFilms, filterSortState.filters);
      
      // Sort films
      const sorted = sortFilms(filtered, filterSortState.sortBy);
      
      // Paginate films
      const paginated = paginateItems(sorted, filterSortState.currentPage, ITEMS_PER_PAGE);
      
      return paginated;
    } finally {
      setIsLoading(false);
    }
  }, [allFilms, filterSortState]);

  // Update URL when filter state changes
  useEffect(() => {
    const queryString = encodeFilterState(
      filterSortState.filters,
      filterSortState.sortBy,
      filterSortState.currentPage
    );
    
    const newUrl = queryString ? `/films?${queryString}` : '/films';
    
    if (router.asPath !== newUrl) {
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [filterSortState, router]);

  // Update state from URL changes (back/forward navigation)
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const { filters, sortBy, currentPage } = decodeFilterState(urlParams);
      
      setFilterSortState({
        filters,
        sortBy,
        currentPage
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilterSortState(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Handle filter/sort state change
  const handleStateChange = (newState: FilterSortState) => {
    setFilterSortState(newState);
  };

  // Generate page title and description
  const getPageTitle = () => {
    const hasFilters = filterSortState.filters.genres.length > 0 || 
                      filterSortState.filters.countries.length > 0 || 
                      filterSortState.filters.search.trim() !== '';
    
    if (hasFilters) {
      const filterTerms = [
        ...filterSortState.filters.genres,
        ...filterSortState.filters.countries,
        filterSortState.filters.search
      ].filter(Boolean).join(', ');
      
      return `${filterTerms} Films | Where Was It Filmed`;
    }
    
    return 'Film Locations | Where Was It Filmed';
  };

  const getMetaDescription = () => {
    const hasFilters = filterSortState.filters.genres.length > 0 || 
                      filterSortState.filters.countries.length > 0;
    
    if (hasFilters) {
      const filterTerms = [
        ...filterSortState.filters.genres,
        ...filterSortState.filters.countries
      ].filter(Boolean).join(', ');
      
      return `Explore filming locations of ${filterTerms} movies. Discover where your favorite films were shot with detailed location guides.`;
    }
    
    return `Explore the real filming locations of ${processedFilms.totalItems}+ movies. Discover where your favorite films were shot with detailed location guides, maps, and travel tips.`;
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://wherewasitfilmed.co${router.asPath.split('?')[0]}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://wherewasitfilmed.co${router.asPath}`} />
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getMetaDescription()} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Film Locations
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Discover the real-world filming locations of your favorite movies. 
            Filter by genre, country, or year to find exactly what you're looking for.
          </p>
        </div>
        
        {/* Ad Banner - temporarily disabled */}
        {/* <BannerAd slot={AD_SLOTS.FILM_PAGE_BANNER} className="mb-8" /> */}
        
        {/* Filter and Sort Panel */}
        <FilterSortPanel
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          state={filterSortState}
          onStateChange={handleStateChange}
          totalResults={processedFilms.totalItems}
          isLoading={isLoading}
          contentType="films"
        />
        
        {/* Films Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(ITEMS_PER_PAGE).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : processedFilms.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedFilms.items.map((film) => (
                <Link href={`/films/${film.meta.slug}`} key={film.meta.slug} className="block group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                    <div className="relative h-48 overflow-hidden">
                      {film.meta.posterImage ? (
                        <div className="w-full h-full relative">
                          <img 
                            src={film.meta.posterImage}
                            alt={`${film.meta.title} poster`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-200">
                          <div className="text-4xl font-bold text-gray-400 opacity-60">
                            {film.meta.year}
                          </div>
                        </div>
                      )}
                      
                      {/* Year badge */}
                      {film.meta.year && (
                        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                          {film.meta.year}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {film.meta.title}
                      </h2>
                      
                      {/* Director */}
                      {film.meta.director && (
                        <p className="text-gray-600 text-sm mb-2">
                          <span className="font-medium">Director:</span> {film.meta.director}
                        </p>
                      )}
                      
                      {/* Genre */}
                      {film.meta.genre && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(() => {
                            const genres: string[] = Array.isArray(film.meta.genre) ? film.meta.genre : [film.meta.genre as string];
                            return genres.slice(0, 2).map((genre: string, index: number) => (
                              <span key={index} className="text-xs font-medium py-1 px-2 bg-primary/10 text-primary rounded-full">
                                {genre}
                              </span>
                            ));
                          })()}
                          {Array.isArray(film.meta.genre) && film.meta.genre.length > 2 && (
                            <span className="text-xs font-medium py-1 px-2 bg-gray-100 text-gray-700 rounded-full">
                              +{film.meta.genre.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {film.meta.description}
                      </p>
                      
                      {/* View link */}
                      <div className="flex justify-end">
                        <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary-dark transition-colors">
                          View Locations
                          <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {processedFilms.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={processedFilms.currentPage}
                  totalPages={processedFilms.totalPages}
                  totalItems={processedFilms.totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No films found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or clearing some filters to see more results.
              </p>
              <button
                onClick={() => setFilterSortState(prev => ({
                  ...prev,
                  filters: {
                    genres: [],
                    yearRange: [null, null],
                    countries: [],
                    search: ''
                  },
                  currentPage: 1
                }))}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Clear All Filters
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<FilmsPageProps> = async () => {
  try {
    const allFilms = await getAllFilms();
    const allSeries = await getAllSeries();
    console.log(`Found ${allFilms.length} films and ${allSeries.length} series for page generation`);

    return {
      props: {
        allFilms,
        allSeries,
      },
      revalidate: 86400, // 24 hours
    };
  } catch (error) {
    console.error('Error in getStaticProps for films index:', error);
    return {
      notFound: true,
    };
  }
}; 

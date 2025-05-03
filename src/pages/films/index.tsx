import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAllFilms } from '../../utils/markdown';
import { Content, FilmMeta } from '../../types/content';
import categoryAnalyticsService from '../../utils/categoryAnalytics';
import PopularCategoriesContainer from '../../components/PopularCategoriesContainer';
import BannerAd from '../../components/ads/BannerAd';
import { AD_SLOTS } from '../../utils/adManager';

interface FilmsPageProps {
  allFilms: Content<FilmMeta>[];
}

export default function FilmsPage({ allFilms }: FilmsPageProps) {
  const router = useRouter();
  const { category, genre } = router.query;
  
  const [films, setFilms] = useState<Content<FilmMeta>[]>(allFilms);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<{type: string, value: string} | null>(null);
  
  // Apply filtering based on URL parameters
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      
      try {
        // Priority to category filter first (more specific)
        if (category && typeof category === 'string') {
          const normalizedCategory = category.toLowerCase();
          // Use the service to get films by category
          const filteredFilms = await categoryAnalyticsService.getFilmsByCategory(normalizedCategory);
          setFilms(filteredFilms);
          setActiveFilter({ type: 'category', value: normalizedCategory });
        } 
        // Then check for genre filter
        else if (genre && typeof genre === 'string') {
          const normalizedGenre = genre.toLowerCase();
          // Filter films by genre
          const filteredFilms = allFilms.filter(film => {
            const filmGenres = Array.isArray(film.meta.genre) 
              ? film.meta.genre.map(g => g.toLowerCase())
              : [film.meta.genre.toString().toLowerCase()];
            
            return filmGenres.includes(normalizedGenre);
          });
          
          setFilms(filteredFilms);
          setActiveFilter({ type: 'genre', value: normalizedGenre });
        } 
        // If no filters, show all films
        else {
          setFilms(allFilms);
          setActiveFilter(null);
        }
      } catch (error) {
        console.error('Error filtering films:', error);
        setFilms(allFilms); // Fallback to all films on error
      } finally {
        setLoading(false);
      }
    };
    
    applyFilters();
  }, [category, genre, allFilms]);
  
  // Get the title with optional filter information
  const getPageTitle = () => {
    if (!activeFilter) return 'Films | Where Was It Filmed';
    
    const filterValue = activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1);
    return `${filterValue} Films | Where Was It Filmed`;
  };
  
  // Get the meta description with optional filter information
  const getMetaDescription = () => {
    if (!activeFilter) return 'Explore the real filming locations of popular movies and TV shows';
    
    const filterValue = activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1);
    return `Explore the real filming locations of ${filterValue} movies and TV shows`;
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header with optional filter indicator */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {activeFilter 
              ? `${activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1)} Films` 
              : 'All Films'}
          </h1>
          
          {activeFilter && (
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Filtering by {activeFilter.type}:</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {activeFilter.value}
              </span>
              <button 
                onClick={() => router.push('/films')}
                className="ml-3 text-gray-500 hover:text-gray-700 text-sm flex items-center"
              >
                Clear filter
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Show Popular Categories when not filtered */}
        {!activeFilter && (
          <section className="mb-10">
            <PopularCategoriesContainer
              title="Popular Film Categories"
              showViewAll={false}
              maxCategories={10}
            />
          </section>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map((film) => (
              <Link href={`/films/${film.meta.slug}`} key={film.meta.slug} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-light-gray h-48 relative">
                    {film.meta.posterImage ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={film.meta.posterImage}
                          alt={`${film.meta.title} poster`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-4xl font-bold text-dark-gray opacity-30">
                          {film.meta.year}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{film.meta.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Director:</span> {film.meta.director}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Genre:</span> {Array.isArray(film.meta.genre) ? film.meta.genre.join(', ') : film.meta.genre}
                    </p>
                    <div className="mt-3 text-gray-700 line-clamp-2 text-sm">
                      {film.meta.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && films.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xl text-gray-600 mb-3">No films found for this filter.</p>
            <Link 
              href="/films"
              className="text-primary hover:text-red-700 font-medium inline-flex items-center"
            >
              View all films
              <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allFilms = await getAllFilms();
  
  return {
    props: {
      allFilms,
    },
  };
}; 
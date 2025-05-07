import React, { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getFilmBySlug, getFilmSlugs } from '../../utils/markdown';
import { Content, FilmMeta, Coordinates, StreamingService, BookingOption, TravelTip, FilmTrivia } from '../../types/content';
import Map from '../../components/Map';
import FilmHero from '../../components/FilmHero';
import LocationCard from '../../components/LocationCard';
import AffiliateLink from '../../components/AffiliateLink';
import HarryPotterGuide from '../../components/HarryPotterGuide';
import CommentSection from '../../components/CommentSection';
import SEO from '../../components/SEO';
import { getFilmSchema, getFilmingLocationSchema, getBreadcrumbSchema } from '../../utils/schema';
import FilmLocationsGuide from '../../components/FilmLocationsGuide';
import { extractTravelTips, extractTrivia } from '../../utils/locationFormatters';
import { addLocationBacklinks } from '../../utils/locationUtils';

interface FilmPageProps {
  film: Content<FilmMeta>;
}

export default function FilmPage({ film, locationBacklinks }: FilmPageProps & { locationBacklinks: string[] }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'locations' | 'overview' | 'related'>('overview');
  
  /**
   * Checks if the film has valid coordinates data
   * Used to conditionally render map and location-based UI elements
   * @returns {boolean} True if coordinates exist and array is not empty
   */
  const hasCoordinates = !!film.meta.coordinates && film.meta.coordinates.length > 0;
  
  /**
   * Safely checks if the film includes a specific component
   * Handles undefined components array and performs type checking
   * @param {string} componentName - Name of the component to check for
   * @returns {boolean} True if the component is included in the film's components
   */
  const hasComponent = (componentName: string): boolean => {
    return !!film.meta.components && Array.isArray(film.meta.components) && 
      film.meta.components.includes(componentName);
  };
  
  /**
   * Determines if the region-based layout should be used for this film
   * Uses region layout if explicitly set in metadata or if film has special components
   * @returns {boolean} True if region layout should be used
   */
  const shouldUseRegionLayout = (): boolean => {
    // Use region layout if explicitly set to true or if it has the HarryPotterGuide component
    return film.meta.useRegionLayout === true || hasComponent('HarryPotterGuide');
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Extract travel tips and trivia for this film
  const travelTips = extractTravelTips(film.meta);
  const trivia = extractTrivia(film.meta);
  
  // Get random images from coordinates to show in the overview gallery
  const locationImages = film.meta.coordinates
    ? film.meta.coordinates
        .filter(coord => coord.image)
        .map(coord => ({ url: coord.image as string, name: coord.name || 'Film location' }))
        .slice(0, 6)
    : [];

  const currentUrl = process.env.NEXT_PUBLIC_BASE_URL ? 
    `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}` : 
    `https://wherewasitfilmed.co${router.asPath}`;
    
  // Generate JSON-LD schema for this film page
  const filmSchema = getFilmSchema(film.meta, currentUrl);
  const locationsSchema = hasCoordinates ? getFilmingLocationSchema(film.meta.title, film.meta.coordinates || []) : null;
  
  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Home', url: 'https://wherewasitfilmed.co/' },
    { name: 'Films', url: 'https://wherewasitfilmed.co/films/' },
    { name: film.meta.title, url: currentUrl }
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  
  // Combine all schemas into a single JSON string
  const schemaData = JSON.stringify([filmSchema, locationsSchema, breadcrumbSchema].filter(Boolean));

  // Default sample booking options if none provided in the film meta
  const bookingOptions: BookingOption[] = film.meta.bookingOptions || [
    {
      name: 'Booking.com',
      url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(film.meta.coordinates?.[0]?.name || film.meta.title)}&aid=1234567`,
      type: 'booking',
      price: '$120/night',
      isPartner: true
    },
    {
      name: 'Expedia',
      url: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(film.meta.coordinates?.[0]?.name || film.meta.title)}`,
      type: 'booking',
      price: '$110/night'
    },
    {
      name: 'Ultimate Film Locations Tour',
      url: '#tour-booking',
      type: 'tour',
      price: '$299',
      discount: '$249',
      isPartner: true
    }
  ];

  // Default sample streaming services if none provided in the film meta
  const streamingServices: StreamingService[] = film.meta.streamingServices || [
    {
      name: 'Netflix',
      url: 'https://www.netflix.com/search?q=' + encodeURIComponent(film.meta.title)
    },
    {
      name: 'Amazon Prime',
      url: 'https://www.amazon.com/s?k=' + encodeURIComponent(film.meta.title)
    },
    {
      name: 'Disney+',
      url: 'https://www.disneyplus.com/search?q=' + encodeURIComponent(film.meta.title)
    }
  ];

  // Check if content includes custom components
  const hasHarryPotterGuide = hasComponent('HarryPotterGuide');
  // Check if we should use the new region-based layout
  const useRegionLayout = shouldUseRegionLayout();

  if (!film) {
    return <div>Film not found</div>;
  }

  // Custom processing for HTML content that might have component placeholders
  const renderContentWithComponents = () => {
    if (hasHarryPotterGuide && film.meta.slug === "where-was-harry-potter-filmed") {
      // For Harry Potter, we want to show the custom component instead of the regular HTML
      return <HarryPotterGuide />;
    } else if (useRegionLayout) {
      // For films with useRegionLayout flag, use our new FilmLocationsGuide
      return <FilmLocationsGuide film={film.meta} />;
    }
    
    // For other content, just render the HTML
    return (
      <section className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: film.html }} />
    );
  };

  return (
    <>
      <SEO 
        meta={film.meta} 
        type="movie"
        jsonLd={schemaData}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb navigation */}
          <nav className={`mb-6 text-sm transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/films" className="text-gray-600 hover:text-primary transition-colors">
                  Films
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-primary font-medium truncate max-w-xs">{film.meta.title}</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <FilmHero film={film.meta} posterImage={film.meta.posterImage} />

          {/* Tab Navigation */}
          <div className={`flex justify-center mb-8 border-b border-gray-200 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-4 text-lg font-medium border-b-2 transition-all duration-300 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('locations')}
                className={`px-4 py-4 text-lg font-medium border-b-2 transition-all duration-300 ${activeTab === 'locations' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Filming Locations
              </button>
              <button 
                onClick={() => setActiveTab('related')}
                className={`px-4 py-4 text-lg font-medium border-b-2 transition-all duration-300 ${activeTab === 'related' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Related
              </button>
            </div>
          </div>

          {/* Main content grid with two columns on desktop */}
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Left column: Film content */}
            <div className="lg:col-span-2">
              {/* Content cards based on active tab */}
              <div 
                className={`transition-all duration-500 ${activeTab === 'overview' ? 'opacity-100' : 'opacity-0 absolute -z-10 h-0 overflow-hidden'}`}
                style={{ position: activeTab === 'overview' ? 'relative' : 'absolute' }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 overflow-hidden relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                  
                  {/* Film Introduction or custom component */}
                  <div className="relative">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center group">
                      <svg className="w-7 h-7 mr-3 text-primary group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">About <span className="text-primary">{film.meta.title}</span></span>
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full mb-8"></div>
                    
                    <div className="prose prose-lg max-w-none mb-8 prose-headings:text-primary prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
                      {renderContentWithComponents()}
                    </div>
                  </div>
                  
                  {/* Quick Film Facts */}
                  {!hasHarryPotterGuide && !useRegionLayout && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <svg className="w-10 h-10 text-primary mb-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1h12z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Year Released</h3>
                        <p className="text-gray-600">{film.meta.year}</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <svg className="w-10 h-10 text-primary mb-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Director</h3>
                        <p className="text-gray-600">{film.meta.director}</p>
                      </div>
                      
                      {hasCoordinates && (
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <svg className="w-10 h-10 text-primary mb-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">Filming Locations</h3>
                          <p className="text-gray-600">{film.meta.coordinates?.length || 0} location{(film.meta.coordinates?.length || 0) !== 1 ? 's' : ''}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Behind the Scenes section - only show if not using region layout */}
                  {!useRegionLayout && film.meta.behindTheScenes && (
                    <section className="mt-12 mb-4 transform transition-all duration-500 hover:translate-y-[-5px]">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v10.764a1 1 0 01-1.447.894L15 18M5 18l-4.553-2.276A1 1 0 010 14.618V3.382a1 1 0 011.447-.894L5.5 4m0 14V4m14 0l-4.553 2.276A1 1 0 0014 7.382v10.236a1 1 0 001.447.894L20 16" />
                        </svg>
                        <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Behind the Scenes</span>
                      </h2>
                      <div className="w-32 h-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full mb-8"></div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-md border-l-4 border-primary/60 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        {typeof film.meta.behindTheScenes === 'string' ? (
                          <p className="italic text-gray-700 leading-relaxed text-lg relative z-10">{film.meta.behindTheScenes}</p>
                        ) : film.meta.behindTheScenes && typeof film.meta.behindTheScenes === 'object' && film.meta.behindTheScenes.intro ? (
                          <>
                            <p className="italic text-gray-700 leading-relaxed mb-6 text-lg relative z-10">{film.meta.behindTheScenes.intro}</p>
                            {film.meta.behindTheScenes.facts && film.meta.behindTheScenes.facts.length > 0 && (
                              <ul className="space-y-4 relative z-10">
                                {film.meta.behindTheScenes.facts.map((fact, index) => (
                                  <li key={index} className="flex items-start">
                                    <svg className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">{fact}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : null}
                      </div>
                    </section>
                  )}
                  
                  {/* Location Image Gallery */}
                  {locationImages.length > 0 && (
                    <section className="mt-12 mb-8 transform transition-all duration-500 hover:translate-y-[-5px]">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Location Gallery</span>
                      </h2>
                      <div className="w-32 h-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full mb-8"></div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {locationImages.map((image, index) => (
                          <div key={index} className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-48 transform hover:scale-[1.02]">
                            <img 
                              src={image.url} 
                              alt={image.name} 
                              className="w-full h-full object-cover transition-transform duration-3000 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.src = '/images/default-location.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <p className="text-white font-medium px-4 py-3 text-sm">{image.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Travel Tips Section */}
                  {(travelTips.length > 0 || trivia.length > 0) && (
                  <section className="mt-12 mb-8 grid md:grid-cols-2 gap-8">
                    {/* Travel Tips */}
                    {travelTips.length > 0 && (
                    <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${trivia.length === 0 ? 'md:col-span-2' : ''}`}>
                      <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                        Travel Tips
                      </h3>
                      <ul className="space-y-3">
                        {travelTips.map((tip, index) => (
                          <li key={index} className="flex items-start bg-white bg-opacity-70 p-4 rounded-lg shadow-sm">
                            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-700 leading-relaxed">{tip.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    )}
                    
                    {/* Film Trivia */}
                    {trivia.length > 0 && (
                    <div className={`bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-6 border border-amber-200 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${travelTips.length === 0 ? 'md:col-span-2' : ''}`}>
                      <h3 className="text-xl font-bold text-amber-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        Film Trivia
                      </h3>
                      <ul className="space-y-3">
                        {trivia.map((item, index) => (
                          <li key={index} className="flex items-start bg-white bg-opacity-70 p-4 rounded-lg shadow-sm">
                            <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                            </svg>
                            <p className="text-gray-700 leading-relaxed">{item.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    )}
                  </section>
                  )}
                  
                  {/* Call to action for locations exploration */}
                  {hasCoordinates && (
                    <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between border border-primary/10 shadow-sm transform transition-all duration-500 hover:shadow-md hover:translate-y-[-5px]">
                      <div className="mb-4 md:mb-0 md:mr-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Explore Filming Locations</h3>
                        <p className="text-gray-600">Discover all {film.meta.coordinates?.length || 0} locations where {film.meta.title} was filmed</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('locations')}
                        className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition-colors flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        View on Map
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Locations Tab Content */}
              <div 
                className={`transition-all duration-500 ${activeTab === 'locations' ? 'opacity-100' : 'opacity-0 absolute -z-10 h-0 overflow-hidden'}`}
                style={{ position: activeTab === 'locations' ? 'relative' : 'absolute' }}
              >
                {/* Interactive Map */}
                {hasCoordinates && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Interactive Location Map
                    </h2>
                    <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-lg">
                      <Map markers={film.meta.coordinates?.map(coord => ({
                        lat: coord.lat,
                        lng: coord.lng,
                        title: coord.name || '',
                        description: coord.description || ''
                      })) || []} height="500px" />
                    </div>
                    <p className="text-gray-600 text-sm italic mt-4 bg-gray-50 p-4 rounded-lg border-l-4 border-primary/30">
                      Explore all {film.meta.coordinates?.length || 0} filming locations on the interactive map above. Click on markers for details.
                    </p>
                  </div>
                )}
                
                {/* Filming Locations */}
                {hasCoordinates && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Filming Locations
                    </h2>
                    <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      {film.meta.coordinates?.map((coord: Coordinates, index: number) => (
                        <LocationCard key={index} location={coord} index={index} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Related Tab Content */}
              <div 
                className={`transition-all duration-500 ${activeTab === 'related' ? 'opacity-100' : 'opacity-0 absolute -z-10 h-0 overflow-hidden'}`}
                style={{ position: activeTab === 'related' ? 'relative' : 'absolute' }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    Related Films
                  </h2>
                  <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
                  
                  <p className="text-gray-600 italic mb-6">
                    Explore other films with similar genres or filming locations.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {film.meta.genre && Array.isArray(film.meta.genre) && film.meta.genre.map((genre, index) => (
                      <Link 
                        key={index}
                        href={`/films?genre=${encodeURIComponent(genre)}`}
                        className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 text-primary">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h-2v-2h2zm0-4v2h-2V9h2zm-4 4v2H7v-2h4zm0-4v2H7V9h4zm-6 4v2H3v-2h2zm0-4v2H3V9h2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Films in {genre}</span>
                          <p className="text-sm text-gray-500">Explore similar {genre} films</p>
                        </div>
                      </Link>
                    ))}
                    
                    {hasCoordinates && film.meta.coordinates?.slice(0, 2).map((coord, index) => (
                      <Link 
                        key={`location-${index}`}
                        href={`/locations?name=${encodeURIComponent(coord.name || '')}`}
                        className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 text-primary">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Films in {coord.name || 'This Location'}</span>
                          <p className="text-sm text-gray-500">See what else was filmed here</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Filming Locations Links */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Explore Filming Locations
                  </h2>
                  <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
                  
                  {locationBacklinks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {locationBacklinks.map((link, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors" dangerouslySetInnerHTML={{ __html: link }} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No specific location pages available for this film yet. Check back later!
                    </p>
                  )}
                  
                  <div className="mt-6">
                    <Link href="/locations" className="text-primary font-medium hover:underline flex items-center">
                      Browse all filming locations
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column: Sidebar with booking options, streaming services */}
            <div className="lg:col-span-1">
              {/* Sticky sidebar */}
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Booking Options card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl border border-gray-100">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <h2 className="text-xl font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Book Accommodations
                    </h2>
                    <p className="text-sm mt-2 text-blue-100">
                      Stay near these iconic filming locations
                    </p>
                  </div>
                  
                  <div className="p-6">
                    {bookingOptions.map((option, index) => (
                      <AffiliateLink
                        key={index}
                        name={option.name}
                        url={option.url}
                        type={option.type}
                        logo={option.logo}
                        price={option.price}
                        discount={option.discount}
                        isPartner={option.isPartner}
                      />
                    ))}
                    
                    <p className="text-xs text-gray-500 mt-3 italic">
                      * Affiliate links help support this website. We may earn a commission on bookings.
                    </p>
                  </div>
                </div>
                
                {/* Streaming Options card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl border border-gray-100">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                    <h2 className="text-xl font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Watch {film.meta.title}
                    </h2>
                    <p className="text-sm mt-2 text-red-100">
                      Available on these streaming platforms
                    </p>
                  </div>
                  
                  <div className="p-6">
                    {streamingServices.map((service, index) => (
                      <a 
                        key={index}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center mb-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 group"
                      >
                        {service.logo ? (
                          <img 
                            src={service.logo} 
                            alt={service.name} 
                            className="w-8 h-8 mr-3" 
                          />
                        ) : (
                          <svg className="w-8 h-8 mr-3 text-red-500 group-hover:text-red-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium group-hover:text-gray-900 transition-colors">{service.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Call to action for comments */}
                <div className="bg-gradient-to-r from-primary-light to-primary rounded-2xl shadow-lg p-6 text-white transform transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
                  <h3 className="text-xl font-bold mb-3">Share Your Experiences</h3>
                  <p className="mb-4 text-white/90">Have you visited any of these filming locations? Share your stories and tips in the comments below!</p>
                  <button 
                    className="px-5 py-3 bg-white text-primary font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-md flex items-center"
                    onClick={() => {
                      // Scroll to comment section
                      document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Jump to Comments
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments section */}
          <div id="comments" className="pt-12 mt-4">
            <div className={`transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <CommentSection pageSlug={film.meta.slug} pageType="film" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getFilmSlugs();
  
  return {
    paths: slugs.map((slug: string) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  
  if (typeof slug !== 'string') {
    return {
      notFound: true,
    };
  }
  
  console.log(`Getting film for slug: ${slug}`);
  // We no longer need to add the .md extension since getFilmBySlug does that now
  const film = await getFilmBySlug(slug);
  
  if (!film) {
    console.error(`Film not found for slug: ${slug}`);
    return {
      notFound: true,
    };
  }
  
  // Generate location backlinks for SEO
  const locationBacklinks = await addLocationBacklinks(film);
  
  return {
    props: {
      film,
      locationBacklinks,
    },
  };
}; 
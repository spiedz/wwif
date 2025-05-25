import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import SeriesLocationsGuide from '../../components/SeriesLocationsGuide';
import SeriesEpisodesDisplay from '../../components/SeriesEpisodesDisplay';
import { getSeriesBySlug, getSeriesSlugs } from '../../lib/server/serverMarkdown';
import { TVSeries } from '../../types/series';
import SEO from '../../components/SEO';
import CommentSection from '../../components/CommentSection';
import { addLocationBacklinks } from '../../utils/locationUtils';
import Link from 'next/link';
import { getVideoObjectSchema, combineSchemas } from '../../utils/schema';
import ErrorBoundary from '../../components/ErrorBoundary';

interface SeriesPageProps {
  series: TVSeries;
  locationBacklinks: string[];
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export default function SeriesPage({ series, locationBacklinks }: SeriesPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Series Not Found</h1>
        <p>Sorry, we couldn't find information about this TV series.</p>
      </div>
    );
  }

  const { meta } = series;
  
  // Create schema data
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    'headline': meta.title,
    'image': meta.posterImage || meta.bannerImage || '',
    'author': 'Where Was It Filmed',
    'genre': meta.genres?.join(', '),
    'startDate': meta.releaseYearStart,
    'endDate': meta.releaseYearEnd || 'present',
    'numberOfSeasons': typeof meta.seasons === 'number' ? meta.seasons : Array.isArray(meta.seasons) ? meta.seasons.length : undefined,
    'creator': meta.creator ? {
      '@type': 'Person',
      'name': meta.creator
    } : undefined,
    'publisher': {
      '@type': 'Organization',
      'name': 'Where Was It Filmed',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://wherewasitfilmed.co/logo.png'
      }
    },
    'url': `https://wherewasitfilmed.co/series/${meta.slug}`,
    'datePublished': new Date().toISOString(),
    'dateCreated': new Date().toISOString(),
    'dateModified': new Date().toISOString(),
    'description': meta.description,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://wherewasitfilmed.co/series/${meta.slug}`,
    }
  };

  // Add video schema if trailer is available
  const videoSchema = meta.trailer ? getVideoObjectSchema({
    name: meta.trailer.title || `${meta.title} - Official Trailer`,
    description: meta.trailer.description || `Watch the official trailer for ${meta.title}`,
    thumbnailUrl: meta.trailer.thumbnailUrl || meta.posterImage || `${process.env.NEXT_PUBLIC_BASE_URL}/images/default-trailer-thumbnail.jpg`,
    uploadDate: meta.trailer.uploadDate || new Date().toISOString().split('T')[0],
    contentUrl: meta.trailer.contentUrl,
    embedUrl: meta.trailer.embedUrl,
    duration: meta.trailer.duration
  }) : null;

  // Combine schemas
  const jsonLd = meta.trailer && videoSchema ? [jsonLdData, videoSchema] : jsonLdData;
  
  return (
      <>
      <SEO 
        meta={{
          title: `${meta.title} - Filming Locations`,
          description: meta.description || `Discover the real filming locations of ${meta.title}`,
          slug: meta.slug
        }}
        imageUrl={meta.posterImage || meta.bannerImage}
        type="article"
        jsonLd={jsonLd}
      />
      
      {/* Enhanced Hero Section with Netflix branding */}
      <div className="relative bg-black h-[60vh] sm:h-[70vh] overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0 opacity-50">
          {meta.bannerImage && (
            <img 
              src={meta.bannerImage} 
              alt={meta.title} 
              className="w-full h-full object-cover"
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        
        {/* Netflix badge */}
        <div className="absolute top-8 right-8 z-10">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 1024 276.742" fill="currentColor">
              <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 74.59 30.27-74.59h47.295z" />
            </svg>
            Original Series
          </div>
        </div>
        
        {/* Content wrapper */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <div className="relative z-10 grid grid-cols-12 gap-6 items-end">
            {/* Poster image */}
            <div className="hidden sm:block sm:col-span-3 lg:col-span-2">
              {meta.posterImage && (
                <img 
                  src={meta.posterImage} 
                  alt={meta.title} 
                  className="w-full rounded-lg shadow-2xl transform -translate-y-8 aspect-[2/3] object-cover"
                />
              )}
            </div>
            
            {/* Info column */}
            <div className="col-span-12 sm:col-span-9 lg:col-span-10 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {meta.genres?.map((genre, index) => (
                  <span key={index} className="text-xs font-medium py-1 px-3 bg-primary/70 rounded-full">
                    {genre}
                  </span>
                ))}
                <span className="text-xs font-medium py-1 px-3 bg-gray-800/70 rounded-full">
                  {meta.releaseYearStart}
                  {meta.releaseYearEnd ? ` - ${meta.releaseYearEnd}` : ' - Present'}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-md">{meta.title}</h1>
              
              <p className="text-lg sm:text-xl opacity-90 mb-6 max-w-4xl">{meta.overview}</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-sm opacity-80">
                  <span className="font-semibold mr-2">Creator:</span>
                  <span>{meta.creator}</span>
                </div>
                
                {/* Watch Now button */}
                <a 
                  href={`https://www.netflix.com/search?q=${encodeURIComponent(meta.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 1024 276.742" fill="currentColor">
                    <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 74.59 30.27-74.59h47.295z" />
                  </svg>
                  Watch on Netflix
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto py-12 px-4">
        {/* SEO-optimized introductory paragraph */}
        <div className="mb-12 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center group">
              <svg className="w-7 h-7 mr-3 text-primary group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                About {meta.title.replace("Where Was ", "").replace(" Filmed?", "")}
              </span>
            </h2>
            <ErrorBoundary>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{meta.overview}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Facts</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span><strong>Release:</strong> {meta.releaseYearStart}{meta.releaseYearEnd ? ` - ${meta.releaseYearEnd}` : ' - Present'}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span><strong>Creator:</strong> {meta.creator}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span><strong>Genres:</strong> {meta.genres?.join(', ')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span><strong>Primary Filming Locations:</strong> {series.locations && series.locations.length > 0 
                          ? `${series.locations.slice(0, 3).map(loc => loc.name).join(', ')}${series.locations.length > 3 ? ', and more' : ''}`
                          : 'Information not available'}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Why Visit These Locations</h3>
                    <p className="text-gray-700">Fans of {meta.title.replace("Where Was ", "").replace(" Filmed?", "")} can experience the magic of the show by visiting these iconic filming locations. Explore the real-world settings that brought this beloved series to life, and create unforgettable memories connecting with the scenes you know and love.</p>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>
      
        {/* Series content from markdown */}
        {series.html && (
          <div className="prose prose-lg max-w-none mt-8 prose-headings:text-primary prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
            <div dangerouslySetInnerHTML={{ __html: series.html }} />
          </div>
        )}
      
        {/* Tab navigation for different sections */}
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <a href="#locations" className="whitespace-nowrap py-4 px-1 border-b-2 border-primary text-sm font-medium text-primary">
                Filming Locations
              </a>
              <a href="#episodes" className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Episodes
              </a>
              <a href="#behind" className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Behind The Scenes
              </a>
            </nav>
          </div>
        </div>
        
        {/* Locations Section */}
        <div id="locations" className="mb-16">
          <SeriesLocationsGuide series={series} hideTitle={true} />
        </div>
        
        {/* Episodes Section */}
        <div id="episodes" className="mb-16">
          <SeriesEpisodesDisplay series={series} />
        </div>
        
        {/* Streaming Services Section */}
        {meta.streamingServices && meta.streamingServices.length > 0 && (
          <div id="streaming" className="my-16 p-8 bg-gray-50 border border-gray-100 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Where to Watch
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meta.streamingServices.map((service, index) => (
                <a 
                  key={index} 
                  href={service.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{service.name}</p>
                    <p className="text-sm text-primary group-hover:text-primary-dark transition-colors">Watch Now</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Booking Options */}
        {meta.bookingOptions && meta.bookingOptions.length > 0 && (
          <div id="booking" className="my-16 p-8 bg-primary/5 border border-primary/10 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Visit the Locations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meta.bookingOptions.map((option, index) => (
                <a 
                  key={index} 
                  href={option.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        {option.type === 'tour' ? (
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        ) : (
                          <path d="M6 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm.293 2.707a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L8.586 9 6.293 6.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                        )}
                      </svg>
                    </div>
                    {option.isPartner && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">Partner</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{option.name}</h3>
                  <div className="text-gray-600 text-sm mb-3">{option.type === 'tour' ? 'Guided Tour' : 'Accommodation'}</div>
                  <div className="flex justify-between items-end">
                    <div className="font-bold text-primary">
                      {option.discount ? (
                        <div>
                          <span className="line-through text-gray-400 text-sm mr-2">{option.price}</span>
                          <span>{option.discount}</span>
                        </div>
                      ) : (
                        <span>{option.price}</span>
                      )}
                    </div>
                    <span className="text-sm text-primary group-hover:text-primary-dark transition-colors">Book Now</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Similar Series Recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            You Might Also Like
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Stranger Things", "Game of Thrones", "Breaking Bad", "The Queens Gambit"].map((title, index) => (
              <a 
                key={index}
                href={`/series/where-was-${title.toLowerCase().replace(/\s+/g, '-')}-filmed`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                  <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-700">
                    {/* Placeholder for image */}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    Where Was {title} Filmed?
                  </h3>
                  <div className="mt-2 text-sm text-primary font-medium">
                    Explore Locations →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* Comment Section */}
        <div className="mt-20 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Visitor Comments & Discussion
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Have you visited these filming locations?</h3>
              <p className="text-gray-600 mt-1">Share your experiences or ask questions about visiting the filming locations of {meta.title.replace("Where Was ", "").replace(" Filmed?", "")}.</p>
            </div>
            <div className="p-6">
              <CommentSection pageSlug={meta.slug} pageType="film" />
            </div>
          </div>
        </div>

        {/* Location Backlinks Section */}
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
              No specific location pages available for this series yet. Check back later!
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
      </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Temporarily disable series pages to prevent build errors
  // TODO: Fix component import issues causing "Element type is invalid" errors
  return {
    paths: [],
    fallback: false
  };
  
  // Original code commented out:
  /*
  try {
    const slugs = await getSeriesSlugs();
    console.log(`Found ${slugs.length} series slugs for static generation`);
    
    const paths = slugs.map((slug) => ({
      params: { slug },
    }));

    return { paths, fallback: true };
  } catch (error) {
    console.error('Error in getStaticPaths for series:', error);
    return { paths: [], fallback: true };
  }
  */
};

export const getStaticProps: GetStaticProps<SeriesPageProps, Params> = async ({ params }) => {
  const slug = params?.slug;
  
  if (typeof slug !== 'string') {
    return {
      notFound: true,
    };
  }
  
  const series = await getSeriesBySlug(slug);
  
  if (!series) {
    return {
      notFound: true,
    };
  }
  
  // Generate location backlinks for SEO
  const locationBacklinks = await addLocationBacklinks(series);
  
  return {
    props: {
      series,
      locationBacklinks,
    },
    revalidate: 3600, // revalidate every hour
  };
}; 
import { GetStaticPaths, GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Breadcrumbs from '../../components/Breadcrumbs';
import MediaGrid from '../../components/MediaGrid';
import Map from '../../components/Map';
import { LocationInfo, MediaItem, getLocationBySlug, getPopularLocations } from '../../utils/locationUtils';
import { formatPageTitle } from '../../utils/metaUtils';
import { getAllLocationsData } from '../../lib/server/serverMarkdown';

// Default placeholder image for locations
const DEFAULT_LOCATION_IMAGE = '/images/default-location.jpg';

interface LocationPageProps {
  location: LocationInfo;
}

export default function LocationPage({ location }: LocationPageProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (router.isFallback) {
    return (
      <>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
            <div className="animate-pulse mb-12">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg w-full mx-auto"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  const pageTitle = formatPageTitle(`Films and TV Series Filmed in ${location.name}`);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const breadcrumbsItems = [
    { label: 'Home', url: '/' },
    { label: 'Locations', url: '/locations' },
    { label: location.name }
  ];
  
  // Group media items by type
  const films = location.mediaItems.filter((item: MediaItem) => item.type === 'film');
  const series = location.mediaItems.filter((item: MediaItem) => item.type === 'series');
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`Discover all films and TV series filmed at ${location.name}. Explore film locations, get travel tips, and plan your visit.`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={`Discover all films and TV series filmed at ${location.name}. Explore film locations, get travel tips, and plan your visit.`} />
        <meta property="og:image" content={location.image || DEFAULT_LOCATION_IMAGE} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={`Discover all films and TV series filmed at ${location.name}. Explore film locations, get travel tips, and plan your visit.`} />
        <meta name="twitter:image" content={location.image || DEFAULT_LOCATION_IMAGE} />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Place',
              name: location.name,
              description: location.description || `A filming location featured in ${location.mediaItems.length} films and TV series.`,
              geo: {
                '@type': 'GeoCoordinates',
                latitude: location.lat,
                longitude: location.lng
              },
              url: currentUrl,
              image: location.image || DEFAULT_LOCATION_IMAGE
            })
          }}
        />
      </Head>
      
      <div className={`fade-in ${isLoaded ? 'visible' : ''}`}>
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Films and TV Series Filmed in {location.name}
            </h1>
            <p className="text-lg text-gray-600">
              Discover {location.mediaItems.length} 
              {location.mediaItems.length === 1 ? ' production ' : ' productions '} 
              filmed at this iconic location
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              {location.description && (
                <div className="prose prose-lg max-w-none mb-8">
                  <h2 className="text-2xl font-bold mb-4">About this Location</h2>
                  <p>{location.description}</p>
                </div>
              )}
              
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
                <Image
                  src={location.image || DEFAULT_LOCATION_IMAGE}
                  alt={location.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
                  className="object-cover"
                  priority
                />
              </div>
              
              {location && (
                <div className="mt-8 h-96 rounded-lg overflow-hidden shadow-lg">
                  <Map 
                    markers={[{ 
                      lat: location.lat, 
                      lng: location.lng, 
                      title: location.name,
                      description: location.description || `Filming location in ${location.name}`
                    }]} 
                    zoom={14} 
                  />
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Location Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Media Count</h3>
                  <p>{location.mediaItems.length} productions filmed here</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Films</h3>
                  <p>{films.length} {films.length === 1 ? 'film' : 'films'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">TV Series</h3>
                  <p>{series.length} {series.length === 1 ? 'series' : 'series'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Coordinates</h3>
                  <p>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-2">Plan Your Visit</h3>
                <div className="space-y-2">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    View on Google Maps
                  </a>
                  <a 
                    href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(location.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Check TripAdvisor Reviews
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Films Filmed at {location.name}
            </h2>
            
            {films.length > 0 ? (
              <MediaGrid items={films} />
            ) : (
              <p className="text-gray-600">No films found for this location.</p>
            )}
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              TV Series Filmed at {location.name}
            </h2>
            
            {series.length > 0 ? (
              <MediaGrid items={series} />
            ) : (
              <p className="text-gray-600">No TV series found for this location.</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-12">
            <h2 className="text-2xl font-bold mb-4">Explore More Filming Locations</h2>
            <p className="mb-4 text-gray-600">Discover other popular filming locations around the world.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/locations" className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                <span className="font-semibold text-primary">Browse All Locations</span>
              </Link>
              <Link href="/map" className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                <span className="font-semibold text-primary">Interactive Location Map</span>
              </Link>
              <Link href="/blog" className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                <span className="font-semibold text-primary">Travel Guides & Tips</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all locations data
  const locations = await getAllLocationsData();
  
  // Create paths for both simple and SEO-friendly slugs
  const paths = locations.map(location => ({
    params: { slug: location.slug }
  }));
  
  return {
    paths,
    fallback: 'blocking' // Show a fallback version while loading
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const location = await getLocationBySlug(slug);
    
    if (!location) {
      return {
        notFound: true
      };
    }
    
    return {
      props: {
        location
      },
      revalidate: 60 * 60 * 24 // Re-generate at most once per day
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true
    };
  }
}; 
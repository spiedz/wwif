import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllLocations } from '../../lib/server/serverMarkdown';
import { LocationListItem } from '../../types/location';
import Map from '../../components/Map';

interface LocationsPageProps {
  locations: LocationListItem[];
}

export default function LocationsPage({ locations }: LocationsPageProps) {
  // Prepare map markers for all locations
  const mapMarkers = locations.map(location => ({
    lat: location.coordinates.lat,
    lng: location.coordinates.lng,
    title: location.name,
    description: `${location.city}, ${location.country} - ${location.filmCount} films, ${location.seriesCount} series`
  }));

  // Calculate stats for SEO content
  const totalProductions = locations.reduce((total, location) => total + location.filmCount + location.seriesCount, 0);
  const countriesCount = [...new Set(locations.map(l => l.country))].length;
  const totalFilms = locations.reduce((total, location) => total + location.filmCount, 0);
  const totalSeries = locations.reduce((total, location) => total + location.seriesCount, 0);

  // Generate schema for the locations listing page
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const currentUrl = `${baseUrl}/locations`;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Filming Locations",
    "description": `Discover ${locations.length} filming locations from around the world where movies and TV shows were shot`,
    "url": currentUrl,
    "numberOfItems": locations.length,
    "itemListElement": locations.slice(0, 20).map((location, index) => ({
      "@type": "Place",
      "position": index + 1,
      "name": location.name,
      "description": location.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location.city,
        "addressCountry": location.country
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.coordinates.lat,
        "longitude": location.coordinates.lng
      },
      "url": `${baseUrl}/locations/${location.slug}`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Filming Locations",
        "item": currentUrl
      }
    ]
  };

  const combinedSchemas = JSON.stringify([websiteSchema, breadcrumbSchema]);

  return (
    <>
      <Head>
        <title>Filming Locations Around the World | Movies & TV Shows | Where Was It Filmed</title>
        <meta 
          name="description" 
          content={`Explore ${locations.length} filming locations from ${totalFilms} movies and ${totalSeries} TV shows across ${countriesCount} countries. Plan your film tourism adventure with our comprehensive location guides.`} 
        />
        <meta name="keywords" content="filming locations, movie locations, TV show locations, film tourism, where was it filmed, movie sets, film sites, travel guide" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Filming Locations Around the World | Movies & TV Shows | Where Was It Filmed" />
        <meta property="og:description" content={`Explore ${locations.length} filming locations from ${totalFilms} movies and ${totalSeries} TV shows across ${countriesCount} countries. Plan your film tourism adventure with our comprehensive location guides.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Where Was It Filmed" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Filming Locations Around the World | Movies & TV Shows" />
        <meta name="twitter:description" content={`Explore ${locations.length} filming locations from ${totalFilms} movies and ${totalSeries} TV shows across ${countriesCount} countries.`} />
        <meta name="twitter:site" content="@wherewasitfilmed" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: combinedSchemas }}
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Filming <span className="text-primary">Locations</span> Worldwide
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Explore {locations.length} real-world locations where your favorite movies and TV shows were filmed. 
              From {totalFilms} movies and {totalSeries} TV series across {countriesCount} countries, plan your next film tourism adventure and 
              visit the actual places where cinema magic happened.
            </p>
          </div>

          {/* Interactive Map Section */}
          {locations.length > 0 && (
            <div className="mb-12">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Interactive Filming Locations Map
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Explore all {locations.length} filming locations on our interactive map. Click on markers to see location details and discover what was filmed there.
                  </p>
                </div>
                <div className="h-96">
                  <Map markers={mapMarkers} height="100%" />
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-primary mb-2">{locations.length}</div>
              <div className="text-gray-600 text-sm">Filming Locations</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-primary mb-2">{totalFilms}</div>
              <div className="text-gray-600 text-sm">Movies Filmed</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-primary mb-2">{totalSeries}</div>
              <div className="text-gray-600 text-sm">TV Series Filmed</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-primary mb-2">{countriesCount}</div>
              <div className="text-gray-600 text-sm">Countries</div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Film Tourism: Visit Real Movie & TV Locations</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Film tourism has become one of the most exciting ways to travel, allowing you to step into the worlds of your favorite movies and TV shows. 
                Our comprehensive database features {locations.length} verified filming locations across {countriesCount} countries, covering everything from 
                blockbuster movie sets to intimate TV series locations.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Whether you're looking for iconic cityscapes, hidden gems in small towns, or breathtaking natural landscapes, our location guides provide 
                detailed information about where {totalFilms} movies and {totalSeries} TV series were actually filmed. Each location page includes travel tips, 
                nearby attractions, and the complete filming history of the area.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Start planning your film tourism adventure today and discover the real-world locations behind the magic of cinema and television.
              </p>
            </div>
          </div>

          {/* Locations Grid */}
          {locations.length > 0 ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse All Filming Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {locations.map((location) => (
                  <Link 
                    href={`/locations/${location.slug}`} 
                    key={location.slug}
                    className="block group"
                  >
                    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                      {/* Location Image */}
                      <div className="relative h-48 overflow-hidden">
                        {location.image ? (
                          <div className="w-full h-full relative">
                            <img 
                              src={location.image}
                              alt={`${location.name} filming location in ${location.country}`}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Location Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {location.name}
                        </h3>
                        
                        {/* Location Details */}
                        <p className="text-gray-600 text-sm mb-3">
                          {location.city}, {location.country}
                        </p>
                        
                        {/* Description */}
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {location.description}
                        </p>
                        
                        {/* Production Count */}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm text-gray-500">
                            {location.filmCount > 0 && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                </svg>
                                {location.filmCount} film{location.filmCount !== 1 ? 's' : ''}
                              </span>
                            )}
                            {location.seriesCount > 0 && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                {location.seriesCount} series
                              </span>
                            )}
                          </div>
                          
                          {/* Explore Link */}
                          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary-dark transition-colors">
                            Explore
                            <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-3">No locations found</h3>
                <p className="text-gray-600">
                  We're working on adding more filming locations. Check back soon!
                </p>
              </div>
            </div>
          )}

          {/* Call-to-Action Section */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Plan Your Film Tourism Adventure
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ready to visit the real locations where your favorite movies and TV shows were filmed? Start planning your journey with our comprehensive 
              location guides, travel tips, and insider information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Travel Guides
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-md border border-primary/20"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Suggest a Location
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<LocationsPageProps> = async () => {
  try {
    const locations = await getAllLocations();
    
    return {
      props: {
        locations,
      },
      revalidate: 86400, // 24 hours
    };
  } catch (error) {
    console.error('Error in getStaticProps for locations index:', error);
    return {
      notFound: true,
    };
  }
}; 
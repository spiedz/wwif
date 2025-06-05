import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getLocationBySlug, getLocationSlugs } from '../../lib/server/serverMarkdown';
import { LocationContent } from '../../types/location';
import Map from '../../components/Map';
import Breadcrumbs from '../../components/Breadcrumbs';
import { FilmographyTable, TechnicalTable, BudgetTable, WeatherTable } from '../../components/LocationTable';
import {
  generateLocationSchema,
  generateFilmingLocationSchema,
  generateLocationBreadcrumbSchema,
  generateLocationTitle,
  generateLocationDescription,
  generateLocationKeywords,
  generateLocationFAQSchema,
  combineLocationSchemas
} from '../../utils/locationSeo';

interface LocationPageProps {
  location: LocationContent;
}

export default function LocationPage({ location }: LocationPageProps) {
  const router = useRouter();

  if (!location || !location.meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location details...</p>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const currentUrl = `${baseUrl}${router.asPath}`;

  // Generate SEO data using utilities
  const pageTitle = generateLocationTitle(location.meta);
  const pageDescription = generateLocationDescription(location.meta);
  const keywords = generateLocationKeywords(location.meta);

  // Generate schemas
  const locationSchema = generateLocationSchema(location.meta, currentUrl);
  const filmingLocationSchema = generateFilmingLocationSchema(location.meta, currentUrl);
  const breadcrumbSchema = generateLocationBreadcrumbSchema(location.meta, baseUrl);
  const faqSchema = generateLocationFAQSchema(location.meta);
  const combinedSchemas = combineLocationSchemas(
    locationSchema,
    filmingLocationSchema,
    breadcrumbSchema,
    faqSchema
  );

  // Generate breadcrumb items for UI
  const breadcrumbUIItems = [
    { label: 'Home', url: '/' },
    { label: 'Filming Locations', url: '/locations' },
    { label: location.meta.name }
  ];

  const mapMarkers = [{
    lat: location.meta.coordinates.lat,
    lng: location.meta.coordinates.lng,
    title: location.meta.name,
    description: `${location.meta.city}, ${location.meta.country}`
  }];

  const filmItems = location.meta.mediaItems.filter(item => item.type === 'film');
  const seriesItems = location.meta.mediaItems.filter(item => item.type === 'series' || item.type === 'tv');
  const blogItems = location.meta.mediaItems.filter(item => item.type === 'blog');

  // Prepare data for tables (if we have structured data from Larne example)
  const filmographyData = location.meta.mediaItems.map(item => ({
    year: '2024', // You'd need to add year to your media items
    production: item.title,
    location: location.meta.name
  }));

  // Sample technical data (you could add this to your location metadata)
  const technicalData = [
    { zone: 'Main Area', power: 'Available', connectivity: 'Good', parking: 'Street parking' }
  ];

  const weatherData = [
    { month: 'May', rainDays: '12', goldenHour: '05:30-06:30', sunrise: '05:45', sunset: '20:15' },
    { month: 'Jun', rainDays: '11', goldenHour: '05:00-06:00', sunrise: '05:15', sunset: '21:00' },
    { month: 'Jul', rainDays: '13', goldenHour: '05:15-06:15', sunrise: '05:30', sunset: '20:45' },
    { month: 'Aug', rainDays: '14', goldenHour: '06:00-07:00', sunrise: '06:15', sunset: '20:00' }
  ];

  const budgetData = [
    { service: 'Location Fee', rate: '£0-500', notes: 'Varies by complexity' },
    { service: 'Traffic Management', rate: '£300-800', notes: 'Council requirement' },
    { service: 'Security', rate: '£200-400', notes: '12hr shifts' }
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Where Was It Filmed" />
        <meta property="og:locale" content="en_US" />
        {location.meta.image && <meta property="og:image" content={location.meta.image} />}
        {location.meta.image && <meta property="og:image:alt" content={`${location.meta.name} filming location in ${location.meta.country}`} />}
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:site" content="@wherewasitfilmed" />
        {location.meta.image && <meta name="twitter:image" content={location.meta.image} />}
        {location.meta.image && <meta name="twitter:image:alt" content={`${location.meta.name} filming location in ${location.meta.country}`} />}

        {/* Additional SEO meta tags */}
        <meta name="geo.region" content={location.meta.state ? `${location.meta.country}-${location.meta.state}` : location.meta.country} />
        <meta name="geo.placename" content={location.meta.name} />
        <meta name="geo.position" content={`${location.meta.coordinates.lat};${location.meta.coordinates.lng}`} />
        <meta name="ICBM" content={`${location.meta.coordinates.lat}, ${location.meta.coordinates.lng}`} />

        {/* Enhanced JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: combinedSchemas }}
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb navigation */}
          <Breadcrumbs items={breadcrumbUIItems} />

          {/* Hero Section */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
            {location.meta.image && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                  src={location.meta.image}
                  alt={`${location.meta.name} filming location in ${location.meta.country}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    What Was Filmed in {location.meta.name}
                  </h1>
                  <p className="text-lg text-white/90">
                    {location.meta.city}, {location.meta.country}
                  </p>
                </div>
              </div>
            )}
            
            {!location.meta.image && (
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  What Was Filmed in <span className="text-primary">{location.meta.name}</span>
                </h1>
                <p className="text-lg text-gray-600">
                  {location.meta.city}, {location.meta.country}
                </p>
              </div>
            )}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Main content */}
            <div className="lg:col-span-2">
              {/* Location Description */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location.meta.name} Filming Locations Guide
                </h2>
                
                {location.html && (
                  <div 
                    className="prose prose-lg max-w-none mb-6 prose-headings:text-primary prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: location.html }} 
                  />
                )}

                {/* Location Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 bg-gray-50 p-6 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{filmItems.length}</div>
                    <div className="text-sm text-gray-600">Films</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{seriesItems.length}</div>
                    <div className="text-sm text-gray-600">TV Series</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{blogItems.length}</div>
                    <div className="text-sm text-gray-600">Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{location.meta.mediaItems.length}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>

              {/* Interactive Tables Section */}
              <div className="space-y-8 mb-8">
                {/* Filmography Table */}
                {location.meta.mediaItems.length > 0 && (
                  <FilmographyTable
                    title="Production Credits"
                    subtitle="Movies and TV shows filmed in this location"
                    data={filmographyData}
                  />
                )}

                {/* Technical & Weather Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <TechnicalTable
                    title="Technical Specifications"
                    subtitle="Power, connectivity & logistics"
                    data={technicalData}
                  />
                  <WeatherTable
                    title="Weather Windows"
                    subtitle="Optimal shooting conditions"
                    data={weatherData}
                  />
                </div>

                {/* Budget Table */}
                <BudgetTable
                  title="Estimated Filming Costs"
                  subtitle="Contact local film office for current rates"
                  data={budgetData}
                />
              </div>

              {/* SEO-Enhanced FAQ Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      What movies and TV shows were filmed in {location.meta.name}?
                    </h3>
                    <p className="text-gray-700">
                      {location.meta.mediaItems.length > 0 
                        ? `${location.meta.mediaItems.length} productions have been filmed in ${location.meta.name}, ${location.meta.country}. The location offers diverse filming opportunities with its ${location.meta.description.toLowerCase()}.`
                        : `${location.meta.name} is an emerging filming destination in ${location.meta.country}, known for its ${location.meta.description.toLowerCase()}.`
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      How do I visit {location.meta.name} filming locations?
                    </h3>
                    <p className="text-gray-700">
                      {location.meta.name} is located in {location.meta.city}, {location.meta.country}. 
                      {location.meta.bestTimeToVisit && ` The best time to visit is ${location.meta.bestTimeToVisit}.`}
                      {location.meta.travelTips && location.meta.travelTips.length > 0 && ' Check our travel tips section below for transportation and accommodation recommendations.'}
                    </p>
                  </div>

                  {location.meta.population && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        What is {location.meta.name} known for?
                      </h3>
                      <p className="text-gray-700">
                        {location.meta.name} is a {location.meta.description.toLowerCase()} with a population of {location.meta.population.toLocaleString()}. 
                        It has become a popular filming destination due to its scenic beauty and authentic character.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Map */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {location.meta.name} Location Map
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Explore {location.meta.name} filming locations on the interactive map below.
                  </p>
                </div>
                <div className="h-96">
                  <Map markers={mapMarkers} height="100%" />
                </div>
              </div>

              {/* Films Shot Here */}
              {filmItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Movies Filmed in {location.meta.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filmItems.map((film, index) => (
                      <Link 
                        href={`/films/${film.slug}`} 
                        key={index}
                        className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {film.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">View filming locations →</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* TV Series Shot Here */}
              {seriesItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    TV Series Filmed in {location.meta.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {seriesItems.map((series, index) => (
                      <Link 
                        href={`/series/${series.slug}`} 
                        key={index}
                        className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {series.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">View filming locations →</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Location Details Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
                    <h3 className="text-xl font-bold">Location Details</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600 text-sm">{location.meta.address}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">City</h4>
                      <p className="text-gray-600 text-sm">{location.meta.city}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Country</h4>
                      <p className="text-gray-600 text-sm">{location.meta.country}</p>
                    </div>

                    {location.meta.population && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Population</h4>
                        <p className="text-gray-600 text-sm">{location.meta.population.toLocaleString()}</p>
                      </div>
                    )}

                    {location.meta.bestTimeToVisit && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Best Time to Visit</h4>
                        <p className="text-gray-600 text-sm">{location.meta.bestTimeToVisit}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Travel Tips */}
                {location.meta.travelTips && location.meta.travelTips.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                      <h3 className="text-xl font-bold flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Travel Tips
                      </h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {location.meta.travelTips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Nearby Attractions */}
                {location.meta.nearbyAttractions && location.meta.nearbyAttractions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                      <h3 className="text-xl font-bold flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Nearby Attractions
                      </h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-2">
                        {location.meta.nearbyAttractions.map((attraction, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-center">
                            <svg className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {attraction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                  <h3 className="font-bold text-gray-800 mb-3">Planning a Film Tourism Visit?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Use our comprehensive guides and tips to make the most of your film location tour in {location.meta.name}.
                  </p>
                  <Link 
                    href="/blog" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    View Travel Guides
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const slugs = getLocationSlugs();
    
    const paths = slugs.map((slug) => ({
      params: { slug },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error in getStaticPaths for locations:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const location = await getLocationBySlug(slug);

    if (!location) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        location,
      },
      revalidate: 86400, // 24 hours
    };
  } catch (error) {
    console.error('Error in getStaticProps for location page:', error);
    return {
      notFound: true,
    };
  }
}; 
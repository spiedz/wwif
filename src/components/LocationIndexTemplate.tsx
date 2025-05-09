import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SEO from './SEO';
import Map from './Map';
import Breadcrumbs from './Breadcrumbs';
import { LocationInfo } from '../utils/locationUtils';
import { getLocationPageSchema, getBreadcrumbSchema, combineSchemas } from '../utils/schema';
import { getLocationMetaDescription, getKeywordsMetaContent } from '../utils/metaUtils';
import FAQSection, { FAQItem } from './FAQSection';

interface LocationIndexTemplateProps {
  title: string;
  description: string;
  locations: LocationInfo[];
  heroTitle: string;
  heroSubtitle: string;
  locationCount: number;
  mediaItemCount: number;
  breadcrumbItems: { label: string; url?: string }[];
  relatedLocations?: { title: string; slug: string; description: string }[];
  pageType: 'city' | 'country';
  name: string;
  faqs?: FAQItem[];
  heroImageUrl?: string;
  metaImageUrl?: string;
}

export default function LocationIndexTemplate({
  title,
  description,
  locations,
  heroTitle,
  heroSubtitle,
  locationCount,
  mediaItemCount,
  breadcrumbItems,
  relatedLocations = [],
  pageType,
  name,
  faqs = [],
  heroImageUrl,
  metaImageUrl
}: LocationIndexTemplateProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterText, setFilterText] = useState('');

  // Filter locations based on search input
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Load animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sort locations by media item count
  const sortedLocations = [...filteredLocations].sort(
    (a, b) => b.mediaItems.length - a.mediaItems.length
  );

  // Prepare map markers for all locations
  const mapMarkers = locations.map(location => ({
    lat: location.lat,
    lng: location.lng,
    title: location.name,
    description: `${location.mediaItems.length} films/shows were filmed here`,
    url: `/locations/${location.formattedSlug}`
  }));

  // Get current URL
  const currentUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`
    : `https://wherewasitfilmed.co${router.asPath}`;

  // Generate schema data for SEO
  const locationSchemas = locations.slice(0, 5).map(location => 
    getLocationPageSchema(location, `/locations/${location.formattedSlug}`)
  );

  // Generate breadcrumb schema
  const breadcrumbSchemaItems = breadcrumbItems.map(item => ({
    name: item.label,
    url: item.url 
      ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co'}${item.url}`
      : currentUrl
  }));
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbSchemaItems);

  // Combine schemas
  const combinedSchema = combineSchemas([
    breadcrumbSchema,
    ...locationSchemas
  ]);

  // Prepare meta data with keyword optimization
  const pageMeta = {
    title,
    description: description,
    slug: router.asPath.substring(1), // Remove leading slash
    keywords: getKeywordsMetaContent(pageType === 'city' ? 'location' : 'location', name),
    image: metaImageUrl || (locations[0]?.image || '/images/default-location.jpg')
  };

  // Default FAQs if none provided
  if (faqs.length === 0) {
    faqs = [
      {
        question: `What famous movies were filmed in ${name}?`,
        answer: `${name} has been a popular filming location for ${mediaItemCount} movies and TV shows. Some of the most notable productions filmed here include ${sortedLocations.slice(0, 3).map(loc => loc.mediaItems[0]?.title).filter(Boolean).join(', ')}.`
      },
      {
        question: `How many filming locations are in ${name}?`,
        answer: `We've identified ${locationCount} distinct filming locations in ${name}. These locations have been featured in ${mediaItemCount} different films and TV series.`
      },
      {
        question: `Can I visit the filming locations in ${name}?`,
        answer: `Yes, most filming locations in ${name} are accessible to the public. Some may require tickets or have specific visiting hours, while others are freely accessible public spaces. Check our detailed location guides for specific visiting information.`
      },
      {
        question: `What's the best time to visit film locations in ${name}?`,
        answer: `The best time to visit film locations in ${name} depends on the specific sites you want to see. Generally, visiting during weekdays or off-season will help you avoid crowds. Early morning is also a good time for photography at popular locations.`
      }
    ];
  }

  return (
    <>
      <SEO 
        meta={pageMeta}
        jsonLd={combinedSchema}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Hero section */}
          <section className={`bg-gradient-to-r from-primary/90 to-primary rounded-2xl shadow-xl px-4 py-12 mb-8 text-white transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative overflow-hidden`}>
            {heroImageUrl && (
              <div className="absolute inset-0 z-0 opacity-20">
                <Image 
                  src={heroImageUrl} 
                  alt={`${name} film locations`} 
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            )}
            <div className="max-w-4xl mx-auto relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                {heroSubtitle}
              </p>
              
              {/* Search bar */}
              <div className="relative max-w-xl">
                <input
                  type="text"
                  placeholder="Search for a location..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <svg className="w-5 h-5 absolute left-3 top-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </section>

          {/* Map section */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {name} Filming Locations Map
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-lg">
              <Map
                markers={mapMarkers}
                height="500px"
                zoom={mapMarkers.length > 20 ? 10 : 12}
                center={{ 
                  lat: mapMarkers[0]?.lat || 0, 
                  lng: mapMarkers[0]?.lng || 0 
                }}
              />
            </div>
            <p className="text-gray-600 text-sm italic mt-4 bg-gray-50 p-4 rounded-lg border-l-4 border-primary/30">
              This map shows all {locations.length} filming locations in {name}. Click any marker to explore details about what was filmed there.
            </p>
          </section>

          {/* Locations listing */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              All Filming Locations in {name}
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            {filteredLocations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No locations found matching "{filterText}"</p>
                <button 
                  onClick={() => setFilterText('')} 
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedLocations.map((location) => (
                  <Link
                    key={location.formattedSlug}
                    href={`/locations/${location.formattedSlug}`}
                    className="group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="h-48 relative overflow-hidden">
                      {location.image && (
                        <Image
                          src={location.image}
                          alt={location.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                        {location.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {location.mediaItems.length} films & TV shows
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                        {location.mediaItems.slice(0, 3).map((item, index) => (
                          <span key={index} className="inline-block bg-white px-2 py-1 rounded text-xs border border-gray-200">
                            {item.title}
                          </span>
                        ))}
                        {location.mediaItems.length > 3 && (
                          <span className="inline-block bg-white px-2 py-1 rounded text-xs border border-gray-200">
                            +{location.mediaItems.length - 3} more
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center text-sm text-primary font-medium">
                        Explore location
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Frequently Asked Questions
              </h2>
              <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
              
              <FAQSection items={faqs} includeSchema={true} />
            </section>
          )}

          {/* Related Locations */}
          {relatedLocations.length > 0 && (
            <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-400' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Related Film Locations
              </h2>
              <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedLocations.map((item, index) => (
                  <Link
                    key={index}
                    href={item.slug}
                    className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-gray-50"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-2 hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
} 
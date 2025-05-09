import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import { CityInfo, getLocationsByCity } from '../../utils/locationUtils';
import { getWebPageSchema, getBreadcrumbSchema, combineSchemas } from '../../utils/schema';
import { getKeywordsMetaContent } from '../../utils/metaUtils';
import FAQSection, { FAQItem } from '../../components/FAQSection';

interface CitiesPageProps {
  cities: CityInfo[];
}

export default function CitiesPage({ cities }: CitiesPageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<CityInfo[]>(cities);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Load animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    let filtered = cities;
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(city => 
        city.country === selectedCountry
      );
    }
    
    setFilteredCities(filtered);
  }, [searchQuery, selectedCountry, cities]);

  // Get unique countries for filter
  const uniqueCountries = [...new Set(cities.map(city => city.country))].sort();

  // Group cities by first letter for alphabetical display
  const groupedCities = filteredCities.reduce<Record<string, CityInfo[]>>((acc, city) => {
    const firstLetter = city.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(city);
    return acc;
  }, {});

  // Sort the keys (letters) alphabetically
  const sortedLetters = Object.keys(groupedCities).sort();

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Locations', url: '/locations' },
    { label: 'Cities' }
  ];

  // Generate FAQs for better SEO
  const faqs: FAQItem[] = [
    {
      question: "What city has the most movie filming locations?",
      answer: `New York City has the most film locations, with thousands of scenes shot across its iconic skyline, neighborhoods, and landmarks. London, Los Angeles, Paris, and Toronto round out the top five cities that appear most frequently in films and TV shows.`
    },
    {
      question: "How can I find filming locations in a specific city?",
      answer: `Our city pages provide comprehensive guides to filming locations in each city. Simply browse our alphabetical list of cities or use the search function to find a specific city. Each city page features an interactive map showing all filming locations, along with details about the films and TV shows shot there.`
    },
    {
      question: "Which cities are most frequently used as stand-ins for other locations?",
      answer: `Toronto, Vancouver, and Montreal often stand in for American cities due to lower production costs. Budapest, Prague, and Malta frequently double for historical European and Middle Eastern settings. Atlanta has become a popular stand-in for various urban environments due to Georgia's film incentives.`
    },
    {
      question: "Can I take tours of famous movie locations in cities?",
      answer: `Yes, many cities offer dedicated film location tours. New York, London, Los Angeles, and Paris have particularly extensive tour options. Our city guides include information about official tours where available, as well as self-guided tour suggestions for exploring filming locations independently.`
    }
  ];

  // Prepare metadata
  const title = "Film and TV Locations by City | Where Was It Filmed";
  const description = `Explore ${cities.length} cities around the world where famous movies and TV shows were filmed. Find film locations by city with interactive maps and guides.`;
  
  // Prepare meta data with keyword optimization
  const pageMeta = {
    title,
    description,
    slug: "locations/cities",
    keywords: getKeywordsMetaContent('location', 'cities')
  };

  // Generate schema data for SEO
  const webPageSchema = getWebPageSchema(
    "Film and TV Locations by City",
    description,
    "https://wherewasitfilmed.co/locations/cities"
  );

  // Generate breadcrumb schema
  const breadcrumbSchema = getBreadcrumbSchema(
    breadcrumbItems.map(item => ({
      name: item.label,
      url: item.url 
        ? `https://wherewasitfilmed.co${item.url}`
        : "https://wherewasitfilmed.co/locations/cities"
    }))
  );

  // Combine schemas
  const combinedSchema = combineSchemas([webPageSchema, breadcrumbSchema]);

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
          <section className={`bg-gradient-to-r from-primary/90 to-primary rounded-2xl shadow-xl px-4 py-12 mb-8 text-white transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Film Locations by City
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                Explore {cities.length} cities around the world where your favorite movies and TV shows were filmed
              </p>
              
              {/* Search and filter bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-auto md:flex-1">
                  <input
                    type="text"
                    placeholder="Search for a city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="w-full md:w-auto">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full md:w-auto px-4 py-3 rounded-full bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="all">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Cities Grid - Popular Cities */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Popular Filming Cities
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities
                .sort((a, b) => b.mediaItemCount - a.mediaItemCount)
                .slice(0, 6)
                .map((city) => (
                  <Link
                    key={city.slug}
                    href={`/locations/city/${city.slug}`}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 block h-64"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                    {city.image && (
                      <Image
                        src={city.image}
                        alt={`${city.name} film locations`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-xl text-white font-bold mb-1">
                        {city.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-2">
                        {city.country}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-white/80 text-sm">
                          {city.locationCount} locations • {city.mediaItemCount} films/shows
                        </p>
                        <div className="bg-primary/90 rounded-full p-1 group-hover:bg-white transition-colors duration-300">
                          <svg className="w-4 h-4 text-white group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* Alphabetical City Listing */}
          {filteredCities.length > 0 ? (
            <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Cities A-Z {selectedCountry !== 'all' ? `in ${selectedCountry}` : ''}
              </h2>
              <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
              
              {sortedLetters.map((letter) => (
                <div key={letter} className="border-b border-gray-100 pb-6 mb-6 last:border-b-0">
                  <h3 className="text-2xl font-bold text-primary mb-4">{letter}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {groupedCities[letter].sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
                      <Link
                        key={city.slug}
                        href={`/locations/city/${city.slug}`}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex-1">
                          <h4 className="text-gray-800 font-medium group-hover:text-primary transition-colors">
                            {city.name}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            {city.country} • {city.locationCount} locations
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow my-8">
              <p className="text-gray-500 text-lg">No cities found matching your search criteria</p>
              <div className="mt-4 space-x-4">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
                {selectedCountry !== 'all' && (
                  <button 
                    onClick={() => setSelectedCountry('all')} 
                    className="text-primary hover:underline"
                  >
                    Show all countries
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* FAQ Section for SEO */}
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

          {/* City Statistics */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-400' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              City Filming Statistics
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-1">{cities.length}</h3>
                <p className="text-gray-600">Total cities with film locations</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-1">{uniqueCountries.length}</h3>
                <p className="text-gray-600">Countries represented</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-1">
                  {cities.reduce((total, city) => total + city.locationCount, 0)}
                </h3>
                <p className="text-gray-600">Total filming locations</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-1">
                  {cities.reduce((total, city) => total + city.mediaItemCount, 0)}
                </h3>
                <p className="text-gray-600">Films and TV shows</p>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Film Locations in Cities Around the World
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Cities have always been a favorite backdrop for filmmakers, offering distinctive skylines, unique architecture, and vibrant streets that bring stories to life. From the iconic skyscrapers of New York City to the historic streets of Rome, our database covers {cities.length} cities that have featured in popular films and TV shows.
              </p>
              <p>
                Major cities like New York, London, and Los Angeles appear in thousands of productions, but smaller cities and towns often provide the most distinctive and memorable filming locations. Our comprehensive city guides help you discover these locations, whether you're planning a film tourism trip or simply curious about where your favorite scenes were filmed.
              </p>
              <p>
                Each city page features detailed information about specific filming locations, interactive maps, and facts about the productions that used these locations. Discover hidden gems, iconic landmarks, and how filmmakers transform ordinary city streets into extraordinary cinematic settings.
              </p>
              <p>
                Browse our collection alphabetically, search for a specific city, or filter by country to start exploring the real-world locations behind your favorite films and TV shows.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Get all cities
  const cities = await getLocationsByCity();
  
  return {
    props: {
      cities,
    },
    revalidate: 86400, // Revalidate once per day
  };
}; 
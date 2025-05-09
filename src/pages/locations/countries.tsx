import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import { CountryInfo, getLocationsByCountry } from '../../utils/locationUtils';
import { getWebPageSchema, getBreadcrumbSchema, combineSchemas } from '../../utils/schema';
import { getKeywordsMetaContent } from '../../utils/metaUtils';
import FAQSection, { FAQItem } from '../../components/FAQSection';

interface CountriesPageProps {
  countries: CountryInfo[];
}

export default function CountriesPage({ countries }: CountriesPageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<CountryInfo[]>(countries);
  const [selectedContinent, setSelectedContinent] = useState<string>('all');

  // Load animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    let filtered = countries;
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply continent filter
    if (selectedContinent !== 'all') {
      filtered = filtered.filter(country => 
        getContinentForCountry(country.name) === selectedContinent
      );
    }
    
    setFilteredCountries(filtered);
  }, [searchQuery, selectedContinent, countries]);

  // Get unique continents for filter
  const continentsMap: Record<string, string[]> = {
    'Europe': ['United Kingdom', 'France', 'Italy', 'Spain', 'Germany', 'Netherlands', 'Ireland', 'Greece', 'Czech Republic', 'Austria', 'Hungary', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Iceland'],
    'North America': ['United States', 'Canada', 'Mexico'],
    'Asia': ['Japan', 'China', 'South Korea', 'Thailand', 'India', 'United Arab Emirates'],
    'Oceania': ['Australia', 'New Zealand'],
    'South America': ['Brazil', 'Argentina', 'Chile'],
    'Africa': ['Egypt', 'Morocco', 'South Africa']
  };
  
  // Helper function to get continent for a country
  function getContinentForCountry(countryName: string): string {
    for (const [continent, countries] of Object.entries(continentsMap)) {
      if (countries.includes(countryName)) {
        return continent;
      }
    }
    return 'Other';
  }

  const uniqueContinents = ['Europe', 'North America', 'Asia', 'Oceania', 'South America', 'Africa', 'Other'];

  // Group countries by first letter for alphabetical display
  const groupedCountries = filteredCountries.reduce<Record<string, CountryInfo[]>>((acc, country) => {
    const firstLetter = country.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(country);
    return acc;
  }, {});

  // Sort the keys (letters) alphabetically
  const sortedLetters = Object.keys(groupedCountries).sort();

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Locations', url: '/locations' },
    { label: 'Countries' }
  ];
  
  // Generate FAQs for better SEO
  const faqs: FAQItem[] = [
    {
      question: "What country has the most movie filming locations?",
      answer: `Based on our database, the United States has the most film locations, followed by the United Kingdom and New Zealand. These countries offer diverse landscapes, tax incentives, and established film infrastructures that attract major productions.`
    },
    {
      question: "How can I find filming locations by country?",
      answer: `You can explore our comprehensive database of filming locations by country. Simply browse through our alphabetical country list or use the search function to find a specific country. Each country page provides an interactive map, detailed location listings, and information about films shot there.`
    },
    {
      question: "What are the most popular filming locations outside the US?",
      answer: `New Zealand (known for Lord of the Rings), the United Kingdom (Harry Potter, James Bond), Iceland (Game of Thrones), and Thailand (numerous action films) are among the most popular international filming destinations. These countries offer unique landscapes and often provide significant tax incentives for film productions.`
    },
    {
      question: "Do film studios prefer certain countries for filming?",
      answer: `Yes, film studios often prefer countries with a combination of diverse landscapes, experienced film crews, studio facilities, tax incentives, and political stability. Countries like Canada, the UK, Australia, and New Zealand are particularly favored for large productions, while countries with unique visual aesthetics are chosen for specific settings.`
    }
  ];

  // Prepare metadata
  const title = "Film and TV Locations by Country | Where Was It Filmed";
  const description = `Explore ${countries.length} countries around the world where famous movies and TV shows were filmed. Find film locations by country with interactive maps and guides.`;
  
  // Prepare meta data with keyword optimization
  const pageMeta = {
    title,
    description,
    slug: "locations/countries",
    keywords: getKeywordsMetaContent('location', 'countries')
  };

  // Generate schema data for SEO
  const webPageSchema = getWebPageSchema(
    "Film and TV Locations by Country",
    description,
    "https://wherewasitfilmed.co/locations/countries"
  );

  // Generate breadcrumb schema
  const breadcrumbSchema = getBreadcrumbSchema(
    breadcrumbItems.map(item => ({
      name: item.label,
      url: item.url 
        ? `https://wherewasitfilmed.co${item.url}`
        : "https://wherewasitfilmed.co/locations/countries"
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
                Film Locations by Country
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                Explore {countries.length} countries around the world where your favorite movies and TV shows were filmed
              </p>
              
              {/* Search and filter bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-auto md:flex-1">
                  <input
                    type="text"
                    placeholder="Search for a country..."
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
                    value={selectedContinent}
                    onChange={(e) => setSelectedContinent(e.target.value)}
                    className="w-full md:w-auto px-4 py-3 rounded-full bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="all">All Continents</option>
                    {uniqueContinents.map(continent => (
                      <option key={continent} value={continent}>{continent}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Countries Grid - Popular Countries */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Popular Filming Countries
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries
                .sort((a, b) => b.mediaItemCount - a.mediaItemCount)
                .slice(0, 6)
                .map((country) => (
                  <Link
                    key={country.slug}
                    href={`/locations/country/${country.slug}`}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 block h-64"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                    {country.image && (
                      <Image
                        src={country.image}
                        alt={`${country.name} film locations`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-xl text-white font-bold mb-1">
                        {country.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-2">
                        {country.cities.length} cities
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-white/80 text-sm">
                          {country.locationCount} locations • {country.mediaItemCount} films/shows
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

          {/* Alphabetical Country Listing */}
          {filteredCountries.length > 0 ? (
            <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Countries A-Z {selectedContinent !== 'all' ? `in ${selectedContinent}` : ''}
              </h2>
              <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
              
              {sortedLetters.map((letter) => (
                <div key={letter} className="border-b border-gray-100 pb-6 mb-6 last:border-b-0">
                  <h3 className="text-2xl font-bold text-primary mb-4">{letter}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {groupedCountries[letter].sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                      <Link
                        key={country.slug}
                        href={`/locations/country/${country.slug}`}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex-1">
                          <h4 className="text-gray-800 font-medium group-hover:text-primary transition-colors">
                            {country.name}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            {country.cities.length} cities • {country.locationCount} locations
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
            <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0'}`}>
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No countries found</h3>
                <p className="text-gray-600 mb-6">
                  No countries match your search criteria. Try adjusting your filters.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedContinent('all'); }}
                  className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </section>
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
          
          {/* SEO Content Section */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-400' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Discover Film Locations Around the World
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                From the iconic streets of New York City to the stunning landscapes of New Zealand, films and TV shows have showcased locations from around the globe. Our comprehensive collection of {countries.length} countries allows you to explore famous filming locations from your favorite productions.
              </p>
              <p>
                Whether you're planning a movie-inspired trip or just curious about where famous scenes were filmed, our country guides provide detailed information on filming locations complete with interactive maps, visitor information, and behind-the-scenes facts.
              </p>
              <p>
                Popular countries for filming include the United States with its diverse landscapes and iconic cities, the United Kingdom with its historic architecture, New Zealand's breathtaking natural scenery made famous by The Lord of the Rings, and Japan's unique blend of ultramodern and traditional locations.
              </p>
              <p>
                Browse our collection by country, continent, or search for a specific destination to discover the real-world locations behind your favorite films and TV shows.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Get all countries
  const countries = await getLocationsByCountry();
  
  return {
    props: {
      countries,
    },
    revalidate: 86400, // Revalidate once per day
  };
}; 
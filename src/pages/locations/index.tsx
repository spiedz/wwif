import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { LocationInfo, getAllLocations } from '../../utils/locationUtils';
import { getWebPageSchema } from '../../utils/schema';
import Map from '../../components/Map';

interface LocationsPageProps {
  locations: LocationInfo[];
}

export default function LocationsPage({ locations }: LocationsPageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<LocationInfo[]>(locations);

  // Load animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle search query changes
  useEffect(() => {
    const filtered = locations.filter(location => 
      location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchQuery, locations]);

  // Group locations by first letter for alphabetical display
  const groupedLocations = filteredLocations.reduce<Record<string, LocationInfo[]>>((acc, location) => {
    const firstLetter = location.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(location);
    return acc;
  }, {});

  // Sort the keys (letters) alphabetically
  const sortedLetters = Object.keys(groupedLocations).sort();

  // Prepare map markers for all locations
  const mapMarkers = locations.map(location => ({
    lat: location.lat,
    lng: location.lng,
    title: location.name,
    description: `${location.mediaItems.length} films/series filmed here`
  }));

  // Prepare metadata
  const pageMeta = {
    title: "Filming Locations | Where Was It Filmed",
    description: "Explore film and TV series filming locations around the world. Find out what movies and shows were filmed in your favorite places.",
    slug: "locations"
  };

  // JSON-LD Schema
  const schema = getWebPageSchema(
    "Filming Locations",
    "Discover all the real-world locations where your favorite movies and TV shows were filmed.",
    "https://wherewasitfilmed.co/locations"
  );

  return (
    <>
      <SEO 
        meta={pageMeta}
        jsonLd={JSON.stringify(schema)}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          
          {/* Hero section */}
          <section className={`bg-gradient-to-r from-primary/90 to-primary rounded-2xl shadow-xl px-4 py-12 mb-8 text-white transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Filming Locations
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                Explore {locations.length} real-world filming locations from your favorite movies and TV shows
              </p>
              
              {/* Search bar */}
              <div className="relative max-w-xl">
                <input
                  type="text"
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              Explore All Filming Locations
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-lg">
              <Map
                markers={mapMarkers}
                height="500px"
                zoom={2}
              />
            </div>
            <p className="text-gray-600 text-sm italic mt-4 bg-gray-50 p-4 rounded-lg border-l-4 border-primary/30">
              This map shows all filming locations available on our site. Click a marker to explore what was filmed there.
            </p>
          </section>

          {/* Alphabetical listing */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Locations A-Z
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            {filteredLocations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No locations found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedLetters.map((letter) => (
                  <div key={letter} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h3 className="text-2xl font-bold text-primary mb-4">{letter}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {groupedLocations[letter].map((location) => (
                        <Link
                          key={location.formattedSlug}
                          href={`/locations/${location.formattedSlug}`}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex-1">
                            <h4 className="text-gray-800 font-medium group-hover:text-primary transition-colors">
                              {location.name}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              {location.mediaItems.length} {location.mediaItems.length === 1 ? 'title' : 'titles'}
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
              </div>
            )}
          </section>

          {/* Popular locations */}
          <section className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Popular Filming Locations
            </h2>
            <div className="w-32 h-1 bg-primary/30 rounded mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations
                .sort((a, b) => b.mediaItems.length - a.mediaItems.length)
                .slice(0, 6)
                .map((location) => (
                  <Link
                    key={location.formattedSlug}
                    href={`/locations/${location.formattedSlug}`}
                    className="group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                        {location.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {location.mediaItems.length} films & TV shows
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
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
          </section>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<LocationsPageProps> = async () => {
  // Temporarily disable locations page to prevent build errors
  // TODO: Fix component import issues causing "Element type is invalid" errors
  return {
    notFound: true,
  };
  
  // Original code commented out:
  /*
  try {
    const locations = await getAllLocations();
    
    return {
      props: {
        locations,
      },
      revalidate: 86400, // 24 hours
    };
  } catch (error) {
    console.error('Error generating locations page:', error);
    return {
      notFound: true,
    };
  }
  */
}; 
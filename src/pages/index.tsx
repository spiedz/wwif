import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { getWebPageSchema } from '../utils/schema';
import { useRouter } from 'next/router';
import PopularCategoriesContainer from '../components/PopularCategoriesContainer';
import Image from 'next/image';
import BannerAd from '../components/ads/BannerAd';
import { AD_SLOTS } from '../utils/adManager';
import SearchBar from '../components/search/SearchBar';

export default function Home() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const currentUrl = `${BASE_URL}${router.asPath}`;
  
  // State for stats
  const [stats] = useState({
    films: 227,
    series: 101,
    locations: 500,
    countries: 45
  });
  
  // Create page metadata
  const pageMeta = {
    title: 'Where Was It Filmed',
    description: `Explore the real-world filming locations of your favorite movies and TV shows. Discover ${stats.films}+ films and ${stats.series}+ series across ${stats.countries} countries.`,
    slug: '',
  };
  
  // Generate webpage schema
  const webpageSchema = getWebPageSchema(
    'Where Was It Filmed | Discover Real Movie & TV Locations',
    `Explore the real-world filming locations of your favorite movies and TV shows. Discover ${stats.films}+ films and ${stats.series}+ series across ${stats.countries} countries.`,
    currentUrl
  );

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Hero carousel content
  const heroSlides = [
    {
      title: "The Fantastic Four (2025) Filming Locations",
      subtitle: "Marvel's First Family returns - filmed in Buckinghamshire & London",
      image: "https://www.rollingstone.com/wp-content/uploads/2025/02/MFB1420_TRL_comp_DDO_v0137.1038_R8.jpg",
      slug: "/films/where-was-the-fantastic-four-2025-filmed",
      isNew: true
    },
    {
      title: "Thunderbolts* Filming Locations",
      subtitle: "Latest Marvel filming locations revealed",
      image: "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:0,cw:1920,ch:1080,q:80,w:1920/t6ons9A2MQVtKmAFDejv24.jpg",
      slug: "/films/where-was-thunderbolts-filmed",
      isNew: true
    },
    {
      title: "Final Destination: Bloodlines Filming Locations",
      subtitle: "The deadly franchise returns - filmed in Vancouver with spectacular tower collapse scenes",
      image: "https://m.media-amazon.com/images/M/MV5BMzc3OWFhZWItMTE2Yy00N2NmLTg1YTktNGVlNDY0ODQ5YjNlXkEyXkFqcGc@._V1_.jpg",
      slug: "/films/where-was-final-destination-bloodlines-filmed",
      isNew: true
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <>
      <SEO 
        meta={pageMeta}
        jsonLd={webpageSchema}
      />

      {/* Hero Section with Carousel */}
      <section className="bg-gradient-to-r from-red-800 to-primary py-12 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Where Your Favorite Films Come to Life
              </h1>
              <p className="text-lg md:text-xl text-white opacity-90 mb-6">
                Explore real-world locations where iconic movie and TV scenes were filmed. 
                Plan your visit and experience the magic yourself.
              </p>
              
              {/* Stats Counter */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stats.films}+</div>
                  <div className="text-white/80 text-sm">Films</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stats.series}+</div>
                  <div className="text-white/80 text-sm">TV Series</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stats.locations}+</div>
                  <div className="text-white/80 text-sm">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stats.countries}</div>
                  <div className="text-white/80 text-sm">Countries</div>
                </div>
              </div>
              
              {/* Hero Search Box */}
              <div className="mb-8">
                <SearchBar 
                  onSearch={handleSearch} 
                  autoFocus={false}
                  showSuggestions={true}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                  placeholder="Search movies, TV shows, actors..."
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/films" 
                  className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Explore {stats.films}+ Films
                </Link>
                <Link 
                  href="/series" 
                  className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Browse {stats.series}+ Series
                </Link>
                <Link 
                  href="/locations" 
                  className="inline-block border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
                >
                  Visit Locations
                </Link>
                <Link 
                  href="/blog" 
                  className="inline-block border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
                >
                  Travel Guides
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="relative">
                {/* Carousel Container */}
                <div className="relative h-60 sm:h-72 md:h-80 w-full rounded-lg overflow-hidden shadow-2xl">
                  {heroSlides.map((slide, index) => (
                    <Link key={index} href={slide.slug} className="block">
                      <div className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="relative w-full h-full group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                          <Image 
                            src={slide.image} 
                            alt={slide.title} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            width={800}
                            height={400}
                            priority={index === 0}
                          />
                          {slide.isNew && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
                              NEW
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            <p className="text-white text-lg font-bold">{slide.title}</p>
                            <p className="text-white/80 text-sm">{slide.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Carousel Indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Trust Signals Section */}
        <section className="mb-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Trusted by Film Location Enthusiasts Worldwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Verified Locations</h3>
                <p className="text-gray-600 text-sm">All filming locations are researched and verified through multiple sources</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
                <p className="text-gray-600 text-sm">Powered by a passionate community of film location enthusiasts</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Regular Updates</h3>
                <p className="text-gray-600 text-sm">New filming locations added weekly from the latest movies and shows</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Find Your Favorite Film</h3>
              <p className="text-gray-600">Browse our database of {stats.films}+ movies and {stats.series}+ TV shows to find the ones you love.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Explore Verified Locations</h3>
              <p className="text-gray-600">Discover the real-world locations where your favorite scenes were shot, with detailed maps and photos.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Plan Your Visit</h3>
              <p className="text-gray-600">Use our travel tips, booking links, and insider information to experience these iconic locations yourself.</p>
            </div>
          </div>
        </section>
        
        {/* Ad Banner */}
        <BannerAd slot={AD_SLOTS.HOME_TOP_BANNER} className="mb-16" />
        
        {/* Popular Categories - Dynamic Component */}
        <PopularCategoriesContainer 
          title="Popular Categories"
          showViewAll={true}
          maxCategories={6}
        />
        
        {/* Recently Added Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Recently Added</h2>
            <Link 
              href="/films" 
              className="text-primary hover:text-red-700 font-medium flex items-center"
            >
              View All Films
              <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Where Was Back to the Future Filmed?",
                description: "Travel back in time to discover the iconic California locations from the classic time-travel adventure.",
                image: "https://m.media-amazon.com/images/M/MV5BMjA4MzI0NzI3MF5BMl5BanBnXkFtZTcwOTc4Mzg0OQ@@._V1_.jpg",
                slug: "where-was-back-to-the-future-filmed",
                isNew: false,
                year: 1985
              },
              {
                title: "Where Was Interstellar Filmed?",
                description: "Journey beyond the dust to discover Interstellar's stunning real-world filming locations in Canada and Iceland.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSngBJ0B7UDrLUkDlp6DCQLsEYuWR-DiHwbnxFFCniB3HiP3f3NZmR1-lKSC34ge6YXu4LX",
                slug: "where-was-interstellar-filmed",
                isNew: false,
                year: 2014
              },
              {
                title: "Where Was Thunderbolts* Filmed?",
                description: "Discover the filming locations of Marvel's latest anti-hero team movie across Utah, Malaysia, and more.",
                image: "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:0,cw:1920,ch:1080,q:80,w:1920/t6ons9A2MQVtKmAFDejv24.jpg",
                slug: "where-was-thunderbolts-filmed",
                isNew: true,
                year: 2025
              }
            ].map((item, index) => (
              <Link key={index} href={`/films/${item.slug}`} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
                  <div className="h-48 overflow-hidden relative">
                    {item.isNew && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                        NEW
                      </div>
                    )}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-sm opacity-80">{item.year}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-end">
                      <span className="text-primary group-hover:text-red-700 font-medium text-sm flex items-center transition-colors">
                        Explore Locations
                        <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Featured Filming Locations Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Filming Locations</h2>
              <p className="text-gray-600 mt-2">Discover the real places where movie magic happens</p>
            </div>
            <Link 
              href="/locations" 
              className="text-primary hover:text-red-700 font-medium flex items-center"
            >
              View All Locations
              <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Larne",
                description: "Northern Ireland's filming hotspot featuring Game of Thrones locations, harbours, and dramatic coastal routes.",
                country: "Northern Ireland",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                slug: "larne",
                featuredProductions: ["Game of Thrones", "Morgan", "The Foreigner"],
                stats: { films: 6, series: 1 }
              },
              {
                name: "London",
                description: "The world's most filmed city with iconic landmarks from Big Ben to Tower Bridge appearing in countless productions.",
                country: "England",
                image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                slug: "london",
                featuredProductions: ["Harry Potter", "James Bond", "The Crown"],
                stats: { films: 150, series: 45 }
              },
              {
                name: "New York City",
                description: "From Manhattan skyscrapers to Brooklyn streets, NYC provides the backdrop for countless Hollywood blockbusters.",
                country: "United States",
                image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                slug: "new-york-city",
                featuredProductions: ["Spider-Man", "The Avengers", "Friends"],
                stats: { films: 200, series: 75 }
              }
            ].map((location, index) => (
              <Link key={index} href={`/locations/${location.slug}`} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={location.image} 
                      alt={`${location.name} filming locations`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-sm opacity-80">{location.country}</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {location.stats.films}+ Films
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-primary transition-colors">{location.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{location.description}</p>
                    
                    {/* Featured Productions */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Featured in:</p>
                      <div className="flex flex-wrap gap-1">
                        {location.featuredProductions.slice(0, 3).map((production, prodIndex) => (
                          <span key={prodIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {production}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {location.stats.films} films • {location.stats.series} series
                      </div>
                      <span className="text-primary group-hover:text-red-700 font-medium text-sm flex items-center transition-colors">
                        Explore
                        <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Location Feature Banner */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Plan Your Film Location Tour</h3>
            <p className="text-lg mb-6 text-white/90">
              Discover detailed guides, travel tips, and insider information for visiting your favorite filming locations
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/locations" 
                className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse All Locations
              </Link>
              <Link 
                href="/blog" 
                className="border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Travel Guides
              </Link>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="bg-light-gray p-8 md:p-12 rounded-lg shadow-md">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Never Miss a Location</h2>
            <p className="text-gray-600 mb-6">
              Get the latest filming location guides, travel tips, and behind-the-scenes content delivered to your inbox. Join 10,000+ film location enthusiasts!
            </p>
            <form className="flex flex-col sm:flex-row gap-3 mb-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none"
                required
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors font-medium"
              >
                Get Free Updates
              </button>
            </form>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No spam, ever
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Unsubscribe anytime
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 
import React from 'react';
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
  
  // Create page metadata
  const pageMeta = {
    title: 'Where Was It Filmed',
    description: 'Explore the real-world filming locations of your favorite movies and TV shows.',
    slug: '',
  };
  
  // Generate webpage schema
  const webpageSchema = getWebPageSchema(
    'Where Was It Filmed | Discover Real Movie & TV Locations',
    'Explore the real-world filming locations of your favorite movies and TV shows.',
    currentUrl
  );

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <SEO 
        meta={pageMeta}
        jsonLd={webpageSchema}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-primary py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Where Your Favorite Films Come to Life
              </h1>
              <p className="text-lg md:text-xl text-white opacity-90 mb-8">
                Explore real-world locations where iconic movie and TV scenes were filmed. 
                Plan your visit and experience the magic yourself.
              </p>
              
              {/* Hero Search Box */}
              <div className="mb-8">
                <SearchBar 
                  onSearch={handleSearch} 
                  autoFocus={false}
                  showSuggestions={true}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/films" 
                  className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Browse Films
                </Link>
                <Link 
                  href="/series" 
                  className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Browse Series
                </Link>
                <Link 
                  href="/locations" 
                  className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Explore Locations
                </Link>
                <Link 
                  href="/blog" 
                  className="inline-block border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
                >
                  Read Our Blog
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <Link href="/films/where-was-harry-potter-filmed" className="block">
                <div className="relative h-60 sm:h-72 md:h-80 w-full rounded-lg overflow-hidden shadow-2xl group">
                  {/* Harry Potter Map Image */}
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                      <Image 
                        src="https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630" 
                        alt="Harry Potter Filming Locations Map" 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        width={800}
                        height={400}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <p className="text-white text-lg font-bold">Harry Potter Filming Locations</p>
                        <p className="text-white/80 text-sm">Explore the magical world across the UK</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Find Your Favorite Film</h3>
              <p className="text-gray-600">Browse our database of movies and TV shows to find the ones you love.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Explore Film Locations</h3>
              <p className="text-gray-600">Discover the real-world locations where your favorite scenes were shot.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Plan Your Visit</h3>
              <p className="text-gray-600">Use our travel tips to experience these iconic locations for yourself.</p>
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
        
        {/* TV Series Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Popular TV Series</h2>
            <Link 
              href="/series" 
              className="text-primary hover:text-red-700 font-medium flex items-center"
            >
              View All Series
              <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Where Was Stranger Things Filmed?",
                description: "Explore the real-world locations behind the supernatural hit series.",
                image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                slug: "where-was-stranger-things-filmed"
              },
              {
                title: "Where Was Game of Thrones Filmed?",
                description: "Discover the stunning locations that brought Westeros to life.",
                image: "https://images.unsplash.com/photo-1576549116895-29f97be12d6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                slug: "where-was-game-of-thrones-filmed"
              },
              {
                title: "Where Was Breaking Bad Filmed?",
                description: "Visit the real Albuquerque locations from the iconic crime drama.",
                image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                slug: "where-was-breaking-bad-filmed"
              }
            ].map((series, index) => (
              <Link key={index} href={`/series/${series.slug}`} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={series.image} 
                      alt={series.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-primary transition-colors">{series.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{series.description}</p>
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
        
        {/* Featured Locations */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Locations</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'New York City, USA',
                description: 'Home to countless iconic movie scenes, from superhero battles to romantic comedies.',
                slug: 'what-was-filmed-in-new-york-city',
                image: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300'
              },
              {
                title: 'Dubrovnik, Croatia',
                description: 'The real-world setting for King\'s Landing in Game of Thrones.',
                slug: 'what-was-filmed-in-dubrovnik',
                image: 'https://images.unsplash.com/photo-1555990538-17bae0b94f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300'
              },
              {
                title: 'Matamata, New Zealand',
                description: 'Visit the Hobbiton set from The Lord of the Rings and The Hobbit.',
                slug: 'what-was-filmed-in-matamata',
                image: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300'
              }
            ].map((location, index) => (
              <Link key={index} href={`/locations/${location.slug}`} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={location.image} 
                      alt={location.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1568707043650-eb03f2536825?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-primary transition-colors">{location.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{location.description}</p>
                    <div className="flex justify-end">
                      <span className="text-primary group-hover:text-red-700 font-medium text-sm flex items-center transition-colors">
                        See films & series
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
        
        {/* Newsletter Section */}
        <section className="bg-light-gray p-8 md:p-12 rounded-lg shadow-md">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to get the latest updates on new filming locations and travel guides.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
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
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </main>
    </>
  );
} 
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import SEO from '../../components/SEO';
import { getAllSeries } from '../../lib/server/serverMarkdown';
import { TVSeries } from '../../types/series';

interface SeriesIndexPageProps {
  allSeries: TVSeries[];
}

export default function SeriesIndexPage({ allSeries }: SeriesIndexPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter series based on search term
  const filteredSeries = allSeries.filter(series => 
    series.meta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    series.meta.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    series.meta.genres?.some(genre => 
      genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  return (
    <>
      <SEO
        meta={{
          title: "TV Series Filming Locations",
          description: "Discover where your favorite TV series were filmed. Explore filming locations from popular shows like Game of Thrones, Stranger Things, and more.",
          slug: "series"
        }}
        type="website"
      />
      
      {/* Hero section */}
      <div className="relative bg-black h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-60">
          <img 
            src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1949&q=80" 
            alt="TV Series Filming Locations" 
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80"></div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl mx-auto">
            TV Series Filming Locations
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Discover where your favorite TV shows were filmed and explore the real-world locations that brought them to life.
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto py-12 px-4">
        {/* Search and filter section */}
        <div className="mb-12 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for a TV series by title, description, or genre..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Series grid */}
        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSeries.map((series) => (
              <SeriesCard key={series.meta.slug} series={series} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No TV Series Found</h2>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for more content.</p>
          </div>
        )}
      </div>
    </>
  );
}

// Series card component
const SeriesCard: React.FC<{ series: TVSeries }> = ({ series }) => {
  const { meta } = series;
  
  return (
    <Link 
      href={`/series/${meta.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full"
    >
      {/* Card image */}
      <div className="relative h-60 overflow-hidden">
        {meta.posterImage ? (
          <img 
            src={meta.posterImage}
            alt={meta.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Series year badge */}
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
          {meta.releaseYearStart}
          {meta.releaseYearEnd ? ` - ${meta.releaseYearEnd}` : ' - Present'}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {meta.title}
        </h2>
        
        {/* Genres */}
        {meta.genres && meta.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {meta.genres.slice(0, 3).map((genre, index) => (
              <span key={index} className="text-xs font-medium py-1 px-2 bg-gray-100 text-gray-700 rounded-full">
                {genre}
              </span>
            ))}
            {meta.genres.length > 3 && (
              <span className="text-xs font-medium py-1 px-2 bg-gray-100 text-gray-700 rounded-full">
                +{meta.genres.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {meta.description}
        </p>
        
        {/* Creator */}
        <div className="text-xs text-gray-500 flex items-center">
          <span className="font-medium mr-1">Creator:</span> {meta.creator}
        </div>
        
        {/* View link */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary-dark transition-colors">
            View Filming Locations
            <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export const getStaticProps: GetStaticProps<SeriesIndexPageProps> = async () => {
  const allSeries = await getAllSeries();
  
  return {
    props: {
      allSeries,
    },
    revalidate: 3600, // revalidate every hour
  };
}; 
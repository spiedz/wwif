import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FranchiseFilm } from '../../types/franchise';

interface FranchiseFilmGridProps {
  films: FranchiseFilm[];
}

/**
 * Grid component for displaying films in a franchise
 * Allows for filtering and sorting options
 */
const FranchiseFilmGrid: React.FC<FranchiseFilmGridProps> = ({ films }) => {
  const [sortBy, setSortBy] = useState<'chronological' | 'release'>('release');
  
  // Sort films based on the selected option
  const sortedFilms = React.useMemo(() => {
    const filmsCopy = [...films];
    
    if (sortBy === 'chronological') {
      // Sort by in-universe chronology (using year as proxy)
      return filmsCopy.sort((a, b) => a.year - b.year);
    } else {
      // Sort by release date (using ID as proxy since they're usually in release order)
      return filmsCopy.sort((a, b) => a.id.localeCompare(b.id));
    }
  }, [films, sortBy]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Films in this Franchise</h2>
          
          {/* Sorting options */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'chronological' | 'release')}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 leading-tight focus:outline-none focus:border-primary"
              >
                <option value="release">Release Date</option>
                <option value="chronological">Chronological</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Film grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedFilms.map((film) => (
            <Link key={film.id} href={`/films/${film.slug}`} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl">
                {/* Film poster */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={film.posterImage}
                    alt={film.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20" />
                </div>
                
                {/* Film info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {film.title}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {film.year}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {film.description}
                  </p>
                  
                  {/* Location count badge */}
                  {film.locationCount && (
                    <div className="mt-4 flex items-center text-sm text-primary">
                      <svg 
                        className="w-4 h-4 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      {film.locationCount} Filming {film.locationCount === 1 ? 'Location' : 'Locations'}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FranchiseFilmGrid; 
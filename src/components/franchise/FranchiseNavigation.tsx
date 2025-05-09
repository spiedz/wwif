import React, { useState } from 'react';
import Link from 'next/link';
import { FranchiseFilm } from '../../types/franchise';

interface FranchiseNavigationProps {
  films: FranchiseFilm[];
  currentFilm?: string; // Optional current film slug to highlight
}

/**
 * Navigation component for franchise pages
 * Provides easy navigation between films in a franchise
 */
const FranchiseNavigation: React.FC<FranchiseNavigationProps> = ({
  films,
  currentFilm
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Sort films by year for chronological display
  const sortedFilms = [...films].sort((a, b) => a.year - b.year);

  return (
    <nav className="sticky top-0 z-30 bg-white shadow-md py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center text-gray-700"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="franchise-navigation"
          >
            <span className="mr-2">{isExpanded ? 'Hide Films' : 'Show Films'}</span>
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Desktop title */}
          <h2 className="text-lg font-medium text-gray-900 hidden lg:block">Films in this Franchise:</h2>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-6 overflow-x-auto max-w-4xl scrollbar-thin">
            {sortedFilms.map(film => (
              <Link
                key={film.id}
                href={`/films/${film.slug}`}
                className={`whitespace-nowrap py-1 border-b-2 transition-colors ${
                  currentFilm === film.slug
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-600 hover:text-primary hover:border-gray-300'
                }`}
              >
                {film.title} ({film.year})
              </Link>
            ))}
          </div>
          
          {/* View all button - could link to a dedicated films listing page */}
          <Link
            href="#films-section"
            className="text-primary font-medium hover:text-red-700 transition-colors hidden lg:block"
          >
            View All
          </Link>
        </div>
        
        {/* Mobile navigation (collapsible) */}
        <div
          id="franchise-navigation"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 pt-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col space-y-3">
            {sortedFilms.map(film => (
              <Link
                key={film.id}
                href={`/films/${film.slug}`}
                className={`py-2 px-3 rounded-md transition-colors ${
                  currentFilm === film.slug
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{film.title}</span>
                  <span className="text-sm text-gray-500">{film.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FranchiseNavigation; 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRelatedFilms, RelatedFilmData } from '../utils/filmUtils';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface RelatedFilmsProps {
  currentFilmSlug: string;
  count?: number;
  className?: string;
}

const RelatedFilms: React.FC<RelatedFilmsProps> = ({ 
  currentFilmSlug, 
  count = 4,
  className = '' 
}) => {
  const [relatedFilms, setRelatedFilms] = useState<RelatedFilmData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Make the component visible immediately
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Load related films data
  useEffect(() => {
    const loadRelatedFilms = async () => {
      try {
        console.log(`Loading related films for: ${currentFilmSlug}`);
        setIsLoading(true);
        
        const films = await getRelatedFilms(currentFilmSlug, count);
        console.log(`Found ${films.length} related films`);
        
        if (films && films.length > 0) {
          setRelatedFilms(films);
        } else {
          // If no films found, add some fallback films for better UX
          console.log('No related films found, using fallback films');
          setRelatedFilms([
            {
              title: "Indiana Jones",
              slug: "where-was-indiana-jones-filmed",
              posterImage: "https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
              description: "Explore the stunning filming locations of the Indiana Jones series",
              year: "1981"
            },
            {
              title: "The Dark Knight",
              slug: "where-was-the-dark-knight-filmed",
              posterImage: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
              description: "Visit Gotham City's real-world counterparts in Chicago and London",
              year: "2008"
            },
            {
              title: "Stranger Things",
              slug: "where-was-stranger-things-filmed",
              posterImage: "https://image.tmdb.org/t/p/w500/j2QEBLIHEPw9fSsrHcBW6Qsj3NY.jpg",
              description: "Discover the real town behind Hawkins, Indiana",
              year: "2016"
            },
            {
              title: "Jurassic Park",
              slug: "where-was-jurassic-park-filmed",
              posterImage: "https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
              description: "Visit the tropical islands where dinosaurs roamed",
              year: "1993"
            }
          ]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading related films:', err);
        setError('Unable to load related films');
        
        // Add fallback films in case of error for better UX
        setRelatedFilms([
          {
            title: "The Matrix",
            slug: "where-was-the-matrix-filmed",
            posterImage: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            description: "Experience the iconic locations from The Matrix",
            year: "1999"
          },
          {
            title: "Lord of the Rings",
            slug: "where-was-lord-of-the-rings-filmed", 
            posterImage: "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg",
            description: "Visit the spectacular New Zealand locations",
            year: "2001"
          },
          {
            title: "Harry Potter",
            slug: "where-was-harry-potter-filmed",
            posterImage: "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
            description: "Tour the magical filming locations",
            year: "2001"
          },
          {
            title: "Avatar",
            slug: "where-was-avatar-filmed",
            posterImage: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
            description: "Discover the real-world inspiration for Pandora",
            year: "2009"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRelatedFilms();
  }, [currentFilmSlug, count]);
  
  return (
    <ErrorBoundary>
      <section 
        className={`mt-16 mb-12 ${className} transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        aria-labelledby="related-films-heading"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          
          <h2 
            id="related-films-heading" 
            className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center"
          >
            <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span>Explore more filming locations</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full mb-8"></div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 mb-6">
                <p>We couldn't load related films right now. Here are some suggestions you might enjoy:</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedFilms.map((film, index) => (
                  <FilmCard key={film.slug} film={film} index={index} />
                ))}
              </div>
              <div className="mt-8">
                <Link 
                  href="/films"
                  className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                >
                  Browse All Films
                </Link>
              </div>
            </div>
          ) : relatedFilms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedFilms.map((film, index) => (
                <FilmCard key={film.slug} film={film} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <p className="text-lg text-yellow-800">No other films found at this time</p>
              <p className="text-sm text-yellow-600 mt-2">Check back soon as we continue to add more film locations</p>
              <div className="mt-4">
                <Link 
                  href="/films"
                  className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                >
                  Browse All Films
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
};

interface FilmCardProps {
  film: RelatedFilmData;
  index: number;
}

const FilmCard: React.FC<FilmCardProps> = ({ film, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const defaultImage = '/images/default-location.jpg';
  
  // Delay the appearance of each card for a staggered animation effect
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + index * 150); // Staggered delay
    
    return () => clearTimeout(timer);
  }, [index]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Make sure film properties are defined
  const title = film?.title || 'Unknown Film';
  const slug = film?.slug || 'unknown-film';
  const description = film?.description || '';
  const year = film?.year || '';
  const posterImage = !imageError ? (film?.posterImage || defaultImage) : defaultImage;

  return (
    <Link 
      href={`/films/${slug}`}
      className={`block transform transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full hover:shadow-lg transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Film poster image */}
        <div className="h-52 overflow-hidden relative">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out"
            style={{
              backgroundImage: `url(${posterImage})`,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
          
          {/* Year badge */}
          {year && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
              {year}
            </div>
          )}
        </div>
        
        {/* Film title */}
        <div className="p-4">
          <h3 className="text-gray-800 font-bold text-lg line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {description}
            </p>
          )}
          <div className={`mt-3 inline-flex items-center text-primary text-sm font-medium transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
            <span>View filming locations</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RelatedFilms; 
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FilmMeta } from '../types/content';

interface FilmHeroProps {
  film: FilmMeta;
  posterImage?: string;
}

const FilmHero: React.FC<FilmHeroProps> = ({ film, posterImage }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get a background image based on the first location if no poster
  const defaultBgImage = film.coordinates && film.coordinates.length > 0
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${film.coordinates[0][0]},${film.coordinates[0][1]}&zoom=12&size=1200x600&scale=2&maptype=roadmap&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : '/images/default-film-bg.jpg';

  const backgroundImage = posterImage || defaultBgImage;
  
  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Get the number of locations safely
  const locationCount = film.coordinates ? film.coordinates.length : 0;

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative mb-16 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      {/* Background image with gradient overlay */}
      <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
        {/* Background image using Next.js Image */}
        <div className="absolute inset-0">
          <Image 
            src={backgroundImage}
            alt={`${film.title} backdrop`}
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQIGAwAAAAAAAAAAAAABAgADBAUGITESE1GB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwBdmFrU/YzVhUSqrEbg6H9igCaf/9k="
            className={`object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            onLoadingComplete={() => setImageLoaded(true)}
          />
          
          {/* Show a blurred low-quality image placeholder if the real image is loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
        </div>
        
        {/* Multiple gradient layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10 lg:p-14 text-white">
          <div className="max-w-4xl relative">
            {/* Animated reveal for content */}
            <div className={`transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {/* Film genres pills */}
              <div className="flex flex-wrap gap-2 mb-4 md:mb-5">
                {Array.isArray(film.genre) ? film.genre.map((genre: string, index: number) => (
                  <span 
                    key={`${genre}-${index}`} 
                    className="inline-block px-3 py-1 md:px-4 md:py-1.5 text-xs font-semibold bg-gradient-to-r from-primary to-primary-dark text-white rounded-full backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border border-white/10"
                  >
                    {genre}
                  </span>
                )) : (
                  <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 text-xs font-semibold bg-gradient-to-r from-primary to-primary-dark text-white rounded-full backdrop-blur-sm shadow-md">
                    {film.genre}
                  </span>
                )}
              </div>
            </div>
            
            {/* Film title with animation */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-5 text-white drop-shadow-xl leading-tight transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              {film.title}
            </h1>
            
            {/* Film metadata with animation */}
            <div className={`flex flex-wrap items-center text-xs sm:text-sm md:text-base text-gray-200 mb-4 md:mb-8 gap-x-3 md:gap-x-5 gap-y-2 md:gap-y-3 transition-all duration-1000 delay-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center bg-black/30 px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-sm">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{film.year}</span>
              </div>
              
              <div className="flex items-center bg-black/30 px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-sm">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{film.director}</span>
              </div>
              
              {film.date && (
                <div className="flex items-center bg-black/30 px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-sm">
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                  </svg>
                  <span>Added {formatDate(film.date)}</span>
                </div>
              )}
              
              <div className="flex items-center bg-black/30 px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-sm">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{locationCount} Location{locationCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {/* Film description with animation */}
            <div className={`relative max-w-2xl transition-all duration-1000 delay-900 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              <p className="text-gray-100 hidden sm:block text-base md:text-lg leading-relaxed shadow-lg backdrop-blur-md bg-black/20 p-4 md:p-6 rounded-lg border-l-4 border-primary font-medium">
                {film.description}
                <span className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile description (only shown on small screens) */}
      <div className="block sm:hidden p-4 md:p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-b-2xl">
        <p className="text-gray-100 leading-relaxed border-l-4 border-primary pl-4 py-2">{film.description}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0"></div>
    </div>
  );
};

export default FilmHero; 
import React, { useState, useEffect } from 'react';
import { FilmMeta, FilmRegion, FilmLocation, TravelTip, FilmTrivia } from '../types/content';
import { prepareFilmLocationData } from '../utils/locationFormatters';
import Map from './Map';

interface FilmLocationsGuideProps {
  film: FilmMeta;
}

const FilmLocationsGuide: React.FC<FilmLocationsGuideProps> = ({ film }) => {
  const [activeRegion, setActiveRegion] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Process film data to get regions, travel tips and trivia
  const { regions, travelTips, trivia, useRegionLayout } = prepareFilmLocationData(film);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // If no regions, return null
  if (!regions || regions.length === 0) {
    return null;
  }
  
  return (
    <div className="film-locations-guide">
      {/* Film introduction with animated entrance */}
      <div className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 flex items-center">
          <span className="gradient-text">{film.title}</span>
          <span className="ml-2 text-gray-700"> Filming Locations</span>
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          <span className="float-left text-6xl font-serif text-primary mr-4 mt-1 leading-none">
            {film.description.charAt(0)}
          </span>
          {film.description.substring(1)}
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full my-8"></div>
      </div>

      {/* Map showing all locations */}
      <div className={`mb-16 ${useRegionLayout ? 'bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-1000 hover:shadow-xl' : 'bg-white p-6 rounded-xl shadow-md'} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-6 pt-6 flex items-center">
          <svg className="w-7 h-7 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Interactive Location Map
        </h2>
        <div className={`${useRegionLayout ? 'rounded-xl overflow-hidden shadow-xl mb-6 border border-gray-200' : 'rounded-lg overflow-hidden shadow-md mb-4'}`}>
          <Map 
            markers={film.coordinates.map(coord => ({
              lat: coord.lat,
              lng: coord.lng,
              title: coord.name || '',
              description: coord.description || ''
            }))}
            height="600px" 
            zoom={12}
          />
        </div>
        <p className="text-gray-600 text-sm italic mx-6 mb-6 py-4 px-5 bg-gray-50 rounded-lg border-l-4 border-primary/30">
          <svg className="w-5 h-5 inline-block mr-2 text-primary/70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Explore all {film.coordinates.length} filming locations on the interactive map above. Click on markers for details about each filming location.
        </p>
      </div>

      {/* Regions */}
      <div className="space-y-24">
        {regions.map((region, index) => (
          <div 
            key={index} 
            className={`region-section ${useRegionLayout ? 'transform transition-all duration-700 hover:scale-[1.01]' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} 
            style={{ transitionDelay: `${300 + index * 150}ms` }}
            onMouseEnter={() => setActiveRegion(index)}
            onMouseLeave={() => setActiveRegion(null)}
          >
            {/* Region header with background image */}
            <div className={`region-header relative rounded-2xl overflow-hidden mb-10 ${useRegionLayout ? 'shadow-2xl' : 'shadow-lg'}`}>
              <div 
                className={`${useRegionLayout ? 'h-72 md:h-96' : 'h-48 md:h-60'} bg-cover bg-center transition-transform duration-5000 ${activeRegion === index ? 'scale-110' : 'scale-100'}`} 
                style={{ 
                  backgroundImage: region.image 
                    ? `url(${region.image})` 
                    : 'linear-gradient(to right, #f43f5e, #d1495b)'
                }}
              />
              <div className={`absolute inset-0 ${useRegionLayout ? 'bg-gradient-to-t from-black/85 via-black/40 to-transparent' : 'bg-black bg-opacity-50'} flex items-center justify-center transition-opacity duration-500 ${activeRegion === index ? 'opacity-90' : 'opacity-75'}`}>
                <h3 className={`${useRegionLayout ? 'text-5xl' : 'text-3xl'} font-bold text-white tracking-wide drop-shadow-xl`}>
                  {region.name}
                </h3>
              </div>
              {/* Decorative elements */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0"></div>
            </div>

            {/* Region description */}
            <div className="mb-12 px-4">
              <p className={`text-gray-700 leading-relaxed ${useRegionLayout ? 'text-xl' : 'text-lg'} mb-8 max-w-3xl mx-auto text-center`}>
                {region.description}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 rounded-full my-6 mx-auto"></div>
            </div>

            {/* Locations grid */}
            <div className={`grid grid-cols-1 ${useRegionLayout ? 'md:grid-cols-2 lg:grid-cols-3 gap-8' : 'md:grid-cols-2 gap-6'}`}>
              {region.locations.map((location, idx) => (
                <LocationCard key={idx} location={location} useEnhancedStyle={useRegionLayout} index={idx} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Travel Tips and Trivia Sections */}
      <div className={`mt-20 grid grid-cols-1 md:grid-cols-2 ${useRegionLayout ? 'gap-10' : 'gap-8'} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '800ms' }}>
        {/* Travel Tips Card */}
        <div className={`${useRegionLayout 
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2' 
          : 'bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200 hover:shadow-lg transition-shadow'}`}>
          <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            Travel Tips
          </h3>
          <ul className="space-y-4">
            {travelTips.map((tip, index) => (
              <li key={index} className={`flex items-start ${useRegionLayout 
                ? 'bg-white bg-opacity-70 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100/50' 
                : 'bg-white bg-opacity-60 p-4 rounded-lg shadow-sm'}`}>
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700 leading-relaxed">{tip.text}</p>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Trivia Card */}
        <div className={`${useRegionLayout 
          ? 'bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg p-8 border border-amber-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2' 
          : 'bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-6 border border-amber-200 hover:shadow-lg transition-shadow'}`}>
          <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            Film Trivia
          </h3>
          <ul className="space-y-4">
            {trivia.map((item, index) => (
              <li key={index} className={`flex items-start ${useRegionLayout 
                ? 'bg-white bg-opacity-70 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100/50' 
                : 'bg-white bg-opacity-60 p-4 rounded-lg shadow-sm'}`}>
                <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                <p className="text-gray-700 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// LocationCard subcomponent for displaying individual locations
const LocationCard: React.FC<{ location: FilmLocation, useEnhancedStyle?: boolean, index: number }> = ({ location, useEnhancedStyle = false, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const defaultImage = '/images/default-location.jpg';
  
  return (
    <div 
      className={`premium-card ${useEnhancedStyle 
        ? 'bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100' 
        : 'bg-white rounded-lg shadow-md overflow-hidden border border-gray-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Location image */}
      <div className={`${useEnhancedStyle ? 'h-60' : 'h-48'} overflow-hidden relative`}>
        <img 
          src={location.image || defaultImage} 
          alt={location.name} 
          className="w-full h-full object-cover transition-transform duration-3000 ease-out"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1.01)'
          }}
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 transition-opacity duration-300"></div>
        
        {/* Location number badge */}
        <div className={`absolute top-4 left-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-xl border-2 border-white transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {index + 1}
        </div>
      </div>
      
      {/* Location content */}
      <div className={`${useEnhancedStyle ? 'p-6' : 'p-5'}`}>
        <h4 className={`${useEnhancedStyle ? 'text-2xl' : 'text-xl'} font-bold text-gray-800 mb-3 flex items-center`}>
          {location.name}
          {(location as any).scene && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {(location as any).scene}
            </span>
          )}
        </h4>
        <p className="text-gray-600 leading-relaxed">{location.description}</p>
        
        {/* Coordinates display */}
        {location.coordinates && (
          <div className={`mt-5 flex justify-between items-center pt-4 border-t border-gray-100`}>
            <div className={`${useEnhancedStyle ? 'text-sm font-mono' : 'text-xs'} text-gray-500 bg-gray-50 px-3 py-2 rounded-lg shadow-sm`}>
              <span className="text-primary-dark font-semibold">LAT</span> {location.coordinates.lat.toFixed(5)}, <span className="text-primary-dark font-semibold">LNG</span> {location.coordinates.lng.toFixed(5)}
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${useEnhancedStyle 
                ? 'text-white hover:text-white font-medium flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-300' 
                : 'text-primary hover:text-primary-dark text-sm font-medium flex items-center bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-colors'}`}
              style={{
                background: useEnhancedStyle 
                  ? isHovered 
                    ? 'linear-gradient(to right, #f43f5e, #e11d48)' 
                    : 'linear-gradient(to right, #f43f5e99, #e11d4899)'
                  : '',
                transform: isHovered && useEnhancedStyle ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Directions
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmLocationsGuide; 
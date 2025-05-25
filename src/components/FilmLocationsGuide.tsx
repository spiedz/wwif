import React, { useState, useEffect } from 'react';
import { FilmMeta } from '../types/content';
import Map from './Map';

interface FilmLocationsGuideProps {
  film: FilmMeta;
}

const FilmLocationsGuide: React.FC<FilmLocationsGuideProps> = ({ film }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // If no coordinates, return null
  if (!film.coordinates || film.coordinates.length === 0) {
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
        {film.description && (
          <p className="text-gray-700 text-lg leading-relaxed">
            <span className="float-left text-6xl font-serif text-primary mr-4 mt-1 leading-none">
              {film.description.charAt(0)}
            </span>
            {film.description.substring(1)}
          </p>
        )}
        <div className="w-32 h-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full my-8"></div>
      </div>

      {/* Map showing all locations */}
      <div className={`mb-16 bg-white p-6 rounded-xl shadow-md ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-7 h-7 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Interactive Location Map
        </h2>
        <div className="rounded-lg overflow-hidden shadow-md mb-4">
          <Map 
            markers={film.coordinates.map((coord: any) => ({
              lat: coord.lat,
              lng: coord.lng,
              title: coord.name || '',
              description: coord.description || ''
            }))}
            height="600px" 
            zoom={12}
          />
        </div>
        <p className="text-gray-600 text-sm italic py-4 px-5 bg-gray-50 rounded-lg border-l-4 border-primary/30">
          <svg className="w-5 h-5 inline-block mr-2 text-primary/70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Explore all {film.coordinates.length} filming locations on the interactive map above. Click on markers for details about each filming location.
        </p>
      </div>

      {/* Locations List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Filming Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {film.coordinates.map((location: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{location.name}</h4>
                {location.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{location.description}</p>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  Coordinates: {location.lat}, {location.lng}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmLocationsGuide;

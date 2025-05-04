import React, { useState } from 'react';
import { Coordinates } from '../types/content';

interface LocationCardProps {
  location: Coordinates;
  index: number;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate a static Google Maps image for this location
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=14&size=600x400&scale=2&markers=color:red|${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  
  // Directions link
  const directionsUrl = location.lat && location.lng ? `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}` : "#";

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-500 group"
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Location map image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <img 
            src={staticMapUrl} 
            alt={`Map of ${location.name || `Location ${index + 1}`}`}
            className="w-full h-full object-cover transition-transform duration-2000 ease-out"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1.01)'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-sm">Map preview unavailable</span>
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Location number badge */}
        <div className={`absolute top-4 left-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-xl border-2 border-white transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {index + 1}
        </div>
        
        {/* Location name on overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-xl mb-1 drop-shadow-md">
            {location.name || `Location ${index + 1}`}
          </h3>
          {(location as any).scene && (
            <span className="inline-block text-xs bg-black/30 text-white px-3 py-1 rounded-full backdrop-blur-sm mb-2">
              {(location as any).scene}
            </span>
          )}
        </div>
      </div>
      
      {/* Location details */}
      <div className="p-6">
        {location.description && (
          <p className="text-gray-600 leading-relaxed">{location.description}</p>
        )}
        
        {/* Location actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded-lg shadow-sm">
            <span className="text-primary font-semibold">LAT</span> {location.lat ? location.lat.toFixed(5) : 'N/A'}, <span className="text-primary font-semibold">LNG</span> {location.lng ? location.lng.toFixed(5) : 'N/A'}
          </div>
          
          <a 
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white font-medium flex items-center px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${isHovered ? 'bg-primary' : 'bg-primary/90'}`}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default LocationCard; 
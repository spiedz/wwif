import React, { useState, useEffect } from 'react';
import { TVSeries } from '../types/series';
import Map from './Map';

interface SeriesLocationsGuideProps {
  series?: TVSeries;
  hideTitle?: boolean;
}

const SeriesLocationsGuide: React.FC<SeriesLocationsGuideProps> = ({ series, hideTitle = false }) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  if (!series) {
    return <div className="p-4 text-gray-500">Series information not available</div>;
  }
  
  // Get all unique seasons from locations
  const seasons = series.seasons?.map(season => season.number) || [];
  
  // Filter locations based on selected season
  const filteredLocations = selectedSeason 
    ? series.locations?.filter(location => 
        location?.episodes && Array.isArray(location.episodes) && 
        location.episodes.some(ep => ep.season === selectedSeason)
      )
    : series.locations;
    
  return (
    <div className="series-locations-guide">
      {/* Series introduction with animated entrance - conditionally render based on hideTitle prop */}
      {!hideTitle && (
        <div className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 flex items-center">
            <span className="gradient-text">{series.meta.title}</span>
            <span className="ml-2 text-gray-700"> Filming Locations</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            <span className="float-left text-6xl font-serif text-primary mr-4 mt-1 leading-none">
              {series.meta.description && series.meta.description.charAt(0)}
            </span>
            {series.meta.description && series.meta.description.substring(1)}
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full my-8"></div>
        </div>
      )}

      {/* Season filter with improved visual styling */}
      {seasons.length > 1 && (
        <div className={`mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Filter by Season
          </h3>
          <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSeason === null 
                ? 'bg-primary text-white shadow-md scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
              onClick={() => setSelectedSeason(null)}
            >
              All Seasons
            </button>
            {seasons.map(season => (
              <button 
                key={season}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSeason === season 
                  ? 'bg-primary text-white shadow-md scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                onClick={() => setSelectedSeason(season)}
              >
                Season {season}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map showing filtered locations with improved UI */}
      <div className={`mb-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-1000 hover:shadow-xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-7 h-7 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Interactive Location Map
            {selectedSeason && <span className="ml-2 text-primary-dark">Season {selectedSeason}</span>}
          </h2>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-xl mb-6 border border-gray-200">
          <Map 
            markers={(series.meta.coordinates || []).map(coord => ({
              lat: coord.lat,
              lng: coord.lng,
              title: coord.name || '',
              description: coord.description || ''
            }))}
            height="600px" 
            zoom={10}
          />
        </div>
        
        <div className="px-6 pb-6">
          <div className="text-gray-600 text-sm italic bg-gray-50 rounded-lg border-l-4 border-primary/30 p-4 flex items-start">
            <svg className="w-5 h-5 text-primary/70 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Explore {filteredLocations?.length || 0} filming location{(filteredLocations?.length !== 1) ? 's' : ''} 
              {selectedSeason ? ` from Season ${selectedSeason}` : ' across all seasons'}.
              Click on markers for details about each filming location or browse the locations below.
            </span>
          </div>
        </div>
      </div>

      {/* Locations grid with enhanced design */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Filming Locations {selectedSeason ? `- Season ${selectedSeason}` : ''}
        </h2>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '300ms' }}>
          {filteredLocations?.map((location, idx) => (
            <SeriesLocationCard 
              key={location.id || `location-${idx}`} 
              location={location} 
              index={idx}
              selectedSeason={selectedSeason}
              isActive={activeLocation === (location.id || `location-${idx}`)}
              onCardClick={() => setActiveLocation(location.id || `location-${idx}`)}
            />
          ))}
        </div>
        
        {filteredLocations?.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No locations found for the selected season.</p>
            <button 
              onClick={() => setSelectedSeason(null)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20"
            >
              View all locations
            </button>
          </div>
        )}
      </div>
      
      {/* Behind the scenes section with enhanced visual design */}
      {series.meta.behindTheScenes && (
        <div className={`mt-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg p-8 border border-amber-200 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '500ms' }}>
          <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Behind The Scenes
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">{series.meta.behindTheScenes.intro}</p>
          
          {series.meta.behindTheScenes.facts && series.meta.behindTheScenes.facts.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Fun Facts
              </h4>
              <ul className="space-y-4">
                {series.meta.behindTheScenes.facts.map((fact, index) => (
                  <li key={index} className="flex items-start bg-white bg-opacity-70 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100/50">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-4 text-amber-800 font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{fact}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Add Netflix Watch Now button */}
          <div className="mt-8 pt-6 border-t border-amber-200/50 flex justify-center">
            <a 
              href={`https://www.netflix.com/search?q=${encodeURIComponent(series.meta.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 1024 276.742" fill="currentColor">
                <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 74.59 30.27-74.59h47.295z" />
              </svg>
              Watch on Netflix
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// SeriesLocationCard subcomponent with enhanced interactive elements
const SeriesLocationCard: React.FC<{ 
  location: any, 
  index: number, 
  selectedSeason: number | null,
  isActive: boolean,
  onCardClick: () => void
}> = ({ location, index, selectedSeason, isActive, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const defaultImage = '/images/default-location.jpg';
  
  // Ensure location.episodes exists and is an array
  const locationEpisodes = location?.episodes && Array.isArray(location.episodes) ? location.episodes : [];
  
  // Filter episodes based on selected season
  const episodes = selectedSeason 
    ? locationEpisodes.filter((ep: any) => ep.season === selectedSeason)
    : locationEpisodes;
  
  // Extract location type or landmark type from description (if possible)
  const extractLocationType = () => {
    const descLower = location.description ? location.description.toLowerCase() : '';
    const locationTypes = [
      { keyword: 'museum', label: 'Museum' },
      { keyword: 'castle', label: 'Castle' },
      { keyword: 'park', label: 'Park' },
      { keyword: 'beach', label: 'Beach' },
      { keyword: 'forest', label: 'Forest' },
      { keyword: 'village', label: 'Village' },
      { keyword: 'city', label: 'City' },
      { keyword: 'town', label: 'Town' },
      { keyword: 'mountain', label: 'Mountain' },
      { keyword: 'lake', label: 'Lake' },
      { keyword: 'river', label: 'River' },
      { keyword: 'studio', label: 'Studio' },
      { keyword: 'building', label: 'Building' },
      { keyword: 'mansion', label: 'Mansion' },
      { keyword: 'house', label: 'House' },
      { keyword: 'street', label: 'Street' },
      { keyword: 'mall', label: 'Mall' },
      { keyword: 'school', label: 'School' },
      { keyword: 'university', label: 'University' },
      { keyword: 'college', label: 'College' },
      { keyword: 'hospital', label: 'Hospital' },
      { keyword: 'cafe', label: 'Café' },
      { keyword: 'restaurant', label: 'Restaurant' },
      { keyword: 'church', label: 'Church' },
      { keyword: 'cathedral', label: 'Cathedral' },
      { keyword: 'monument', label: 'Monument' },
      { keyword: 'landmark', label: 'Landmark' },
    ];
    
    for (const type of locationTypes) {
      if (descLower.includes(type.keyword)) {
        return type.label;
      }
    }
    
    return 'Location';
  };
  
  const locationType = extractLocationType();
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden border transition-all duration-500 ${
        isActive 
          ? 'border-primary shadow-xl scale-[1.02] z-10' 
          : 'border-gray-100 hover:shadow-xl'
      }`}
      style={{
        transform: isHovered ? 'translateY(-8px)' : isActive ? 'scale(1.02)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      {/* Location image */}
      <div className="h-60 overflow-hidden relative">
        <img 
          src={location.image || defaultImage} 
          alt={location.name} 
          className={`w-full h-full object-cover transition-transform duration-3000 ease-out ${
            isHovered || isActive ? 'scale-110' : 'scale-101'
          } cursor-pointer`}
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowFullImage(true);
          }}
        />
        
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 transition-opacity duration-300"></div>
        
        {/* Full Image Viewer */}
        {showFullImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullImage(false);
            }}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <button 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors z-10"
                onClick={() => setShowFullImage(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={location.image || defaultImage} 
                alt={location.name} 
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 rounded-b-lg">
                <h3 className="text-xl font-bold">{location.name}</h3>
                <p className="text-sm text-gray-300 mt-1">{locationType} • Filming Location</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Location type badge */}
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
          {locationType}
        </div>
        
        {/* Expand image icon */}
        <button 
          className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowFullImage(true);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
        
        {/* Location number badge */}
        <div className={`absolute top-4 left-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-xl border-2 border-white transition-transform duration-500 ${
          isHovered || isActive ? 'scale-110' : 'scale-100'
        }`}>
          {index + 1}
        </div>
        
        {/* Season badge for filtered results */}
        {selectedSeason && (
          <div className="absolute top-4 left-16 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
            Season {selectedSeason}
          </div>
        )}
      </div>
      
      {/* Location content */}
      <div className="p-6">
        <h4 className="text-2xl font-bold text-gray-800 mb-2">{location.name}</h4>
        
        {/* Location details */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {locationType}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {episodes.length} scene{episodes.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-4">{location.description || 'No description available.'}</p>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Location Map Toggle Button */}
          {location.coordinates && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMap(!showMap);
              }}
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          )}
          
          {/* View Image Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullImage(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Photo
          </button>
          
          {/* Directions Button */}
          {location.coordinates && location.coordinates.lat && location.coordinates.lng && (
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Directions
            </a>
          )}
        </div>
        
        {/* Individual Location Map */}
        {showMap && location.coordinates && location.coordinates.lat && location.coordinates.lng && (
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <Map 
              markers={[{
                lat: location.coordinates.lat,
                lng: location.coordinates.lng,
                title: location.name || '',
                description: location.description || '',
                image: location.image || defaultImage
              }]}
              center={{
                lat: location.coordinates.lat,
                lng: location.coordinates.lng
              }}
              height="250px" 
              zoom={14}
            />
          </div>
        )}
        
        {/* Episode references */}
        {episodes && episodes.length > 0 && (
          <div className="mt-4 mb-6">
            <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Featured In:
            </h5>
            <div className="space-y-2">
              {episodes.map((ep: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-100 hover:border-gray-200 transition-colors">
                  <span className="font-medium text-primary-dark">S{ep.season}:E{ep.episode}</span>
                  {ep.sceneDescription && (
                    <span className="ml-2 text-gray-600">- {ep.sceneDescription}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Coordinates display */}
        {location.coordinates && location.coordinates.lat && location.coordinates.lng && (
          <div className="mt-5 flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded-lg shadow-sm">
              <span className="text-primary-dark font-semibold">LAT</span> {location.coordinates.lat.toFixed(5)}, <span className="text-primary-dark font-semibold">LNG</span> {location.coordinates.lng.toFixed(5)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesLocationsGuide; 
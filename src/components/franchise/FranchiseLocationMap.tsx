import React, { useState } from 'react';
import { Location } from '../../types/franchise';
import Map from '../Map';
import { MapMarker } from '../../types/blog-interfaces';

interface FranchiseLocationMapProps {
  locations: Location[];
}

/**
 * Map component displaying all filming locations for a franchise
 * Leverages the existing Map component with custom markers for franchise locations
 */
const FranchiseLocationMap: React.FC<FranchiseLocationMapProps> = ({ locations }) => {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [showLocationsList, setShowLocationsList] = useState(true);
  
  // Calculate the optimal center point for the map
  const calculateMapCenter = () => {
    if (locations.length === 0) {
      // Default to London if no locations
      return { lat: 51.5074, lng: -0.1278 };
    }
    
    // Calculate average coordinates
    const totalLat = locations.reduce((sum, loc) => sum + loc.coordinates.lat, 0);
    const totalLng = locations.reduce((sum, loc) => sum + loc.coordinates.lng, 0);
    
    return {
      lat: totalLat / locations.length,
      lng: totalLng / locations.length
    };
  };
  
  // Format locations for the Map component
  const mapLocations: MapMarker[] = locations.map(location => ({
    title: location.name,
    lat: location.coordinates.lat,
    lng: location.coordinates.lng,
    description: `${location.description}${location.isVisitable ? ' (Open to visitors)' : ''}`,
    // You can add images here if available in your location data
    // The Map component doesn't support the additional properties we wanted, but we can
    // include relevant info in the description field
  }));

  // Handle marker click - matching location by coordinates since we don't have IDs
  const handleMarkerClick = (index: number) => {
    if (index >= 0 && index < locations.length) {
      setActiveLocation(locations[index].id);
      // On mobile, show the locations list when a marker is clicked
      if (window.innerWidth < 1024) {
        setShowLocationsList(true);
      }
    }
  };

  // Toggle the locations list visibility (for mobile)
  const toggleLocationsList = () => {
    setShowLocationsList(!showLocationsList);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Filming Locations</h2>
          <p className="text-gray-600">
            Explore the real-world locations where scenes from this franchise were filmed.
            {locations.length > 0 && ` Discover all ${locations.length} locations on the map below.`}
          </p>
        </div>

        {/* Mobile toggle for locations list */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={toggleLocationsList}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-md"
            aria-expanded={showLocationsList}
            aria-controls="locations-list"
          >
            <span className="font-medium">{showLocationsList ? 'Hide Locations List' : 'Show Locations List'}</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${showLocationsList ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Location list - hidden on mobile when toggle is off */}
          <div 
            id="locations-list"
            className={`lg:col-span-1 ${showLocationsList ? 'block' : 'hidden lg:block'} lg:max-h-[600px] overflow-auto pr-2 bg-white rounded-lg shadow-md sticky top-20`}
            style={{ maxHeight: 'calc(50vh - 100px)', height: 'auto' }}
          >
            <div className="divide-y divide-gray-100">
              {locations.map(location => (
                <div 
                  key={location.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    activeLocation === location.id ? 'bg-gray-50 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => setActiveLocation(location.id)}
                >
                  <h3 className="font-medium text-lg text-gray-900 mb-1">{location.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{location.description}</p>
                  
                  {location.isVisitable && (
                    <div className="flex items-center text-xs text-primary">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Open to visitors
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Map - full width on mobile, 2/3 on larger screens */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <div className="h-[50vh] lg:h-[600px] relative rounded-lg overflow-hidden shadow-md">
              <Map 
                markers={mapLocations}
                center={calculateMapCenter()}
                zoom={4}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseLocationMap; 
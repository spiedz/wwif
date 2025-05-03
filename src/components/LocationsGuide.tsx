import React from 'react';

interface LocationInfo {
  name: string;
  description: string;
  image?: string;
}

interface RegionInfo {
  name: string;
  description: string;
  locations: LocationInfo[];
  image?: string;
}

interface LocationsGuideProps {
  title: string;
  intro: string;
  regions: RegionInfo[];
}

const LocationsGuide: React.FC<LocationsGuideProps> = ({ title, intro, regions }) => {
  return (
    <div className="locations-guide">
      {/* Title and intro */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
        <p className="text-gray-700">{intro}</p>
      </div>

      {/* Regions */}
      <div className="space-y-10">
        {regions.map((region, index) => (
          <div key={index} className="region-section">
            {/* Region header with background image */}
            <div className="region-header relative rounded-xl overflow-hidden mb-6">
              <div 
                className="h-40 bg-cover bg-center" 
                style={{ backgroundImage: region.image ? `url(${region.image})` : 'linear-gradient(to right, #f43f5e, #d1495b)' }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white tracking-wide">
                  {region.name}
                </h3>
              </div>
            </div>

            {/* Region description */}
            <p className="text-gray-700 mb-6">{region.description}</p>

            {/* Locations grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {region.locations.map((location, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                  {/* Location image if available */}
                  {location.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={location.image} 
                        alt={location.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  
                  {/* Location content */}
                  <div className="p-4">
                    <h4 className="text-xl font-semibold text-primary mb-2">{location.name}</h4>
                    <p className="text-gray-700">{location.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsGuide; 
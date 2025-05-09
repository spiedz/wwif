import React from 'react';
import Image from 'next/image';

interface FranchiseHeroProps {
  title: string;
  description: string;
  bannerImage: string;
  logoImage?: string;
}

/**
 * Hero section component for franchise pages
 * Displays franchise banner, logo, title, and description
 */
const FranchiseHero: React.FC<FranchiseHeroProps> = ({
  title,
  description,
  bannerImage,
  logoImage
}) => {
  return (
    <section className="relative w-full">
      {/* Banner image with overlay */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
        
        <div className="relative h-full w-full">
          <Image
            src={bannerImage}
            alt={`${title} banner`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 md:px-8">
        <div className="container mx-auto">
          {logoImage ? (
            <div className="relative w-full max-w-xl h-24 md:h-32 lg:h-40 mx-auto mb-6">
              <Image
                src={logoImage}
                alt={`${title} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 50vw"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {title}
            </h1>
          )}
          
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto drop-shadow-md">
            {description}
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="bg-primary hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-colors">
              Explore Locations
            </button>
            <button className="bg-white hover:bg-gray-100 text-primary font-medium py-3 px-6 rounded-lg shadow-lg transition-colors">
              View Films
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseHero; 
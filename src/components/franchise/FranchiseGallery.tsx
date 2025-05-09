import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '../../types/franchise';

interface FranchiseGalleryProps {
  images: GalleryImage[];
  title?: string;
}

/**
 * Gallery component for franchise pages
 * Displays a grid of franchise-related images with lightbox functionality
 */
const FranchiseGallery: React.FC<FranchiseGalleryProps> = ({
  images,
  title = 'Photo Gallery'
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  if (!images || images.length === 0) {
    return null;
  }
  
  // Find hero image (if any) to display first
  const heroImage = images.find(img => img.isHero);
  
  // Rearrange images to show hero first, then all others
  const arrangedImages = heroImage 
    ? [heroImage, ...images.filter(img => img !== heroImage)]
    : images;

  return (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{title}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {arrangedImages.map((image, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-lg shadow-md group cursor-pointer transition-transform hover:scale-[1.02] ${
                  index === 0 && heroImage ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative h-64 w-full">
                  <Image 
                    src={image.src} 
                    alt={image.alt} 
                    fill
                    className="object-cover"
                    sizes={index === 0 && heroImage 
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    }
                  />
                  
                  {/* Image overlay with caption */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      {image.caption && (
                        <p className="text-white text-sm mb-2">{image.caption}</p>
                      )}
                      <div className="flex items-center text-white/70 text-xs">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Click to enlarge
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] p-4">
            {/* Close button */}
            <button 
              className="absolute top-0 right-0 -mt-12 -mr-4 text-white hover:text-gray-300 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
            
            {/* Image container */}
            <div className="relative h-full max-h-[80vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            {/* Caption */}
            {selectedImage.caption && (
              <div className="mt-4 bg-black/50 p-4 rounded">
                <p className="text-white">{selectedImage.caption}</p>
                {selectedImage.filmSlug && (
                  <a 
                    href={`/films/${selectedImage.filmSlug}`} 
                    className="mt-2 inline-block text-primary hover:text-red-400 text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View related film
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FranchiseGallery; 
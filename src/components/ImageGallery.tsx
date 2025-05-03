import React, { useState, useEffect, useRef } from 'react';

interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  layout?: 'grid' | 'carousel';
  className?: string;
}

/**
 * ImageGallery component for displaying multiple images in a grid or carousel
 * with lightbox functionality for fullscreen viewing
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  layout = 'grid',
  className = '',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(new Array(images.length).fill(false));
  const carouselRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Set up lazy loading with Intersection Observer
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Initialize image refs array
    imageRefs.current = imageRefs.current.slice(0, images.length);

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          
          const img = entry.target as HTMLImageElement;
          const index = Number(img.dataset.index || 0);
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => {
              setIsLoaded(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            };
            // Stop observing once loaded
            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading when within 200px
        threshold: 0.01
      }
    );

    // Start observing all image elements
    imageRefs.current.forEach((img) => {
      if (img) observerRef.current?.observe(img);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [images.length]);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, images.length]);

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  // Handle carousel scrolling
  const scrollToImage = (index: number) => {
    if (carouselRef.current && layout === 'carousel') {
      const scrollAmount = index * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Navigate to next image in lightbox
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Navigate to previous image in lightbox
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Properly typed ref callback to avoid linter errors
  const setImageRef = (index: number) => (el: HTMLImageElement | null) => {
    imageRefs.current[index] = el;
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`mb-6 ${className}`}>
      {/* Grid Layout */}
      {layout === 'grid' && (
        <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
          {images.map((image, index) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-lg shadow-sm bg-gray-100 aspect-video relative"
              onClick={() => openLightbox(index)}
            >
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isLoaded[index] ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <img
                ref={setImageRef(index)}
                data-src={image.src}
                data-index={index.toString()}
                src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" // Tiny placeholder
                alt={image.alt}
                className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${isLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Carousel Layout */}
      {layout === 'carousel' && (
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="min-w-full snap-center flex-shrink-0 relative"
                onClick={() => openLightbox(index)}
              >
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isLoaded[index] ? 'opacity-0' : 'opacity-100'}`}
                >
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <img
                  ref={setImageRef(index)}
                  data-src={image.src}
                  data-index={index.toString()}
                  src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" // Tiny placeholder
                  alt={image.alt}
                  className={`w-full h-64 md:h-96 object-contain cursor-pointer transition-opacity duration-300 ${isLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center">
                    {image.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = (currentImageIndex - 1 + images.length) % images.length;
                  setCurrentImageIndex(newIndex);
                  scrollToImage(newIndex);
                }}
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = (currentImageIndex + 1) % images.length;
                  setCurrentImageIndex(newIndex);
                  scrollToImage(newIndex);
                }}
                aria-label="Next image"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Carousel Indicators */}
          {images.length > 1 && (
            <div className="flex justify-center mt-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    scrollToImage(index);
                  }}
                  className={`w-2 h-2 rounded-full mx-1 focus:outline-none ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="max-w-full max-h-full object-contain px-4"
              onClick={(e) => e.stopPropagation()}
            />
            
            {images[currentImageIndex].caption && (
              <div className="absolute bottom-16 left-0 right-0 text-white text-center p-4 bg-black/60">
                {images[currentImageIndex].caption}
              </div>
            )}
            
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center focus:outline-none"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white w-12 h-12 rounded-full flex items-center justify-center focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white w-12 h-12 rounded-full flex items-center justify-center focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery; 
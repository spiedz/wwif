import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  webp?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
  category?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  locationId?: string;
}

interface EnhancedImageGalleryProps {
  images: GalleryImage[];
  title?: string;
  layout?: 'grid' | 'masonry' | 'carousel';
  columns?: 2 | 3 | 4 | 5;
  showThumbnails?: boolean;
  enableLightbox?: boolean;
  lazyLoad?: boolean;
  className?: string;
}

const EnhancedImageGallery: React.FC<EnhancedImageGalleryProps> = ({
  images,
  title,
  layout = 'grid',
  columns = 3,
  showThumbnails = true,
  enableLightbox = true,
  lazyLoad = true,
  className = ''
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'Escape':
          setLightboxOpen(false);
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  const getImageSrc = (image: GalleryImage, isFullSize = false) => {
    // Use WebP if supported and available
    const supportsWebP = typeof window !== 'undefined' && 
      window.HTMLCanvasElement && 
      window.HTMLCanvasElement.prototype.toDataURL &&
      window.HTMLCanvasElement.prototype.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (supportsWebP && image.webp) {
      return image.webp;
    }

    return isFullSize ? image.src : (image.thumbnail || image.src);
  };

  const getGridClasses = () => {
    const baseClasses = 'grid gap-4';
    switch (columns) {
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      case 5:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`;
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
    }
  };

  const getAspectRatioClasses = (aspectRatio?: string) => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'landscape':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return 'aspect-video';
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`enhanced-image-gallery ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {title}
        </h3>
      )}

      {/* Gallery Grid */}
      <div className={getGridClasses()}>
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100"
            onClick={() => openLightbox(index)}
          >
            <div className={`relative ${getAspectRatioClasses(image.aspectRatio)} overflow-hidden`}>
              {/* Lazy loading placeholder */}
              {lazyLoad && !loadedImages.has(index) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Main image */}
              <img
                src={getImageSrc(image)}
                alt={image.alt}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  lazyLoad && !loadedImages.has(index) ? 'opacity-0' : 'opacity-100'
                }`}
                loading={lazyLoad ? 'lazy' : 'eager'}
                onLoad={() => handleImageLoad(index)}
                onError={(e) => {
                  // Fallback to original src if thumbnail fails
                  if (image.thumbnail && e.currentTarget.src === image.thumbnail) {
                    e.currentTarget.src = image.src;
                  }
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Image title overlay */}
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h4 className="text-white font-medium text-sm">{image.title}</h4>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {enableLightbox && lightboxOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Main lightbox image */}
          <div className="relative max-w-full max-h-full">
            <img
              src={getImageSrc(images[currentImageIndex], true)}
              alt={images[currentImageIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Image info */}
            {(images[currentImageIndex].title || images[currentImageIndex].description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                {images[currentImageIndex].title && (
                  <h4 className="font-semibold text-lg mb-1">{images[currentImageIndex].title}</h4>
                )}
                {images[currentImageIndex].description && (
                  <p className="text-sm opacity-90">{images[currentImageIndex].description}</p>
                )}
              </div>
            )}
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnail strip */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageSrc(image)}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default EnhancedImageGallery; 
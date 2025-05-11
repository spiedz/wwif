import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageForLocation } from '../utils/serpApiService';

interface AutoImageLocationProps {
  locationName: string;
  description?: string;
  existingImageUrl?: string | null;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  alt?: string;
  showCaption?: boolean;
  captionClassName?: string;
  onImageLoad?: (imageUrl: string) => void;
  layout?: 'rounded' | 'square' | 'full-width' | 'card';
}

/**
 * A component that automatically fetches and displays an image for a location using SerpAPI
 * Falls back to placeholder images if no image is found
 */
const AutoImageLocation: React.FC<AutoImageLocationProps> = ({
  locationName,
  description,
  existingImageUrl,
  width = 800,
  height = 500,
  priority = false,
  className = 'relative overflow-hidden',
  imageClassName = 'object-cover rounded-lg',
  alt,
  showCaption = true,
  captionClassName = 'text-sm text-gray-600 mt-2 italic',
  onImageLoad,
  layout = 'rounded',
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(existingImageUrl || null);
  const [isLoading, setIsLoading] = useState<boolean>(!existingImageUrl);
  const [hasError, setHasError] = useState<boolean>(false);

  // Apply layout styles
  const getContainerClassName = () => {
    switch (layout) {
      case 'rounded':
        return `${className} rounded-lg overflow-hidden`;
      case 'square':
        return `${className} aspect-square`;
      case 'full-width':
        return `${className} w-full`;
      case 'card':
        return `${className} rounded-lg shadow-md overflow-hidden`;
      default:
        return className;
    }
  };

  useEffect(() => {
    // If there's already an existing image URL, use it and skip the API call
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
      setIsLoading(false);
      if (onImageLoad) onImageLoad(existingImageUrl);
      return;
    }

    // Otherwise, fetch the image from SerpAPI
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        const image = await getImageForLocation(locationName, null, {
          size: 'large',
          type: 'photo',
          safeSearch: true,
        });
        
        setImageUrl(image);
        if (onImageLoad) onImageLoad(image);
      } catch (error) {
        console.error(`Error fetching image for ${locationName}:`, error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [locationName, existingImageUrl, onImageLoad]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`${getContainerClassName()} animate-pulse bg-gray-200`} style={{ width, height }}>
        <div className="flex items-center justify-center h-full">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError || !imageUrl) {
    return (
      <div className={getContainerClassName()} style={{ width, height }}>
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-500 p-4">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-center">Image not available for {locationName}</p>
        </div>
      </div>
    );
  }

  // Successful image load
  return (
    <div className={getContainerClassName()}>
      <div className="relative" style={{ width, height }}>
        <Image
          src={imageUrl}
          alt={alt || `${locationName} filming location`}
          width={width}
          height={height}
          className={imageClassName}
          priority={priority}
          onError={() => setHasError(true)}
        />
      </div>
      
      {showCaption && (locationName || description) && (
        <figcaption className={captionClassName}>
          {description || `${locationName} filming location`}
        </figcaption>
      )}
    </div>
  );
};

export default AutoImageLocation; 
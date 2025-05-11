import React, { useEffect, useRef, useState } from 'react';
import { MapMarker } from '../types/blog-interfaces';
import { Coordinates } from '../types/content';

export interface MapProps {
  markers?: (MapMarker | Coordinates)[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

const Map: React.FC<MapProps> = ({
  markers = [],
  center = { lat: 40.7128, lng: -74.0060 }, // Default to New York
  zoom = 10,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Initialize the map
  useEffect(() => {
    // Check if window and google is defined
    if (typeof window === 'undefined' || !window.google?.maps) {
      // Add Google Maps script if not already loaded
      if (!document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      } else {
        // Script already exists but may not be loaded yet
        const checkGoogleMapsLoaded = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkGoogleMapsLoaded);
            setMapLoaded(true);
          }
        }, 100);
        return () => clearInterval(checkGoogleMapsLoaded);
      }
      return;
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Create the map once Google Maps is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google?.maps) return;

    // Only initialize the map if it doesn't exist yet
    if (!googleMapRef.current) {
      const mapOptions: google.maps.MapOptions = {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
        // We cannot use gestureHandling due to type issues, but the map will still work on mobile
      };

      googleMapRef.current = new google.maps.Map(mapRef.current, mapOptions);
      infoWindowRef.current = new google.maps.InfoWindow();
    } else {
      // Update map properties if it already exists
      googleMapRef.current.setCenter(center);
      googleMapRef.current.setZoom(zoom);
    }

    // Clean up on unmount
    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [mapLoaded, center, zoom, isMobile]);

  // Add markers when the map is created or markers change
  useEffect(() => {
    if (!googleMapRef.current || !infoWindowRef.current || !mapLoaded || !markers.length) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    const map = googleMapRef.current; // Create a local variable for TypeScript

    markers.forEach((markerData) => {
      // Ensure marker has required properties
      if (!('lat' in markerData) || !('lng' in markerData)) {
        console.error('Invalid marker data:', markerData);
        return;
      }

      const position = new google.maps.LatLng(markerData.lat, markerData.lng);
      bounds.extend(position);

      const marker = new google.maps.Marker({
        position,
        map, 
        title: 'title' in markerData ? markerData.title : '',
        animation: google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current && map) {
          infoWindowRef.current.close();
          
          // Create content for info window - mobile optimized with larger text
          const fontSize = isMobile ? '16px' : '14px';
          const padding = isMobile ? '15px' : '10px';
          const maxWidth = isMobile ? '280px' : '300px';
          
          const title = 'title' in markerData ? markerData.title : (markerData.name || 'Location');
          const description = 'description' in markerData ? markerData.description : '';
          const image = 'image' in markerData ? markerData.image : undefined;
          
          const content = `
            <div style="max-width: ${maxWidth}; padding: ${padding};">
              <h3 style="margin-top: 0; color: #333; font-size: ${isMobile ? '18px' : '16px'}; font-weight: bold;">${title}</h3>
              ${image ? `<img src="${image}" alt="${title}" style="width: 100%; height: auto; margin-bottom: 8px; border-radius: 4px;">` : ''}
              ${description ? `<p style="margin-bottom: 0; font-size: ${fontSize}; color: #666;">${description}</p>` : ''}
            </div>
          `;
          
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to bounds if there are multiple markers
    if (markers.length > 1 && map) {
      map.fitBounds(bounds);
      
      // If on mobile, we want a reasonable zoom level for touch
      if (isMobile && markers.length > 3) {
        // Use setTimeout to wait for bounds to be applied
        setTimeout(() => {
          // Set a reasonable zoom level that works well for touch on mobile
          map.setZoom(5);
        }, 100);
      }
    }

    return () => {
      // This cleanup function will only run when markers change or component unmounts
      // No need to clear markers here as we'll do that on the next render
    };
  }, [markers, mapLoaded, isMobile]); // Include isMobile in dependencies

  return (
    <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg">
      {!mapLoaded && (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map; 
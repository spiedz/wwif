import React, { useEffect, useRef, useState } from 'react';
import { MapMarker } from '../types/blog-interfaces';

export interface MapProps {
  markers?: MapMarker[];
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
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
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
      // No need to set references to null here, they'll be garbage collected
    };
  }, [mapLoaded, center, zoom]);

  // Add markers when the map is created or markers change
  useEffect(() => {
    if (!googleMapRef.current || !infoWindowRef.current || !mapLoaded || !markers.length) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    const map = googleMapRef.current; // Create a local variable for TypeScript

    markers.forEach((markerData) => {
      const position = new google.maps.LatLng(markerData.lat, markerData.lng);
      bounds.extend(position);

      const marker = new google.maps.Marker({
        position,
        map, // Use the local variable instead of googleMapRef.current
        title: markerData.title,
        animation: google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current && map) {
          infoWindowRef.current.close();
          
          // Create content for info window
          const content = `
            <div style="max-width: 300px; padding: 10px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px; font-weight: bold;">${markerData.title}</h3>
              ${markerData.image ? `<img src="${markerData.image}" alt="${markerData.title}" style="width: 100%; height: auto; margin-bottom: 8px; border-radius: 4px;">` : ''}
              ${markerData.description ? `<p style="margin-bottom: 0; font-size: 14px; color: #666;">${markerData.description}</p>` : ''}
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
    }

    return () => {
      // This cleanup function will only run when markers change or component unmounts
      // No need to clear markers here as we'll do that on the next render
    };
  }, [markers, mapLoaded]); // Only depend on markers and mapLoaded

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
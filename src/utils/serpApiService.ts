/**
 * SerpAPI Service for fetching location images
 * This service uses SerpAPI to fetch images for locations when they're not explicitly provided
 */

import axios from 'axios';

// Define the structure of a SerpAPI response
interface SerpApiResponse {
  search_metadata: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  search_parameters: {
    engine: string;
    q: string;
    ijn: string;
    device: string;
    tbm: string;
  };
  error?: string;
  search_information?: {
    image_results_state: string;
    query_displayed: string;
    total: number;
  };
  images_results?: {
    position: number;
    thumbnail: string;
    source: string;
    title: string;
    link: string;
    original: string;
    original_width: number;
    original_height: number;
    is_product: boolean;
  }[];
}

// Options for the image search
export interface ImageSearchOptions {
  size?: 'large' | 'medium' | 'icon';
  type?: 'photo' | 'clip' | 'line' | 'animated';
  color?: string;
  safeSearch?: boolean;
  limit?: number;
}

/**
 * Fetch images for a location using SerpAPI
 * @param location - The location name to search for
 * @param options - Optional search parameters
 * @returns An array of image URLs or null if the API call fails
 */
export async function fetchLocationImages(
  location: string,
  options: ImageSearchOptions = {}
): Promise<string[] | null> {
  // Get API key from environment variables
  const apiKey = process.env.SERPAPI_API_KEY;
  
  if (!apiKey) {
    console.error('SERPAPI_API_KEY is not defined in environment variables');
    return null;
  }
  
  try {
    // Build the search query
    const searchQuery = `${location} filming location`;
    
    // Construct the API URL with parameters
    const params = new URLSearchParams({
      api_key: apiKey,
      q: searchQuery,
      engine: 'google_images',
      tbm: 'isch', // Image search
      ijn: '0', // First page
      safe: options.safeSearch ? 'active' : 'off',
    });
    
    // Add optional parameters if provided
    if (options.size) params.append('size', options.size);
    if (options.type) params.append('type', options.type);
    if (options.color) params.append('color', options.color);
    
    // Make the API request
    const response = await axios.get<SerpApiResponse>(
      `https://serpapi.com/search?${params.toString()}`
    );
    
    // Check if the response contains image results
    if (response.data.error) {
      console.error('SerpAPI error:', response.data.error);
      return null;
    }
    
    if (!response.data.images_results || response.data.images_results.length === 0) {
      console.warn(`No images found for location: ${location}`);
      return [];
    }
    
    // Extract image URLs from the response, limiting to the specified number if provided
    const limit = options.limit || 5; // Default to 5 images if no limit specified
    const imageUrls = response.data.images_results
      .slice(0, limit)
      .map((img: { original: string }) => img.original); // Fix: added type for img parameter
    
    return imageUrls;
  } catch (error) {
    console.error('Error fetching images from SerpAPI:', error);
    return null;
  }
}

/**
 * Fetch a single best image for a location
 * @param location - The location name to search for
 * @param options - Optional search parameters
 * @returns A single image URL or null if no images found
 */
export async function fetchBestLocationImage(
  location: string,
  options: ImageSearchOptions = {}
): Promise<string | null> {
  const images = await fetchLocationImages(location, { ...options, limit: 1 });
  return images && images.length > 0 ? images[0] : null;
}

/**
 * Generate a fallback image URL using placeholder services
 * @param location - The location name to include in the placeholder
 * @returns A placeholder image URL
 */
export function generatePlaceholderImage(location: string): string {
  // Encode the location name for use in a URL
  const encodedLocation = encodeURIComponent(location);
  
  // Return a placeholder image with the location name
  return `https://via.placeholder.com/800x600/e2e8f0/1a202c?text=${encodedLocation}`;
}

/**
 * Create an API endpoint safe location string
 * @param location - The raw location name
 * @returns A sanitized location string
 */
export function sanitizeLocationForApi(location: string): string {
  return location
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '+'); // Replace spaces with plus signs
}

/**
 * Handle missing images by fetching from SerpAPI or generating a placeholder
 * @param location - The location name
 * @param existingImageUrl - Optional existing image URL that might be null or empty
 * @param options - Search options
 * @returns An image URL (from SerpAPI, existing, or placeholder)
 */
export async function getImageForLocation(
  location: string,
  existingImageUrl?: string | null,
  options: ImageSearchOptions = {}
): Promise<string> {
  // If there's already an image URL, use it
  if (existingImageUrl) {
    return existingImageUrl;
  }
  
  // Try to fetch an image from SerpAPI
  const serpApiImage = await fetchBestLocationImage(location, options);
  
  // If SerpAPI returned an image, use it
  if (serpApiImage) {
    return serpApiImage;
  }
  
  // If all else fails, return a placeholder image
  return generatePlaceholderImage(location);
} 
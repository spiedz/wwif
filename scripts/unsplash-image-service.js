require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ UNSPLASH_ACCESS_KEY not found in environment variables');
    console.log('📝 Get your free API key at: https://unsplash.com/developers');
    process.exit(1);
}

/**
 * Search for high-quality images on Unsplash
 * @param {string} query - Search query
 * @param {number} perPage - Number of results (max 30)
 * @param {string} orientation - 'landscape', 'portrait', or 'squarish'
 * @param {string} color - Color filter
 * @returns {Promise<Array>} Array of image objects
 */
async function searchUnsplashImages(query, perPage = 10, orientation = 'landscape', color = null) {
    try {
        const params = new URLSearchParams({
            query: query,
            per_page: perPage,
            orientation: orientation,
            order_by: 'relevant'
        });

        if (color) {
            params.append('color', color);
        }

        const url = `${UNSPLASH_BASE_URL}/search/photos?${params}`;
        
        console.log(`🔍 Searching Unsplash for: "${query}"`);
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'Accept-Version': 'v1'
            }
        });

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            console.log(`⚠️ No images found for "${query}"`);
            return [];
        }

        console.log(`✅ Found ${data.results.length} images for "${query}"`);
        
        return data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular, // High quality (1080px width)
            urlLarge: photo.urls.full, // Full resolution
            urlSmall: photo.urls.small, // 400px width
            description: photo.description || photo.alt_description || query,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            downloadUrl: photo.links.download_location,
            width: photo.width,
            height: photo.height,
            color: photo.color,
            tags: photo.tags ? photo.tags.map(tag => tag.title).join(', ') : ''
        }));

    } catch (error) {
        console.error(`❌ Error searching Unsplash for "${query}":`, error.message);
        return [];
    }
}

/**
 * Get a random high-quality image from Unsplash
 * @param {string} query - Search query
 * @param {string} orientation - 'landscape', 'portrait', or 'squarish'
 * @returns {Promise<Object|null>} Single image object
 */
async function getRandomUnsplashImage(query, orientation = 'landscape') {
    try {
        const params = new URLSearchParams({
            query: query,
            orientation: orientation,
            count: 1
        });

        const url = `${UNSPLASH_BASE_URL}/photos/random?${params}`;
        
        console.log(`🎲 Getting random Unsplash image for: "${query}"`);
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'Accept-Version': 'v1'
            }
        });

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
        }

        const photo = await response.json();
        
        if (Array.isArray(photo) && photo.length > 0) {
            const selectedPhoto = photo[0];
            console.log(`✅ Found random image for "${query}"`);
            
            return {
                id: selectedPhoto.id,
                url: selectedPhoto.urls.regular,
                urlLarge: selectedPhoto.urls.full,
                urlSmall: selectedPhoto.urls.small,
                description: selectedPhoto.description || selectedPhoto.alt_description || query,
                photographer: selectedPhoto.user.name,
                photographerUrl: selectedPhoto.user.links.html,
                downloadUrl: selectedPhoto.links.download_location,
                width: selectedPhoto.width,
                height: selectedPhoto.height,
                color: selectedPhoto.color,
                tags: selectedPhoto.tags ? selectedPhoto.tags.map(tag => tag.title).join(', ') : ''
            };
        }

        return null;

    } catch (error) {
        console.error(`❌ Error getting random Unsplash image for "${query}":`, error.message);
        return null;
    }
}

/**
 * Download image from Unsplash and trigger download endpoint
 * @param {string} downloadUrl - Unsplash download URL
 * @returns {Promise<boolean>} Success status
 */
async function triggerUnsplashDownload(downloadUrl) {
    try {
        const response = await fetch(downloadUrl, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'Accept-Version': 'v1'
            }
        });

        if (response.ok) {
            console.log('📊 Download tracked with Unsplash');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('❌ Error tracking download with Unsplash:', error.message);
        return false;
    }
}

/**
 * Get the best image for a location from Unsplash
 * @param {string} locationName - Name of the location
 * @param {Array<string>} alternativeQueries - Alternative search terms
 * @returns {Promise<Object|null>} Best matching image
 */
async function getBestLocationImage(locationName, alternativeQueries = []) {
    const queries = [locationName, ...alternativeQueries];
    
    for (const query of queries) {
        const images = await searchUnsplashImages(query, 5, 'landscape');
        
        if (images && images.length > 0) {
            // Return the first (most relevant) image
            const bestImage = images[0];
            
            // Trigger download tracking
            if (bestImage.downloadUrl) {
                await triggerUnsplashDownload(bestImage.downloadUrl);
            }
            
            return bestImage;
        }
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`⚠️ No suitable images found for "${locationName}"`);
    return null;
}

/**
 * Create fallback image data for when no image is found
 * @param {string} locationName - Name of the location
 * @returns {Object} Fallback image object
 */
function createFallbackImage(locationName) {
    return {
        id: 'fallback',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080', // Beautiful landscape
        urlLarge: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        urlSmall: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        description: `Beautiful landscape representing ${locationName}`,
        photographer: 'Unsplash Community',
        photographerUrl: 'https://unsplash.com',
        downloadUrl: null,
        width: 1080,
        height: 720,
        color: '#4A90E2',
        tags: 'landscape, nature, scenic'
    };
}

module.exports = {
    searchUnsplashImages,
    getRandomUnsplashImage,
    getBestLocationImage,
    triggerUnsplashDownload,
    createFallbackImage
};

// Test function
async function test() {
  const service = new UnsplashImageService();
  
  console.log('🧪 Testing Unsplash Image Service...\n');
  
  // Check API status
  const isValid = await service.checkUsage();
  if (!isValid) {
    console.log('❌ Please set UNSPLASH_ACCESS_KEY in your .env file');
    console.log('🔗 Get your free API key at: https://unsplash.com/developers');
    return;
  }
  
  // Test search
  const images = await service.getLocationImages('Calgary downtown', 'city', 2);
  
  console.log('\n📸 Test Results:');
  images.forEach((img, index) => {
    console.log(`${index + 1}. ${img.url}`);
    console.log(`   Alt: ${img.alt}`);
    console.log(`   Credit: ${img.credit}`);
  });
}

if (require.main === module) {
  test();
} 
// Load environment variables with better handling for complex .env.local files
const fs = require('fs');
const path = require('path');

function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse line by line to handle complex multi-line values
    const lines = envContent.split('\n');
    let currentKey = null;
    let currentValue = '';
    let inMultiLine = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines
      if (trimmedLine.startsWith('#') || trimmedLine === '') {
        continue;
      }
      
      // Check if this is a simple key=value line
      if (trimmedLine.includes('=') && !inMultiLine) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=');
        
        // Check if this starts a multi-line value (contains {)
        if (value.includes('{') && !value.includes('}')) {
          currentKey = key.trim();
          currentValue = value;
          inMultiLine = true;
        } else {
          // Simple single-line value
          process.env[key.trim()] = value.trim();
        }
      } else if (inMultiLine) {
        currentValue += '\n' + line;
        
        // Check if multi-line value ends
        if (line.includes('}')) {
          process.env[currentKey] = currentValue.trim();
          inMultiLine = false;
          currentKey = null;
          currentValue = '';
        }
      }
    }
  } catch (error) {
    console.warn('Could not load .env.local:', error.message);
  }
}

// Load environment variables
loadEnvLocal();
require('dotenv').config(); // Fallback

class PexelsImageService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.PEXELS_API_KEY;
    this.baseUrl = 'https://api.pexels.com/v1';
  }

  /**
   * Search Pexels for high-quality location images
   * @param {string} query - Search term (e.g., "Calgary downtown skyline")
   * @param {number} count - Number of images to return (default: 3)
   * @returns {Promise<Array>} Array of image objects
   */
  async searchImages(query, count = 3) {
    try {
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
      
      console.log(`🔍 Searching Pexels for: ${query}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const images = data.photos.map(photo => ({
        url: photo.src.large, // 940px wide
        fullUrl: photo.src.original, // Original size
        thumbnailUrl: photo.src.medium, // 350px wide
        alt: photo.alt || query,
        source: 'Pexels',
        query: query,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        pexelsUrl: photo.url,
        credit: `Photo by ${photo.photographer} from Pexels`,
        license: 'Pexels License (Free to use)'
      }));

      console.log(`✅ Found ${images.length} high-quality images for "${query}"`);
      return images;

    } catch (error) {
      console.error(`❌ Error searching Pexels for "${query}":`, error.message);
      return [];
    }
  }

  /**
   * Get location-specific images with smart search terms
   * @param {string} locationName - Name of the location
   * @param {string} locationType - Type of location (city, bridge, park, etc.)
   * @param {number} count - Number of images to return
   * @returns {Promise<Array>} Array of image objects
   */
  async getLocationImages(locationName, locationType = '', count = 3) {
    const searchQueries = this.generateSearchQueries(locationName, locationType);
    
    let allImages = [];
    
    for (const query of searchQueries) {
      if (allImages.length >= count) break;
      
      const images = await this.searchImages(query, Math.min(count - allImages.length, 3));
      allImages.push(...images);
      
      // Small delay to respect rate limits (200 requests per hour)
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Remove duplicates and return top results
    const uniqueImages = allImages.filter((img, index, self) => 
      index === self.findIndex(i => i.url === img.url)
    );
    
    return uniqueImages.slice(0, count);
  }

  /**
   * Generate smart search queries for locations
   * @param {string} locationName - Name of the location
   * @param {string} locationType - Type of location
   * @returns {Array<string>} Array of search queries
   */
  generateSearchQueries(locationName, locationType) {
    const queries = [];
    
    // Primary search with location name
    queries.push(locationName);
    
    // Add location type specific searches
    switch (locationType.toLowerCase()) {
      case 'city':
        queries.push(`${locationName} skyline`);
        queries.push(`${locationName} downtown`);
        queries.push(`${locationName} cityscape`);
        queries.push('urban skyline');
        break;
      case 'historic_town':
        queries.push(`${locationName} historic`);
        queries.push(`${locationName} main street`);
        queries.push('historic town');
        break;
      case 'bridge':
        queries.push(`${locationName} bridge`);
        queries.push(`${locationName} architecture`);
        queries.push('railway bridge');
        break;
      case 'park':
      case 'national_park':
        queries.push(`${locationName} landscape`);
        queries.push(`${locationName} nature`);
        queries.push(`${locationName} scenic`);
        queries.push('national park');
        break;
      case 'mountain_town':
        queries.push(`${locationName} mountains`);
        queries.push(`${locationName} alpine`);
        queries.push('mountain town');
        queries.push('rocky mountains');
        break;
      case 'government_building':
        queries.push(`${locationName} architecture`);
        queries.push(`${locationName} building`);
        queries.push('government building');
        queries.push('capitol building');
        break;
      case 'zoo':
        queries.push(`${locationName} animals`);
        queries.push(`${locationName} wildlife`);
        queries.push('zoo animals');
        queries.push('giraffes');
        break;
      case 'residential':
        queries.push(`${locationName} neighborhood`);
        queries.push('suburban houses');
        queries.push('residential street');
        break;
      case 'lake':
        queries.push(`${locationName} lake`);
        queries.push(`${locationName} water`);
        queries.push('mountain lake');
        queries.push('alpine lake');
        break;
      default:
        queries.push(`${locationName} landmark`);
        queries.push(`${locationName} scenic`);
        queries.push('landscape');
    }
    
    return queries.slice(0, 4); // Limit to 4 queries to avoid rate limits
  }

  /**
   * Get fallback image for location types
   * @param {string} locationType - Type of location
   * @returns {Object} Fallback image object
   */
  getFallbackImage(locationType) {
    const fallbacks = {
      city: {
        url: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'City skyline',
        credit: 'Fallback city image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      historic_town: {
        url: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Historic town',
        credit: 'Fallback historic town image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      bridge: {
        url: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Bridge',
        credit: 'Fallback bridge image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      park: {
        url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Park landscape',
        credit: 'Fallback park image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      national_park: {
        url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'National park',
        credit: 'Fallback national park image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      mountain_town: {
        url: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Mountain town',
        credit: 'Fallback mountain town image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      government_building: {
        url: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Government building',
        credit: 'Fallback government building image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      zoo: {
        url: 'https://images.pexels.com/photos/34098/south-africa-hluhluwe-giraffes-pattern.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Zoo animals',
        credit: 'Fallback zoo image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      residential: {
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Residential area',
        credit: 'Fallback residential image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      lake: {
        url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Mountain lake',
        credit: 'Fallback lake image from Pexels',
        license: 'Pexels License (Free to use)'
      },
      default: {
        url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'Scenic location',
        credit: 'Fallback location image from Pexels',
        license: 'Pexels License (Free to use)'
      }
    };

    return fallbacks[locationType] || fallbacks.default;
  }

  /**
   * Check API status and rate limits
   */
  async checkUsage() {
    try {
      // Test with a simple search to verify API key
      const response = await fetch(`${this.baseUrl}/search?query=test&per_page=1`, {
        headers: {
          'Authorization': this.apiKey
        }
      });

      if (response.ok) {
        const rateLimit = response.headers.get('X-Ratelimit-Remaining');
        const rateLimitReset = response.headers.get('X-Ratelimit-Reset');
        console.log(`📊 Pexels API - Requests remaining: ${rateLimit || 'Unknown'}`);
        if (rateLimitReset) {
          const resetTime = new Date(parseInt(rateLimitReset) * 1000);
          console.log(`🔄 Rate limit resets at: ${resetTime.toLocaleTimeString()}`);
        }
        return true;
      } else {
        console.error('❌ Pexels API key invalid or expired');
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking Pexels API:', error.message);
      return false;
    }
  }
}

module.exports = PexelsImageService;

// Test function
async function test() {
  const service = new PexelsImageService();
  
  console.log('🧪 Testing Pexels Image Service...\n');
  
  // Check API status
  const isValid = await service.checkUsage();
  if (!isValid) {
    console.log('❌ Please set PEXELS_API_KEY in your .env file');
    console.log('🔗 Get your free API key at: https://www.pexels.com/api/');
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
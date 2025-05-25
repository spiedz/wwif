const fetch = require('node-fetch');
const cheerio = require('cheerio');

class ScraperAPIImageService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.scraperapi.com';
  }

  /**
   * Search Google Images for film location photos
   * @param {string} query - Search term (e.g., "Atlanta skyline", "Decatur High School")
   * @param {number} count - Number of images to return (default: 5)
   * @returns {Promise<Array>} Array of image objects
   */
  async searchGoogleImages(query, count = 5) {
    try {
      // Build Google Images search URL
      const googleImagesUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&hl=en&gl=us`;
      
      // Use ScraperAPI to fetch the page
      const scraperUrl = `${this.baseUrl}/?api_key=${this.apiKey}&url=${encodeURIComponent(googleImagesUrl)}&render=true`;
      
      console.log(`🔍 Searching for: ${query}`);
      
      const response = await fetch(scraperUrl);
      
      if (!response.ok) {
        throw new Error(`ScraperAPI error: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      const images = [];
      
      // Parse image results from Google Images
      // Google Images structure can vary, so we try multiple selectors
      $('img').each((index, element) => {
        if (images.length >= count) return false;
        
        const src = $(element).attr('src') || $(element).attr('data-src');
        const alt = $(element).attr('alt') || query;
        
        // Filter out small images and base64 data URLs
        if (src && !src.startsWith('data:') && src.includes('http')) {
          // Try to get higher resolution version
          const highResSrc = $(element).parent().attr('href') || 
                           $(element).attr('data-iurl') || 
                           src;
          
          images.push({
            url: highResSrc,
            thumbnailUrl: src,
            alt: alt,
            source: 'Google Images',
            query: query
          });
        }
      });

      // If we didn't get enough images from img tags, try parsing JSON data
      if (images.length < count) {
        const scriptTags = $('script').toArray();
        for (const script of scriptTags) {
          const scriptContent = $(script).html();
          if (scriptContent && scriptContent.includes('AF_initDataCallback')) {
            // Extract image URLs from Google's data
            const imageMatches = scriptContent.match(/\["(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]/g);
            if (imageMatches) {
              for (const match of imageMatches) {
                if (images.length >= count) break;
                const urlMatch = match.match(/https?:\/\/[^"]+/);
                if (urlMatch) {
                  images.push({
                    url: urlMatch[0],
                    thumbnailUrl: urlMatch[0],
                    alt: query,
                    source: 'Google Images',
                    query: query
                  });
                }
              }
            }
          }
        }
      }

      console.log(`✅ Found ${images.length} images for "${query}"`);
      return images;

    } catch (error) {
      console.error(`❌ Error searching images for "${query}":`, error.message);
      return [];
    }
  }

  /**
   * Alternative: Search Bing Images (often easier to parse)
   * @param {string} query - Search term
   * @param {number} count - Number of images to return
   * @returns {Promise<Array>} Array of image objects
   */
  async searchBingImages(query, count = 5) {
    try {
      const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1`;
      const scraperUrl = `${this.baseUrl}/?api_key=${this.apiKey}&url=${encodeURIComponent(bingUrl)}`;
      
      const response = await fetch(scraperUrl);
      
      if (!response.ok) {
        throw new Error(`ScraperAPI error: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      const images = [];
      
      // Bing Images uses a more consistent structure
      $('.iusc').each((index, element) => {
        if (images.length >= count) return false;
        
        const metadata = $(element).attr('m');
        if (metadata) {
          try {
            const data = JSON.parse(metadata);
            images.push({
              url: data.murl || data.turl,
              thumbnailUrl: data.turl,
              alt: data.t || query,
              source: 'Bing Images',
              query: query,
              width: data.mw,
              height: data.mh
            });
          } catch (e) {
            // Skip if JSON parsing fails
          }
        }
      });

      console.log(`✅ Found ${images.length} Bing images for "${query}"`);
      return images;

    } catch (error) {
      console.error(`❌ Error searching Bing images for "${query}":`, error.message);
      return [];
    }
  }

  /**
   * Get images for film locations with fallback options
   * @param {string} query - Search term
   * @param {number} count - Number of images to return
   * @returns {Promise<Array>} Array of image objects
   */
  async getFilmLocationImages(query, count = 5) {
    // Try Google Images first
    let images = await this.searchGoogleImages(query, count);
    
    // If not enough results, try Bing
    if (images.length < count) {
      console.log(`⚠️  Only found ${images.length} Google images, trying Bing...`);
      const bingImages = await this.searchBingImages(query, count - images.length);
      images = [...images, ...bingImages];
    }
    
    // Add our standard formatting
    return images.map(img => ({
      ...img,
      url: this.ensureHighQuality(img.url),
      credit: `Image from ${img.source} search for "${img.query}"`
    }));
  }

  /**
   * Ensure image URL is high quality
   * @param {string} url - Original image URL
   * @returns {string} Optimized URL
   */
  ensureHighQuality(url) {
    // Remove common size parameters to get full resolution
    return url
      .replace(/&w=\d+/g, '')
      .replace(/&h=\d+/g, '')
      .replace(/\?sz=\d+/g, '')
      .replace(/=s\d+-c/g, '=s1200-c')
      .replace(/=w\d+-h\d+/g, '=w1200-h630');
  }

  /**
   * Get location-specific images with smart search terms
   * @param {string} locationType - Type of location (city, school, etc.)
   * @param {string} specificLocation - Specific location name
   * @returns {Promise<Array>} Array of image objects
   */
  async getLocationTypeImages(locationType, specificLocation = '') {
    const searchQueries = this.generateSearchQueries(locationType, specificLocation);
    
    for (const query of searchQueries) {
      const images = await this.getFilmLocationImages(query, 3);
      if (images.length > 0) {
        return images;
      }
      
      // Rate limiting between searches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return [];
  }

  /**
   * Generate search queries for better results
   * @param {string} locationType - Type of location
   * @param {string} specificLocation - Specific location name
   * @returns {Array<string>} Array of search queries
   */
  generateSearchQueries(locationType, specificLocation = '') {
    const queries = {
      city: [
        `${specificLocation} city skyline aerial view`,
        `${specificLocation} downtown buildings`,
        `${specificLocation} cityscape photography`
      ],
      school: [
        `${specificLocation} building exterior`,
        `high school building facade`,
        `american high school exterior`
      ],
      forest: [
        `${specificLocation} trees nature`,
        `forest path trail`,
        `dense forest canopy`
      ],
      cemetery: [
        `${specificLocation} historic graves`,
        `old cemetery headstones`,
        `gothic cemetery gates`
      ],
      warehouse: [
        `industrial warehouse exterior`,
        `abandoned warehouse building`,
        `warehouse district`
      ]
    };

    return queries[locationType] || [`${specificLocation} ${locationType}`];
  }

  /**
   * Batch process multiple locations
   * @param {Array} locations - Array of location objects
   * @returns {Promise<Object>} Object mapping location IDs to images
   */
  async batchProcessLocations(locations) {
    const imageAssignments = {};
    
    for (const location of locations) {
      console.log(`📍 Processing: ${location.name || location.type}`);
      
      const images = await this.getLocationTypeImages(
        location.type || 'location',
        location.name || location.city
      );
      
      if (images.length > 0) {
        imageAssignments[location.id] = images[0];
        console.log(`✅ Found image for ${location.name}`);
      } else {
        console.log(`❌ No image found for ${location.name}`);
        imageAssignments[location.id] = this.getFallbackImage(location.type);
      }
      
      // Rate limiting: 2 seconds between locations
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return imageAssignments;
  }

  /**
   * Get fallback image when search fails
   * @param {string} locationType - Type of location
   * @returns {Object} Fallback image object
   */
  getFallbackImage(locationType) {
    const fallbacks = {
      city: {
        url: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&w=1200&h=630',
        alt: 'City skyline',
        credit: 'Fallback city image from Pexels'
      },
      school: {
        url: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&w=1200&h=630',
        alt: 'School building',
        credit: 'Fallback school image from Pexels'
      },
      forest: {
        url: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&w=1200&h=630',
        alt: 'Forest path',
        credit: 'Fallback forest image from Pexels'
      },
      default: {
        url: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&w=1200&h=630',
        alt: 'Film location',
        credit: 'Fallback location image from Pexels'
      }
    };

    return fallbacks[locationType] || fallbacks.default;
  }

  /**
   * Check API usage/credits
   * @returns {Promise<Object>} Usage information
   */
  async checkUsage() {
    try {
      const response = await fetch(`${this.baseUrl}/account?api_key=${this.apiKey}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          requestsUsed: data.requestCount || 0,
          requestsLimit: data.requestLimit || 0,
          creditsRemaining: data.credits || 0
        };
      }
    } catch (error) {
      console.error('Error checking API usage:', error);
    }
    
    return { requestsUsed: 'Unknown', requestsLimit: 'Unknown', creditsRemaining: 'Unknown' };
  }
}

module.exports = ScraperAPIImageService;

// Example usage
if (require.main === module) {
  const scraper = new ScraperAPIImageService(process.env.SCRAPERAPI_KEY);
  
  async function test() {
    console.log('🧪 Testing ScraperAPI Image Service...\n');
    
    // Test basic search
    const atlantaImages = await scraper.getFilmLocationImages('Atlanta skyline', 3);
    console.log(`\nAtlanta images found: ${atlantaImages.length}`);
    if (atlantaImages.length > 0) {
      console.log(`First result: ${atlantaImages[0].url.substring(0, 80)}...`);
    }
    
    // Test location type search
    const schoolImages = await scraper.getLocationTypeImages('school', 'Decatur High School');
    console.log(`\nSchool images found: ${schoolImages.length}`);
    
    // Check usage
    const usage = await scraper.checkUsage();
    console.log('\nAPI Usage:', usage);
  }
  
  if (process.env.SCRAPERAPI_KEY) {
    test().catch(console.error);
  } else {
    console.log('Set SCRAPERAPI_KEY environment variable to test');
  }
} 
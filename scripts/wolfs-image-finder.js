const fs = require('fs');
const path = require('path');
const ScraperAPIImageService = require('./scraperapi-image-service');

// Read .env.local as UTF-16
const envPath = path.join(process.cwd(), '.env.local');
const buffer = fs.readFileSync(envPath);
let content = buffer.toString('utf16le');

// Parse API key
const lines = content.split(/\r?\n/);
let scraperApiKey = null;

lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    if (trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      
      if (key.trim() === 'SCRAPERAPI_KEY') {
        scraperApiKey = value.trim();
      }
    }
  }
});

async function findWolfsImages() {
  console.log('🎬 Finding images for Wolfs (2024) filming locations...\n');
  
  const scraper = new ScraperAPIImageService(scraperApiKey);
  
  // Define Wolfs filming locations
  const wolfsLocations = [
    {
      id: 1,
      name: 'Four Seasons Hotel New York',
      type: 'hotel',
      searchQuery: 'Four Seasons Hotel New York Manhattan exterior',
      description: 'Hotel Delon in the film'
    },
    {
      id: 2,
      name: 'Brooklyn-Battery Tunnel',
      type: 'tunnel',
      searchQuery: 'Brooklyn Battery Tunnel Hugh L Carey Tunnel entrance',
      description: 'Hugh L. Carey Tunnel'
    },
    {
      id: 3,
      name: 'Chinatown Madison Street',
      type: 'street',
      searchQuery: 'Madison Street Chinatown New York',
      description: 'Doctor\'s house location'
    },
    {
      id: 4,
      name: 'East Broadway Mall',
      type: 'mall',
      searchQuery: 'East Broadway Mall Manhattan Bridge New York',
      description: 'Under Manhattan Bridge'
    },
    {
      id: 5,
      name: 'Mott Street Chinatown',
      type: 'street',
      searchQuery: 'Mott Street Chinatown New York Panda Ma store',
      description: 'Car flip scene location'
    },
    {
      id: 6,
      name: 'Brooklyn Bridge',
      type: 'bridge',
      searchQuery: 'Brooklyn Bridge Manhattan side underneath',
      description: 'Chase scene location'
    },
    {
      id: 7,
      name: 'Da Mikelle Palazzo',
      type: 'venue',
      searchQuery: 'Da Mikelle Palazzo Queens New York wedding venue',
      description: 'Dimitri\'s Ice Club'
    },
    {
      id: 8,
      name: 'Crown Fried Chicken',
      type: 'restaurant',
      searchQuery: 'Crown Fried Chicken Hillside Avenue Queens Village',
      description: 'Restaurant scene'
    },
    {
      id: 9,
      name: 'Brighton Beach Diner',
      type: 'diner',
      searchQuery: 'Brighton Beach Brooklyn diner restaurant',
      description: 'Final scene diner'
    }
  ];
  
  const imageResults = {};
  
  for (const location of wolfsLocations) {
    console.log(`📍 Searching for: ${location.name}`);
    
    try {
      const images = await scraper.getFilmLocationImages(location.searchQuery, 1);
      
      if (images.length > 0) {
        imageResults[location.id] = {
          ...location,
          image: images[0]
        };
        console.log(`✅ Found image: ${images[0].url.substring(0, 60)}...`);
      } else {
        console.log(`❌ No images found, using fallback`);
        imageResults[location.id] = {
          ...location,
          image: scraper.getFallbackImage(location.type)
        };
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      imageResults[location.id] = {
        ...location,
        image: scraper.getFallbackImage(location.type)
      };
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Check usage
  console.log('\n📊 Checking API usage...');
  const usage = await scraper.checkUsage();
  console.log(`Credits remaining: ${usage.creditsRemaining}`);
  console.log(`Total requests used: ${usage.requestsUsed}`);
  
  return imageResults;
}

// Run the script
if (require.main === module) {
  findWolfsImages()
    .then(results => {
      console.log('\n✅ Image search complete!');
      // Save results for use in markdown generation
      fs.writeFileSync(
        'scripts/wolfs-images.json',
        JSON.stringify(results, null, 2)
      );
      console.log('Results saved to scripts/wolfs-images.json');
    })
    .catch(console.error);
}

module.exports = { findWolfsImages }; 
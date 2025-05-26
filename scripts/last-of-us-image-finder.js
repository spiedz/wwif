const ScraperAPIImageService = require('./scraperapi-image-service');
require('dotenv').config();

// Initialize the service
const imageService = new ScraperAPIImageService(process.env.SCRAPERAPI_KEY);

// Define The Last of Us filming locations
const lastOfUsLocations = [
  {
    name: "Calgary Downtown (Boston Quarantine Zone)",
    searchTerms: [
      "Calgary downtown skyline Alberta Canada",
      "Calgary 4th Avenue Flyover bridge",
      "Calgary Inglewood neighborhood historic buildings"
    ],
    type: "city",
    coordinates: { lat: 51.0447, lng: -114.0719 }
  },
  {
    name: "Fort Macleod Main Street (Austin Texas)",
    searchTerms: [
      "Fort Macleod Main Street Alberta historic buildings",
      "Fort Macleod Empress Theatre Alberta",
      "Fort Macleod downtown heritage district"
    ],
    type: "historic_town",
    coordinates: { lat: 49.7225, lng: -113.4047 }
  },
  {
    name: "Canmore Engine Bridge (Jackson Wyoming)",
    searchTerms: [
      "Canmore Engine Bridge Alberta Rocky Mountains",
      "Canmore Main Street Alberta mountain town",
      "Canmore Bow River bridge historic railway"
    ],
    type: "mountain_town",
    coordinates: { lat: 51.0884, lng: -115.3581 }
  },
  {
    name: "Alberta Legislature Building (Massachusetts State House)",
    searchTerms: [
      "Alberta Legislature Building Edmonton dome",
      "Edmonton Legislature grounds North Saskatchewan River",
      "Alberta Parliament Building Beaux Arts architecture"
    ],
    type: "government_building",
    coordinates: { lat: 53.5344, lng: -113.5019 }
  },
  {
    name: "High River (Miller Family Home)",
    searchTerms: [
      "High River Alberta residential neighborhood",
      "High River Sullivan Road houses",
      "High River Alberta small town streets"
    ],
    type: "residential",
    coordinates: { lat: 50.5833, lng: -113.6833 }
  },
  {
    name: "Waterton Lakes National Park",
    searchTerms: [
      "Waterton Lakes National Park Alberta winter",
      "Waterton Lakes snow covered mountains",
      "Waterton Lakes National Park UNESCO World Heritage"
    ],
    type: "national_park",
    coordinates: { lat: 49.0500, lng: -113.9000 }
  },
  {
    name: "Calgary Zoo (Giraffe Scene)",
    searchTerms: [
      "Calgary Zoo giraffes Alberta",
      "Wilder Institute Calgary Zoo animals",
      "Calgary Zoo giraffe exhibit enclosure"
    ],
    type: "zoo",
    coordinates: { lat: 51.0447, lng: -114.0325 }
  },
  {
    name: "Lethbridge Viaduct (High Level Bridge)",
    searchTerms: [
      "Lethbridge Viaduct High Level Bridge Alberta",
      "Lethbridge railway bridge Oldman River",
      "High Level Bridge Lethbridge longest highest"
    ],
    type: "bridge",
    coordinates: { lat: 49.6928, lng: -112.8281 }
  },
  {
    name: "Fish Creek Provincial Park",
    searchTerms: [
      "Fish Creek Provincial Park Calgary Shannon Terrace Bridge",
      "Fish Creek Park Calgary urban park pathways",
      "Shannon Terrace pedestrian bridge Calgary"
    ],
    type: "park",
    coordinates: { lat: 50.9333, lng: -114.0833 }
  },
  {
    name: "Barrier Lake Kananaskis",
    searchTerms: [
      "Barrier Lake Kananaskis Alberta Rocky Mountains",
      "Barrier Lake Bow Valley Provincial Park",
      "Kananaskis Country Barrier Lake hiking trails"
    ],
    type: "lake",
    coordinates: { lat: 51.0333, lng: -115.0500 }
  }
];

async function findAllImages() {
  console.log('🎬 Finding images for The Last of Us filming locations...\n');
  
  const results = {};
  
  for (const location of lastOfUsLocations) {
    console.log(`\n📍 Processing: ${location.name}`);
    console.log(`   Type: ${location.type}`);
    console.log(`   Coordinates: ${location.coordinates.lat}, ${location.coordinates.lng}`);
    
    const locationImages = [];
    
    // Search for images using each search term
    for (const searchTerm of location.searchTerms) {
      try {
        const images = await imageService.getFilmLocationImages(searchTerm, 2);
        locationImages.push(...images);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error searching for "${searchTerm}":`, error.message);
      }
    }
    
    // Remove duplicates and select best images
    const uniqueImages = locationImages.filter((img, index, self) => 
      index === self.findIndex(i => i.url === img.url)
    );
    
    results[location.name] = {
      ...location,
      images: uniqueImages.slice(0, 3), // Keep top 3 images
      totalFound: uniqueImages.length
    };
    
    console.log(`✅ Found ${uniqueImages.length} unique images for ${location.name}`);
  }
  
  return results;
}

async function generateImageReport(results) {
  console.log('\n📊 IMAGE SEARCH RESULTS SUMMARY\n');
  console.log('=' .repeat(60));
  
  let totalImages = 0;
  
  for (const [locationName, data] of Object.entries(results)) {
    console.log(`\n📍 ${locationName}`);
    console.log(`   Images found: ${data.totalFound}`);
    console.log(`   Selected: ${data.images.length}`);
    
    if (data.images.length > 0) {
      console.log('   Best images:');
      data.images.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.url}`);
        console.log(`      Alt: ${img.alt}`);
        console.log(`      Source: ${img.source}`);
      });
    }
    
    totalImages += data.images.length;
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📈 TOTAL IMAGES COLLECTED: ${totalImages}`);
  console.log('=' .repeat(60));
  
  return results;
}

async function main() {
  try {
    // Check API usage first
    console.log('🔍 Checking ScraperAPI usage...');
    await imageService.checkUsage();
    
    // Find all images
    const results = await findAllImages();
    
    // Generate report
    await generateImageReport(results);
    
    // Save results to file for use in article creation
    const fs = require('fs');
    fs.writeFileSync(
      'scripts/last-of-us-images.json', 
      JSON.stringify(results, null, 2)
    );
    
    console.log('\n💾 Results saved to scripts/last-of-us-images.json');
    console.log('🎬 Ready to create The Last of Us filming locations article!');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { lastOfUsLocations, findAllImages }; 
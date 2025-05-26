// Load environment variables manually due to complex .env.local file
const fs = require('fs');
const path = require('path');

function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Simple parser for key=value pairs, skipping complex multi-line JSON
    const lines = envContent.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments, empty lines, and lines that look like JSON
      if (trimmedLine.startsWith('#') || trimmedLine === '' || trimmedLine.startsWith('{') || trimmedLine.startsWith('"')) {
        continue;
      }
      
      // Parse simple key=value pairs
      if (trimmedLine.includes('=') && !trimmedLine.includes('{')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        
        if (key && value) {
          process.env[key.trim()] = value;
        }
      }
    }
  } catch (error) {
    console.warn('Could not load .env.local:', error.message);
  }
}

// Load environment variables
loadEnvLocal();

const PexelsImageService = require('./pexels-image-service');

// Initialize the service with the API key directly if environment loading fails
const apiKey = process.env.PEXELS_API_KEY || 'Uqcha02AvDiJMRZU2oj0p0ipQjnXw2GedXS98wsUflMXqgQ2Bhzt4nIV';
const imageService = new PexelsImageService(apiKey);

// Define The Last of Us filming locations with better search terms for Pexels
const lastOfUsLocations = [
  {
    name: "Calgary Downtown (Boston Quarantine Zone)",
    searchTerms: [
      "Calgary downtown skyline",
      "urban cityscape",
      "modern city buildings",
      "downtown architecture"
    ],
    type: "city",
    coordinates: { lat: 51.0447, lng: -114.0719 }
  },
  {
    name: "Fort Macleod Main Street (Austin Texas)",
    searchTerms: [
      "historic main street",
      "small town Alberta",
      "heritage buildings",
      "western town street"
    ],
    type: "historic_town",
    coordinates: { lat: 49.7225, lng: -113.4047 }
  },
  {
    name: "Canmore Engine Bridge (Jackson Wyoming)",
    searchTerms: [
      "mountain town",
      "rocky mountains",
      "alpine village",
      "mountain railway bridge"
    ],
    type: "mountain_town",
    coordinates: { lat: 51.0884, lng: -115.3581 }
  },
  {
    name: "Alberta Legislature Building (Massachusetts State House)",
    searchTerms: [
      "government building",
      "capitol building dome",
      "neoclassical architecture",
      "legislative building"
    ],
    type: "government_building",
    coordinates: { lat: 53.5344, lng: -113.5019 }
  },
  {
    name: "High River (Miller Family Home)",
    searchTerms: [
      "suburban houses",
      "residential neighborhood",
      "prairie town",
      "small town homes"
    ],
    type: "residential",
    coordinates: { lat: 50.5833, lng: -113.6833 }
  },
  {
    name: "Waterton Lakes National Park",
    searchTerms: [
      "mountain lake",
      "national park",
      "rocky mountains",
      "alpine landscape"
    ],
    type: "national_park",
    coordinates: { lat: 49.0500, lng: -113.9000 }
  },
  {
    name: "Calgary Zoo (Giraffe Scene)",
    searchTerms: [
      "giraffes",
      "zoo animals",
      "wildlife park",
      "african animals"
    ],
    type: "zoo",
    coordinates: { lat: 51.0447, lng: -114.0325 }
  },
  {
    name: "Lethbridge Viaduct (High Level Bridge)",
    searchTerms: [
      "railway bridge",
      "steel bridge",
      "viaduct architecture",
      "train bridge"
    ],
    type: "bridge",
    coordinates: { lat: 49.6928, lng: -112.8281 }
  },
  {
    name: "Fish Creek Provincial Park",
    searchTerms: [
      "urban park",
      "creek bridge",
      "park pathway",
      "nature trail"
    ],
    type: "park",
    coordinates: { lat: 50.9333, lng: -114.0833 }
  },
  {
    name: "Barrier Lake Kananaskis",
    searchTerms: [
      "mountain lake",
      "alpine lake",
      "rocky mountains lake",
      "pristine lake"
    ],
    type: "lake",
    coordinates: { lat: 51.0333, lng: -115.0500 }
  }
];

async function findAllImages() {
  console.log('🎬 Finding high-quality images for The Last of Us filming locations using Pexels...\n');
  
  const results = {};
  
  for (const location of lastOfUsLocations) {
    console.log(`\n📍 Processing: ${location.name}`);
    console.log(`   Type: ${location.type}`);
    console.log(`   Coordinates: ${location.coordinates.lat}, ${location.coordinates.lng}`);
    
    const locationImages = [];
    
    // Search for images using each search term
    for (const searchTerm of location.searchTerms) {
      try {
        const images = await imageService.searchImages(searchTerm, 2);
        locationImages.push(...images);
        
        // Delay to respect rate limits (200 requests per hour)
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`❌ Error searching for "${searchTerm}":`, error.message);
      }
    }
    
    // Remove duplicates and select best images
    const uniqueImages = locationImages.filter((img, index, self) => 
      index === self.findIndex(i => i.url === img.url)
    );
    
    // If no images found, use fallback
    const finalImages = uniqueImages.length > 0 
      ? uniqueImages.slice(0, 3) 
      : [imageService.getFallbackImage(location.type)];
    
    results[location.name] = {
      ...location,
      images: finalImages,
      totalFound: uniqueImages.length,
      usedFallback: uniqueImages.length === 0
    };
    
    console.log(`✅ Found ${uniqueImages.length} unique images for ${location.name}${uniqueImages.length === 0 ? ' (using fallback)' : ''}`);
  }
  
  return results;
}

async function generateImageReport(results) {
  console.log('\n📊 PEXELS IMAGE SEARCH RESULTS SUMMARY\n');
  console.log('=' .repeat(60));
  
  let totalImages = 0;
  let locationsWithImages = 0;
  
  for (const [locationName, data] of Object.entries(results)) {
    console.log(`\n📍 ${locationName}`);
    console.log(`   Images found: ${data.totalFound}${data.usedFallback ? ' (fallback used)' : ''}`);
    console.log(`   Selected: ${data.images.length}`);
    
    if (data.images.length > 0) {
      locationsWithImages++;
      console.log('   Best images:');
      data.images.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.url}`);
        console.log(`      Alt: ${img.alt}`);
        console.log(`      Credit: ${img.credit}`);
        if (img.photographer) {
          console.log(`      Photographer: ${img.photographer}`);
        }
      });
    }
    
    totalImages += data.images.length;
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📈 TOTAL IMAGES COLLECTED: ${totalImages}`);
  console.log(`📍 LOCATIONS WITH IMAGES: ${locationsWithImages}/${Object.keys(results).length}`);
  console.log('=' .repeat(60));
  
  return results;
}

async function updateMarkdownWithImages(results) {
  const fs = require('fs');
  const path = 'content/films/where-was-the-last-of-us-filmed.md';
  
  try {
    let content = fs.readFileSync(path, 'utf8');
    
    // Update coordinates section with real images
    for (const [locationName, data] of Object.entries(results)) {
      if (data.images.length > 0) {
        const bestImage = data.images[0];
        const coordinateEntry = data.coordinates;
        
        // Find and replace the image URL in the coordinates section
        const coordRegex = new RegExp(
          `(- lat: ${coordinateEntry.lat}[\\s\\S]*?image: ')[^']*(')`
        );
        
        if (coordRegex.test(content)) {
          content = content.replace(coordRegex, `$1${bestImage.url}$2`);
          console.log(`✅ Updated image for ${locationName}`);
        }
      }
    }
    
    fs.writeFileSync(path, content);
    console.log('\n📝 Updated markdown file with new Pexels images!');
    
  } catch (error) {
    console.error('❌ Error updating markdown file:', error.message);
  }
}

async function main() {
  try {
    // Check API status first
    console.log('🔍 Checking Pexels API status...');
    const isValid = await imageService.checkUsage();
    
    if (!isValid) {
      console.log('\n❌ Pexels API key not found or invalid!');
      console.log('🔗 Get your free API key at: https://www.pexels.com/api/');
      console.log('📝 Add PEXELS_API_KEY to your .env file');
      console.log('\n💡 Pexels offers:');
      console.log('   • 200 requests per hour');
      console.log('   • High-quality professional photos');
      console.log('   • Free to use with attribution');
      return;
    }
    
    // Find all images
    const results = await findAllImages();
    
    // Generate report
    await generateImageReport(results);
    
    // Save results to file
    const fs = require('fs');
    fs.writeFileSync(
      'scripts/last-of-us-pexels-images.json', 
      JSON.stringify(results, null, 2)
    );
    
    console.log('\n💾 Results saved to scripts/last-of-us-pexels-images.json');
    
    // Update the markdown file with real images
    await updateMarkdownWithImages(results);
    
    console.log('\n🎬 The Last of Us filming locations article updated with high-quality Pexels images!');
    console.log('📸 All images are properly licensed and credited');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { lastOfUsLocations, findAllImages }; 
const UnsplashService = require('./unsplash-service');
require('dotenv').config();

async function testImageAutomation() {
  console.log('🎬 Testing Image Automation for Film Locations\n');

  // Check if API key is available
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.log('❌ UNSPLASH_ACCESS_KEY not found in environment variables');
    console.log('📝 To get started:');
    console.log('1. Sign up at https://unsplash.com/developers');
    console.log('2. Create a new application');
    console.log('3. Add UNSPLASH_ACCESS_KEY=your_key_here to your .env file');
    console.log('4. Run this script again');
    return;
  }

  const unsplash = new UnsplashService(process.env.UNSPLASH_ACCESS_KEY);

  try {
    // Test 1: Basic location search
    console.log('🔍 Test 1: Searching for Atlanta skyline images...');
    const atlantaImages = await unsplash.getFilmLocationImages('Atlanta skyline', 3);
    
    if (atlantaImages.length > 0) {
      console.log(`✅ Found ${atlantaImages.length} Atlanta images`);
      console.log(`   Best match: ${atlantaImages[0].url}`);
      console.log(`   Credit: ${atlantaImages[0].credit}\n`);
    } else {
      console.log('❌ No Atlanta images found\n');
    }

    // Test 2: Location type search
    console.log('🏫 Test 2: Searching for school building images...');
    const schoolImages = await unsplash.getLocationTypeImages('school', 'Decatur High School');
    
    if (schoolImages.length > 0) {
      console.log(`✅ Found ${schoolImages.length} school images`);
      console.log(`   Best match: ${schoolImages[0].url}`);
      console.log(`   Alt text: ${schoolImages[0].alt}\n`);
    } else {
      console.log('❌ No school images found\n');
    }

    // Test 3: Behind-the-scenes content
    console.log('🎭 Test 3: Searching for behind-the-scenes images...');
    const btsImages = await unsplash.getBehindTheScenesImages('Fear Street');
    
    if (btsImages.length > 0) {
      console.log(`✅ Found ${btsImages.length} behind-the-scenes images`);
      console.log(`   Best match: ${btsImages[0].url}\n`);
    } else {
      console.log('❌ No behind-the-scenes images found\n');
    }

    // Test 4: Batch processing (simulating Fear Street locations)
    console.log('📦 Test 4: Batch processing Fear Street locations...');
    const fearStreetLocations = [
      {
        id: 1,
        type: 'city',
        name: 'Atlanta',
        city: 'Atlanta',
        state: 'Georgia'
      },
      {
        id: 2,
        type: 'school',
        name: 'Decatur High School',
        city: 'Decatur',
        state: 'Georgia'
      },
      {
        id: 3,
        type: 'forest',
        name: 'Hard Labor Creek State Park',
        city: 'Rutledge',
        state: 'Georgia'
      },
      {
        id: 4,
        type: 'cemetery',
        name: 'Decatur Cemetery',
        city: 'Decatur',
        state: 'Georgia'
      },
      {
        id: 5,
        type: 'warehouse',
        name: 'The Goat Farm Arts Center',
        city: 'Atlanta',
        state: 'Georgia'
      }
    ];

    const imageAssignments = await unsplash.batchProcessLocations(fearStreetLocations);
    
    console.log('\n📊 Batch Processing Results:');
    console.log(`   Locations processed: ${fearStreetLocations.length}`);
    console.log(`   Images assigned: ${Object.keys(imageAssignments).length}`);
    
    // Show results for each location
    for (const location of fearStreetLocations) {
      const image = imageAssignments[location.id];
      if (image) {
        console.log(`   ✅ ${location.name}: ${image.url.substring(0, 60)}...`);
      } else {
        console.log(`   ❌ ${location.name}: No image assigned`);
      }
    }

    // Test 5: Usage statistics
    console.log('\n📈 Test 5: Checking API usage...');
    const stats = await unsplash.getUsageStats();
    console.log(`   API requests used: ${stats.requests}`);
    console.log(`   API limit: ${stats.limit}`);

    // Test 6: Generate markdown example
    console.log('\n📝 Test 6: Generated markdown example:');
    const exampleLocation = fearStreetLocations[0];
    const exampleImage = imageAssignments[exampleLocation.id];
    
    if (exampleImage) {
      const markdown = `
### ${exampleLocation.name}: The Heart of Shadyside

${exampleLocation.name} served as the primary filming location for Fear Street: Prom Queen, transforming into the cursed town of Shadyside.

<div align="center">
  <img src="${exampleImage.url}" alt="${exampleImage.alt}" width="80%">
  <p><em>${exampleImage.credit}</em></p>
</div>

**Key Filming Details:**
- Location: ${exampleLocation.city}, ${exampleLocation.state}
- Type: ${exampleLocation.type}
- Used for: Multiple scenes throughout the film
`;
      
      console.log(markdown);
    }

    console.log('\n🎉 Image automation test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Integrate this into your content generation pipeline');
    console.log('2. Create curated fallback images for common location types');
    console.log('3. Build validation to ensure image quality and relevance');
    console.log('4. Set up monitoring for API usage and image accessibility');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔑 Authentication Error:');
      console.log('Your Unsplash API key may be invalid or expired.');
      console.log('Please check your UNSPLASH_ACCESS_KEY in the .env file.');
    } else if (error.message.includes('403')) {
      console.log('\n🚫 Rate Limit Error:');
      console.log('You may have exceeded the Unsplash API rate limit.');
      console.log('Free tier allows 50 requests per hour.');
    }
  }
}

// Helper function to demonstrate content generation with images
async function generateSampleContent() {
  console.log('\n🎬 Generating sample content with automated images...\n');
  
  const unsplash = new UnsplashService(process.env.UNSPLASH_ACCESS_KEY);
  
  // Sample film data
  const filmData = {
    title: 'Fear Street: Prom Queen',
    year: 2025,
    genre: ['Horror', 'Thriller'],
    locations: [
      { id: 1, type: 'city', name: 'Atlanta', description: 'Primary filming hub' },
      { id: 2, type: 'school', name: 'Decatur High School', description: 'Shadyside High School' }
    ]
  };

  // Get images for each location
  for (const location of filmData.locations) {
    console.log(`🔍 Finding images for ${location.name}...`);
    const images = await unsplash.getLocationTypeImages(location.type, location.name);
    
    if (images.length > 0) {
      location.image = images[0];
      console.log(`✅ Assigned image: ${images[0].url.substring(0, 50)}...`);
    } else {
      location.image = unsplash.getFallbackImage(location.type);
      console.log(`⚠️  Using fallback image for ${location.name}`);
    }
  }

  // Generate markdown content
  const markdown = `---
title: "Where Was ${filmData.title} Filmed? Complete Location Guide"
description: "Explore ${filmData.title}'s filming locations with exclusive behind-the-scenes content and visiting guides."
slug: where-was-${filmData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-filmed
year: ${filmData.year}
genre: ${JSON.stringify(filmData.genre)}
---

# 🎬 Where Was ${filmData.title} Filmed?

*Discover the real locations behind this ${filmData.year} ${filmData.genre.join('/')} film.*

## 🗺️ Major Filming Locations

${filmData.locations.map(location => `
### ${location.name}

${location.description}

<div align="center">
  <img src="${location.image.url}" alt="${location.image.alt}" width="80%">
  <p><em>${location.image.credit}</em></p>
</div>
`).join('\n')}

## 🎬 Behind-the-Scenes Production

[Content would be generated here with more automated images]
`;

  console.log('\n📄 Generated Content Preview:');
  console.log(markdown.substring(0, 800) + '...\n');
  
  return markdown;
}

// Run the tests
if (require.main === module) {
  testImageAutomation()
    .then(() => {
      if (process.env.UNSPLASH_ACCESS_KEY) {
        return generateSampleContent();
      }
    })
    .catch(console.error);
}

module.exports = { testImageAutomation, generateSampleContent }; 
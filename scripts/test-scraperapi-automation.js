const ScraperAPIImageService = require('./scraperapi-image-service');
require('dotenv').config();

async function testScraperAPIAutomation() {
  console.log('🎬 Testing ScraperAPI Image Automation for Film Locations\n');

  // Check if API key is available
  if (!process.env.SCRAPERAPI_KEY) {
    console.log('❌ SCRAPERAPI_KEY not found in environment variables');
    console.log('📝 To get started:');
    console.log('1. Sign up at https://www.scraperapi.com');
    console.log('2. Get your API key from the dashboard');
    console.log('3. Add SCRAPERAPI_KEY=your_key_here to your .env.local file');
    console.log('4. Run this script again');
    console.log('\n💡 ScraperAPI offers:');
    console.log('   - 1000 free API credits');
    console.log('   - No credit card required');
    console.log('   - Works with Google Images & Bing');
    return;
  }

  const scraper = new ScraperAPIImageService(process.env.SCRAPERAPI_KEY);

  try {
    // Test 1: Basic location search
    console.log('🔍 Test 1: Searching for Atlanta skyline images...');
    const atlantaImages = await scraper.getFilmLocationImages('Atlanta skyline', 3);
    
    if (atlantaImages.length > 0) {
      console.log(`✅ Found ${atlantaImages.length} Atlanta images`);
      console.log(`   Best match: ${atlantaImages[0].url.substring(0, 80)}...`);
      console.log(`   Credit: ${atlantaImages[0].credit}\n`);
    } else {
      console.log('❌ No Atlanta images found\n');
    }

    // Test 2: Location type search
    console.log('🏫 Test 2: Searching for school building images...');
    const schoolImages = await scraper.getLocationTypeImages('school', 'Decatur High School');
    
    if (schoolImages.length > 0) {
      console.log(`✅ Found ${schoolImages.length} school images`);
      console.log(`   Best match: ${schoolImages[0].url.substring(0, 80)}...`);
      console.log(`   Alt text: ${schoolImages[0].alt}\n`);
    } else {
      console.log('❌ No school images found\n');
    }

    // Test 3: Batch processing Fear Street locations
    console.log('📦 Test 3: Batch processing Fear Street locations...');
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
      }
    ];

    const imageAssignments = await scraper.batchProcessLocations(fearStreetLocations);
    
    console.log('\n📊 Batch Processing Results:');
    console.log(`   Locations processed: ${fearStreetLocations.length}`);
    console.log(`   Images assigned: ${Object.keys(imageAssignments).length}`);
    
    // Show results for each location
    for (const location of fearStreetLocations) {
      const image = imageAssignments[location.id];
      if (image && image.url) {
        console.log(`   ✅ ${location.name}: ${image.url.substring(0, 60)}...`);
      } else {
        console.log(`   ❌ ${location.name}: Using fallback image`);
      }
    }

    // Test 4: Check API usage
    console.log('\n📈 Test 4: Checking API usage...');
    const usage = await scraper.checkUsage();
    console.log(`   Credits remaining: ${usage.creditsRemaining}`);
    console.log(`   Requests used: ${usage.requestsUsed}`);

    // Test 5: Generate markdown example
    console.log('\n📝 Test 5: Generated markdown example:');
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

    console.log('\n🎉 ScraperAPI image automation test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Integrate this into your content generation pipeline');
    console.log('2. Monitor your API credits (1000 free)');
    console.log('3. Consider paid plans for higher volume');
    console.log('4. Use fallback images when scraping fails');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔑 Authentication Error:');
      console.log('Your ScraperAPI key may be invalid.');
      console.log('Please check your SCRAPERAPI_KEY in the .env.local file.');
    } else if (error.message.includes('402')) {
      console.log('\n💳 Credits Exhausted:');
      console.log('You may have used all your free credits.');
      console.log('Check your usage at https://dashboard.scraperapi.com');
    }
  }
}

// Comparison function to show differences
async function compareImageSources() {
  console.log('\n📊 Comparing Image Sources:\n');
  
  console.log('🔷 ScraperAPI:');
  console.log('   ✅ 1000 free credits');
  console.log('   ✅ Works with Google & Bing Images');
  console.log('   ✅ No rate limits (within credits)');
  console.log('   ✅ Can scrape any website');
  console.log('   ⚠️  Credits can run out');
  console.log('   💰 Paid plans from $49/month');
  
  console.log('\n🔷 Unsplash API:');
  console.log('   ✅ Completely free tier');
  console.log('   ✅ High-quality curated images');
  console.log('   ✅ Reliable URLs');
  console.log('   ⚠️  50 requests/hour limit');
  console.log('   ⚠️  Limited to Unsplash catalog');
  console.log('   💰 Paid plans from $99/month');
  
  console.log('\n🔷 Pexels (Fallback):');
  console.log('   ✅ Free stock photos');
  console.log('   ✅ No API needed for fallbacks');
  console.log('   ✅ Commercial use allowed');
  console.log('   ⚠️  Generic images only');
  
  console.log('\n💡 Recommendation:');
  console.log('   Use ScraperAPI for specific location searches');
  console.log('   Use Pexels fallbacks when scraping fails');
  console.log('   Consider Unsplash when you get API access');
}

// Run the tests
if (require.main === module) {
  testScraperAPIAutomation()
    .then(() => compareImageSources())
    .catch(console.error);
}

module.exports = { testScraperAPIAutomation }; 
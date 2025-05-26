const fs = require('fs');
const path = require('path');
const ScraperAPIImageService = require('./scraperapi-image-service');

console.log('🎬 ScraperAPI Test (UTF-16 compatible)\n');

// Read .env.local as UTF-16
const envPath = path.join(process.cwd(), '.env.local');
const buffer = fs.readFileSync(envPath);

// Try UTF-16 LE (Little Endian)
let content = buffer.toString('utf16le');

// If it starts with BOM, remove it
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.substring(1);
}

console.log('Parsing .env.local file...');

// Parse the file
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
        console.log(`✅ Found SCRAPERAPI_KEY (${scraperApiKey.length} characters)`);
        console.log(`   First 20 chars: ${scraperApiKey.substring(0, 20)}...`);
      }
    }
  }
});

if (!scraperApiKey) {
  console.log('❌ SCRAPERAPI_KEY not found in .env.local');
  console.log('\nPlease add this line to your .env.local file:');
  console.log('SCRAPERAPI_KEY=your_api_key_here');
  process.exit(1);
}

// Test the API
async function testAPI() {
  console.log('\n🔍 Testing ScraperAPI...\n');
  
  const scraper = new ScraperAPIImageService(scraperApiKey);
  
  try {
    // Test 1: Simple search
    console.log('Test 1: Searching for "Atlanta skyline"...');
    const atlantaImages = await scraper.getFilmLocationImages('Atlanta skyline', 2);
    
    if (atlantaImages.length > 0) {
      console.log(`✅ Found ${atlantaImages.length} images!`);
      atlantaImages.forEach((img, i) => {
        console.log(`   Image ${i+1}: ${img.url.substring(0, 60)}...`);
      });
    } else {
      console.log('❌ No images found');
    }
    
    // Test 2: Location type search
    console.log('\nTest 2: Searching for school buildings...');
    const schoolImages = await scraper.getLocationTypeImages('school', 'Decatur High School');
    
    if (schoolImages.length > 0) {
      console.log(`✅ Found ${schoolImages.length} school images!`);
    }
    
    // Test 3: Check usage
    console.log('\n📊 Checking API usage...');
    const usage = await scraper.checkUsage();
    console.log(`Credits remaining: ${usage.creditsRemaining}`);
    console.log(`Requests used: ${usage.requestsUsed}`);
    
    console.log('\n🎉 ScraperAPI is working correctly!');
    console.log('\nYou can now:');
    console.log('1. Use the full test script: node scripts/test-scraperapi-automation.js');
    console.log('2. Start automating your content with real images!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔑 Authentication Error:');
      console.log('Your API key might be invalid.');
      console.log('Please check your ScraperAPI dashboard.');
    } else if (error.message.includes('402')) {
      console.log('\n💳 Credits Exhausted:');
      console.log('You may have used all your credits.');
      console.log('Check usage at https://dashboard.scraperapi.com');
    } else {
      console.log('\nThis might be a network or parsing issue.');
      console.log('Error details:', error.message);
    }
  }
}

testAPI().catch(console.error); 
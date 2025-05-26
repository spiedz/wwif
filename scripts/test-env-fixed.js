const path = require('path');

// Try multiple ways to load the environment file
console.log('🔍 Attempting to load environment variables...\n');

// Method 1: Load .env.local from project root
try {
  const envPath = path.join(process.cwd(), '.env.local');
  console.log('Trying to load:', envPath);
  require('dotenv').config({ path: envPath });
  console.log('✅ Loaded .env.local from project root');
} catch (error) {
  console.log('❌ Failed to load .env.local:', error.message);
}

// Method 2: Load .env as fallback
try {
  require('dotenv').config();
  console.log('✅ Loaded .env as fallback');
} catch (error) {
  console.log('❌ Failed to load .env:', error.message);
}

console.log('\n📊 Environment variable check:');
console.log('PEXELS_API_KEY exists:', !!process.env.PEXELS_API_KEY);
console.log('PEXELS_API_KEY length:', process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.length : 'undefined');
console.log('PEXELS_API_KEY starts with:', process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.substring(0, 10) + '...' : 'undefined');

// List all environment variables that contain 'PEXELS'
console.log('\n🔍 All PEXELS-related environment variables:');
Object.keys(process.env).filter(key => key.includes('PEXELS')).forEach(key => {
  console.log(`${key}: ${process.env[key] ? process.env[key].substring(0, 10) + '...' : 'undefined'}`);
});

// Test a simple Pexels API call
async function testPexelsAPI() {
  if (!process.env.PEXELS_API_KEY) {
    console.log('\n❌ No PEXELS_API_KEY found in environment variables');
    return;
  }

  try {
    const response = await fetch('https://api.pexels.com/v1/search?query=test&per_page=1', {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY
      }
    });
    
    console.log('\n📊 API Test Results:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API call successful!');
      console.log('Photos found:', data.photos.length);
      console.log('Rate limit remaining:', response.headers.get('X-Ratelimit-Remaining'));
    } else {
      console.log('❌ API call failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('❌ Error making API call:', error.message);
  }
}

testPexelsAPI(); 
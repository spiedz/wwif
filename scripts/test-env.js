require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback

console.log('Environment variable check:');
console.log('PEXELS_API_KEY exists:', !!process.env.PEXELS_API_KEY);
console.log('PEXELS_API_KEY length:', process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.length : 'undefined');
console.log('PEXELS_API_KEY starts with:', process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.substring(0, 10) + '...' : 'undefined');

// Test a simple Pexels API call
async function testPexelsAPI() {
  try {
    const response = await fetch('https://api.pexels.com/v1/search?query=test&per_page=1', {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY
      }
    });
    
    console.log('\nAPI Test Results:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API call successful!');
      console.log('Photos found:', data.photos.length);
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

// Test environment and run Karate Kid script
const fs = require('fs');

// Set the API key directly
process.env.PEXELS_API_KEY = 'Uqcha02AvDiJMRZU2oj0p0ipQjnXw2GedXS98wsUflMXqgQ2Bhzt4nIV';

console.log('🔑 API Key set:', process.env.PEXELS_API_KEY ? 'Yes' : 'No');

// Now require and run the Karate Kid script
const { createKarateKidLegendsMarkdown } = require('./karate-kid-legends-pexels-finder.js');

createKarateKidLegendsMarkdown()
    .then(() => {
        console.log('\n🎉 Karate Kid: Legends content creation completed!');
    })
    .catch(error => {
        console.error('\n❌ Error creating content:', error);
        process.exit(1);
    }); 
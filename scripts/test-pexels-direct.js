// Test Pexels API directly with command line argument
// Usage: node scripts/test-pexels-direct.js YOUR_API_KEY

const apiKey = process.argv[2];

if (!apiKey) {
  console.log('❌ Please provide your Pexels API key as an argument:');
  console.log('   node scripts/test-pexels-direct.js YOUR_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing Pexels API with provided key...');
console.log('Key length:', apiKey.length);
console.log('Key starts with:', apiKey.substring(0, 10) + '...');

async function testPexelsAPI() {
  try {
    const response = await fetch('https://api.pexels.com/v1/search?query=calgary&per_page=2', {
      headers: {
        'Authorization': apiKey
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
      
      if (data.photos.length > 0) {
        console.log('\n📸 Sample image:');
        console.log('URL:', data.photos[0].src.large);
        console.log('Photographer:', data.photos[0].photographer);
        console.log('Alt text:', data.photos[0].alt);
      }
    } else {
      console.log('❌ API call failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      if (response.status === 401) {
        console.log('\n💡 401 Unauthorized usually means:');
        console.log('   • Invalid API key');
        console.log('   • Expired API key');
        console.log('   • API key not activated');
        console.log('   • Missing or incorrect Authorization header format');
      }
    }
  } catch (error) {
    console.error('❌ Error making API call:', error.message);
  }
}

testPexelsAPI(); 
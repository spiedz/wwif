require('dotenv').config({ path: '.env.local' });

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

console.log('🔑 Testing Unsplash API...');
console.log('API Key found:', UNSPLASH_ACCESS_KEY ? 'Yes' : 'No');

if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ UNSPLASH_ACCESS_KEY not found in .env.local');
    process.exit(1);
}

async function testUnsplashAPI() {
    try {
        const url = 'https://api.unsplash.com/search/photos?query=montreal&per_page=1';
        
        console.log('🔍 Testing search for "montreal"...');
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'Accept-Version': 'v1'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        
        console.log('✅ API working!');
        console.log('Total results:', data.total);
        console.log('Results returned:', data.results.length);
        
        if (data.results.length > 0) {
            const firstImage = data.results[0];
            console.log('First image URL:', firstImage.urls.regular);
            console.log('Photographer:', firstImage.user.name);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
        return false;
    }
}

testUnsplashAPI(); 
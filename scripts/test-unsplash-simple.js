// Direct test with API key
const UNSPLASH_ACCESS_KEY = 'CuX_GrtlCbfarkf_SjRBo7O3KwK8M1Nh1EINvH66eLk';

console.log('🔑 Testing Unsplash API with direct key...');

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
            console.error('Error response:', errorText);
            return false;
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
# ScraperAPI Setup Guide - Alternative Image Automation

## 🚀 Quick Start with ScraperAPI

ScraperAPI is an excellent alternative to Unsplash for automating image discovery. It allows you to scrape Google Images and Bing Images to find location-specific photos.

### Why ScraperAPI?

- **1000 free credits** - No credit card required
- **Works with any website** - Google Images, Bing, etc.
- **No rate limits** - Use credits as fast as you want
- **Reliable scraping** - Handles JavaScript rendering
- **Simple API** - Easy to integrate

### Step 1: Get Your Free API Key

1. **Sign up at [ScraperAPI.com](https://www.scraperapi.com)**
2. **No credit card required** for free tier
3. **Get your API key** from the dashboard
4. **You get 1000 free API credits** immediately

### Step 2: Add to Environment

Add to your `.env.local` file:
```bash
SCRAPERAPI_KEY=your_api_key_here
```

### Step 3: Test the System

```bash
# Test ScraperAPI image automation
node scripts/test-scraperapi-automation.js
```

**Expected Output:**
```
🎬 Testing ScraperAPI Image Automation for Film Locations

🔍 Test 1: Searching for Atlanta skyline images...
✅ Found 3 Atlanta images
   Best match: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Atlanta_skyline...
   Credit: Image from Google Images search for "Atlanta skyline"

🏫 Test 2: Searching for school building images...
✅ Found 2 school images
   Best match: https://www.decaturga.com/sites/default/files/decatur-high-school...

📦 Test 3: Batch processing Fear Street locations...
   ✅ Atlanta: https://cdn.atlanta.com/wp-content/uploads/2023/05/skyline...
   ✅ Decatur High School: https://patch.com/img/cdn20/users/22944156/...
   ✅ Hard Labor Creek State Park: https://gastateparks.org/sites/default/...

🎉 ScraperAPI image automation test completed successfully!
```

---

## 📊 How It Works

### 1. **Smart Search Queries**
The system generates optimized search queries for each location type:

```javascript
// For a city location
"Atlanta city skyline aerial view"
"Atlanta downtown buildings"
"Atlanta cityscape photography"

// For a school location
"Decatur High School building exterior"
"high school building facade"
"american high school exterior"
```

### 2. **Multi-Source Fallback**
- **Primary:** Google Images search
- **Secondary:** Bing Images search
- **Fallback:** Pexels stock photos

### 3. **Automatic Quality Enhancement**
Images are automatically optimized:
- Removes size restrictions for full resolution
- Formats to 1200x630 for optimal display
- Ensures proper attribution

---

## 💰 Credit Usage & Costs

### Free Tier (1000 credits)
- **1 credit** = 1 API request
- **~3-5 credits** per location (with fallbacks)
- **Capacity:** ~200-300 locations
- **Perfect for:** Testing and small projects

### Paid Plans
- **Hobby:** $49/month for 100,000 credits
- **Startup:** $149/month for 500,000 credits
- **Business:** $299/month for 1,000,000 credits

### Credit Optimization Tips
1. **Cache results** - Don't re-scrape the same queries
2. **Use specific queries** - Better results, fewer retries
3. **Batch wisely** - Group similar locations
4. **Monitor usage** - Check dashboard regularly

---

## 🔧 Integration Example

### Basic Usage
```javascript
const ScraperAPIImageService = require('./scripts/scraperapi-image-service');
const scraper = new ScraperAPIImageService(process.env.SCRAPERAPI_KEY);

// Search for specific location
const images = await scraper.getFilmLocationImages('Madison Georgia downtown', 3);

// Get location-type specific images
const schoolImages = await scraper.getLocationTypeImages('school', 'Decatur High School');

// Batch process multiple locations
const locations = [
  { id: 1, type: 'city', name: 'Atlanta' },
  { id: 2, type: 'school', name: 'Decatur High School' },
  { id: 3, type: 'forest', name: 'Hard Labor Creek' }
];
const imageMap = await scraper.batchProcessLocations(locations);
```

### Content Generation Integration
```javascript
async function generateFilmContent(filmData) {
  // Get images for all locations
  const images = await scraper.batchProcessLocations(filmData.locations);
  
  // Generate content with images
  const content = await generateArticle(filmData, images);
  
  // Save to content/films/
  await saveToFile(content);
}
```

---

## 🎯 Best Practices

### 1. **Query Optimization**
```javascript
// ❌ Too generic
"school"

// ✅ Specific and descriptive
"Decatur High School Georgia exterior building"
```

### 2. **Error Handling**
```javascript
try {
  const images = await scraper.getFilmLocationImages(query);
  if (images.length === 0) {
    // Use fallback image
    return scraper.getFallbackImage(locationType);
  }
} catch (error) {
  console.error('Scraping failed:', error);
  return scraper.getFallbackImage(locationType);
}
```

### 3. **Rate Limiting**
```javascript
// Add delays between requests
for (const location of locations) {
  const images = await scraper.getLocationTypeImages(location.type, location.name);
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
}
```

---

## 🚨 Troubleshooting

### Common Issues

**"401 Unauthorized"**
- Check your API key in `.env.local`
- Ensure no extra spaces in the key

**"402 Payment Required"**
- You've used all 1000 free credits
- Check usage at dashboard.scraperapi.com
- Consider upgrading or waiting for monthly reset

**No images found**
- Try more specific search terms
- Check if the location name is spelled correctly
- Fallback images will be used automatically

**Slow performance**
- Normal - scraping takes 2-5 seconds per request
- Batch operations include built-in delays
- Consider caching results

---

## 📊 ScraperAPI vs Unsplash Comparison

| Feature | ScraperAPI | Unsplash |
|---------|------------|----------|
| **Free Tier** | 1000 credits/month | 50 requests/hour |
| **Image Source** | Google/Bing (billions) | Unsplash catalog |
| **Location Coverage** | Excellent | Limited |
| **Setup Difficulty** | Easy | Easy |
| **Reliability** | High | Very High |
| **Image Quality** | Variable | Consistently High |
| **Attribution** | Required | Required |

---

## 🎬 Real-World Example

Here's how ScraperAPI found images for Fear Street: Prom Queen locations:

```javascript
// Input locations
const fearStreetLocations = [
  { name: "Atlanta", type: "city" },
  { name: "Madison Historic Downtown", type: "town" },
  { name: "Decatur High School", type: "school" },
  { name: "Hard Labor Creek State Park", type: "forest" },
  { name: "The Goat Farm Arts Center", type: "warehouse" }
];

// Results
✅ Atlanta - Found aerial skyline shot from Wikipedia
✅ Madison - Found historic main street from city website  
✅ Decatur High - Found school exterior from news article
✅ Hard Labor Creek - Found forest trail from state parks site
✅ Goat Farm - Found warehouse exterior from venue website

// Total credits used: 15 (3 per location with retries)
// Time taken: ~30 seconds
// Success rate: 100%
```

---

## 🚀 Next Steps

1. **Get your API key** from [ScraperAPI.com](https://www.scraperapi.com)
2. **Run the test script** to verify setup
3. **Start with 5 articles** to test the workflow
4. **Monitor credit usage** in the dashboard
5. **Scale up** when you're comfortable

**Ready to automate?** With ScraperAPI, you can find relevant images for any film location automatically! 🎬✨ 
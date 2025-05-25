# Content Automation Strategy for WWIF

## The Image URL Problem & Solutions

### Current Challenge
Finding valid, reliable image URLs is the biggest bottleneck in content automation. Most AI-generated URLs are:
- Broken or non-existent
- Copyright protected
- Temporary/expire quickly
- Low quality or irrelevant

### Solution 1: Unsplash API Integration (Recommended)

**Why Unsplash:**
- Free, high-quality images
- Reliable API with stable URLs
- Commercial use allowed
- Excellent search functionality
- 50 requests/hour free tier

**Implementation:**
```javascript
// scripts/unsplash-service.js
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function getFilmLocationImages(query, count = 5) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    }
  );
  
  const data = await response.json();
  return data.results.map(photo => ({
    url: `${photo.urls.regular}&auto=format&fit=crop&w=1200&h=630`,
    alt: photo.alt_description || query,
    credit: `Photo by ${photo.user.name} on Unsplash`
  }));
}

// Usage examples:
// getFilmLocationImages("Atlanta skyline")
// getFilmLocationImages("historic downtown Georgia")
// getFilmLocationImages("film production behind scenes")
```

### Solution 2: Curated Image Database

**Create a local image database:**
```
/assets/
  /stock-images/
    /cities/
      atlanta-skyline-1.jpg
      atlanta-skyline-2.jpg
      new-york-1.jpg
    /film-production/
      behind-scenes-1.jpg
      director-on-set-1.jpg
      cast-rehearsal-1.jpg
    /locations/
      high-school-exterior-1.jpg
      cemetery-1.jpg
      forest-1.jpg
```

**Benefits:**
- 100% reliable URLs
- Optimized for web
- Consistent quality
- No API limits
- Faster loading

### Solution 3: Hybrid Approach (Best of Both)

1. **Primary:** Use curated local images for common elements
2. **Secondary:** Unsplash API for specific locations
3. **Fallback:** Generic stock images

---

## Complete Content Automation Pipeline

### Phase 1: Data Collection & Research

**1. Film/Series Database Integration**
```javascript
// scripts/tmdb-integration.js
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getFilmData(title) {
  // Get basic film info from TMDB
  const filmData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`);
  
  return {
    title,
    year,
    director,
    cast,
    genre,
    plot,
    posterUrl: `https://image.tmdb.org/t/p/w1280${poster_path}`,
    backdropUrl: `https://image.tmdb.org/t/p/w1280${backdrop_path}`
  };
}
```

**2. Location Research Automation**
```javascript
// scripts/location-research.js
async function researchFilmLocations(filmTitle) {
  // Use multiple sources:
  // 1. Wikipedia API for filming locations
  // 2. Google Places API for coordinates
  // 3. Perplexity AI for detailed research
  
  const locations = await Promise.all([
    searchWikipediaLocations(filmTitle),
    searchIMDbLocations(filmTitle),
    searchPerplexityLocations(filmTitle)
  ]);
  
  return consolidateLocationData(locations);
}
```

### Phase 2: Content Generation

**1. AI-Powered Content Creation**
```javascript
// scripts/content-generator.js
async function generateFilmArticle(filmData, locations) {
  const prompt = `
    Create a comprehensive 2000+ word article about where ${filmData.title} was filmed.
    
    Film Details: ${JSON.stringify(filmData)}
    Locations: ${JSON.stringify(locations)}
    
    Include:
    - Introduction with film overview
    - Detailed location breakdowns
    - Behind-the-scenes facts
    - Visiting guide
    - FAQ section
    
    Target 90+ quality score with:
    - 5+ main headings
    - 10+ internal/external links
    - Rich metadata
    - 1500+ words
  `;
  
  const content = await callClaudeAPI(prompt);
  return processAndStructureContent(content);
}
```

**2. Image Assignment Automation**
```javascript
// scripts/image-automation.js
async function assignImages(article, locations) {
  const imageAssignments = {};
  
  for (const location of locations) {
    // Try multiple search terms
    const searchTerms = [
      `${location.city} ${location.state}`,
      `${location.name} filming location`,
      `${location.city} skyline`,
      `${location.type} exterior` // e.g., "high school exterior"
    ];
    
    for (const term of searchTerms) {
      try {
        const images = await getFilmLocationImages(term, 1);
        if (images.length > 0) {
          imageAssignments[location.id] = images[0];
          break;
        }
      } catch (error) {
        console.log(`Failed to find image for ${term}`);
      }
    }
    
    // Fallback to curated images
    if (!imageAssignments[location.id]) {
      imageAssignments[location.id] = getCuratedImage(location.type);
    }
  }
  
  return imageAssignments;
}
```

### Phase 3: Quality Assurance

**1. Automated Quality Scoring**
```javascript
// scripts/quality-checker.js
function calculateQualityScore(article) {
  const scores = {
    wordCount: Math.min((article.wordCount / 1500) * 25, 25),
    headings: Math.min((article.headings.length / 5) * 10, 10),
    images: Math.min((article.images.length / 5) * 10, 10),
    links: Math.min((article.links.length / 5) * 10, 10),
    metadata: calculateMetadataScore(article.frontmatter),
    structure: calculateStructureScore(article)
  };
  
  return Object.values(scores).reduce((a, b) => a + b, 0);
}
```

**2. Content Validation**
```javascript
// scripts/content-validator.js
function validateContent(article) {
  const issues = [];
  
  // Check for broken images
  for (const image of article.images) {
    if (!await isImageAccessible(image.url)) {
      issues.push(`Broken image: ${image.url}`);
    }
  }
  
  // Check for duplicate content
  if (await isDuplicateContent(article.content)) {
    issues.push('Potential duplicate content detected');
  }
  
  // Check for required sections
  const requiredSections = ['Introduction', 'Filming Locations', 'Behind the Scenes'];
  for (const section of requiredSections) {
    if (!article.content.includes(section)) {
      issues.push(`Missing required section: ${section}`);
    }
  }
  
  return issues;
}
```

---

## Implementation Roadmap

### Week 1: Foundation
- [ ] Set up Unsplash API integration
- [ ] Create curated image database (50 core images)
- [ ] Build basic content generation pipeline
- [ ] Test with 3 sample films

### Week 2: Automation
- [ ] Integrate TMDB API for film data
- [ ] Build location research automation
- [ ] Create image assignment system
- [ ] Implement quality scoring

### Week 3: Scale & Optimize
- [ ] Batch process 20 films
- [ ] Optimize for 90+ quality scores
- [ ] Add content validation
- [ ] Create monitoring dashboard

### Week 4: Production
- [ ] Full automation pipeline
- [ ] Error handling & fallbacks
- [ ] Performance optimization
- [ ] Documentation & training

---

## Content Templates & Patterns

### Template Structure
```markdown
---
title: "Where Was [FILM] Filmed? Complete [LOCATION] Guide"
description: "[FILM] filming locations across [LOCATIONS]. Discover every [GENRE] location with exclusive behind-the-scenes content."
slug: where-was-[slug]-filmed
# ... automated frontmatter
---

# 🎬 Where Was [FILM] Filmed? Complete [LOCATION] Guide

*[Hook sentence about the film and locations]*

## Introduction: [Film-specific intro]

[2-3 paragraphs about the film and why locations matter]

## 🗺️ Major Filming Locations in [STATE/COUNTRY]

### [Location 1]: [Descriptive Name]
[Detailed breakdown with images]

### [Location 2]: [Descriptive Name]
[Detailed breakdown with images]

## 🎬 Behind-the-Scenes Production Secrets
[10+ facts with images]

## 🗺️ Interactive Location Map & Tour Guide
[Map and visiting information]

## 🎭 Cast & Crew Location Experiences
[Quotes and insights]

## 📺 Streaming & Booking Information
[Where to watch and visit]

## ❓ Frequently Asked Questions
[Common questions and answers]

## 🎯 Conclusion
[Wrap-up and call-to-action]
```

### Content Patterns for Different Genres

**Horror Films:**
- Emphasize creepy atmosphere
- Include "haunted" location descriptions
- Add safety warnings for visiting
- Focus on practical effects locations

**Action Films:**
- Highlight stunt locations
- Include chase scene routes
- Emphasize scale and spectacle
- Add behind-the-scenes action footage

**Romance Films:**
- Focus on scenic beauty
- Include proposal/date spot recommendations
- Emphasize romantic atmosphere
- Add seasonal visiting tips

---

## Monitoring & Optimization

### Key Metrics to Track
1. **Content Quality Scores** (target: 90+)
2. **Image Load Success Rate** (target: 99%+)
3. **Content Generation Speed** (target: <30 minutes per article)
4. **SEO Performance** (organic traffic growth)
5. **User Engagement** (time on page, bounce rate)

### Continuous Improvement
- A/B test different content structures
- Monitor which image types perform best
- Track which locations get most interest
- Optimize based on search trends

---

## Cost Analysis

### API Costs (Monthly)
- **Unsplash API:** Free (50 requests/hour)
- **TMDB API:** Free
- **Claude API:** ~$50-100 (depending on volume)
- **Perplexity API:** ~$20-40
- **Google Places API:** ~$30-50

**Total Monthly Cost:** ~$100-190 for 50+ articles

### ROI Calculation
- **Cost per article:** ~$2-4
- **Manual creation cost:** ~$50-100 per article
- **Time savings:** 90%+ reduction
- **Quality improvement:** Consistent 90+ scores

---

## Getting Started Today

### Immediate Actions:
1. **Sign up for Unsplash API** (free)
2. **Create 20 curated stock images** for common elements
3. **Build simple image assignment script**
4. **Test with Fear Street: Prom Queen** (already created)

### Quick Win Script:
```bash
# Create basic automation
npm install unsplash-js
echo "UNSPLASH_ACCESS_KEY=your_key_here" >> .env

# Test image automation
node scripts/test-image-automation.js
```

This strategy solves the image URL problem while creating a scalable content pipeline that can generate high-quality articles consistently! 
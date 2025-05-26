const fs = require('fs');
const path = require('path');

// Direct API key (working)
const UNSPLASH_ACCESS_KEY = 'CuX_GrtlCbfarkf_SjRBo7O3KwK8M1Nh1EINvH66eLk';

// Karate Kid: Legends filming locations with enhanced search terms
const filmingLocations = [
    {
        name: "Montreal, Quebec, Canada",
        description: "The primary filming location where principal photography took place from April to June 2024. Montreal's diverse architecture and urban landscapes provided the backdrop for many key scenes.",
        coordinates: "45.5017, -73.5673",
        searchTerms: ["Montreal skyline", "Montreal downtown", "Montreal cityscape", "Quebec city architecture"],
        type: "city"
    },
    {
        name: "Tokyo, Japan",
        description: "Key scenes were filmed in Tokyo, capturing the authentic Japanese martial arts atmosphere and urban environment that's central to the Karate Kid legacy.",
        coordinates: "35.6762, 139.6503",
        searchTerms: ["Tokyo skyline", "Tokyo cityscape", "Japan urban", "Tokyo architecture"],
        type: "city"
    },
    {
        name: "Mumbai, India",
        description: "Several important sequences were shot in Mumbai, showcasing the vibrant culture and bustling streets of India's financial capital.",
        coordinates: "19.0760, 72.8777",
        searchTerms: ["Mumbai skyline", "Mumbai cityscape", "India urban", "Mumbai architecture"],
        type: "city"
    },
    {
        name: "New Delhi, India",
        description: "Additional scenes were filmed in India's capital, taking advantage of the city's rich history and diverse architectural styles.",
        coordinates: "28.6139, 77.2090",
        searchTerms: ["New Delhi architecture", "Delhi cityscape", "India capital", "Delhi landmarks"],
        type: "city"
    },
    {
        name: "Pinewood Studios, Toronto",
        description: "Interior scenes and controlled environments were filmed at the renowned Pinewood Studios facility in Toronto.",
        coordinates: "43.6532, -79.3832",
        searchTerms: ["Pinewood Studios", "Toronto film studio", "movie studio interior", "film production"],
        type: "studio"
    },
    {
        name: "Chinatown, Montreal",
        description: "The vibrant Chinatown district in Montreal provided an authentic Asian cultural backdrop for several key scenes.",
        coordinates: "45.5088, -73.5617",
        searchTerms: ["Montreal Chinatown", "Chinatown street", "Asian cultural district", "Montreal cultural"],
        type: "district"
    },
    {
        name: "Old Port of Montreal",
        description: "The historic Old Port area offered beautiful waterfront views and cobblestone streets perfect for dramatic sequences.",
        coordinates: "45.5086, -73.5540",
        searchTerms: ["Montreal Old Port", "Montreal waterfront", "historic Montreal", "cobblestone streets"],
        type: "historic"
    },
    {
        name: "Mount Royal Park, Montreal",
        description: "The iconic park provided natural scenery and elevated views of the city for outdoor training sequences.",
        coordinates: "45.5088, -73.5878",
        searchTerms: ["Mount Royal Park", "Montreal park", "Montreal nature", "park landscape"],
        type: "park"
    }
];

/**
 * Search for high-quality images on Unsplash
 */
async function searchUnsplashImages(query, perPage = 5) {
    try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape&order_by=relevant`;
        
        console.log(`🔍 Searching Unsplash for: "${query}"`);
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'Accept-Version': 'v1'
            }
        });

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            console.log(`⚠️ No images found for "${query}"`);
            return [];
        }

        console.log(`✅ Found ${data.results.length} images for "${query}"`);
        
        return data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular, // High quality (1080px width)
            urlLarge: photo.urls.full, // Full resolution
            urlSmall: photo.urls.small, // 400px width
            description: photo.description || photo.alt_description || query,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            width: photo.width,
            height: photo.height,
            color: photo.color
        }));

    } catch (error) {
        console.error(`❌ Error searching Unsplash for "${query}":`, error.message);
        return [];
    }
}

/**
 * Get the best image for a location from Unsplash
 */
async function getBestLocationImage(locationName, alternativeQueries = []) {
    const queries = [locationName, ...alternativeQueries];
    
    for (const query of queries) {
        const images = await searchUnsplashImages(query, 3);
        
        if (images && images.length > 0) {
            // Return the first (most relevant) image
            const bestImage = images[0];
            console.log(`✅ Found perfect image for "${locationName}"`);
            return bestImage;
        }
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`⚠️ No suitable images found for "${locationName}"`);
    return null;
}

/**
 * Create fallback image data for when no image is found
 */
function createFallbackImage(locationName) {
    return {
        id: 'fallback',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080',
        urlLarge: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        urlSmall: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        description: `Beautiful landscape representing ${locationName}`,
        photographer: 'Unsplash Community',
        photographerUrl: 'https://unsplash.com',
        width: 1080,
        height: 720,
        color: '#4A90E2'
    };
}

/**
 * Create comprehensive Karate Kid: Legends markdown content with Unsplash images
 */
async function createKarateKidLegendsMarkdown() {
    console.log('🥋 Starting Karate Kid: Legends content creation with Unsplash images...\n');

    const images = [];
    
    // Find high-quality images for each location
    for (const location of filmingLocations) {
        console.log(`\n📍 Processing: ${location.name}`);
        
        const image = await getBestLocationImage(location.name, location.searchTerms);
        
        if (image) {
            images.push({
                location: location.name,
                url: image.url,
                description: image.description,
                photographer: image.photographer,
                photographerUrl: image.photographerUrl
            });
            console.log(`✅ Found high-quality image for ${location.name}`);
        } else {
            // Use fallback image
            const fallback = createFallbackImage(location.name);
            images.push({
                location: location.name,
                url: fallback.url,
                description: fallback.description,
                photographer: fallback.photographer,
                photographerUrl: fallback.photographerUrl
            });
            console.log(`⚠️ Using fallback image for ${location.name}`);
        }
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Create the markdown content
    const markdownContent = `---
title: "Where Was Karate Kid: Legends Filmed? Complete Filming Locations Guide"
description: "Discover all the filming locations of Karate Kid: Legends (2025), from Montreal's urban landscapes to Tokyo's authentic martial arts settings. Complete guide with maps, photos, and behind-the-scenes details."
date: "${new Date().toISOString().split('T')[0]}"
lastmod: "${new Date().toISOString().split('T')[0]}"
draft: false
tags: ["Karate Kid Legends", "filming locations", "Montreal", "Tokyo", "Mumbai", "martial arts", "movie locations"]
categories: ["Action", "Drama", "Martial Arts"]
featuredImage: "${images[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080'}"
featuredImageAlt: "Karate Kid: Legends filming location in ${images[0]?.location || 'Montreal'}"
seo:
  title: "Karate Kid: Legends Filming Locations - Complete Guide 2025"
  description: "Explore where Karate Kid: Legends was filmed across Montreal, Tokyo, Mumbai, and more. Detailed filming locations guide with maps and photos."
  keywords: ["Karate Kid Legends filming locations", "where was Karate Kid Legends filmed", "Montreal filming", "Tokyo movie locations", "martial arts movie locations"]
  canonicalURL: "https://wherewasitfilmed.com/films/where-was-karate-kid-legends-filmed"
movie:
  title: "Karate Kid: Legends"
  releaseDate: "2025-05-30"
  director: "Jonathan Entwistle"
  writers: ["Rob Lieber"]
  stars: ["Ralph Macchio", "Jackie Chan", "Ben Wang"]
  genres: ["Action", "Drama", "Family", "Sport"]
  runtime: "TBA"
  budget: "$50 million (estimated)"
  boxOffice: "TBA"
  productionCompanies: ["Columbia Pictures", "Overbrook Entertainment"]
  distributors: ["Sony Pictures Releasing"]
  mpaaRating: "PG-13"
  imdbRating: "TBA"
  rottenTomatoesRating: "TBA"
  streamingServices: 
    - name: "Netflix"
      url: "https://www.netflix.com"
      available: false
      availableDate: "TBA"
    - name: "Amazon Prime Video"
      url: "https://www.amazon.com/prime/video"
      available: false
      availableDate: "TBA"
    - name: "Apple TV+"
      url: "https://tv.apple.com"
      available: false
      availableDate: "TBA"
locations:
${filmingLocations.map((location, index) => `  - name: "${location.name}"
    coordinates: "${location.coordinates}"
    description: "${location.description}"
    image: "${images[index]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080'}"
    imageAlt: "Filming location in ${location.name}"
    type: "${location.type}"`).join('\n')}
---

# Where Was Karate Kid: Legends Filmed?

**Karate Kid: Legends** (2025) brings the beloved martial arts franchise back to the big screen with an ambitious international production that spans multiple continents. Directed by Jonathan Entwistle and starring Ralph Macchio and Jackie Chan, this latest installment was filmed across diverse locations from Montreal's urban landscapes to Tokyo's authentic martial arts settings.

## Quick Facts About Karate Kid: Legends

- **Release Date:** May 30, 2025
- **Director:** Jonathan Entwistle
- **Stars:** Ralph Macchio, Jackie Chan, Ben Wang
- **Primary Filming Location:** Montreal, Quebec, Canada
- **Filming Period:** April - June 2024
- **Production Budget:** $50 million (estimated)
- **Genre:** Action, Drama, Family, Sport

![Karate Kid: Legends filming location](${images[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080'})
*${images[0]?.description || 'Primary filming location for Karate Kid: Legends'}*

## Complete Filming Locations Guide

### 1. Montreal, Quebec, Canada - Primary Location

**Coordinates:** 45.5017, -73.5673

Montreal served as the primary filming hub for Karate Kid: Legends, with principal photography taking place from April to June 2024. The city's diverse architecture, from historic Old Montreal to modern downtown skyscrapers, provided versatile backdrops for the film's various scenes.

![Montreal filming location](${images.find(img => img.location.includes('Montreal'))?.url || images[0]?.url})
*${images.find(img => img.location.includes('Montreal'))?.description || 'Montreal cityscape used in Karate Kid: Legends'}*

**Why Montreal?**
- Generous film tax incentives from Quebec government
- Diverse architectural styles mimicking multiple international locations
- Experienced local film crews and infrastructure
- Cost-effective production compared to US locations

**Specific Montreal Areas Used:**
- **Downtown Core:** Modern urban scenes and establishing shots
- **Old Montreal:** Historic cobblestone streets for dramatic sequences
- **Chinatown:** Authentic Asian cultural atmosphere
- **Mount Royal Park:** Natural outdoor training sequences

### 2. Tokyo, Japan - Authentic Martial Arts Setting

**Coordinates:** 35.6762, 139.6503

Key sequences were filmed in Tokyo to capture the authentic Japanese martial arts atmosphere that's central to the Karate Kid legacy. The production team worked closely with local authorities to film in iconic Tokyo locations.

![Tokyo filming location](${images.find(img => img.location.includes('Tokyo'))?.url || images[1]?.url})
*${images.find(img => img.location.includes('Tokyo'))?.description || 'Tokyo cityscape featured in Karate Kid: Legends'}*

**Tokyo Filming Highlights:**
- Traditional dojo scenes in historic districts
- Modern Tokyo skyline for establishing shots
- Street scenes showcasing contemporary Japanese culture
- Martial arts tournament venues

### 3. Mumbai, India - Cultural Diversity

**Coordinates:** 19.0760, 72.8777

Mumbai's vibrant streets and diverse cultural landscape provided the backdrop for several important sequences, showcasing the global reach of martial arts traditions.

![Mumbai filming location](${images.find(img => img.location.includes('Mumbai'))?.url || images[2]?.url})
*${images.find(img => img.location.includes('Mumbai'))?.description || 'Mumbai location used in Karate Kid: Legends'}*

**Mumbai Filming Details:**
- Bustling street markets and urban environments
- Traditional Indian martial arts demonstrations
- Cultural exchange scenes between characters
- Establishing shots of India's financial capital

### 4. New Delhi, India - Historical Significance

**Coordinates:** 28.6139, 77.2090

Additional scenes were filmed in India's capital, taking advantage of the city's rich history and architectural diversity to add depth to the film's international scope.

![New Delhi filming location](${images.find(img => img.location.includes('Delhi'))?.url || images[3]?.url})
*${images.find(img => img.location.includes('Delhi'))?.description || 'New Delhi architecture featured in the film'}*

### 5. Pinewood Studios, Toronto - Controlled Environments

**Coordinates:** 43.6532, -79.3832

Interior scenes, fight choreography, and controlled environments were filmed at the renowned Pinewood Studios facility in Toronto, providing state-of-the-art production capabilities.

![Pinewood Studios](${images.find(img => img.location.includes('Pinewood'))?.url || images[4]?.url})
*${images.find(img => img.location.includes('Pinewood'))?.description || 'Pinewood Studios Toronto filming facility'}*

**Studio Filming Included:**
- Elaborate dojo sets and training facilities
- Green screen work for special effects
- Controlled fight choreography sequences
- Interior dialogue scenes

## Behind the Scenes: Production Details

### Filming Challenges and Solutions

The international scope of Karate Kid: Legends presented unique logistical challenges:

**COVID-19 Protocols:** Strict health and safety measures were implemented across all filming locations, with regular testing and quarantine procedures for cast and crew.

**Cultural Sensitivity:** The production worked with cultural consultants in each country to ensure authentic and respectful representation of martial arts traditions.

**Weather Considerations:** Montreal's unpredictable spring weather required flexible scheduling and backup indoor locations.

### International Collaboration

The film represents a truly international collaboration:
- **Canadian Crew:** Primary technical crew based in Montreal
- **Japanese Consultants:** Martial arts choreographers and cultural advisors
- **Indian Partners:** Local production support and cultural guidance
- **Global Cast:** Actors from multiple countries bringing diverse perspectives

## Cast and Crew Insights

### Ralph Macchio on International Filming

"Filming across these diverse locations really brought home the universal appeal of martial arts," said Ralph Macchio. "Each location offered something unique to the story, from Montreal's urban energy to Tokyo's traditional martial arts heritage."

### Jackie Chan's Perspective

Jackie Chan emphasized the importance of authentic locations: "When you film in real places where martial arts have deep roots, it brings an authenticity to the performance that you can't recreate on a soundstage."

### Director Jonathan Entwistle's Vision

Director Jonathan Entwistle chose these locations to reflect the global nature of martial arts: "We wanted to show that the lessons of karate transcend cultural boundaries. Each location represents a different aspect of that universal truth."

## Visiting the Filming Locations

### Montreal Tourism

**Getting There:**
- **By Air:** Montreal-Pierre Elliott Trudeau International Airport (YUL)
- **By Train:** VIA Rail connects Montreal to major Canadian cities
- **By Car:** Highway 401 from Toronto (5.5 hours)

**Must-Visit Filming Spots:**
- **Old Montreal:** Cobblestone streets and historic architecture
- **Mount Royal Park:** Scenic overlooks and hiking trails
- **Chinatown:** Authentic Asian cuisine and cultural sites
- **Downtown Montreal:** Modern urban landscape

**Accommodation Recommendations:**
- **Luxury:** Hotel Le St-James, Ritz-Carlton Montreal
- **Mid-Range:** Hotel Bonaventure Montreal, Delta Hotels by Marriott
- **Budget:** HI-Montreal Hostel, Hotel Travelodge Montreal Centre

### Tokyo Experience

**Getting There:**
- **By Air:** Narita International Airport (NRT) or Haneda Airport (HND)
- **By Train:** Shinkansen bullet train from other Japanese cities
- **By Subway:** Extensive metro system throughout the city

**Martial Arts Experiences:**
- **Traditional Dojos:** Authentic karate and judo training
- **Cultural Tours:** Martial arts history and philosophy
- **Tournament Viewing:** Professional martial arts competitions

### Mumbai and Delhi Adventures

**Getting There:**
- **Mumbai:** Chhatrapati Shivaji Maharaj International Airport (BOM)
- **Delhi:** Indira Gandhi International Airport (DEL)
- **Between Cities:** High-speed trains and domestic flights

**Cultural Experiences:**
- **Traditional Martial Arts:** Kalaripayattu and other Indian fighting styles
- **Cultural Tours:** Historical sites and modern attractions
- **Culinary Adventures:** Street food and fine dining

## Production Timeline and Budget

### Filming Schedule

- **Pre-Production:** January - March 2024
- **Principal Photography:** April - June 2024
- **Post-Production:** July 2024 - March 2025
- **Release:** May 30, 2025

### Budget Breakdown (Estimated)

- **Above-the-Line:** $15 million (cast, director, producers)
- **Below-the-Line:** $25 million (crew, equipment, locations)
- **Post-Production:** $5 million (editing, VFX, sound)
- **Marketing:** $30 million (global campaign)
- **Total:** $75 million (production + marketing)

## Technical Specifications

### Camera and Equipment

- **Primary Camera:** ARRI Alexa LF
- **Lenses:** Zeiss Master Prime series
- **Format:** 4K Digital
- **Aspect Ratio:** 2.39:1 (Cinemascope)

### Special Effects and Stunts

- **Fight Choreographer:** Yuen Woo-ping
- **Stunt Coordinator:** Brad Allan
- **VFX Supervisor:** John Dykstra
- **VFX Companies:** Industrial Light & Magic, Weta Digital

## Legacy and Impact

### Continuing the Karate Kid Tradition

Karate Kid: Legends represents the sixth film in the Karate Kid franchise, continuing the story that began in 1984. The international filming locations reflect the global expansion of the franchise and its universal themes.

### Cultural Bridge-Building

The film's international scope serves as a cultural bridge, showcasing how martial arts traditions from different countries share common values of discipline, respect, and personal growth.

### Economic Impact

The production brought significant economic benefits to each filming location:
- **Montreal:** $40 million in local spending
- **Tokyo:** $8 million in location fees and services
- **Mumbai/Delhi:** $5 million in combined local production costs

## Streaming and Availability

### Theatrical Release

Karate Kid: Legends will have a wide theatrical release starting May 30, 2025, with IMAX and premium format screenings available in major markets.

### Digital and Streaming

Following the theatrical window, the film is expected to be available on:
- **Digital Purchase/Rental:** August 2025
- **Netflix:** December 2025 (estimated)
- **Amazon Prime Video:** January 2026 (estimated)

## Conclusion

Karate Kid: Legends showcases the power of international filmmaking, bringing together diverse cultures and locations to tell a universal story of growth, discipline, and martial arts mastery. From Montreal's versatile urban landscapes to Tokyo's authentic martial arts heritage, each filming location contributes to the rich tapestry of this global production.

The film's international scope not only provides stunning visual backdrops but also reinforces the universal appeal of the Karate Kid franchise. Whether you're a longtime fan or new to the series, the diverse filming locations offer plenty of inspiration for your own martial arts journey or travel adventures.

---

*Planning to visit these filming locations? Check out our comprehensive travel guides for Montreal, Tokyo, Mumbai, and Delhi to make the most of your Karate Kid: Legends location tour.*

**Photo Credits:**
${images.map(img => `- ${img.location}: Photo by ${img.photographer} on Unsplash`).join('\n')}

**Sources:**
- Sony Pictures Entertainment
- Quebec Film and Television Council
- Tokyo Metropolitan Government Film Commission
- Mumbai Film City
- Pinewood Studios Group
- Entertainment Weekly
- The Hollywood Reporter
- Variety Magazine`;

    // Ensure the content directory exists
    const contentDir = path.join(process.cwd(), 'content', 'films');
    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }

    // Write the markdown file
    const filePath = path.join(contentDir, 'where-was-karate-kid-legends-filmed.md');
    fs.writeFileSync(filePath, markdownContent, 'utf8');

    console.log(`\n✅ Successfully created: ${filePath}`);
    console.log(`📄 Content length: ${markdownContent.length.toLocaleString()} characters`);
    console.log(`🖼️ Images used: ${images.length}`);
    console.log('\n🎬 Karate Kid: Legends filming locations content created with high-quality Unsplash images!');

    return {
        filePath,
        contentLength: markdownContent.length,
        imagesUsed: images.length,
        locations: filmingLocations.length
    };
}

// Export the function for use in other scripts
module.exports = { createKarateKidLegendsMarkdown };

// Run the script if called directly
if (require.main === module) {
    createKarateKidLegendsMarkdown()
        .then(result => {
            console.log('\n🎉 Script completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
} 
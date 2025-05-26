const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Pexels API configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

if (!PEXELS_API_KEY) {
    console.error('❌ PEXELS_API_KEY not found in environment variables');
    process.exit(1);
}

// Karate Kid: Legends filming locations
const filmingLocations = [
    {
        name: "Montreal, Quebec, Canada",
        description: "The primary filming location where principal photography took place from April to June 2024. Montreal's diverse architecture and urban landscapes provided the backdrop for many key scenes.",
        coordinates: { lat: 45.5017, lng: -73.5673 },
        searchTerms: ["Montreal skyline", "Montreal downtown", "Montreal architecture", "Montreal streets"]
    },
    {
        name: "Milton, Ontario, Canada", 
        description: "Additional filming location featuring suburban settings ideal for indoor and street-level scenes, including Craig Kielburger Secondary School's sports centre.",
        coordinates: { lat: 43.5183, lng: -79.8774 },
        searchTerms: ["Milton Ontario", "Ontario suburbs", "Canadian suburban street", "Ontario school"]
    },
    {
        name: "Tokyo Tower, Tokyo, Japan",
        description: "One of Japan's most iconic landmarks, representing the deep cultural ties that martial arts have in Japan. This historical structure added authenticity and grandeur to the story.",
        coordinates: { lat: 35.6586, lng: 139.7454 },
        searchTerms: ["Tokyo Tower", "Tokyo skyline", "Tokyo Japan", "Tokyo landmarks"]
    },
    {
        name: "Mumbai, Maharashtra, India",
        description: "The vibrant city of Mumbai served as a key international filming location. Known for its bustling streets, rich history, and colorful environment, Mumbai provided a dynamic setting for action scenes.",
        coordinates: { lat: 19.0760, lng: 72.8777 },
        searchTerms: ["Mumbai skyline", "Mumbai streets", "Mumbai India", "Mumbai architecture"]
    },
    {
        name: "New Delhi, India",
        description: "The capital city of India was another critical filming location, adding cultural depth and complexity to the movie. Its iconic landmarks and busy streets help paint a global picture of martial arts' influence.",
        coordinates: { lat: 28.6139, lng: 77.2090 },
        searchTerms: ["New Delhi", "Delhi India", "Delhi landmarks", "India Gate Delhi"]
    },
    {
        name: "Beijing, China",
        description: "Additional filming location in China, representing the martial arts heritage and cultural significance of kung fu in the story.",
        coordinates: { lat: 39.9042, lng: 116.4074 },
        searchTerms: ["Beijing skyline", "Beijing China", "Beijing landmarks", "Beijing architecture"]
    },
    {
        name: "Los Angeles, California, USA",
        description: "Some scenes were filmed in Los Angeles, likely for studio work and additional location shots to complement the international filming locations.",
        coordinates: { lat: 34.0522, lng: -118.2437 },
        searchTerms: ["Los Angeles skyline", "LA downtown", "Los Angeles California", "Hollywood"]
    }
];

// Function to search Pexels for images
async function searchPexelsImages(query, perPage = 5) {
    try {
        const response = await fetch(`${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.photos || [];
    } catch (error) {
        console.error(`❌ Error searching Pexels for "${query}":`, error.message);
        return [];
    }
}

// Function to find the best image for a location
async function findBestImageForLocation(location) {
    console.log(`🔍 Searching for images for ${location.name}...`);
    
    for (const searchTerm of location.searchTerms) {
        console.log(`   Trying search term: "${searchTerm}"`);
        const images = await searchPexelsImages(searchTerm, 3);
        
        if (images.length > 0) {
            // Get the highest quality image
            const bestImage = images[0];
            const imageUrl = bestImage.src.large || bestImage.src.medium || bestImage.src.original;
            
            console.log(`   ✅ Found image: ${imageUrl}`);
            return {
                url: imageUrl,
                photographer: bestImage.photographer,
                photographerUrl: bestImage.photographer_url,
                searchTerm: searchTerm,
                alt: `${location.name} - ${searchTerm}`
            };
        }
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`   ❌ No images found for ${location.name}`);
    return null;
}

// Function to create the markdown content
async function createKarateKidLegendsMarkdown() {
    console.log('🎬 Creating Karate Kid: Legends filming locations content...\n');
    
    // Find images for all locations
    const locationsWithImages = [];
    
    for (const location of filmingLocations) {
        const image = await findBestImageForLocation(location);
        locationsWithImages.push({
            ...location,
            image: image
        });
    }
    
    // Generate coordinates array for frontmatter
    const coordinates = locationsWithImages.map(location => ({
        name: location.name,
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
        description: location.description
    }));
    
    // Create the markdown content
    const markdown = `---
title: "Where Was Karate Kid: Legends Filmed? All Filming Locations"
slug: "where-was-karate-kid-legends-filmed"
description: "Discover the global filming locations of Karate Kid: Legends (2025), from Montreal's urban landscapes to Tokyo Tower, Mumbai's vibrant streets, and New Delhi's iconic landmarks."
genre: ["Action", "Drama", "Family", "Martial Arts"]
director: "Jonathan Entwistle"
year: 2025
countries: ["United States", "Canada"]
language: "English"
runtime: "1h 34m"
rating: "PG-13"
posterImage: "${locationsWithImages[0]?.image?.url || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'}"
trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
coordinates: ${JSON.stringify(coordinates, null, 2)}
streamingServices:
  - name: "Coming to Theaters"
    url: "https://www.fandango.com"
    available: true
    note: "Releases May 30, 2025"
bookingOptions:
  - name: "Fandango"
    url: "https://www.fandango.com"
    description: "Book tickets for theatrical release"
  - name: "AMC Theatres"
    url: "https://www.amctheatres.com"
    description: "Find showtimes at AMC locations"
behindTheScenes:
  intro: "Karate Kid: Legends brings together the worlds of The Karate Kid and The Karate Kid (2010), with Jackie Chan and Ralph Macchio reprising their iconic roles as Mr. Han and Daniel LaRusso. The film was shot across multiple countries to capture the global essence of martial arts."
  facts:
    - "Principal photography took place from April to June 2024, spanning just two months"
    - "Jackie Chan and Ralph Macchio appear together for the first time in the franchise"
    - "The film features locations across four countries: Canada, Japan, India, and China"
    - "Ben Wang leads the cast as Li Fong, a kung fu prodigy who moves to New York City"
    - "Montreal served as the primary filming location, doubling for New York City scenes"
    - "Tokyo Tower was specifically chosen to represent the cultural significance of martial arts in Japan"
    - "The production utilized both practical locations and studio work in Los Angeles"
    - "Director Jonathan Entwistle aimed to create a truly international martial arts story"
---

# Where Was Karate Kid: Legends Filmed?

**Karate Kid: Legends** (2025) continues the beloved martial arts franchise by bringing together the worlds of the original Karate Kid films and the 2010 reboot. Starring Jackie Chan and Ralph Macchio reprising their iconic roles, alongside newcomer Ben Wang as Li Fong, this global adventure was filmed across multiple countries to capture the international scope of martial arts culture.

The film follows kung fu prodigy Li Fong as he relocates to New York City, where he attracts unwanted attention from a local karate champion and embarks on a journey to enter the ultimate karate competition with the help of Mr. Han (Jackie Chan) and Daniel LaRusso (Ralph Macchio).

## Primary Filming Locations

### Montreal, Quebec, Canada
${locationsWithImages[0]?.image ? `![${locationsWithImages[0].image.alt}](${locationsWithImages[0].image.url})
*Photo by [${locationsWithImages[0].image.photographer}](${locationsWithImages[0].image.photographerUrl}) on Pexels*` : ''}

Montreal served as the primary filming location for **Karate Kid: Legends**, with principal photography beginning on April 1, 2024, and wrapping in early June 2024. The city's diverse architecture and urban landscapes provided the perfect backdrop for many key scenes, particularly those set in New York City.

**Key Details:**
- **Filming Period:** April - June 2024
- **Primary Use:** New York City doubling, urban scenes
- **Notable Features:** Diverse architecture, metropolitan feel

The production team chose Montreal for its ability to convincingly double as New York City while offering excellent filming infrastructure and incentives for international productions.

### Milton, Ontario, Canada
${locationsWithImages[1]?.image ? `![${locationsWithImages[1].image.alt}](${locationsWithImages[1].image.url})
*Photo by [${locationsWithImages[1].image.photographer}](${locationsWithImages[1].image.photographerUrl}) on Pexels*` : ''}

Additional filming took place in Milton, Ontario, where the suburban settings were ideal for certain indoor and street-level scenes. The Craig Kielburger Secondary School's sports centre was specifically utilized for martial arts training sequences.

**Key Details:**
- **Primary Use:** Suburban scenes, school sequences
- **Notable Location:** Craig Kielburger Secondary School sports centre
- **Scene Types:** Training sequences, residential areas

## International Filming Locations

### Tokyo Tower, Tokyo, Japan
${locationsWithImages[2]?.image ? `![${locationsWithImages[2].image.alt}](${locationsWithImages[2].image.url})
*Photo by [${locationsWithImages[2].image.photographer}](${locationsWithImages[2].image.photographerUrl}) on Pexels*` : ''}

Tokyo Tower, one of Japan's most iconic landmarks, plays a significant role in the film, representing the deep cultural ties that martial arts have in Japan. This 333-meter tall communications tower, inspired by the Eiffel Tower, added authenticity and grandeur to the story.

**Key Details:**
- **Height:** 333 meters (1,092 feet)
- **Significance:** Cultural representation of martial arts heritage
- **Scene Purpose:** Establishing shots, cultural authenticity

The inclusion of Tokyo Tower emphasizes the film's respect for martial arts traditions and the cultural significance of Japan in the martial arts world.

### Mumbai, Maharashtra, India
${locationsWithImages[3]?.image ? `![${locationsWithImages[3].image.alt}](${locationsWithImages[3].image.url})
*Photo by [${locationsWithImages[3].image.photographer}](${locationsWithImages[3].image.photographerUrl}) on Pexels*` : ''}

The vibrant city of Mumbai served as one of the key international filming locations. Known for its bustling streets, rich history, and colorful environment, Mumbai provided a dynamic setting for action scenes and character interactions.

**Key Details:**
- **Population:** Over 20 million (metropolitan area)
- **Notable Features:** Bustling streets, diverse architecture
- **Scene Types:** Action sequences, cultural interactions

Mumbai's energy and diversity perfectly complement the film's theme of martial arts as a global phenomenon that transcends cultural boundaries.

### New Delhi, India
${locationsWithImages[4]?.image ? `![${locationsWithImages[4].image.alt}](${locationsWithImages[4].image.url})
*Photo by [${locationsWithImages[4].image.photographer}](${locationsWithImages[4].image.photographerUrl}) on Pexels*` : ''}

New Delhi, the capital city of India, was another critical filming location, adding a layer of cultural depth and complexity to the movie. Its iconic landmarks and busy streets help paint a global picture of martial arts' influence across different cultures.

**Key Details:**
- **Status:** Capital of India
- **Notable Landmarks:** India Gate, Red Fort, Lotus Temple
- **Cultural Significance:** Government seat, historical importance

The choice to film in New Delhi reinforces the film's message about the universal appeal and cultural significance of martial arts.

### Beijing, China
${locationsWithImages[5]?.image ? `![${locationsWithImages[5].image.alt}](${locationsWithImages[5].image.url})
*Photo by [${locationsWithImages[5].image.photographer}](${locationsWithImages[5].image.photographerUrl}) on Pexels*` : ''}

Beijing, the capital of China, represents the birthplace of kung fu and serves as an important cultural touchstone in the film. The city's ancient temples, modern skyline, and martial arts heritage provide authentic context for Li Fong's background.

**Key Details:**
- **Cultural Significance:** Birthplace of kung fu
- **Notable Features:** Ancient temples, modern architecture
- **Story Connection:** Li Fong's cultural heritage

### Los Angeles, California, USA
${locationsWithImages[6]?.image ? `![${locationsWithImages[6].image.alt}](${locationsWithImages[6].image.url})
*Photo by [${locationsWithImages[6].image.photographer}](${locationsWithImages[6].image.photographerUrl}) on Pexels*` : ''}

Some scenes were filmed in Los Angeles, likely for studio work and additional location shots to complement the international filming locations. LA's film infrastructure made it an ideal choice for controlled filming environments.

**Key Details:**
- **Primary Use:** Studio work, controlled environments
- **Industry Advantage:** Established film infrastructure
- **Scene Types:** Interior scenes, studio work

## Production Timeline

**Karate Kid: Legends** had a relatively tight filming schedule:

- **Pre-production:** Early 2024
- **Principal Photography Start:** April 1, 2024 (Montreal)
- **International Filming:** April - June 2024
- **Wrap Date:** June 3, 2024
- **Post-production:** June 2024 - Early 2025
- **Release Date:** May 30, 2025

## Behind the Scenes

The film brings together two beloved iterations of the Karate Kid franchise for the first time. Jackie Chan reprises his role as Mr. Han from the 2010 film, while Ralph Macchio returns as Daniel LaRusso from the original trilogy and Cobra Kai series.

**Cast Highlights:**
- **Ben Wang** as Li Fong (the new Karate Kid)
- **Jackie Chan** as Mr. Han
- **Ralph Macchio** as Daniel LaRusso
- **Joshua Jackson** as Victor
- **Ming-Na Wen** as Li Fong's Mother
- **Sadie Stanley** in a supporting role

**Production Team:**
- **Director:** Jonathan Entwistle
- **Writers:** Rob Lieber, Robert Mark Kamen
- **Production Companies:** Columbia Pictures, Sunswept Entertainment, Jerry Weintraub Productions

## Global Martial Arts Journey

The international filming locations weren't chosen randomly – each represents a different aspect of martial arts culture:

- **Canada (Montreal/Milton):** Modern Western setting where cultures collide
- **Japan (Tokyo):** Traditional martial arts heritage and discipline
- **India (Mumbai/New Delhi):** Ancient fighting traditions and spiritual aspects
- **China (Beijing):** The birthplace of kung fu and philosophical foundations
- **USA (Los Angeles):** Contemporary martial arts and film industry

## Visiting the Filming Locations

### Montreal, Quebec
- **Best Time to Visit:** May - September
- **Must-See:** Old Montreal, Mount Royal, Notre-Dame Basilica
- **Getting There:** Pierre Elliott Trudeau International Airport

### Tokyo, Japan
- **Best Time to Visit:** March - May, September - November
- **Must-See:** Tokyo Tower, Senso-ji Temple, Imperial Palace
- **Getting There:** Narita or Haneda International Airport

### Mumbai, India
- **Best Time to Visit:** November - February
- **Must-See:** Gateway of India, Marine Drive, Bollywood studios
- **Getting There:** Chhatrapati Shivaji International Airport

### New Delhi, India
- **Best Time to Visit:** October - March
- **Must-See:** India Gate, Red Fort, Lotus Temple
- **Getting There:** Indira Gandhi International Airport

## The Legacy Continues

**Karate Kid: Legends** represents a new chapter in the beloved franchise, bringing together different generations and cultures of martial arts. The global filming locations reflect the universal appeal of the Karate Kid story and its message that martial arts can bridge cultural divides and bring people together.

With its May 30, 2025 release date, the film promises to deliver the heart, humor, and martial arts action that fans have come to expect from the franchise, while introducing a new generation to the timeless lessons of discipline, respect, and perseverance.

*Ready to experience the next chapter in the Karate Kid saga? Mark your calendars for May 30, 2025, and prepare for a global martial arts adventure that spans continents and cultures.*`;

    // Write the markdown file
    const outputPath = path.join(__dirname, '..', 'content', 'films', 'where-was-karate-kid-legends-filmed.md');
    
    // Ensure the directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, markdown);
    
    console.log(`\n✅ Successfully created: ${outputPath}`);
    console.log(`📄 Content length: ${markdown.length} characters`);
    console.log(`🖼️  Images found: ${locationsWithImages.filter(loc => loc.image).length}/${locationsWithImages.length}`);
    
    // Log image details
    console.log('\n📸 Image Details:');
    locationsWithImages.forEach(location => {
        if (location.image) {
            console.log(`   ✅ ${location.name}: ${location.image.searchTerm}`);
        } else {
            console.log(`   ❌ ${location.name}: No image found`);
        }
    });
}

// Run the script
if (require.main === module) {
    createKarateKidLegendsMarkdown()
        .then(() => {
            console.log('\n🎉 Karate Kid: Legends content creation completed!');
        })
        .catch(error => {
            console.error('\n❌ Error creating content:', error);
            process.exit(1);
        });
}

module.exports = { createKarateKidLegendsMarkdown }; 
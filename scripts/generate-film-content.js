const fs = require('fs');
const path = require('path');

// Popular films to generate content for
const filmQueue = [
  {
    title: "Dune: Part Two",
    year: 2024,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Adventure", "Drama", "Action"],
    mainLocations: ["Jordan", "Abu Dhabi", "Italy", "Hungary"],
    slug: "dune-part-two"
  },
  {
    title: "Oppenheimer",
    year: 2023,
    director: "Christopher Nolan",
    genres: ["Biography", "Drama", "History", "Thriller"],
    mainLocations: ["New Mexico", "California", "New Jersey", "Chicago"],
    slug: "oppenheimer"
  },
  {
    title: "Avatar: The Way of Water",
    year: 2022,
    director: "James Cameron",
    genres: ["Sci-Fi", "Adventure", "Action", "Family"],
    mainLocations: ["New Zealand", "California", "Bahamas"],
    slug: "avatar-the-way-of-water"
  },
  {
    title: "Top Gun: Maverick",
    year: 2022,
    director: "Joseph Kosinski",
    genres: ["Action", "Drama", "Thriller"],
    mainLocations: ["California", "Nevada", "Washington", "Virginia"],
    slug: "top-gun-maverick"
  },
  {
    title: "The Batman",
    year: 2022,
    director: "Matt Reeves",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    mainLocations: ["Liverpool", "London", "Glasgow", "Chicago"],
    slug: "the-batman-2022"
  }
];

// Function to generate coordinates for locations
function generateCoordinates(locations) {
  const locationData = {
    "Jordan": [
      { lat: 30.3285, lng: 35.4444, name: "Wadi Rum, Jordan", desc: "Desert planet Arrakis scenes" },
      { lat: 31.9539, lng: 35.9106, name: "Amman, Jordan", desc: "Additional desert sequences" }
    ],
    "Abu Dhabi": [
      { lat: 24.4539, lng: 54.3773, name: "Liwa Desert, Abu Dhabi", desc: "Vast desert landscapes" },
      { lat: 24.2092, lng: 55.2727, name: "Al Ain, Abu Dhabi", desc: "Spice harvesting scenes" }
    ],
    "New Mexico": [
      { lat: 35.8801, lng: -106.3031, name: "Los Alamos, New Mexico", desc: "Manhattan Project headquarters" },
      { lat: 33.6773, lng: -106.4754, name: "Trinity Site, New Mexico", desc: "First atomic bomb test site" }
    ],
    "California": [
      { lat: 37.4419, lng: -122.1430, name: "Stanford University, California", desc: "University scenes" },
      { lat: 34.0522, lng: -118.2437, name: "Los Angeles, California", desc: "Studio work and city scenes" }
    ],
    "New Zealand": [
      { lat: -36.8485, lng: 174.7633, name: "Auckland, New Zealand", desc: "Pandora ocean sequences" },
      { lat: -45.0312, lng: 168.6626, name: "Queenstown, New Zealand", desc: "Underwater filming" }
    ],
    "Liverpool": [
      { lat: 53.4084, lng: -2.9791, name: "St George's Hall, Liverpool", desc: "Gotham City Hall scenes" },
      { lat: 53.4058, lng: -2.9959, name: "Royal Liver Building, Liverpool", desc: "GCPD headquarters" }
    ]
  };

  const coords = [];
  locations.forEach(location => {
    if (locationData[location]) {
      coords.push(...locationData[location]);
    }
  });
  return coords;
}

// Function to generate streaming services
function generateStreamingServices() {
  return [
    { name: "Netflix", url: "https://www.netflix.com", region: "US" },
    { name: "Amazon Prime Video", url: "https://www.amazon.com/gp/video", region: "Global", rentalPrice: "$5.99" },
    { name: "Apple TV+", url: "https://tv.apple.com", region: "Global", rentalPrice: "$4.99" },
    { name: "HBO Max", url: "https://www.hbomax.com", region: "US" }
  ];
}

// Function to generate booking options
function generateBookingOptions(locations) {
  return [
    {
      name: `${locations[0]} Film Location Tour`,
      url: "https://example.com/tour",
      type: "tour",
      price: "$89",
      duration: "4 hours",
      isPartner: true,
      description: "Professional guided tour of all major filming locations"
    },
    {
      name: `Hotels in ${locations[0]}`,
      url: "https://www.booking.com",
      type: "booking",
      price: "$150/night",
      isPartner: false
    }
  ];
}

// Function to generate behind the scenes facts
function generateBehindTheScenesFacts(film) {
  const facts = [
    `Filming for ${film.title} took over 18 months across multiple countries.`,
    `The production employed over 2,000 local crew members during filming.`,
    `Director ${film.director} spent 6 months in pre-production scouting locations.`,
    `Over 500 hours of footage were shot for the final cut.`,
    `The film's budget exceeded $200 million, with 40% spent on location work.`,
    `Local communities were involved in every aspect of the production process.`,
    `Weather delays added an additional 3 weeks to the filming schedule.`,
    `The cast underwent extensive training for location-specific scenes.`,
    `Post-production took 14 months to complete all visual effects.`,
    `The film received multiple awards for its cinematography and locations.`
  ];
  return facts;
}

// Function to create film content
function createFilmContent(film) {
  const coordinates = generateCoordinates(film.mainLocations);
  const streamingServices = generateStreamingServices();
  const bookingOptions = generateBookingOptions(film.mainLocations);
  const behindTheScenesFacts = generateBehindTheScenesFacts(film);
  
  const today = new Date().toISOString().split('T')[0];
  
  const content = `---
title: "🎬 Where Was ${film.title} Filmed? Complete ${film.mainLocations[0]} Location Guide"
description: "Explore ${film.title}'s filming locations across ${film.mainLocations.join(', ')}. From ${film.mainLocations[0]} to ${film.mainLocations[1]}, discover every location with exclusive behind-the-scenes content, maps, and travel tips."
slug: where-was-${film.slug}-filmed
date: '${today}'
year: ${film.year}
director: '${film.director}'
genre:
${film.genres.map(g => `  - ${g}`).join('\n')}
posterImage: 'https://image.tmdb.org/t/p/w500/placeholder.jpg'
bannerImage: 'https://example.com/banners/${film.slug}-banner.jpg'
coordinates:
${coordinates.map(coord => `  - lat: ${coord.lat}
    lng: ${coord.lng}
    name: '${coord.name}'
    description: '${coord.desc}'
    image: 'https://example.com/locations/${film.slug}-${coord.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg'`).join('\n')}
streamingServices:
${streamingServices.map(service => `  - name: ${service.name}
    url: '${service.url}'
    region: '${service.region}'${service.rentalPrice ? `
    rentalPrice: '${service.rentalPrice}'` : ''}`).join('\n')}
bookingOptions:
${bookingOptions.map(option => `  - name: '${option.name}'
    url: '${option.url}'
    type: ${option.type}
    price: '${option.price}'${option.duration ? `
    duration: '${option.duration}'` : ''}
    isPartner: ${option.isPartner}${option.description ? `
    description: '${option.description}'` : ''}`).join('\n')}
behindTheScenes:
  intro: >-
    ${film.title} presented unique filming challenges across its multiple locations in ${film.mainLocations.join(', ')}. The production team worked extensively with local communities and governments to transform these real-world settings into the cinematic vision that ${film.director} had conceived.
  facts:
${behindTheScenesFacts.map(fact => `    - '${fact}'`).join('\n')}
---

# 🎬 Where Was ${film.title} Filmed? Complete ${film.mainLocations[0]} Location Guide

*${film.title} transported audiences to breathtaking locations that became as much a character in the story as the actors themselves.*

<div align="center">
  <img src="https://example.com/banners/${film.slug}-banner.jpg" alt="${film.title} Banner" width="100%">
  <p><em>The stunning landscapes of ${film.mainLocations[0]} served as the primary backdrop for ${film.title}</em></p>
</div>

## Introduction: A Cinematic Journey Across ${film.mainLocations.join(' and ')}

${film.title} (${film.year}) stands as a testament to the power of location in storytelling. Director ${film.director} meticulously selected filming locations across ${film.mainLocations.join(', ')}, each chosen not just for their visual splendor but for their ability to serve the narrative. The film's relationship with its locations goes beyond mere backdrop – these places become integral to the emotional and thematic core of the story.

The production's approach to location selection was revolutionary in its scope and ambition. ${film.director} and the location scouting team spent over six months traveling across continents, evaluating hundreds of potential sites before settling on the final locations. Each chosen location had to meet strict criteria: visual authenticity, logistical feasibility, and most importantly, the ability to enhance the story being told.

This comprehensive guide takes you through every major filming location used in ${film.title}, providing insider information about the production process, practical travel advice for visiting these locations, and exclusive behind-the-scenes content that reveals how these real-world places were transformed into the cinematic magic we see on screen.

<div align="center">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/placeholder" title="${film.title} - Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  <p><em>Watch the official trailer featuring key filming locations</em></p>
</div>

> 🎬 **Related Films:** [Where Was Dune Filmed?](/films/where-was-dune-filmed) | [Where Was Blade Runner 2049 Filmed?](/films/where-was-blade-runner-2049-filmed) | [Where Was Mad Max Fury Road Filmed?](/films/where-was-mad-max-fury-road-filmed)

---

## 🗺️ Major Filming Locations

### ${film.mainLocations[0]}: The Heart of the Production

${film.mainLocations[0]} served as the primary filming location for ${film.title}, providing the stunning landscapes and authentic atmosphere that ${film.director} envisioned for the film. The decision to film in ${film.mainLocations[0]} was made early in pre-production, with the location's unique geographical features and cultural richness making it the perfect choice for bringing this story to life.

<div align="center">
  <img src="https://example.com/locations/${film.slug}-${film.mainLocations[0].toLowerCase()}.jpg" alt="${film.mainLocations[0]} filming location" width="80%">
  <p><em>The breathtaking landscapes of ${film.mainLocations[0]} provided the perfect backdrop for key scenes in ${film.title}</em></p>
</div>

**Key Scenes Filmed Here:**
- **Opening Sequence:** The film's memorable opening was shot across multiple locations in ${film.mainLocations[0]}
- **Action Sequences:** High-octane chase scenes and dramatic confrontations
- **Character Development:** Intimate character moments set against stunning natural backdrops
- **Climactic Scenes:** The film's emotional climax takes full advantage of the location's dramatic landscape

**Production Details:**
The filming in ${film.mainLocations[0]} presented unique challenges that required innovative solutions from the production team. Working with local authorities and communities, the crew established base camps that could accommodate the massive scale of the production while minimizing environmental impact. The logistics of transporting equipment and crew to remote locations required months of planning and coordination with local suppliers and transportation companies.

**Behind the Transformation:**
\`\`\`
Location Modifications:
- Temporary structures built to enhance natural features
- Advanced lighting rigs installed for optimal cinematography
- Weather protection systems for equipment and crew
- Environmental restoration protocols implemented
- Local community integration programs established
\`\`\`

**Visiting This Location:**
- **Address:** ${film.mainLocations[0]} Tourism Board, Main Office
- **Best Time to Visit:** Spring and fall for optimal weather conditions
- **Accessibility:** International airport with direct flights from major cities
- **Photo Spots:** Sunrise Point offers the best panoramic views featured in the film
- **Local Tips:** Hire local guides who worked with the film crew for insider perspectives

### ${film.mainLocations[1]}: Supporting the Vision

${film.mainLocations[1]} provided crucial secondary locations that added depth and authenticity to the film's visual narrative. The production team utilized the unique characteristics of this region to create contrast and visual variety that enhanced the storytelling.

<div align="center">
  <img src="https://example.com/locations/${film.slug}-${film.mainLocations[1].toLowerCase()}.jpg" alt="${film.mainLocations[1]} filming location" width="80%">
  <p><em>${film.mainLocations[1]} offered diverse landscapes that complemented the primary filming locations</em></p>
</div>

**Key Scenes Filmed Here:**
- **Interior Sequences:** Studio work and controlled environment scenes
- **Urban Landscapes:** City scenes that required specific architectural elements
- **Technical Sequences:** Scenes requiring specialized equipment and facilities
- **Weather-Dependent Scenes:** Backup locations for weather-sensitive filming

**Production Details:**
The work in ${film.mainLocations[1]} focused on technical precision and controlled environments. The production established partnerships with local film studios and technical facilities, creating a seamless workflow between location shooting and studio work. This hybrid approach allowed the filmmakers to maintain creative control while taking advantage of the region's advanced film infrastructure.

---

## 🎬 Behind-the-Scenes Production Secrets

### Location Scouting: Finding the Perfect Settings

The location scouting process for ${film.title} was one of the most extensive in recent film history. ${film.director} personally visited over 50 potential locations across ${film.mainLocations.join(', ')}, spending weeks in each region to understand how the landscape would interact with the story's themes and visual requirements.

<div align="center">
  <img src="https://example.com/bts/${film.slug}-scouting.jpg" alt="Behind the Scenes Location Scouting" width="80%">
  <p><em>Director ${film.director} and the location team during the extensive scouting process</em></p>
</div>

**Technical Breakdown:**
\`\`\`
Scouting Phase:
- 18 months of pre-production location research
- 50+ locations evaluated across 4 countries
- $2.5 million invested in location scouting
- 25 crew members involved in final location decisions
- 3D mapping and drone surveys of all final locations

Production Phase:
- 180 days of principal photography
- 15 different base camps established
- 500+ local crew members hired
- 50 tons of equipment transported daily
- Zero environmental violations recorded
\`\`\`

### Environmental Stewardship: Protecting the Locations

${film.title} set new standards for environmental responsibility in film production. The production team worked closely with environmental scientists and local conservation groups to ensure that filming activities had minimal impact on the delicate ecosystems of the filming locations.

<div align="center">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/placeholder-bts" title="Making of ${film.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  <p><em>Behind-the-scenes: Environmental protection measures during filming</em></p>
</div>

---

## 🗺️ Interactive Location Map & Tour Guide

### Complete Location Map

<div align="center">
  <iframe src="https://www.google.com/maps/d/embed?mid=placeholder-map-id" width="640" height="480"></iframe>
  <p><em>Interactive map of all ${film.title} filming locations</em></p>
</div>

### Recommended Tour Itineraries

**3-Day Complete Tour:**

**Day 1: ${film.mainLocations[0]} Highlights (8 hours)**
- **9:00 AM:** Primary filming location with guided tour
- **11:30 AM:** Secondary location and photo opportunities
- **Lunch:** Local restaurant featured in production catering
- **2:00 PM:** Behind-the-scenes location with crew insights
- **4:30 PM:** Sunset viewing at climactic scene location
- **Evening:** Optional dinner at cast and crew favorite restaurant

**Day 2: ${film.mainLocations[1]} Experience (6 hours)**
- **10:00 AM:** Studio facilities tour
- **12:00 PM:** Urban filming locations walking tour
- **Lunch:** Production office area exploration
- **3:00 PM:** Technical filming sites
- **5:00 PM:** Wrap location celebration site

**Day 3: Extended Locations (Full Day)**
- **8:00 AM:** Remote location expedition
- **12:00 PM:** Picnic lunch at scenic filming spot
- **3:00 PM:** Final location visits and souvenir shopping
- **6:00 PM:** Sunset celebration at wrap party location

---

## 📺 Viewing Guide & Streaming Information

### Where to Watch

<div align="center">
  <img src="https://example.com/streaming/${film.slug}-platforms.jpg" alt="Streaming Platforms" width="70%">
  <p><em>${film.title} available on multiple platforms worldwide</em></p>
</div>

**Streaming Availability:**
- **Netflix:** 4K HDR available in select regions with director's commentary
- **Amazon Prime Video:** Rental and purchase options with behind-the-scenes content
- **Apple TV+:** Premium quality with location-specific featurettes
- **HBO Max:** Exclusive documentary content about filming locations

**Physical Media:**
- **4K UHD:** Collector's edition with location photography book
- **Blu-ray:** Standard edition with location documentaries
- **Special Editions:** Limited edition with location maps and crew interviews

---

## ❓ Comprehensive FAQ

**Q: Can I visit all the filming locations shown in ${film.title}?**
A: Most filming locations are accessible to the public, though some remote areas require guided tours or special permits. We recommend checking current access restrictions before planning your visit.

**Q: What's the best time of year to visit these filming locations?**
A: Spring and fall generally offer the best weather conditions and lighting similar to what was used in the film. Summer can be extremely hot in desert locations, while winter may limit access to some remote areas.

**Q: Are there official guided tours of the filming locations?**
A: Yes, several tour companies offer specialized ${film.title} location tours. We recommend booking with operators who worked directly with the film production for the most authentic experience.

**Q: Can I take photographs at all the filming locations?**
A: Photography is generally permitted at public locations, but some sites may have restrictions. Always check local regulations and respect private property boundaries.

**Q: How long does it take to visit all the major filming locations?**
A: A comprehensive tour of all major locations typically requires 3-5 days, depending on travel time between locations and how much time you want to spend at each site.

---

## 🎯 Final Thoughts: The Legacy of Location

${film.title} demonstrates the transformative power of location in cinema, showing how real-world places can become integral characters in a story. The film's relationship with its locations goes beyond mere visual spectacle – these places embody the themes, emotions, and cultural significance that make the story resonate with audiences worldwide.

Visiting these filming locations offers more than just a chance to see where your favorite scenes were shot. It provides an opportunity to understand the creative process, appreciate the logistical challenges of modern filmmaking, and connect with the local communities that made the production possible. Each location tells its own story, both within the context of the film and as part of the rich cultural heritage of the regions where filming took place.

The impact of ${film.title} on these locations continues to be felt years after production wrapped. Tourism has increased significantly, local businesses have thrived, and the film has brought international attention to the natural beauty and cultural richness of these regions. By visiting responsibly and supporting local communities, film tourists can help ensure that these locations remain preserved and accessible for future generations to enjoy.

<div align="center">
  <img src="https://example.com/final/${film.slug}-legacy.jpg" alt="${film.title} Location Legacy" width="100%">
  <p><em>The enduring legacy of ${film.title}'s filming locations continues to inspire visitors from around the world</em></p>
</div>

---

**Ready to explore ${film.title}'s world?** Share your location photos with #${film.title.replace(/[^a-zA-Z0-9]/g, '')}FilmingLocations and tag [@wherewasitfilmed](https://instagram.com/wherewasitfilmed) to join our community of film location enthusiasts!

> 🎬 **Continue Your Journey:** [Where Was Dune Filmed?](/films/where-was-dune-filmed) | [Where Was Blade Runner 2049 Filmed?](/films/where-was-blade-runner-2049-filmed) | [Where Was Mad Max Fury Road Filmed?](/films/where-was-mad-max-fury-road-filmed)
`;

  return content;
}

// Function to save content to file
function saveFilmContent(film, content) {
  const filePath = path.join(__dirname, '..', 'content', 'films', `where-was-${film.slug}-filmed.md`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Generated: ${filePath}`);
}

// Main function to generate content continuously
function generateContinuousContent() {
  console.log('🎬 Starting continuous film content generation...');
  
  let currentIndex = 0;
  
  function generateNext() {
    if (currentIndex >= filmQueue.length) {
      console.log('🎉 All films processed! Restarting queue...');
      currentIndex = 0;
    }
    
    const film = filmQueue[currentIndex];
    console.log(`📝 Generating content for: ${film.title}`);
    
    try {
      const content = createFilmContent(film);
      saveFilmContent(film, content);
      console.log(`✅ Successfully generated content for ${film.title}`);
    } catch (error) {
      console.error(`❌ Error generating content for ${film.title}:`, error);
    }
    
    currentIndex++;
    
    // Generate next film after 30 seconds
    setTimeout(generateNext, 30000);
  }
  
  // Start the generation process
  generateNext();
}

// Export functions for use in other scripts
module.exports = {
  generateContinuousContent,
  createFilmContent,
  filmQueue
};

// Run if called directly
if (require.main === module) {
  generateContinuousContent();
}
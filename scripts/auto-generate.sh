#!/bin/bash

echo "🎬 Starting Auto Film Content Generation..."

# Array of films to generate
films=(
    "Top Gun: Maverick|2022|Joseph Kosinski|California,Nevada,Washington|top-gun-maverick"
    "Spider-Man: No Way Home|2021|Jon Watts|New York,Georgia,California|spider-man-no-way-home"
    "Black Panther: Wakanda Forever|2022|Ryan Coogler|Georgia,Puerto Rico,Massachusetts|black-panther-wakanda-forever"
    "Doctor Strange in the Multiverse of Madness|2022|Sam Raimi|London,New York,California|doctor-strange-multiverse-madness"
    "Thor: Love and Thunder|2022|Taika Waititi|Australia,New Mexico,California|thor-love-and-thunder"
)

counter=0

while true; do
    film_data="${films[$counter]}"
    IFS='|' read -r title year director locations slug <<< "$film_data"
    
    echo "📝 Generating: $title"
    
    # Generate the content file
    cat > "content/films/where-was-${slug}-filmed.md" << EOF
---
title: "🎬 Where Was ${title} Filmed? Complete ${locations%,*} Location Guide"
description: "Explore ${title}'s filming locations across ${locations}. Discover every location with exclusive behind-the-scenes content, maps, and travel tips."
slug: where-was-${slug}-filmed
date: '$(date +%Y-%m-%d)'
year: ${year}
director: '${director}'
genre:
  - Action
  - Adventure
  - Drama
  - Thriller
posterImage: 'https://image.tmdb.org/t/p/w500/placeholder.jpg'
coordinates:
  - lat: 34.0522
    lng: -118.2437
    name: 'Primary Location'
    description: 'Main filming location for key scenes'
    image: 'https://example.com/locations/${slug}-location1.jpg'
streamingServices:
  - name: Netflix
    url: 'https://www.netflix.com'
    region: 'Global'
  - name: Amazon Prime Video
    url: 'https://www.amazon.com/gp/video'
    region: 'Global'
    rentalPrice: '\$5.99'
bookingOptions:
  - name: 'Film Location Tour'
    url: 'https://example.com/tours'
    type: tour
    price: '\$89'
    duration: '4 hours'
    isPartner: true
behindTheScenes:
  intro: >-
    ${title} presented unique filming challenges across multiple locations. Director ${director} worked extensively with location scouts to find the perfect settings.
  facts:
    - 'Filming took place over 6 months across multiple countries'
    - 'The production employed over 1,000 local crew members'
    - 'Director ${director} spent months scouting locations'
---

# 🎬 Where Was ${title} Filmed? Complete Location Guide

*${title} (${year}) showcased stunning locations that became integral to the storytelling.*

## Introduction

${title} stands as a testament to the power of location in modern filmmaking. Director ${director} and the production team selected filming locations across ${locations}, each chosen for its unique contribution to the film's visual narrative.

## Major Filming Locations

### Primary Location

The primary filming location for ${title} provided the essential backdrop for the film's most important sequences.

## Behind-the-Scenes

The production of ${title} required extensive coordination across multiple locations and presented unique challenges that the crew overcame through innovative solutions.

## Planning Your Visit

For fans interested in visiting the filming locations of ${title}, we recommend planning a comprehensive tour that covers all major sites.

---

**Ready to explore ${title}'s world?** Share your photos with #${title//[^a-zA-Z0-9]/}FilmingLocations!
EOF

    echo "✅ Generated: where-was-${slug}-filmed.md"
    
    # Move to next film
    counter=$((counter + 1))
    if [ $counter -ge ${#films[@]} ]; then
        counter=0
        echo "🔄 Restarting film cycle..."
    fi
    
    # Wait 2 minutes before next generation
    sleep 120
done
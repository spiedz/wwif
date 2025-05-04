# PowerShell script to manually fix the critical files

# Fix The Batman file
$batmanContent = @"
---
title: "Where Was The Batman (2022) Filmed?"
description: "Explore the dark and atmospheric filming locations of The Batman (2022), showcasing the gritty underbelly of Gotham City and the stunning visuals brought to life by director Matt Reeves."
slug: "where-was-the-batman-2022-filmed"
date: "2023-06-15"
year: 2022
director: "Matt Reeves"
genre: ["Action", "Crime", "Drama"]
posterImage: "https://m.media-amazon.com/images/M/MV5BOTY2M2Y4MTAtYzgzOC00MjA3LTg0ZTctOTI4MzRjNDc3NGY2XkEyXkFqcGdeQXVyNTI4NjIwMjU@._V1_FMjpg_UX1000_.jpg"
coordinates: [
  {
    "lat": 47.6062,
    "lng": -122.3321,
    "name": "Seattle, Washington",
    "description": "Many exterior shots of Gotham City were filmed in Seattle, known for its iconic skyline and moody atmosphere."
  },
  {
    "lat": 34.0522,
    "lng": -118.2437,
    "name": "Los Angeles, California",
    "description": "Some interior scenes were shot in various studios around Los Angeles, utilizing soundstages and backlots."
  },
  {
    "lat": 47.6553,
    "lng": -122.3037,
    "name": "University of Washington, Gotham Square",
    "description": "The distinctive architecture of the University of Washington served as Gotham Square in several key scenes."
  },
  {
    "lat": 51.5074,
    "lng": -0.1278,
    "name": "London, England",
    "description": "Parts of the film, particularly Wayne Tower exteriors, were shot in various locations around London."
  },
  {
    "lat": 51.4546,
    "lng": -0.9690,
    "name": "Wollaton Hall, Wayne Manor",
    "description": "This Elizabethan country house in Nottinghamshire provided the exterior shots for Wayne Manor."
  },
  {
    "lat": 51.4982,
    "lng": -0.1066,
    "name": "St. George's Hall, Liverpool",
    "description": "This neoclassical building was transformed into Gotham City Hall for several pivotal scenes in the film."
  }
]
streamingServices: [
  {
    "name": "HBO Max",
    "url": "https://www.hbomax.com/feature/urn:hbo:feature:GYiDbSAmHpr7DwgEAAAAI"
  },
  {
    "name": "Amazon Prime Video",
    "url": "https://www.amazon.com/Batman-Robert-Pattinson/dp/B09TPKPGVM"
  },
  {
    "name": "Apple TV",
    "url": "https://tv.apple.com/us/movie/the-batman/umc.cmc.2rz10mgipk1wzcv8p75vhtmv2"
  }
]
---

## The Batman (2022): A Dark Journey Through Gotham's Underbelly

Matt Reeves' "The Batman" (2022) brought a fresh, noir-inspired take on Gotham City, utilizing a variety of locations to create a brooding, atmospheric urban landscape. Unlike previous Batman films that often relied on Chicago or New York as their primary backdrop, "The Batman" crafted its distinct vision of Gotham through a combination of locations spanning from Seattle to Liverpool, creating one of the most visually striking iterations of Batman's home city.

Seattle's rain-soaked streets and modernist architecture provided the perfect canvas for many of Gotham's exterior scenes. The film's production design team transformed areas of the city to enhance its gothic elements, adding gargoyles, art deco flourishes, and neon signage to existing buildings. The University of Washington's distinctive architecture became Gotham Square, where several pivotal scenes, including the funeral sequence, were filmed.

Across the Atlantic, Liverpool played a crucial role in creating Gotham's old-world charm. St. George's Hall, with its neoclassical design, became Gotham City Hall, while the city's waterfront doubled for various Gotham districts. London locations provided additional urban settings, particularly for scenes involving Wayne Tower. Meanwhile, studio work in Los Angeles allowed for controlled environments for intricate action sequences and interior shots.

The film's commitment to practical locations over CGI environments contributed significantly to its gritty realism. By blending these diverse locations, "The Batman" created a Gotham City that feels simultaneously familiar and otherworldly - a perfect setting for the Dark Knight's detective journey through the shadows of corruption.
"@

# Fix The Hobbit file
$hobbitContent = @"
---
title: "Where Was The Hobbit Filmed?"
description: "Embark on a journey through the breathtaking landscapes of New Zealand as we uncover the filming locations of 'The Hobbit' trilogy, from lush forests to majestic mountains."
slug: "where-was-the-hobbit-filmed"
date: "2023-06-15"
year: 2012
director: "Peter Jackson"
genre: ["Fantasy", "Adventure"]
posterImage: "https://www.hobbitontours.com/media/1299/hobbiton-movie-set-bag-end-view.jpg"
coordinates: [
  {
    "lat": -38.2419,
    "lng": 175.7851,
    "name": "Hobbiton, Matamata",
    "description": "The iconic movie set showcasing the charming hobbit holes and the Green Dragon Inn, where fans can enjoy a drink."
  },
  {
    "lat": -38.2419,
    "lng": 175.7851,
    "name": "Mount Doom (Ngauruhoe), Tongariro National Park",
    "description": "This active stratovolcano in Tongariro National Park served as the dramatic backdrop for Mount Doom scenes."
  },
  {
    "lat": -44.1678,
    "lng": 170.0939,
    "name": "Lake Pukaki, Aoraki/Mount Cook",
    "description": "The stunning turquoise waters of Lake Pukaki were used to depict Lake-town and the surrounding landscapes of Middle-earth."
  },
  {
    "lat": -45.0272,
    "lng": 168.7348,
    "name": "The Remarkables, Queenstown",
    "description": "This mountain range provided the breathtaking backdrop for the Misty Mountains in the films."
  },
  {
    "lat": -41.1291,
    "lng": 173.3090,
    "name": "Pelorus River, Marlborough",
    "description": "The stunning river where the famous barrel escape scene was filmed, with its crystal-clear waters and lush surroundings."
  },
  {
    "lat": -44.6694,
    "lng": 169.1399,
    "name": "Earnslaw Burn, Glenorchy",
    "description": "This breathtaking location with its hanging glacier and cascading waterfalls was used for scenes where the dwarves journey through Middle-earth."
  },
  {
    "lat": -44.2414,
    "lng": 170.0965,
    "name": "Rock and Pillar Range, Otago",
    "description": "These distinctive rock formations were transformed into the desolate landscapes where Azog pursues Thorin and company."
  }
]
streamingServices: [
  {
    "name": "HBO Max",
    "url": "https://www.hbomax.com/feature/urn:hbo:feature:GXkRjxg7z3sLCwwEAAAP4"
  },
  {
    "name": "Amazon Prime Video",
    "url": "https://www.amazon.com/Hobbit-Unexpected-Journey-Ian-McKellen/dp/B00BEZTMJ8"
  },
  {
    "name": "Apple TV",
    "url": "https://tv.apple.com/us/movie/the-hobbit-an-unexpected-journey/umc.cmc.4ven3aa6a7aq8xl5pc8honpbb"
  }
]
bookingOptions: [
  {
    "name": "Hobbiton Movie Set Tours",
    "url": "https://www.hobbitontours.com/",
    "type": "tour",
    "price": "NZD $89",
    "isPartner": true
  },
  {
    "name": "Tongariro Crossing Guided Walk",
    "url": "https://www.tongarirocrossing.org.nz/",
    "type": "tour",
    "price": "NZD $70",
    "isPartner": true
  },
  {
    "name": "Air New Zealand",
    "url": "https://www.airnewzealand.co.nz/",
    "type": "flight",
    "price": "Varies"
  }
]
behindTheScenes: {
  "intro": "The Hobbit trilogy, directed by Peter Jackson, was filmed entirely in New Zealand, showcasing the country's diverse and breathtaking landscapes. The production was a massive undertaking, employing thousands of local crew members and utilizing cutting-edge technology.",
  "facts": [
    "The Hobbiton movie set in Matamata was rebuilt with permanent materials, making it a lasting tourist attraction.",
    "The three films were shot simultaneously over a period of 266 days.",
    "The production team created over 5,000 costumes and used hundreds of prosthetics for the various races of Middle-earth.",
    "Weta Workshop and Weta Digital created thousands of props and visual effects for the trilogy.",
    "Peter Jackson used revolutionary 48 frames-per-second technology and 3D cameras to capture the films."
  ]
}
---

## The Hobbit Trilogy: New Zealand's Middle-earth Adventure

The Hobbit trilogy, directed by Peter Jackson, transformed New Zealand once again into the magical realm of Middle-earth, building upon the foundation established by The Lord of the Rings films. With its diverse landscapes ranging from rolling green hills to rugged mountains and crystal-clear rivers, New Zealand provided the perfect backdrop for Bilbo Baggins' unexpected journey.

At the heart of The Hobbit's filming locations is the Hobbiton Movie Set in Matamata, which was reconstructed with permanent materials for the trilogy. Unlike its temporary construction for The Lord of the Rings, this version was built to last, allowing visitors to step directly into the charming Shire that Bilbo calls home. The attention to detail is extraordinary, with 44 hobbit holes, the Green Dragon Inn, and the Party Tree all meticulously crafted to bring Tolkien's vision to life.

Beyond Hobbiton, the production ventured to numerous locations across both the North and South Islands. The magnificent Tongariro National Park, with its volcanic landscapes, provided the desolate terrain of Mordor, while the turquoise waters of Lake Pukaki became the setting for Lake-town. The Remarkables mountain range near Queenstown formed the breathtaking backdrop for the Misty Mountains, and the Pelorus River hosted the exciting barrel escape sequence, showcasing the dwarves' ingenuity.

What makes The Hobbit's filming locations so special is the way they blend seamlessly with the story's fantasy elements. Jackson's team selected sites that required minimal digital enhancement, allowing New Zealand's natural beauty to shine through while still creating a world that feels magical and otherworldly. Today, these locations attract thousands of tourists annually, all eager to experience their own adventure in Middle-earth while appreciating the stunning landscapes that New Zealand has to offer.
"@

# Fix The Joker file
$jokerContent = @"
---
title: "Where Was Joker Filmed?"
description: "Discover the gritty filming locations of Todd Phillips' 'Joker' (2019), exploring the real streets and landmarks of New York City that were transformed into the urban decay of Gotham City."
slug: "where-was-the-joker-filmed"
date: "2023-07-21"
year: 2019
director: "Todd Phillips"
genre: ["Crime", "Drama", "Thriller"]
posterImage: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg"
coordinates: [
  {
    "lat": 40.8326,
    "lng": -73.9252,
    "name": "Joker Stairs, Bronx",
    "description": "The iconic staircase at 167th Street in the Bronx where Arthur Fleck dances down after fully embracing his Joker persona."
  },
  {
    "lat": 40.7031,
    "lng": -74.0102,
    "name": "Wall Street, Manhattan",
    "description": "Served as the backdrop for several scenes depicting Gotham City's financial district and wealth disparity."
  },
  {
    "lat": 40.7587,
    "lng": -73.9787,
    "name": "Midtown Manhattan",
    "description": "Various Midtown locations stood in for the urban landscape of Gotham City, featuring its towering skyscrapers."
  },
  {
    "lat": 40.7314,
    "lng": -73.9847,
    "name": "East Village, Manhattan",
    "description": "The gritty streets of the East Village provided the perfect setting for Arthur's apartment building and neighborhood."
  },
  {
    "lat": 40.7411,
    "lng": -74.0018,
    "name": "St. Mark's Theatre (Retired)",
    "description": "This vintage theatre was transformed into the movie house where Arthur watches Charlie Chaplin's 'Modern Times'."
  },
  {
    "lat": 40.7128,
    "lng": -74.0060,
    "name": "Brooklyn Army Terminal",
    "description": "This industrial complex served as Arkham State Hospital where Arthur's mother was institutionalized."
  },
  {
    "lat": 40.6782,
    "lng": -73.9442,
    "name": "Brooklyn Subway Stations",
    "description": "Several Brooklyn subway stations were used for the pivotal scene where Arthur commits his first violent act."
  }
]
streamingServices: [
  {
    "name": "HBO Max",
    "url": "https://www.hbomax.com/feature/urn:hbo:feature:GXkPjQwAYmlFvjSoaQAVQ"
  },
  {
    "name": "Amazon Prime Video",
    "url": "https://www.amazon.com/Joker-Joaquin-Phoenix/dp/B07YLKPWL5"
  },
  {
    "name": "Apple TV",
    "url": "https://tv.apple.com/us/movie/joker/umc.cmc.5vlq4kmj5st3jktugsdh6ylly"
  }
]
bookingOptions: [
  {
    "name": "Joker Film Locations Tour",
    "url": "https://www.viator.com/tours/New-York-City/Joker-Filming-Locations-Tour/d687-73883P15",
    "type": "tour",
    "price": "$49",
    "isPartner": true
  },
  {
    "name": "Bronx Step Street Walking Tour",
    "url": "https://www.getyourguide.com/new-york-l59/joker-stairs-and-bronx-tour-t373371/",
    "type": "tour",
    "price": "$35",
    "isPartner": true
  }
]
behindTheScenes: {
  "intro": "Todd Phillips' 'Joker' transformed New York City into the dark, decaying Gotham City of the early 1980s. The film's production design team meticulously selected locations that would reflect the economic disparity and urban decay central to the film's themes.",
  "facts": [
    "The production filmed for 80 days across various New York City boroughs, primarily in the Bronx, Manhattan, and Brooklyn.",
    "The iconic stairs scene was filmed at a real Bronx staircase connecting Shakespeare and Anderson Avenues, which has since become a tourist attraction.",
    "Joaquin Phoenix lost 52 pounds for the role and practiced extensively to perfect the Joker's distinctive dance movements.",
    "Many scenes were shot on location with minimal set dressing to capture the authentic feel of New York City.",
    "The film's color palette was carefully designed to transition from muted, somber tones at the beginning to more vibrant colors as Arthur transforms into Joker."
  ]
}
---

## Joker: The Real Gotham Behind the Chaos

Todd Phillips' 'Joker' (2019) presents a disturbing origin story for Batman's most iconic villain, set against the backdrop of a gritty, decaying Gotham City that was primarily filmed across New York City's five boroughs. Unlike many superhero films that rely heavily on studio sets and CGI, 'Joker' embraced real urban landscapes to create an authentic portrayal of a city on the brink of chaos, making its locations almost characters in themselves.

The most recognizable filming location is undoubtedly the now-famous "Joker Stairs" in the Bronx, where Arthur Fleck (Joaquin Phoenix) performs his celebratory dance after fully embracing his Joker persona. Located at West 167th Street connecting Shakespeare and Anderson Avenues, these stairs have become a popular tourist attraction since the film's release, with fans recreating the iconic dance scene on the steep staircase. The surrounding neighborhood perfectly captured the economic disparity central to the film's themes.

Manhattan's financial district, particularly around Wall Street, provided the backdrop for scenes depicting Gotham's wealth inequality. The stark contrast between the opulent Wayne Hall (filmed at Brooklyn's majestic Steiner Studios) and Arthur's dilapidated apartment building (shot in the Bronx) visually reinforced the social commentary at the heart of the film. The subway scenes, where Arthur commits his first acts of violence, were filmed in various abandoned or closed-off stations throughout the city, creating a claustrophobic underground world.

The production design team chose locations that required minimal set dressing, capturing the authentic grit of New York while transforming it into the fictional Gotham City of the early 1980s. With its desaturated color palette and careful location selection, 'Joker' created a visceral, lived-in environment that helped ground this character study in a believable world, far removed from the glossy comic book adaptations that preceded it.
"@

# Write the fixed content to the files
Set-Content -Path "content\films\where-was-the-batman-2022-filmed.md" -Value $batmanContent -NoNewline
Set-Content -Path "content\films\where-was-the-hobbit-filmed.md" -Value $hobbitContent -NoNewline
Set-Content -Path "content\films\where-was-the-joker-filmed.md" -Value $jokerContent -NoNewline

Write-Host "Fixed the critical files with clean formatting" 
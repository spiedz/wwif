# Using WWIF Auto-Image Feature with n8n Automation

This guide demonstrates how to use the Where Was It Filmed (WWIF) auto-image feature within an n8n automation workflow to automatically create film location content.

## Overview

n8n is a workflow automation platform that can help streamline the content creation process for your film location website. By combining n8n with the WWIF auto-image feature, you can:

1. Automatically gather data about films and their filming locations
2. Generate markdown content with auto-image tags
3. Push this content to your website repository
4. Trigger builds to publish the new content

## Prerequisites

- [n8n](https://n8n.io/) account or self-hosted instance
- WWIF website with auto-image feature implemented
- SerpAPI key in your environment variables
- GitHub repository for your website content

## Example Workflow

### 1. Setting Up the n8n Workflow

Here's a basic n8n workflow for generating film location content:

```
[Trigger] → [Fetch Film Data] → [Process Locations] → [Generate Markdown] → [Push to GitHub]
```

### 2. Detailed Steps

#### Trigger Node

Configure a trigger such as:
- Scheduled trigger (e.g., weekly for new film releases)
- Webhook trigger (when film data is submitted via a form)
- Manual trigger (for testing)

#### Fetch Film Data Node

Use HTTP Request nodes to gather film data from:
- TMDB API
- IMDB API
- Wikipedia API
- Custom film database

Example HTTP Request:
```json
{
  "url": "https://api.themoviedb.org/3/movie/550",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer {{$env.TMDB_API_KEY}}"
  }
}
```

#### Process Locations Node

Create a Function node to extract and format location data:

```javascript
// Input: film data from previous node
// Output: processed location data with coordinates

const filmData = $input.item.json;
const locations = filmData.production_locations || [];

// Example location processing
const processedLocations = locations.map(loc => {
  // You might need to geocode the location name to get coordinates
  // This is simplified for example purposes
  return {
    name: loc.name,
    description: `Scene from ${filmData.title} filmed at ${loc.name}`,
    // These would come from geocoding in a real implementation
    lat: loc.latitude || 0,
    lng: loc.longitude || 0
  };
});

return {
  json: {
    filmTitle: filmData.title,
    filmYear: filmData.release_date.substring(0, 4),
    filmDirector: filmData.director,
    filmDescription: filmData.overview,
    locations: processedLocations
  }
};
```

#### Generate Markdown Node

Create a Function node to generate markdown with auto-image tags:

```javascript
// Input: processed film and location data
// Output: markdown content with auto-image tags

const data = $input.item.json;
const slug = data.filmTitle
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

// Create frontmatter with coordinates
const coordinates = data.locations.map(loc => {
  return {
    lat: loc.lat,
    lng: loc.lng,
    name: loc.name,
    description: loc.description
  };
});

const frontmatter = `---
title: "Where Was ${data.filmTitle} Filmed?"
date: "${new Date().toISOString().split('T')[0]}"
description: "Discover the real-world filming locations of ${data.filmTitle}."
categories: ["Film Locations"]
tags: ["${data.filmTitle}", "${data.filmYear}", "${data.filmDirector}"]
coordinates:
${coordinates.map(coord => `  - lat: ${coord.lat}
    lng: ${coord.lng}
    name: "${coord.name}"
    description: "${coord.description}"`).join('\n')}
---`;

// Generate content with auto-image tags
const content = `
# Where Was ${data.filmTitle} Filmed?

*${data.filmTitle}* (${data.filmYear}) ${data.filmDescription}

## Primary Filming Locations

${data.locations.map(loc => `
### ${loc.name}

${loc.description}

![auto-image: ${loc.name}](Filming location for ${data.filmTitle}, width=800, height=500)
`).join('\n')}

## Behind the Scenes

This content was automatically generated using our n8n automation workflow and SerpAPI auto-image feature.
`;

const markdown = `${frontmatter}\n${content}`;

return {
  json: {
    slug: `where-was-${slug}-filmed`,
    content: markdown
  }
};
```

#### Push to GitHub Node

Use the GitHub node to push the generated content:

1. **Configuration:**
   - Repository: `your-wwif-website-repo`
   - Operation: `Create/Edit File`
   - File Path: `content/films/where-was-${slug}-filmed.md`
   - File Content: `{{$node["Generate Markdown"].json.content}}`
   - Commit Message: `Add filming locations for ${filmTitle}`

### 3. Advanced Features

#### Location Image Caching

To reduce SerpAPI calls, consider implementing a caching system:

```javascript
// Example of checking a cache before using auto-image tag
const locationCache = {
  "New York City": "https://example.com/cached-nyc-image.jpg",
  "London": "https://example.com/cached-london-image.jpg"
};

// In your markdown generator
function getLocationImageTag(locationName) {
  // Check if we have a cached image
  if (locationCache[locationName]) {
    return `![${locationName}](${locationCache[locationName]})`;
  }
  
  // Otherwise use auto-image
  return `![auto-image: ${locationName}](Filming location)`;
}
```

#### Enhancing Location Data

Use additional APIs to enrich your location data:

```javascript
// Example of location enrichment in n8n
const enrichLocation = async (locationName) => {
  // Get additional details from Google Places API
  const placesData = await $http.get({
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`,
    params: {
      input: locationName,
      inputtype: 'textquery',
      fields: 'formatted_address,geometry,name,photos',
      key: process.env.GOOGLE_PLACES_API_KEY
    }
  });
  
  return {
    name: locationName,
    address: placesData.candidates[0].formatted_address,
    lat: placesData.candidates[0].geometry.location.lat,
    lng: placesData.candidates[0].geometry.location.lng,
    // We'll still use auto-image for the primary image
    useAutoImage: true
  };
};
```

## Best Practices

### 1. Rate Limiting

Implement rate limiting in your workflow to avoid excessive API calls:

```javascript
// Example of implementing rate limiting in n8n
const filmBatch = items.slice(0, 5); // Process only 5 films at a time
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

for (const film of filmBatch) {
  // Process film
  // ...
  
  // Add delay between operations
  await delay(1000); // 1 second delay
}
```

### 2. Error Handling

Add error handling to make your workflow robust:

```javascript
// Example error handling in n8n
try {
  // Your logic here
} catch (error) {
  // Log error to a monitoring service
  await $http.post({
    url: 'https://your-monitoring-service.com/log',
    body: { error: error.message, workflow: 'film-location-generator' }
  });
  
  // You might want to continue with partial data or fallback
  return {
    json: {
      error: true,
      message: error.message,
      fallbackContent: generateFallbackContent()
    }
  };
}
```

### 3. Content Review

Consider adding a manual review step before publishing:

```
[Generate Markdown] → [Send Email for Review] → [Wait for Approval] → [Push to GitHub]
```

## Example n8n Workflow JSON

Here's a simplified n8n workflow JSON that you can import:

```json
{
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "days",
              "minutesInterval": 1440
            }
          ]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "url": "https://api.themoviedb.org/3/movie/popular",
        "authentication": "headerAuth",
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "=Bearer {{$env.TMDB_API_KEY}}"
            }
          ]
        }
      },
      "name": "Fetch Popular Films",
      "type": "n8n-nodes-base.httpRequest",
      "position": [
        450,
        300
      ]
    },
    {
      "parameters": {
        "functionCode": "// Process each film to extract location data\nreturn $input.item.json.results.map(film => {\n  return {\n    json: {\n      filmId: film.id,\n      filmTitle: film.title,\n      filmYear: film.release_date.substring(0, 4),\n      filmDescription: film.overview\n    }\n  };\n});"
      },
      "name": "Process Films",
      "type": "n8n-nodes-base.function",
      "position": [
        650,
        300
      ]
    },
    {
      "parameters": {
        "batchSize": 1,
        "url": "=https://api.themoviedb.org/3/movie/{{$json.filmId}}?append_to_response=credits,keywords",
        "authentication": "headerAuth",
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "=Bearer {{$env.TMDB_API_KEY}}"
            }
          ]
        }
      },
      "name": "Get Film Details",
      "type": "n8n-nodes-base.httpRequest",
      "position": [
        850,
        300
      ]
    },
    {
      "parameters": {
        "functionCode": "// Simulate location data (in real world, you'd get this from an API)\nconst filmData = $input.item.json;\nconst director = filmData.credits.crew.find(p => p.job === 'Director');\n\n// Fictional locations for example purposes\nconst mockLocations = [\n  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },\n  { name: 'New York City', lat: 40.7128, lng: -74.0060 },\n  { name: 'London', lat: 51.5074, lng: -0.1278 },\n  { name: 'Paris', lat: 48.8566, lng: 2.3522 },\n  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 }\n];\n\n// Randomly select 2-3 locations\nconst numLocations = Math.floor(Math.random() * 2) + 2;\nconst locations = [];\n\nfor (let i = 0; i < numLocations; i++) {\n  const index = Math.floor(Math.random() * mockLocations.length);\n  if (!locations.find(l => l.name === mockLocations[index].name)) {\n    locations.push({\n      ...mockLocations[index],\n      description: `Scenes from ${filmData.title} were filmed here.`\n    });\n  }\n}\n\nreturn {\n  json: {\n    filmTitle: filmData.title,\n    filmYear: new Date(filmData.release_date).getFullYear(),\n    filmDirector: director ? director.name : 'Unknown Director',\n    filmDescription: filmData.overview,\n    locations: locations\n  }\n};"
      },
      "name": "Generate Locations",
      "type": "n8n-nodes-base.function",
      "position": [
        1050,
        300
      ]
    },
    {
      "parameters": {
        "functionCode": "// Generate markdown with auto-image tags\nconst data = $input.item.json;\nconst slug = data.filmTitle\n  .toLowerCase()\n  .replace(/[^\\w\\s-]/g, '')\n  .replace(/\\s+/g, '-')\n  .replace(/-+/g, '-');\n\n// Create frontmatter with coordinates\nconst coordinates = data.locations.map(loc => {\n  return {\n    lat: loc.lat,\n    lng: loc.lng,\n    name: loc.name,\n    description: loc.description\n  };\n});\n\nconst frontmatter = `---\ntitle: \"Where Was ${data.filmTitle} Filmed?\"\ndate: \"${new Date().toISOString().split('T')[0]}\"\ndescription: \"Discover the real-world filming locations of ${data.filmTitle}.\"\ncategories: [\"Film Locations\"]\ntags: [\"${data.filmTitle}\", \"${data.filmYear}\", \"${data.filmDirector}\"]\ncoordinates:\n${coordinates.map(coord => `  - lat: ${coord.lat}\n    lng: ${coord.lng}\n    name: \"${coord.name}\"\n    description: \"${coord.description}\"`).join('\\n')}\n---`;\n\n// Generate content with auto-image tags\nconst content = `\n# Where Was ${data.filmTitle} Filmed?\n\n*${data.filmTitle}* (${data.filmYear}) ${data.filmDescription}\n\n## Primary Filming Locations\n\n${data.locations.map(loc => `\n### ${loc.name}\n\n${loc.description}\n\n![auto-image: ${loc.name}](Filming location for ${data.filmTitle}, width=800, height=500)\n`).join('\\n')}\n\n## Behind the Scenes\n\nThis content was automatically generated using our n8n automation workflow and SerpAPI auto-image feature.\n`;\n\nconst markdown = `${frontmatter}\\n${content}`;\n\nreturn {\n  json: {\n    slug: `where-was-${slug}-filmed`,\n    content: markdown\n  }\n};"
      },
      "name": "Generate Markdown",
      "type": "n8n-nodes-base.function",
      "position": [
        1250,
        300
      ]
    },
    {
      "parameters": {
        "resource": "file",
        "operation": "edit",
        "owner": "=your-github-username",
        "repository": "=your-website-repo",
        "filePath": "=content/films/{{$json.slug}}.md",
        "fileContent": "={{$json.content}}",
        "commitMessage": "=Add filming locations for {{$json.filmTitle}}"
      },
      "name": "GitHub",
      "type": "n8n-nodes-base.github",
      "position": [
        1450,
        300
      ]
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Fetch Popular Films",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch Popular Films": {
      "main": [
        [
          {
            "node": "Process Films",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Films": {
      "main": [
        [
          {
            "node": "Get Film Details",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Film Details": {
      "main": [
        [
          {
            "node": "Generate Locations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Locations": {
      "main": [
        [
          {
            "node": "Generate Markdown",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Markdown": {
      "main": [
        [
          {
            "node": "GitHub",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Conclusion

By combining n8n automation with the WWIF auto-image feature, you can create a powerful content generation pipeline that:

1. Automatically researches films and their locations
2. Generates rich content with appropriate formatting
3. Includes high-quality images without manual intervention
4. Publishes content to your website with minimal human effort

This automation can save hours of manual research and content creation time, allowing you to scale your website more efficiently while maintaining high-quality content. 
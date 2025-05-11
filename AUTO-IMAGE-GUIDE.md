# SerpAPI Auto-Image Feature Implementation Guide

This guide provides a comprehensive overview of the SerpAPI auto-image feature for the Where Was It Filmed (WWIF) website. This feature automates the process of finding and displaying location images in your content using SerpAPI's image search capabilities.

## Table of Contents

1. [Implementation Overview](#implementation-overview)
2. [Installation Requirements](#installation-requirements)
3. [Files Created/Modified](#files-createdmodified)
4. [How It Works](#how-it-works)
5. [Usage in Content](#usage-in-content)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

## Implementation Overview

The SerpAPI auto-image feature consists of:

1. A service for fetching location images via SerpAPI (`serpApiService.ts`)
2. A React component for displaying location images (`AutoImageLocation.tsx`)
3. A template parser that processes markdown with auto-image syntax (`templateParser.ts`)
4. A custom markdown renderer that integrates the auto-image components (`CustomMarkdown.tsx`)
5. Integration with the existing markdown processing pipeline in `serverMarkdown.ts`

This implementation allows content creators to:
- Automatically fetch images for filming locations using SerpAPI
- Customize image dimensions and layout
- Fall back to placeholder images when no results are found
- Automatically detect and add images for locations mentioned in text

## Installation Requirements

To use this feature, you need:

1. **SerpAPI Key**: Sign up at [serpapi.com](https://serpapi.com/) to get an API key

2. **Required Packages**:
   ```bash
   npm install axios react-markdown remark-gfm
   ```

3. **Environment Variables**: Add to your `.env` or `.env.local` file:
   ```
   SERPAPI_API_KEY=your_api_key_here
   ```

4. **Next.js Configuration**: Update `next.config.js` to allow images from various domains that SerpAPI might return. A wildcard pattern has already been added to support all domains.

## Files Created/Modified

### New Files:
- **src/utils/serpApiService.ts**: Core service for interacting with SerpAPI
- **src/components/AutoImageLocation.tsx**: Component for displaying location images
- **src/utils/templateParser.ts**: Utility for processing custom markdown syntax
- **src/components/CustomMarkdown.tsx**: Enhanced markdown renderer with auto-image support
- **content/templates/auto-image-example.md**: Example template for the auto-image feature
- **content/films/where-was-the-dark-knight-filmed-auto-image.md**: Example film using auto-images

### Modified Files:
- **src/lib/server/serverMarkdown.ts**: Updated to integrate auto-image processing
- **src/types/content.ts**: Updated to add coordinates to BlogMeta interface

## How It Works

### 1. SerpAPI Service

The core service (`serpApiService.ts`) provides functions to:
- Fetch multiple images for a location
- Get a single best image for a location
- Generate fallback placeholder images
- Handle missing images gracefully

### 2. Markdown Processing

When content is processed:
1. The `templateParser.ts` identifies special syntax like `![auto-image: Location Name](description)`
2. It replaces this with component references to `AutoImageLocation`
3. During rendering, these components fetch images via SerpAPI if needed

### 3. Auto-detection

If coordinates are provided in the frontmatter, the system can:
1. Detect mentions of those locations in the text
2. Automatically insert auto-image tags after paragraphs mentioning locations
3. Process these tags during rendering

## Usage in Content

### Basic Syntax

```markdown
![auto-image: Times Square](Famous intersection in New York City)
```

### With Dimensions

```markdown
![auto-image: Grand Canyon](Natural wonder in Arizona, width=600, height=400)
```

### With Layout Options

```markdown
![auto-image: Eiffel Tower](Iconic landmark in Paris, layout=rounded)
![auto-image: Central Park](Urban park in Manhattan, layout=square)
![auto-image: Golden Gate Bridge](Famous bridge in San Francisco, layout=full-width)
![auto-image: Empire State Building](Art Deco skyscraper in NYC, layout=card)
```

### Auto-detection with Coordinates

Add coordinates in your frontmatter:

```yaml
---
title: "Where Was The Dark Knight Filmed?"
coordinates:
  - lat: 41.8781
    lng: -87.6298
    name: "Chicago"
    description: "The main filming location used for Gotham City"
  - lat: 51.5074
    lng: -0.1278
    name: "London"
    description: "Used for several key interior scenes"
---
```

The system will detect mentions of "Chicago" and "London" in the text and can automatically add images.

## n8n Integration Examples

### 1. Simple n8n Workflow

Create a basic n8n workflow to generate film location content:

1. **Initial Node**: HTTP Request to fetch film data from an API (like TMDB)
2. **Function Node**: Process the film data and extract locations
3. **Function Node**: Generate markdown with auto-image tags
4. **Write File Node**: Save the generated markdown to your content directory

### 2. Markdown Template for n8n

Use this template in your n8n function node:

```javascript
// Example n8n function node
const filmTitle = items[0].json.title;
const filmYear = items[0].json.release_date.substring(0, 4);
const locations = items[0].json.locations; // Assuming this array has location names

// Create frontmatter
const frontmatter = `---
title: "Where Was ${filmTitle} Filmed?"
date: "${new Date().toISOString().split('T')[0]}"
description: "Discover the real-world filming locations of ${filmTitle}."
categories: ["Film Locations"]
tags: ["${filmTitle}", "${filmYear}"]
coordinates:
${locations.map(loc => `  - lat: ${loc.lat || 0}
    lng: ${loc.lng || 0}
    name: "${loc.name}"
    description: "${loc.description || `Filming location for ${filmTitle}`}"`).join('\n')}
---`;

// Create content with auto-image tags
const content = `
# Where Was ${filmTitle} Filmed?

*${filmTitle}* (${filmYear}) was filmed in various locations around the world.

## Primary Filming Locations

${locations.map(loc => `
### ${loc.name}

${loc.description || `Scenes from ${filmTitle} were filmed at ${loc.name}.`}

![auto-image: ${loc.name}](Filming location for ${filmTitle})
`).join('\n')}
`;

// Return the combined markdown
return {
  json: {
    filename: `where-was-${filmTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-filmed.md`,
    content: `${frontmatter}\n${content}`
  }
};
```

### 3. Complete n8n Workflow Example

For a full example of an n8n workflow that generates film location content with auto-images:

1. Create a workflow with these nodes:
   - **Trigger**: Schedule or webhook
   - **HTTP Request**: Fetch film data from TMDB or similar API
   - **Function**: Process film data and extract locations
   - **Function**: Generate markdown with auto-image tags
   - **Write File**: Save the generated markdown to your content directory
   - **Execute Command**: Trigger a site rebuild if needed

2. Sample workflow JSON is available in the `n8n-automation-example.md` file.

See our full n8n integration guide for more detailed examples and best practices.

## Configuration

### SerpAPI Options

You can customize the image search by modifying the options in `serpApiService.ts`:

```typescript
// Example options
const options: ImageSearchOptions = {
  size: 'large',      // 'large', 'medium', or 'icon'
  type: 'photo',      // 'photo', 'clip', 'line', or 'animated'
  safeSearch: true,   // Enable safe search
  limit: 5            // Number of results to return
};
```

### Component Customization

The `AutoImageLocation` component accepts multiple props to customize its appearance:

```tsx
<AutoImageLocation
  locationName="Mount Rushmore"
  description="Famous presidential monument"
  width={800}
  height={500}
  priority={true}
  className="my-custom-class"
  imageClassName="rounded-lg shadow-xl"
  showCaption={true}
  captionClassName="text-sm italic"
  layout="card"
/>
```

## Troubleshooting

### SerpAPI Not Working

1. Check your API key in environment variables
2. Verify you have remaining API credits
3. Check network connectivity
4. Look for error messages in console logs

### Image Quality Issues

For better image quality:
1. Use specific location names (e.g., "Eiffel Tower Paris" instead of just "Paris")
2. Use the `type: 'photo'` option for higher quality images
3. Include more context in the location name

### Rate Limiting

SerpAPI has usage limits. To manage them:
1. Cache results when possible
2. Use the limit option to reduce the number of images
3. Handle error states gracefully with fallbacks

### Security Considerations

1. The SerpAPI key should be kept secure and only used server-side
2. Always validate and sanitize location names before using them in API calls
3. Apply appropriate rate limiting to prevent abuse

## Example Implementation

Here's a full example of a film page using auto-images:

```markdown
---
title: "Where Was Inception Filmed?"
coordinates:
  - lat: 48.8566
    lng: 2.3522
    name: "Paris"
    description: "The famous cafe scene was filmed here"
  - lat: 51.5074
    lng: -0.1278
    name: "London"
    description: "Several key scenes were shot here"
---

# Where Was Inception Filmed?

Christopher Nolan's mind-bending thriller was filmed across several iconic locations.

## Paris Scenes

The cafe scene where Cobb explains the dream-sharing concept to Ariadne was filmed in Paris.

![auto-image: Paris](Famous cafe scene location, width=700, height=400)

## London Locations

Several key scenes were shot in London, including the warehouse where the team plans the inception.

![auto-image: London](Team headquarters, layout=full-width)
```

## Production Readiness Checklist

Before deploying to production:

1. ✅ **API Key**: Ensure SerpAPI key is set in environment variables
2. ✅ **Error Handling**: Confirm all edge cases are handled
3. ✅ **Fallbacks**: Verify placeholder images work when SerpAPI fails
4. ✅ **Performance**: Cache results when possible to reduce API calls
5. ✅ **Rate Limiting**: Implement rate limiting to prevent abuse
6. ✅ **Image Domains**: Update Next.js config to allow external image domains

---

This auto-image feature is designed to work with the `n8n` automation workflow, allowing content creators to focus on writing compelling content while the system handles finding appropriate location images automatically. 
# SerpAPI Auto-Image Feature Guide

This guide explains how to use the SerpAPI auto-image feature in the Where Was It Filmed (WWIF) website. This feature allows content creators to automatically fetch images for filming locations without needing to manually find and upload them.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Markdown Syntax](#markdown-syntax)
4. [Template Usage](#template-usage)
5. [Auto-detection](#auto-detection)
6. [Component Integration](#component-integration)
7. [Troubleshooting](#troubleshooting)

## Overview

The SerpAPI auto-image feature allows you to:

- Automatically fetch images for filming locations using SerpAPI
- Insert these images into markdown content with a simple syntax
- Customize image dimensions and layout
- Fall back to placeholder images when no suitable image is found
- Auto-detect location names from text and coordinates

This feature is ideal for rapid content creation and automation workflows like n8n, where finding and uploading images manually would be time-consuming.

## Setup

### 1. Get a SerpAPI Key

1. Sign up for a SerpAPI account at [serpapi.com](https://serpapi.com/)
2. Navigate to your dashboard and copy your API key

### 2. Set Environment Variable

Add your SerpAPI key to your environment variables:

```bash
# In your .env file
SERPAPI_API_KEY=your_api_key_here
```

### 3. Install Required Packages

The feature uses the following packages:

```bash
npm install axios react-markdown remark-gfm
```

## Markdown Syntax

### Basic Syntax

To insert an auto-image in your markdown:

```markdown
![auto-image: Location Name](Optional description)
```

For example:

```markdown
![auto-image: Times Square](Famous intersection in New York City)
```

### Specifying Dimensions

You can customize the image dimensions:

```markdown
![auto-image: Location Name](Description, width=600, height=400)
```

### Layouts

Four built-in layouts are available:

```markdown
![auto-image: Eiffel Tower](Description, layout=rounded)  # Default
![auto-image: Central Park](Description, layout=square)
![auto-image: Golden Gate Bridge](Description, layout=full-width)
![auto-image: Empire State Building](Description, layout=card)
```

## Template Usage

Use the auto-image feature in your templates:

### Film Templates

```markdown
# {title}

{description}

## Filming Locations

### {primaryLocation}

The main sequences were filmed at {primaryLocation}.

![auto-image: {primaryLocation}](Primary filming location)

### Other Notable Locations

{secondaryLocation} was also featured prominently in the film.

![auto-image: {secondaryLocation}](Secondary filming location, width=700, height=400)
```

### Series Templates

```markdown
# {title} - Filming Locations

## Primary Filming Locations

{seriesLocation} served as the main backdrop for the series.

![auto-image: {seriesLocation}](layout=full-width)

## Episode-Specific Locations

Season {seasonNumber}, Episode {episodeNumber} featured scenes shot at {episodeLocation}.

![auto-image: {episodeLocation}](width=600, height=350, layout=card)
```

## Auto-detection

The system can automatically detect location names in your content if they're provided in the coordinates metadata:

### Frontmatter Example

```yaml
---
title: Where Was Inception Filmed?
coordinates:
  - lat: 48.8566
    lng: 2.3522
    name: Paris
    description: The famous cafe scene was filmed here
  - lat: 51.5074
    lng: 0.1278
    name: London
    description: Several key scenes were shot in London
---
```

When the content mentions "Paris" or "London", the system can automatically insert images after those paragraphs.

## Component Integration

For direct component usage in React:

```tsx
import AutoImageLocation from '../components/AutoImageLocation';
import CustomMarkdown from '../components/CustomMarkdown';

// For direct component usage
<AutoImageLocation
  locationName="Mount Rushmore"
  width={800}
  height={500}
  layout="card"
/>

// For markdown content with auto-images
<CustomMarkdown
  content={markdownContent}
  coordinates={filmData.coordinates}
  processAutoImages={true}
/>
```

## Troubleshooting

### Image Not Loading

1. Check if your SerpAPI key is correctly set in environment variables
2. Verify you have enough SerpAPI credits/quota remaining
3. Check if the location name is specific enough (e.g., "Hollywood Sign" is better than just "Hollywood")
4. Ensure your Next.js configuration allows images from external domains

### Rate Limiting

SerpAPI has usage limits based on your plan. To avoid rate limiting:

1. Cache images after fetching them
2. Use existing image URLs when available
3. Implement a fallback strategy (provided by the system)

### Image Quality

For better image quality:

1. Use more specific location names
2. Specify "photo" type in your search options
3. Add more context like city or country name

### Next.js Image Domains

If you see errors about unconfigured domains, add all possible image sources to your Next.js config:

```javascript
// next.config.js
module.exports = {
  images: {
    domains: [
      // ... other domains
      'serpapi.com',
      'i.imgur.com',
      'images.pexels.com',
      'cdn.example.com',
    ],
    // Or use the wildcard pattern (Next.js 13.4+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}
```

## API Reference

### SerpAPI Service

```typescript
// Functions available in serpApiService.ts
fetchLocationImages(location: string, options?: ImageSearchOptions): Promise<string[] | null>
fetchBestLocationImage(location: string, options?: ImageSearchOptions): Promise<string | null>
getImageForLocation(location: string, existingImageUrl?: string | null, options?: ImageSearchOptions): Promise<string>
```

### Components

```typescript
// AutoImageLocation props
interface AutoImageLocationProps {
  locationName: string;
  description?: string;
  existingImageUrl?: string | null;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  alt?: string;
  showCaption?: boolean;
  captionClassName?: string;
  onImageLoad?: (imageUrl: string) => void;
  layout?: 'rounded' | 'square' | 'full-width' | 'card';
}

// CustomMarkdown props
interface CustomMarkdownProps {
  content: string;
  className?: string;
  coordinates?: Array<{ 
    lat: number; 
    lng: number; 
    name: string; 
    description?: string;
    image?: string;
  }>;
  processAutoImages?: boolean;
}
``` 
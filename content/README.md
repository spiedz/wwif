# Content Directory for Where Was It Filmed

This directory contains all the Markdown content files for the Where Was It Filmed website.

## Directory Structure

- `/films` - Contains Markdown files for film and TV show locations
- `/blog` - Contains Markdown files for blog posts
- `/templates` - Contains template files for creating new content

## File Naming Conventions

- **Films**: Use the format `where-was-[film-name]-filmed.md`
- **Blog Posts**: Use a descriptive kebab-case name that includes keywords, e.g., `best-filming-locations-in-paris.md`

## Content Guidelines

All content files should:

1. Include complete YAML frontmatter with all required fields
2. Follow the established header hierarchy (h1 → h2 → h3)
3. Include relevant details about filming locations
4. Provide accurate coordinates for maps
5. Include travel tips where applicable
6. Be free of spelling and grammar errors

## Adding New Content

1. Use the templates in the `/templates` directory as a starting point
2. Follow the file naming conventions
3. Fill in all required frontmatter fields
4. Add high-quality content following the established structure
5. Verify coordinates are accurate before publishing

## Updating Existing Content

When updating existing content:

1. Maintain the same slug to preserve URL structure
2. Add new information at appropriate sections rather than completely rewriting
3. Update the date field to reflect the last modification
4. Check that all existing coordinates remain accurate

## Images

Images related to content should be placed in `/public/images/` with descriptive filenames.

For detailed instructions on content management, please refer to the [Content Management Guide](/docs/content-management-guide.md).

# Content Guidelines for WWIF

This directory contains all the content files for Where Was It Filmed. The website uses markdown files with frontmatter for film and blog pages.

## Directory Structure

- `films/` - Contains markdown files for individual film location pages
- `blog/` - Contains markdown files for blog posts
- `templates/` - Contains template files for new content

## Film Page Layouts

We currently support two layouts for film pages:

### 1. Standard Layout

The standard layout displays film information in a fixed format with:
- Introduction and content displayed as markdown
- Behind the scenes section
- Interactive map
- Simple list of filming locations

### 2. Region-Based Layout (Recommended)

The region-based layout groups locations by geographic region and provides a more visually appealing experience with:
- Regions displayed as sections with header images
- Location cards organized in a grid layout
- Travel tips and trivia in styled cards
- Automatically grouped locations

## How to Use the Region-Based Layout

1. Add `useRegionLayout: true` to your film's frontmatter.

2. Structure your coordinates with location name, description and optionally an image:
   ```yaml
   coordinates:
     - lat: 48.8582
       lng: 2.2945
       name: "Paris - Pont de Bir-Hakeim"
       description: "This iconic Parisian bridge featured in the famous folding city scene."
       image: "https://example.com/images/bir-hakeim.jpg"
   ```

3. Naming locations with region prefixes like "Paris - Location Name" helps the system automatically group them by region.

4. For explicit region data, define your `travelTips` and `trivia` arrays:
   ```yaml
   travelTips:
     - text: "The Pont de Bir-Hakeim bridge is easily accessible via metro."
     - text: "University College London allows visitors to explore parts of the campus."
   
   trivia:
     - text: "The famous Paris folding scene combined practical effects with CGI."
     - text: "The zero-gravity hotel corridor fight scene took three weeks to film."
   ```

## Example Film Page with Region Layout

See `films/where-was-inception-filmed.md` for a complete example of the region-based layout.

## Best Practices

1. **Location Images:**
   - Use high-quality landscape images (16:9 or 4:3 ratio)
   - Optimize images for web (max 800px width, JPEG or WebP format)
   - Use Creative Commons or properly licensed images

2. **Region Grouping:**
   - For automatic region grouping, format location names as "Region - Location"
   - Use consistent region names (e.g., "Paris" not "Paris, France" in one place and "Paris" in another)
   - For locations without a clear region, use city or country names

3. **Travel Tips:**
   - Keep tips concise and actionable
   - Focus on practical information for visitors
   - Include transportation tips, best times to visit, or photography advice

4. **Trivia:**
   - Include interesting behind-the-scenes facts
   - Focus on how the locations were used or modified for filming
   - Add details about production challenges or interesting anecdotes

## Adding New Content

1. Copy the appropriate template from the `/templates` directory
2. Fill in the frontmatter with your film's details
3. Add the main content in markdown format
4. Put the file in the appropriate directory (`films/` or `blog/`)
5. The new content will be automatically published on the next site build

# Content Creation Guide

This guide explains how to create and format content for the "Where Was It Filmed" website, including how to embed images, format text, and use special markdown features.

## Table of Contents
- [Basic Content Structure](#basic-content-structure)
- [Embedding Images](#embedding-images)
- [Text Formatting](#text-formatting)
- [Adding Locations](#adding-locations)
- [Creating Sections](#creating-sections)
- [Best Practices](#best-practices)

## Basic Content Structure

Each content file (film, series, or blog) consists of two parts:
1. **Frontmatter**: Metadata at the top of the file between `---` markers
2. **Content**: The actual markdown content that appears on the page

Example:
```markdown
---
title: Where Was The Matrix Filmed?
description: Explore the iconic filming locations of The Matrix.
slug: where-was-the-matrix-filmed
date: '2023-11-15'
year: 1999
director: Wachowski Sisters
genre:
  - Sci-Fi
  - Action
posterImage: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'
coordinates:
  - lat: 33.8688
    lng: 151.2093
    name: 'Sydney, Australia'
    description: 'The city served as the primary backdrop for most filming locations.'
---

Your content goes here...
```

## Embedding Images

You can now embed images directly within your markdown content using standard markdown or HTML syntax.

### Markdown Image Syntax
```markdown
![Alt text for the image](https://example.com/path/to/image.jpg)
```

### HTML Image Syntax (with more control)
```html
<img 
  src="https://example.com/path/to/image.jpg" 
  alt="Description of the image" 
  class="rounded-lg shadow-md my-4" 
  style="width: 100%; max-width: 600px; margin: 20px auto; display: block;"
/>
```

### Image with Caption
```html
<figure>
  <img src="https://example.com/path/to/image.jpg" alt="Scene from the film" />
  <figcaption>This famous scene was filmed at Griffith Observatory in Los Angeles</figcaption>
</figure>
```

### Side-by-Side Images
```html
<div style="display: flex; gap: 16px; margin: 20px 0;">
  <img src="https://example.com/image1.jpg" alt="Before" style="width: 50%;" />
  <img src="https://example.com/image2.jpg" alt="After" style="width: 50%;" />
</div>
```

## Text Formatting

The site supports standard markdown formatting plus some enhanced features:

### Basic Formatting

```markdown
# Main Heading
## Secondary Heading
### Tertiary Heading

**Bold text**
*Italic text*
~~Strikethrough~~

> Blockquote text appears indented and highlighted

[Link text](https://example.com)

- Bullet point list
- Another item
  - Nested item

1. Numbered list
2. Second item
```

### Callouts and Highlights

```markdown
**Tip:** Special tips for travelers can use this format.

**Note:** Important information can be highlighted like this.

**Warning:** Critical details to be aware of.
```

## Adding Locations

The most effective way to organize filming locations is to use headings and lists:

```markdown
## 1. The Matrix Building

### The Location
This iconic building seen in the film is actually the [Name] located in [City, Country]. It served as the exterior for the [scene description].

### Where to Visit
The building is located at [Address]. Visitors can access the exterior view from [specific directions].

### Visitor Experience
- Best time to visit: Early morning for fewer crowds
- Photography: Allowed from the street, but interior requires permission
- Nearby attractions: [List related places to visit]

## 2. The Rooftop Chase Scene

... and so on for each major location
```

## Creating Sections

Divide your content into clear sections for better readability:

```markdown
## Behind the Scenes

The production of [Film Name] involved several interesting challenges...

## Fun Facts

1. **Unexpected Weather**: The famous rain scene was actually...
2. **Stunt Work**: The lead actor performed 90% of their own stunts...
3. **Set Construction**: The elaborate set took over 6 months to build...

## Travel Tips

If you're planning to visit these filming locations, consider these tips:
- **Best Season**: Spring offers the ideal weather and fewer tourists
- **Transportation**: Public transit passes are available for...
- **Guided Tours**: Several companies offer specialized filming location tours
```

## Best Practices

1. **Use high-quality images** - Preferably at least 1200px wide
2. **Keep paragraphs concise** - Aim for 3-5 sentences per paragraph
3. **Break up content with headings** - Use a logical hierarchy
4. **Include practical information** - Address, visiting hours, costs
5. **Add personal insights** - What makes this location special?
6. **Cite sources** - Credit information from books, interviews, etc.
7. **Update content** - If locations change, add renovation notes

---

For technical support or questions about content creation, please contact the website administrator. 
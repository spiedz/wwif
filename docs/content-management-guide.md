# Content Management Guide for WWIF

This guide explains how to add, edit, and manage content files for the "Where Was It Filmed" website.

## Content Structure

The website uses Markdown files with YAML frontmatter to manage content. Content is divided into two main categories:

1. **Films** - Information about movies and TV shows with their filming locations
2. **Blog Posts** - Articles about filming locations, travel guides, and related topics

All content files are stored in the `/content` directory, organized as follows:

```
/content
  /films
    where-was-movie-name-filmed.md
  /blog
    blog-post-name.md
```

## Adding New Film Content

To add a new film or TV show, create a new Markdown file in the `/content/films` directory with the following structure:

```markdown
---
title: "Where Was [Film Name] Filmed?"
description: "Brief description of the filming locations (keep under 160 characters for SEO)"
slug: "where-was-film-name-filmed"
year: YYYY
genre: ["Genre1", "Genre2"]
director: "Director Name"
categories: ["Movies", "TV Shows", "Documentary", etc.]
coordinates: 
  - { lat: 00.0000, lng: 00.0000, name: "Location Name", description: "Brief description of the scene" }
  - { lat: 00.0000, lng: 00.0000, name: "Another Location", description: "Brief description" }
date: "YYYY-MM-DD"
---

# [Film Name] Filming Locations

Introduction paragraph about the film and its primary filming locations.

## [Location/City Name]

Description of the filming in this location.

### [Specific Site Name]
Details about scenes filmed at this specific site.

### [Another Specific Site]
More details...

## [Another Location/City]

Description of filming in this location.

## Travel Tips

1. Tip for visiting these locations
2. Another useful tip
3. Additional information

## Trivia

- Interesting fact about the filming
- Another piece of trivia
- Additional interesting information
```

### Required Fields for Films

- `title`: The page title (typically "Where Was [Film Name] Filmed?")
- `description`: A brief description (keep under 160 characters for SEO)
- `slug`: URL-friendly version of the title (e.g., "where-was-inception-filmed")
- `year`: Release year of the film
- `genre`: Array of genres (even if only one, use array syntax)
- `director`: Name of the director
- `coordinates`: Array of filming locations with latitude, longitude, name, and description
- `date`: Publication date for the article (YYYY-MM-DD format)

Optional fields:
- `categories`: Additional categorization tags

## Adding New Blog Content

To add a new blog post, create a new Markdown file in the `/content/blog` directory with the following structure:

```markdown
---
title: "Blog Post Title"
description: "Brief description of the blog post (keep under 160 characters for SEO)"
slug: "blog-post-url-slug"
date: "YYYY-MM-DD"
categories: ["Category1", "Category2"]
author: "Author Name"
featuredImage: "/images/image-name.jpg"
---

# Blog Post Title

Introduction paragraph.

## First Section Heading

Content for the first section.

## Second Section Heading

Content for the second section.

### Subsection

More detailed content.

## Conclusion

Concluding thoughts.
```

### Required Fields for Blog Posts

- `title`: The blog post title
- `description`: A brief description (keep under 160 characters for SEO)
- `slug`: URL-friendly version of the title
- `date`: Publication date (YYYY-MM-DD format)

Optional fields:
- `categories`: Array of categories the post belongs to
- `author`: Name of the author
- `featuredImage`: Path to the featured image (should be in /public/images/)

## Markdown Formatting Tips

- Use `#` for the main title (h1)
- Use `##` for section headings (h2)
- Use `###` for subsection headings (h3)
- Use `**bold**` for emphasis
- Use `*italic*` for slight emphasis
- Use numbered lists for sequential steps
- Use bulleted lists for non-sequential items
- Use `[text](url)` for links
- Use proper paragraph spacing (empty line between paragraphs)

## Map Coordinates

For film locations, you need to provide accurate coordinates for the map:

1. Visit Google Maps
2. Find the exact location
3. Right-click on the point and select "What's here?"
4. Copy the latitude and longitude values
5. Use these values in the coordinates section of the frontmatter

## Images

- Store all images in the `/public/images` directory
- For blog posts, specify the featured image in the frontmatter
- For inline images, use Markdown syntax: `![Alt text](/images/image-name.jpg)`
- Optimize images before uploading (reduce file size while maintaining quality)
- Use descriptive filenames that relate to the content

## Content Management Workflow

1. Create new content in Markdown format following the templates above
2. Place files in the appropriate directory (`/content/films` or `/content/blog`)
3. The website will automatically update when files are added or modified
4. Test new content by running the development server and navigating to the page
5. Always validate that maps display correctly for film content

## SEO Best Practices

- Include the film name or main keyword in the title
- Keep descriptions under 160 characters
- Use descriptive slugs with keywords
- Include relevant categories
- Use semantic headings (h1, h2, h3) in a hierarchical structure
- Add alt text to all images
- Include external links to relevant resources when appropriate

## Troubleshooting

- If content doesn't appear, check for syntax errors in the YAML frontmatter
- Ensure all required fields are included
- Verify that coordinates are in the correct format
- Check for special characters that might break the YAML parser 
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
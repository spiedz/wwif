/**
 * Template Parser for Markdown Content
 * Adds support for special syntax to automatically fetch images for locations
 */

import { Coordinates } from '../types/content';

/**
 * Parse markdown templates with custom syntax for auto-images
 * @param content The markdown content to parse
 * @returns Processed content with auto-image components
 */
export function parseTemplates(content: string): string {
  // Handle auto-image syntax: ![auto-image: Location Name](width=800,height=500)
  // This will be transformed into an AutoImageLocation component reference
  const autoImageRegex = /!\[auto-image:\s*([^\]]+)\]\((?:([^,)]+))?(?:,\s*width=(\d+))?(?:,\s*height=(\d+))?(?:,\s*layout=([a-z-]+))?\)/g;
  
  return content.replace(autoImageRegex, (match, location, description, width, height, layout) => {
    // Clean up the parameters
    const cleanLocation = location.trim();
    const cleanDesc = description ? description.trim() : '';
    const cleanWidth = width ? parseInt(width, 10) : 800;
    const cleanHeight = height ? parseInt(height, 10) : 500;
    const cleanLayout = layout ? layout.trim() : 'rounded';
    
    // Create a component reference tag
    // This will be recognized and replaced with the actual component during rendering
    return `<AutoImageLocation
      locationName="${cleanLocation}"
      description="${cleanDesc}"
      width={${cleanWidth}}
      height={${cleanHeight}}
      layout="${cleanLayout}"
    />`;
  });
}

/**
 * Parse location coordinates in content and add auto-image capability
 * @param content The markdown content
 * @param coordinates Optional array of coordinates
 * @returns Content with coordinates and auto-images 
 */
export function enhanceContentWithCoordinates(content: string, coordinates?: Coordinates[]): string {
  // If no coordinates provided, just parse templates
  if (!coordinates || coordinates.length === 0) {
    return parseTemplates(content);
  }
  
  // Process each coordinate for easy lookup
  const locationMap = coordinates.reduce((map, coordinate) => {
    if (coordinate.name) {
      map[coordinate.name.toLowerCase()] = coordinate;
    }
    return map;
  }, {} as Record<string, Coordinates>);
  
  // Find mentions of these locations in the content
  let enhancedContent = content;
  
  // For each location, check if it appears in the content but not as an image already
  Object.entries(locationMap).forEach(([key, coordinate]) => {
    const locationName = coordinate.name;
    if (!locationName) return; // Skip if name is undefined
    
    const regex = new RegExp(`(?<!\\[)(${locationName})(?!\\])`, 'gi');
    
    // Only add auto-image if location is mentioned as plain text (not in link/image already)
    if (regex.test(enhancedContent) && !enhancedContent.includes(`![auto-image: ${locationName}]`)) {
      // Add the auto-image tag at the end of a paragraph where the location is first mentioned
      const paragraphRegex = new RegExp(`([^\\n]+${locationName}[^\\n]+)\\n\\n`, 'i');
      const match = paragraphRegex.exec(enhancedContent);
      
      if (match) {
        const description = coordinate.description || '';
        enhancedContent = enhancedContent.replace(
          match[0],
          `${match[1]}\n\n![auto-image: ${locationName}](${description})\n\n`
        );
      }
    }
  });
  
  // Process all auto-image tags
  return parseTemplates(enhancedContent);
}

/**
 * Convert a template string to HTML with components
 * @param template The template string with component references
 * @param data Data to inject into the template
 * @returns Processed HTML content
 */
export function processTemplate(template: string, data: Record<string, any>): string {
  // Replace {variable} patterns with actual data
  let processed = template;
  
  Object.entries(data).forEach(([key, value]) => {
    processed = processed.replace(new RegExp(`{${key}}`, 'g'), value?.toString() || '');
  });
  
  // Process any auto-image templates
  return enhanceContentWithCoordinates(processed, data.coordinates);
} 
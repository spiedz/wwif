# PowerShell script for quick fix without any npm installs
Write-Host "Starting quick fix script..." -ForegroundColor Cyan

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Cleared Next.js cache" -ForegroundColor Green
} else {
    Write-Host "No .next directory found, nothing to clear" -ForegroundColor Green
}

# Create empty .next directory to avoid startup errors
if (-not (Test-Path ".next")) {
    New-Item -ItemType Directory -Path ".next"
    New-Item -ItemType Directory -Path ".next\cache"
    New-Item -ItemType Directory -Path ".next\server"
    New-Item -ItemType Directory -Path ".next\static"
    Write-Host "✅ Created empty .next directory structure" -ForegroundColor Green
}

# Build the modified version of serverMarkdown.ts to use only the fallback approach
Write-Host "Setting up serverMarkdown.ts to use fallback processor..." -ForegroundColor Yellow

# The target directory
$libServerDir = "src\lib\server"
if (-not (Test-Path $libServerDir)) {
    Write-Host "❌ Could not find $libServerDir directory!" -ForegroundColor Red
    exit 1
}

# Check if serverMarkdown.ts exists
$serverMarkdownPath = "$libServerDir\serverMarkdown.ts"
if (-not (Test-Path $serverMarkdownPath)) {
    Write-Host "❌ Could not find $serverMarkdownPath!" -ForegroundColor Red
    exit 1
}

# Create the simplified serverMarkdown.ts content
$simplifiedContent = @'
/**
 * SERVER-ONLY MARKDOWN UTILITIES 
 * 
 * This is a simplified version that doesn't rely on rehype-raw or remark-gfm.
 * It uses a fallback processor instead for maximum compatibility.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import processMixedContent from '../../utils/fallbackMarkdown';
import { BlogMeta, Content, FilmMeta, Coordinates } from '../../types/content';
import { TVSeries, SeriesMeta, Season } from '../../types/series';

// Define content directories relative to project root
const filmsDirectory = path.join(process.cwd(), 'content/films');
const blogDirectory = path.join(process.cwd(), 'content/blog');
const seriesDirectory = path.join(process.cwd(), 'content/series');
const locationsDirectory = path.join(process.cwd(), 'content/locations');

/**
 * Enhanced markdown processing function that properly handles inline images
 * and custom HTML - using a simple fallback approach
 */
async function processMarkdownContent(content: string) {
  try {
    // Use our custom processor directly to handle HTML in markdown
    return processMixedContent(content);
  } catch (error) {
    console.error('Error processing markdown content:', error);
    return '<p>Error processing content</p>';
  }
}

/**
 * SERVER-ONLY: Gets all film slugs from the films directory
 */
export function getFilmSlugs() {
  try {
    if (!fs.existsSync(filmsDirectory)) {
      console.error(`Films directory not found: ${filmsDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(filmsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting film slugs:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets all blog slugs from the blog directory
 */
export function getBlogSlugs() {
  try {
    if (!fs.existsSync(blogDirectory)) {
      console.error(`Blog directory not found: ${blogDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(blogDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting blog slugs:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets all TV series slugs from the series directory
 */
export function getSeriesSlugs() {
  try {
    if (!fs.existsSync(seriesDirectory)) {
      console.error(`Series directory not found: ${seriesDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(seriesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting series slugs:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets all location slugs from the locations directory
 */
export function getLocationSlugs() {
  try {
    if (!fs.existsSync(locationsDirectory)) {
      console.error(`Locations directory not found: ${locationsDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(locationsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting location slugs:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets a film by its slug
 */
export async function getFilmBySlug(slug: string): Promise<Content<FilmMeta> | null> {
  try {
    const fullPath = path.join(filmsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Film file not found: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    let coordinates: Coordinates[] = [];
    if (data.coordinates) {
      coordinates = data.coordinates.map((coord: any) => {
        if (Array.isArray(coord)) {
          return { lat: coord[0], lng: coord[1] };
        }
        return coord;
      });
    }

    const processedContent = await processMarkdownContent(content);

    // Create trailer object from trailerUrl if present and trailer isn't
    const trailer = data.trailer || (data.trailerUrl ? { url: data.trailerUrl } : null);

    const filmData: Content<FilmMeta> = {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        year: data.year || '',
        director: data.director || '',
        genre: data.genre || [],
        posterImage: data.posterImage || '',
        date: data.date || new Date().toISOString(),
        coordinates: coordinates,
        trailer: trailer,
        useRegionLayout: Boolean(data.useRegionLayout || false),
        travelTips: data.travelTips || [],
        trivia: data.trivia || [],
        regions: data.regions || [],
        streamingServices: data.streamingServices || [],
        bookingOptions: data.bookingOptions || [],
        behindTheScenes: data.behindTheScenes || null,
        components: data.components || [],
      },
      content: content,
      html: processedContent,
    };

    return filmData;
  } catch (error) {
    console.error(`Error getting film by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SERVER-ONLY: Gets all films
 */
export async function getAllFilms(): Promise<Content<FilmMeta>[]> {
  try {
    const slugs = getFilmSlugs();
    const films = [];
    
    for (const slug of slugs) {
      const film = await getFilmBySlug(slug);
      if (film) {
        films.push(film);
      }
    }
    
    return films.sort((a, b) => {
      const dateA = new Date(a.meta.date || 0);
      const dateB = new Date(b.meta.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting all films:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets a blog post by its slug with enhanced formatting
 */
export async function getBlogBySlug(slug: string): Promise<Content<BlogMeta> | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Blog file not found: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await processMarkdownContent(content);

    const blogData: Content<BlogMeta> = {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || '',
        categories: data.categories || [],
        tags: data.tags || [],
        featuredImage: data.featuredImage || '',
      },
      content: content,
      html: processedContent,
    };

    return blogData;
  } catch (error) {
    console.error(`Error getting blog by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SERVER-ONLY: Gets all blog posts
 */
export async function getAllBlogPosts(): Promise<Content<BlogMeta>[]> {
  try {
    const slugs = getBlogSlugs();
    const posts = [];
    
    for (const slug of slugs) {
      const post = await getBlogBySlug(slug);
      if (post) {
        posts.push(post);
      }
    }
    
    return posts.sort((a, b) => {
      const dateA = new Date(a.meta.date || 0);
      const dateB = new Date(b.meta.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting all blog posts:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Gets related blog posts
 */
export async function getRelatedBlogPosts(currentSlug: string, limit = 3): Promise<Content<BlogMeta>[]> {
  const allPosts = await getAllBlogPosts();
  const currentPost = allPosts.find(post => post.meta.slug === currentSlug);
  
  if (!currentPost) return [];
  
  const relatedPosts = allPosts
    .filter(post => {
      if (post.meta.slug === currentSlug) return false;
      
      if (currentPost.meta.categories && post.meta.categories) {
        return currentPost.meta.categories.some(cat => 
          post.meta.categories?.includes(cat)
        );
      }
      
      return false;
    })
    .slice(0, limit);
  
  if (relatedPosts.length < limit) {
    const recentPosts = allPosts
      .filter(post => 
        post.meta.slug !== currentSlug && 
        !relatedPosts.some(rp => rp.meta.slug === post.meta.slug)
      )
      .slice(0, limit - relatedPosts.length);

    return [...relatedPosts, ...recentPosts];
  }

  return relatedPosts;
}

/**
 * SERVER-ONLY: Gets a TV series by its slug
 */
export async function getSeriesBySlug(slug: string): Promise<TVSeries | null> {
  try {
    const fullPath = path.join(seriesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Series file not found: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    let coordinates: Coordinates[] = [];
    if (data.coordinates) {
      coordinates = data.coordinates.map((coord: any) => {
        if (Array.isArray(coord)) {
          return { lat: coord[0], lng: coord[1] };
        }
        return coord;
      });
    }

    const processedContent = await processMarkdownContent(content);

    // Handle releaseYearStart correctly for safe parsing
    let releaseYearStart = 0;
    if (data.releaseYearStart) {
      if (typeof data.releaseYearStart === 'string') {
        releaseYearStart = parseInt(data.releaseYearStart, 10) || 0;
      } else if (typeof data.releaseYearStart === 'number') {
        releaseYearStart = data.releaseYearStart;
      }
    }

    // Ensure seasons is always an array
    const seasons = data.seasons || [];

    const seriesData: TVSeries = {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        creator: data.creator || '',
        releaseYearStart: releaseYearStart,
        releaseYearEnd: data.releaseYearEnd || null,
        genres: data.genres || [],
        posterImage: data.posterImage || '',
        bannerImage: data.bannerImage || '',
        overview: data.overview || '',
        coordinates: coordinates,
        streamingServices: data.streamingServices || [],
        bookingOptions: data.bookingOptions || [],
        behindTheScenes: data.behindTheScenes || null,
        trailer: data.trailer || null,
        seasons: seasons,
        episodes: data.episodes || [],
      } as SeriesMeta,
      locations: data.locations || [],
      content: content,
      html: processedContent,
      seasons: seasons,
    };

    return seriesData;
  } catch (error) {
    console.error(`Error getting series by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SERVER-ONLY: Gets all TV series
 */
export async function getAllSeries(): Promise<TVSeries[]> {
  try {
    const slugs = getSeriesSlugs();
    const seriesList = [];
    
    for (const slug of slugs) {
      const series = await getSeriesBySlug(slug);
      if (series) {
        seriesList.push(series);
      }
    }
    
    return seriesList.sort((a, b) => {
      // Safely handle release year comparison
      let yearA = 0;
      let yearB = 0;
      
      if (typeof a.meta.releaseYearStart === 'number') {
        yearA = a.meta.releaseYearStart;
      } else if (typeof a.meta.releaseYearStart === 'string') {
        yearA = parseInt(a.meta.releaseYearStart, 10) || 0;
      }
      
      if (typeof b.meta.releaseYearStart === 'number') {
        yearB = b.meta.releaseYearStart;
      } else if (typeof b.meta.releaseYearStart === 'string') {
        yearB = parseInt(b.meta.releaseYearStart, 10) || 0;
      }
      
      return yearB - yearA;
    });
  } catch (error) {
    console.error('Error getting all series:', error);
    return [];
  }
}

/**
 * SERVER-ONLY: Pre-processes all location data for client-side use
 * This function can be used in getStaticProps to fetch all location data
 */
export async function getAllLocationsData() {
  try {
    const slugs = getLocationSlugs();
    const locationsData = [];

    for (const slug of slugs) {
      const fullPath = path.join(locationsDirectory, `${slug}.md`);
      
      if (!fs.existsSync(fullPath)) {
        continue;
      }
      
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      locationsData.push({
        slug,
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        coordinates: data.coordinates || { lat: 0, lng: 0 },
        image: data.image || '',
        mediaItems: data.mediaItems || [],
      });
    }

    return locationsData;
  } catch (error) {
    console.error('Error getting all location data:', error);
    return [];
  }
}

/**
 * Updates a location with media items
 */
export async function updateLocationWithMedia(locationSlug: string, mediaType: string, mediaSlug: string, mediaTitle: string) {
  try {
    const fullPath = path.join(locationsDirectory, `${locationSlug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Location file not found: ${fullPath}`);
      return false;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    if (!data.mediaItems) {
      data.mediaItems = [];
    }
    
    const existingItem = data.mediaItems.find((item: any) => 
      item.type === mediaType && item.slug === mediaSlug
    );
    
    if (!existingItem) {
      data.mediaItems.push({
        type: mediaType,
        slug: mediaSlug,
        title: mediaTitle
      });
      
      const updatedFileContent = matter.stringify(content, data);
      fs.writeFileSync(fullPath, updatedFileContent);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating location with media (${locationSlug}):`, error);
    return false;
  }
}
'@

# Create a backup of the original file if we haven't already
$backupPath = "$serverMarkdownPath.bak"
if (-not (Test-Path $backupPath)) {
    Copy-Item $serverMarkdownPath $backupPath
    Write-Host "✅ Created backup of original serverMarkdown.ts" -ForegroundColor Green
}

# Write the simplified version
Set-Content $serverMarkdownPath $simplifiedContent
Write-Host "✅ Updated serverMarkdown.ts to use fallback processor" -ForegroundColor Green

# Ensure the fallback processor utility exists
$fallbackPath = "src\utils\fallbackMarkdown.ts"
if (-not (Test-Path $fallbackPath)) {
    # Create the directory if it doesn't exist
    $fallbackDir = Split-Path $fallbackPath
    if (-not (Test-Path $fallbackDir)) {
        New-Item -ItemType Directory -Path $fallbackDir -Force | Out-Null
    }
    
    $fallbackContent = @'
/**
 * FALLBACK MARKDOWN PROCESSOR
 * 
 * This file provides a fallback markdown processor that uses basic string
 * replacement to handle simple HTML in markdown content. It's used when
 * rehype-raw and remark-gfm are unavailable.
 */

/**
 * Processes raw markdown and HTML content into HTML with basic formatting preserved
 * This is used as a fallback when rehype-raw is unavailable
 * 
 * @param content The mixed markdown and HTML content to process
 * @returns The processed HTML content
 */
export function processMixedContent(content: string): string {
  let processedContent = content;
  
  // Preserve important HTML elements
  const htmlElementsToPreserve = [
    { tag: 'div', attributes: ['style', 'class'] },
    { tag: 'img', attributes: ['src', 'alt', 'style'] },
    { tag: 'figure', attributes: ['style', 'class'] },
    { tag: 'figcaption', attributes: ['style', 'class'] },
    { tag: 'p', attributes: ['style', 'class'] },
    { tag: 'span', attributes: ['style', 'class'] },
    { tag: 'h1', attributes: ['style', 'class'] },
    { tag: 'h2', attributes: ['style', 'class'] },
    { tag: 'h3', attributes: ['style', 'class'] },
    { tag: 'h4', attributes: ['style', 'class'] },
    { tag: 'h5', attributes: ['style', 'class'] },
    { tag: 'h6', attributes: ['style', 'class'] },
    { tag: 'ul', attributes: ['style', 'class'] },
    { tag: 'ol', attributes: ['style', 'class'] },
    { tag: 'li', attributes: ['style', 'class'] },
    { tag: 'a', attributes: ['href', 'style', 'class', 'target'] },
  ];
  
  // Temporarily replace HTML elements with placeholders
  let placeholders: { placeholder: string; original: string }[] = [];
  let placeholderIndex = 0;
  
  htmlElementsToPreserve.forEach(({ tag }) => {
    // Match opening tags with attributes
    const openRegex = new RegExp(`<${tag}\\s+[^>]*>`, 'g');
    processedContent = processedContent.replace(openRegex, (match) => {
      const placeholder = `__HTML_PLACEHOLDER_${placeholderIndex++}__`;
      placeholders.push({ placeholder, original: match });
      return placeholder;
    });
    
    // Match closing tags
    const closeRegex = new RegExp(`</${tag}>`, 'g');
    processedContent = processedContent.replace(closeRegex, (match) => {
      const placeholder = `__HTML_PLACEHOLDER_${placeholderIndex++}__`;
      placeholders.push({ placeholder, original: match });
      return placeholder;
    });
    
    // Match self-closing tags
    const selfClosingRegex = new RegExp(`<${tag}\\s+[^>]*/>`, 'g');
    processedContent = processedContent.replace(selfClosingRegex, (match) => {
      const placeholder = `__HTML_PLACEHOLDER_${placeholderIndex++}__`;
      placeholders.push({ placeholder, original: match });
      return placeholder;
    });
  });
  
  // Perform basic markdown to HTML conversion
  processedContent = basicMarkdownToHtml(processedContent);
  
  // Restore HTML elements from placeholders
  placeholders.forEach(({ placeholder, original }) => {
    processedContent = processedContent.replace(placeholder, original);
  });
  
  return processedContent;
}

/**
 * Very basic markdown to HTML conversion for simple elements
 * This is used as a fallback when remark/rehype processors are unavailable
 * It only handles the most common markdown syntax
 * 
 * @param markdown The markdown content to convert
 * @returns Basic HTML conversion
 */
function basicMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  
  // Images not handled here as they're preserved by the placeholder system
  
  // Lists - unordered
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  
  // Lists - ordered
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Paragraphs (only apply to text not already in HTML tags)
  const paragraphs = html.split('\n\n');
  html = paragraphs.map(paragraph => {
    // Skip if it's a placeholder or already has HTML tags
    if (paragraph.trim().startsWith('__HTML_PLACEHOLDER_') || 
        paragraph.trim().startsWith('<') ||
        paragraph.trim() === '') {
      return paragraph;
    }
    return `<p>${paragraph}</p>`;
  }).join('\n\n');
  
  return html;
}

export default processMixedContent;
'@
    
    Set-Content $fallbackPath $fallbackContent
    Write-Host "✅ Created fallbackMarkdown.ts utility" -ForegroundColor Green
}

Write-Host "Quick fix completed!" -ForegroundColor Cyan
Write-Host "You can now run 'npm run dev' to start the development server." -ForegroundColor Cyan
Write-Host "This approach uses a custom fallback HTML processor instead of relying on rehype-raw and remark-gfm." -ForegroundColor Yellow
Write-Host "If you want to restore the original file, just copy $backupPath back to $serverMarkdownPath" -ForegroundColor Yellow 
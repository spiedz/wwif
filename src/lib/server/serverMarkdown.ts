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
    const slugs = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''))
      .filter((slug) => {
        // Filter out any problematic slugs
        if (!slug || slug === 'films' || slug === '' || slug.trim() === '') {
          console.warn(`Filtering out problematic slug from filename: "${slug}"`);
          return false;
        }
        return true;
      });
    
    console.log(`getFilmSlugs returning ${slugs.length} valid slugs`);
    return slugs;
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
        date: typeof data.date === 'string' ? data.date : (data.date ? data.date.toISOString() : new Date().toISOString()),
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
        date: typeof data.date === 'string' ? data.date : (data.date ? data.date.toISOString() : new Date().toISOString()),
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
 * This function is robust and will skip problematic files instead of failing entirely
 */
export async function getAllLocationsData() {
  const locationsData = [];
  let processedCount = 0;
  let skippedCount = 0;
  
  try {
    const slugs = getLocationSlugs();
    console.log(`Processing ${slugs.length} location files for data export...`);

    for (const slug of slugs) {
      try {
        const fullPath = path.join(locationsDirectory, `${slug}.md`);
        
        if (!fs.existsSync(fullPath)) {
          console.warn(`Location file not found: ${fullPath}`);
          skippedCount++;
          continue;
        }
        
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // Parse frontmatter with individual error handling
        let data;
        try {
          const parsed = matter(fileContents);
          data = parsed.data;
        } catch (yamlError) {
          console.error(`YAML parsing error in ${slug}:`, yamlError);
          skippedCount++;
          continue;
        }

        // Validate required fields
        if (!data.name) {
          console.warn(`Location ${slug} is missing required 'name' field. Skipping...`);
          skippedCount++;
          continue;
        }

        // Handle coordinate formats - normalize to {lat, lng}
        let coordinates = { lat: 0, lng: 0 };
        if (data.coordinates) {
          try {
            if (data.coordinates.lat !== undefined && data.coordinates.lng !== undefined) {
              coordinates = {
                lat: Number(data.coordinates.lat) || 0,
                lng: Number(data.coordinates.lng) || 0
              };
            } else if (data.coordinates.latitude !== undefined && data.coordinates.longitude !== undefined) {
              coordinates = {
                lat: Number(data.coordinates.latitude) || 0,
                lng: Number(data.coordinates.longitude) || 0
              };
            }
            
            // Validate coordinates are reasonable
            if (Math.abs(coordinates.lat) > 90 || Math.abs(coordinates.lng) > 180) {
              console.warn(`Invalid coordinates for ${slug}: lat=${coordinates.lat}, lng=${coordinates.lng}. Using defaults.`);
              coordinates = { lat: 0, lng: 0 };
            }
          } catch (coordError) {
            console.warn(`Error parsing coordinates for ${slug}, using defaults:`, coordError);
            coordinates = { lat: 0, lng: 0 };
          }
        }

        // Parse arrays safely
        const safeArray = (field: any): any[] => {
          if (Array.isArray(field)) return field;
          if (field) return [field]; // Convert single value to array
          return [];
        };

        locationsData.push({
          slug,
          name: String(data.name || '').trim(),
          description: String(data.description || '').trim(),
          address: String(data.address || '').trim(),
          city: String(data.city || '').trim(),
          country: String(data.country || '').trim(),
          coordinates: coordinates,
          image: String(data.image || '').trim(),
          mediaItems: safeArray(data.mediaItems),
        });

        processedCount++;
      } catch (fileError) {
        console.error(`Error processing location file ${slug}:`, fileError);
        skippedCount++;
        continue;
      }
    }

    console.log(`Location data processing complete: ${processedCount} processed, ${skippedCount} skipped`);
    return locationsData;
  } catch (error) {
    console.error('Critical error in getAllLocationsData:', error);
    // Return whatever we managed to process instead of empty array
    console.log(`Returning ${locationsData.length} location data items despite error`);
    return locationsData;
  }
}

/**
 * SERVER-ONLY: Updates a location with media items
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

/**
 * SERVER-ONLY: Gets a location by its slug
 * This function is robust and will handle parsing errors gracefully
 */
export async function getLocationBySlug(slug: string) {
  try {
    const fullPath = path.join(locationsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Location file not found: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Parse frontmatter with error handling
    let data, content;
    try {
      const parsed = matter(fileContents);
      data = parsed.data;
      content = parsed.content;
    } catch (yamlError) {
      console.error(`YAML parsing error in location ${slug}:`, yamlError);
      return null;
    }

    // Validate required fields
    if (!data.name) {
      console.error(`Location ${slug} is missing required 'name' field`);
      return null;
    }

    let processedContent;
    try {
      processedContent = await processMarkdownContent(content);
    } catch (contentError) {
      console.warn(`Error processing markdown content for ${slug}, using raw content:`, contentError);
      processedContent = content; // Fallback to raw content
    }

    // Handle coordinate formats - normalize to {lat, lng}
    let coordinates = { lat: 0, lng: 0 };
    if (data.coordinates) {
      try {
        if (data.coordinates.lat !== undefined && data.coordinates.lng !== undefined) {
          coordinates = {
            lat: Number(data.coordinates.lat) || 0,
            lng: Number(data.coordinates.lng) || 0
          };
        } else if (data.coordinates.latitude !== undefined && data.coordinates.longitude !== undefined) {
          coordinates = {
            lat: Number(data.coordinates.latitude) || 0,
            lng: Number(data.coordinates.longitude) || 0
          };
        }
        
        // Validate coordinates are reasonable
        if (Math.abs(coordinates.lat) > 90 || Math.abs(coordinates.lng) > 180) {
          console.warn(`Invalid coordinates for ${slug}: lat=${coordinates.lat}, lng=${coordinates.lng}. Using defaults.`);
          coordinates = { lat: 0, lng: 0 };
        }
      } catch (coordError) {
        console.warn(`Error parsing coordinates for ${slug}, using defaults:`, coordError);
        coordinates = { lat: 0, lng: 0 };
      }
    }

    // Parse arrays safely
    const safeArray = (field: any): any[] => {
      if (Array.isArray(field)) return field;
      if (field) return [field]; // Convert single value to array
      return [];
    };

    const locationData = {
      meta: {
        slug,
        name: String(data.name || '').trim(),
        description: String(data.description || '').trim(),
        address: String(data.address || '').trim(),
        city: String(data.city || '').trim(),
        state: String(data.state || '').trim(),
        country: String(data.country || '').trim(),
        coordinates: coordinates,
        image: String(data.image || '').trim(),
        mediaItems: safeArray(data.mediaItems),
        population: data.population ? Number(data.population) || null : null,
        timezone: String(data.timezone || '').trim(),
        bestTimeToVisit: String(data.bestTimeToVisit || '').trim(),
        travelTips: safeArray(data.travelTips),
        nearbyAttractions: safeArray(data.nearbyAttractions),
        localEvents: safeArray(data.localEvents),
      },
      content: content || '',
      html: processedContent || '',
    };

    return locationData;
  } catch (error) {
    console.error(`Critical error getting location by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SERVER-ONLY: Gets all locations with summary data for listing pages
 * This function is robust and will skip problematic files instead of failing entirely
 */
export async function getAllLocations() {
  const locations = [];
  let processedCount = 0;
  let skippedCount = 0;
  
  try {
    const slugs = getLocationSlugs();
    console.log(`Processing ${slugs.length} location files...`);

    for (const slug of slugs) {
      try {
        const fullPath = path.join(locationsDirectory, `${slug}.md`);
        
        if (!fs.existsSync(fullPath)) {
          console.warn(`Location file not found: ${fullPath}`);
          skippedCount++;
          continue;
        }
        
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // Parse frontmatter with individual error handling
        let data;
        try {
          const parsed = matter(fileContents);
          data = parsed.data;
        } catch (yamlError) {
          console.error(`YAML parsing error in ${slug}:`, yamlError);
          skippedCount++;
          continue;
        }

        // Validate required fields
        if (!data.name || !data.city || !data.country) {
          console.warn(`Location ${slug} is missing required fields (name, city, or country). Skipping...`);
          skippedCount++;
          continue;
        }

        // Count films and series for this location
        const mediaItems = data.mediaItems || [];
        const filmCount = mediaItems.filter((item: any) => item.type === 'film').length;
        const seriesCount = mediaItems.filter((item: any) => item.type === 'series' || item.type === 'tv').length;

        // Handle coordinate formats - normalize to {lat, lng}
        let coordinates = { lat: 0, lng: 0 };
        if (data.coordinates) {
          try {
            if (data.coordinates.lat !== undefined && data.coordinates.lng !== undefined) {
              coordinates = {
                lat: Number(data.coordinates.lat) || 0,
                lng: Number(data.coordinates.lng) || 0
              };
            } else if (data.coordinates.latitude !== undefined && data.coordinates.longitude !== undefined) {
              coordinates = {
                lat: Number(data.coordinates.latitude) || 0,
                lng: Number(data.coordinates.longitude) || 0
              };
            }
          } catch (coordError) {
            console.warn(`Invalid coordinates for ${slug}, using defaults:`, coordError);
          }
        }

        // Validate coordinates are reasonable (basic sanity check)
        if (Math.abs(coordinates.lat) > 90 || Math.abs(coordinates.lng) > 180) {
          console.warn(`Suspicious coordinates for ${slug}: lat=${coordinates.lat}, lng=${coordinates.lng}. Using defaults.`);
          coordinates = { lat: 0, lng: 0 };
        }

        locations.push({
          slug,
          name: String(data.name || '').trim(),
          description: String(data.description || '').trim(),
          city: String(data.city || '').trim(),
          country: String(data.country || '').trim(),
          coordinates: coordinates,
          image: String(data.image || '').trim(),
          filmCount,
          seriesCount,
        });

        processedCount++;
      } catch (fileError) {
        console.error(`Error processing location file ${slug}:`, fileError);
        skippedCount++;
        continue;
      }
    }

    console.log(`Location processing complete: ${processedCount} processed, ${skippedCount} skipped`);

    // Sort by name for consistency
    return locations.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Critical error in getAllLocations:', error);
    // Return whatever we managed to process instead of empty array
    console.log(`Returning ${locations.length} locations despite error`);
    return locations.sort((a, b) => a.name.localeCompare(b.name));
  }
}

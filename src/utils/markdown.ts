import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import { BlogMeta, Content, FilmMeta } from '../types/content';

const filmsDirectory = path.join(process.cwd(), 'content/films');
const blogDirectory = path.join(process.cwd(), 'content/blog');

/**
 * Default rehype-pretty-code configuration options
 */
const prettycodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
};

/**
 * Gets all film slugs from the films directory
 */
export function getFilmSlugs() {
  try {
    const fileNames = fs.readdirSync(filmsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading film slugs:', error);
    return [];
  }
}

/**
 * Gets all blog slugs from the blog directory
 */
export function getBlogSlugs() {
  try {
    const fileNames = fs.readdirSync(blogDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md') && fileName !== 'template.md')
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading blog slugs:', error);
    return [];
  }
}

/**
 * Gets a film by its slug
 */
export async function getFilmBySlug(slug: string): Promise<Content<FilmMeta> | null> {
  try {
    const fullPath = path.join(filmsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process content with remark
    const processedContent = await remark()
      .use(remarkRehype)
      .use(rehypePrettyCode, prettycodeOptions)
      .use(rehypeStringify)
      .process(content);

    const htmlContent = processedContent.toString();

    return {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        coordinates: data.coordinates || [],
        location: data.location || '',
        year: data.year || '',
        director: data.director || '',
        genre: data.genre || '',
        featuredImage: data.featuredImage || '',
        gallery: data.gallery || [],
        posterImage: data.posterImage || '',
        regions: data.regions || [],
        travelTips: data.travelTips || [],
        trivia: data.trivia || [],
        useRegionLayout: data.useRegionLayout || false,
        behindTheScenes: data.behindTheScenes || '',
        streamingServices: data.streamingServices || [],
        bookingOptions: data.bookingOptions || [],
      },
      content,
      html: htmlContent,
    };
  } catch (error) {
    console.error(`Error getting film by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Gets all films
 */
export async function getAllFilms(): Promise<Content<FilmMeta>[]> {
  const slugs = getFilmSlugs();
  const filmsPromises = slugs.map((slug) => getFilmBySlug(slug));
  const films = await Promise.all(filmsPromises);
  return films.filter(Boolean) as Content<FilmMeta>[];
}

/**
 * Gets a blog post by its slug with enhanced formatting
 */
export async function getBlogBySlug(slug: string): Promise<Content<BlogMeta> | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Clean and format the content before processing
    let formattedContent = content
      // Ensure proper line breaks around headers
      .replace(/\n(#{1,3}[^#\n]+)/g, '\n\n$1')
      // Format lists properly
      .replace(/\n(\s*[-*+])/g, '\n\n$1')
      .replace(/\n(\s*\d+\.)/g, '\n\n$1')
      // Format location sections
      .replace(/\n([0-9]+\.\s+[^\n]+)\n/g, '\n\n## $1\n\n')
      .replace(/\n(The Location:)/g, '\n\n### The Location\n\n')
      .replace(/\n(Where to Visit:)/g, '\n\n### Where to Visit\n\n')
      .replace(/\n(Visitor Experience:)/g, '\n\n### Visitor Experience\n\n')
      // Format callouts
      .replace(/\n(Tip:)/g, '\n\n**Tip:**')
      .replace(/\n(Note:)/g, '\n\n**Note:**')
      .replace(/\n(Warning:)/g, '\n\n**Warning:**')
      // Clean up extra line breaks
      .replace(/\n{3,}/g, '\n\n');

    // Process content with remark
    const processedContent = await remark()
      .use(remarkRehype)
      .use(rehypePrettyCode, prettycodeOptions)
      .use(rehypeStringify)
      .process(formattedContent);

    const htmlContent = processedContent.toString();

    return {
      meta: {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        author: data.author || '',
        categories: data.categories || [],
        featuredImage: data.featuredImage || '',
        estimatedReadingTime: calculateReadingTime(content),
      },
      content: formattedContent,
      html: htmlContent,
    };
  } catch (error) {
    console.error(`Error getting blog by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Gets all blog posts
 */
export async function getAllBlogPosts(): Promise<Content<BlogMeta>[]> {
  const slugs = getBlogSlugs();
  const postsPromises = slugs.map((slug) => getBlogBySlug(slug));
  const posts = await Promise.all(postsPromises);
  
  // Filter out null values and sort by date (newest first)
  return posts
    .filter((post): post is Content<BlogMeta> => post !== null)
    .sort((a: Content<BlogMeta>, b: Content<BlogMeta>) => {
      if (!a.meta.date) return 1;
      if (!b.meta.date) return -1;
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });
}

/**
 * Calculate estimated reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Gets related blog posts
 */
export async function getRelatedBlogPosts(currentSlug: string, limit = 3): Promise<Content<BlogMeta>[]> {
  const allPosts = await getAllBlogPosts();
  const currentPost = allPosts.find(post => post.meta.slug === currentSlug);
  
  if (!currentPost) return [];
  
  // Find posts with matching categories
  const relatedPosts = allPosts
    .filter(post => {
      if (post.meta.slug === currentSlug) return false;
      
      // Check for category overlap
      if (currentPost.meta.categories && post.meta.categories) {
        return currentPost.meta.categories.some(cat => 
          post.meta.categories?.includes(cat)
        );
      }
      
      return false;
    })
    .slice(0, limit);
  
  // If not enough related posts by category, add recent posts
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
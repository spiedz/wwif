/**
 * This is a manual test script for the markdown parser.
 * Run using: npm run test:markdown
 */

import path from 'path';
import { getFilmBySlug, getBlogBySlug, getAllFilms, getAllBlogPosts } from '../lib/server/serverMarkdown';

// Log directories for debugging
console.log('Current working directory:', process.cwd());
console.log('File directory:', path.resolve(__dirname));

async function testMarkdownParser() {
  console.log('Testing Markdown Parser...');
  
  // Test getting a film by slug
  console.log('\n--- Testing getFilmBySlug ---');
  const film = await getFilmBySlug('where-was-dark-knight-filmed.md');
  if (film) {
    console.log('Film title:', film.meta.title);
    console.log('Film year:', film.meta.year);
    console.log('Director:', film.meta.director);
    console.log('Coordinates count:', film.meta.coordinates.length);
    console.log('First location:', film.meta.coordinates[0].name);
  } else {
    console.error('Film not found or error occurred');
  }
  
  // Test getting a blog by slug
  console.log('\n--- Testing getBlogBySlug ---');
  const blog = await getBlogBySlug('best-filming-locations-in-chicago.md');
  if (blog) {
    console.log('Blog title:', blog.meta.title);
    console.log('Blog date:', blog.meta.date);
    console.log('Blog author:', blog.meta.author);
    console.log('Categories:', blog.meta.categories?.join(', '));
  } else {
    console.error('Blog not found or error occurred');
  }
  
  // Test getting all films
  console.log('\n--- Testing getAllFilms ---');
  const films = await getAllFilms();
  console.log('Number of films found:', films.length);
  films.forEach((film, index) => {
    console.log(`${index + 1}. ${film.meta.title} (${film.meta.year})`);
  });
  
  // Test getting all blogs
  console.log('\n--- Testing getAllBlogPosts ---');
  const blogs = await getAllBlogPosts();
  console.log('Number of blogs found:', blogs.length);
  blogs.forEach((blog, index) => {
    console.log(`${index + 1}. ${blog.meta.title} (${blog.meta.date})`);
  });
}

// Run the test
testMarkdownParser().catch(error => {
  console.error('Test failed with error:', error);
}); 

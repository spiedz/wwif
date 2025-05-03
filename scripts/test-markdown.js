const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directories
const filmsDirectory = path.join(process.cwd(), 'content/films');
const blogDirectory = path.join(process.cwd(), 'content/blog');

console.log('--- Testing Markdown Parser ---');

// Test if directories exist
console.log('Films directory exists:', fs.existsSync(filmsDirectory));
console.log('Blog directory exists:', fs.existsSync(blogDirectory));

// List files in directories
console.log('\nFiles in films directory:');
try {
  const filmFiles = fs.readdirSync(filmsDirectory);
  filmFiles.forEach(file => console.log(`- ${file}`));
} catch (error) {
  console.error('Error reading films directory:', error);
}

console.log('\nFiles in blog directory:');
try {
  const blogFiles = fs.readdirSync(blogDirectory);
  blogFiles.forEach(file => console.log(`- ${file}`));
} catch (error) {
  console.error('Error reading blog directory:', error);
}

// Test parsing a film
console.log('\n--- Testing Film Parsing ---');
try {
  const filmSlug = 'where-was-dark-knight-filmed.md';
  const fullPath = path.join(filmsDirectory, filmSlug);
  
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    console.log('Film data parsed successfully.');
    console.log('Title:', data.title);
    console.log('Description:', data.description.substring(0, 50) + '...');
    console.log('Slug:', data.slug);
    console.log('Year:', data.year);
    console.log('Genre:', Array.isArray(data.genre) ? data.genre.join(', ') : data.genre);
    console.log('Director:', data.director);
    console.log('Coordinates count:', data.coordinates ? data.coordinates.length : 'None');
    
    if (data.coordinates && data.coordinates.length > 0) {
      console.log('\nFirst location:');
      console.log('- Name:', data.coordinates[0].name);
      console.log('- Lat/Lng:', data.coordinates[0].lat, data.coordinates[0].lng);
      console.log('- Description:', data.coordinates[0].description);
    }
    
    console.log('\nContent preview:', content.substring(0, 100) + '...');
  } else {
    console.error(`Film file ${filmSlug} does not exist.`);
  }
} catch (error) {
  console.error('Error parsing film:', error);
}

// Test parsing a blog
console.log('\n--- Testing Blog Parsing ---');
try {
  const blogSlug = 'best-filming-locations-in-chicago.md';
  const fullPath = path.join(blogDirectory, blogSlug);
  
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    console.log('Blog data parsed successfully.');
    console.log('Title:', data.title);
    console.log('Description:', data.description.substring(0, 50) + '...');
    console.log('Slug:', data.slug);
    console.log('Date:', data.date);
    console.log('Author:', data.author);
    console.log('Categories:', data.categories ? (Array.isArray(data.categories) ? data.categories.join(', ') : data.categories) : 'None');
    
    console.log('\nContent preview:', content.substring(0, 100) + '...');
  } else {
    console.error(`Blog file ${blogSlug} does not exist.`);
  }
} catch (error) {
  console.error('Error parsing blog:', error);
}

console.log('\n--- Test Completed Successfully ---'); 
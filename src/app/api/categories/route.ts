import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FilmMeta } from '../../../types/content';

// Define content directories
const filmsDirectory = path.join(process.cwd(), 'content/films');

// Helper function to get all film slugs
function getFilmSlugs() {
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

// Helper function to get film metadata
function getFilmMeta(slug: string): FilmMeta | null {
  try {
    const fullPath = path.join(filmsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      coordinates: data.coordinates || [],
      location: data.location || '',
      year: data.year || '',
      director: data.director || '',
      genre: data.genre || [],
      categories: data.categories || [],
      featuredImage: data.featuredImage || '',
      gallery: data.gallery || [],
    };
  } catch (error) {
    console.error(`Error getting film meta (${slug}):`, error);
    return null;
  }
}

// Extract categories from film metadata and count occurrences
function extractCategoriesFromFilms(): { name: string; count: number }[] {
  const slugs = getFilmSlugs();
  const categoryMap = new Map<string, number>();
  
  slugs.forEach(slug => {
    const filmMeta = getFilmMeta(slug);
    if (!filmMeta) return;
    
    // Process categories array
    if (filmMeta.categories && Array.isArray(filmMeta.categories)) {
      filmMeta.categories.forEach((category: string) => {
        const normalizedCategory = normalizeCategory(category);
        categoryMap.set(
          normalizedCategory, 
          (categoryMap.get(normalizedCategory) || 0) + 1
        );
      });
    }
    
    // Process genre (many films will use genre instead of categories)
    if (filmMeta.genre) {
      const genres = Array.isArray(filmMeta.genre) 
        ? filmMeta.genre 
        : [filmMeta.genre];
        
      genres.forEach((genre: string) => {
        const normalizedGenre = normalizeCategory(genre);
        categoryMap.set(
          normalizedGenre, 
          (categoryMap.get(normalizedGenre) || 0) + 1
        );
      });
    }
  });
  
  // Convert map to array and sort by count (descending)
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Normalize category name
function normalizeCategory(category: string): string {
  return category.trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Extract categories from films
    const allCategories = extractCategoriesFromFilms();
    
    // Apply filters if needed
    let filteredCategories = [...allCategories];
    
    // Limit parameter
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    if (limit && !isNaN(limit)) {
      filteredCategories = filteredCategories.slice(0, limit);
    }
    
    // Min count filter
    const minCountParam = searchParams.get('minCount');
    const minCount = minCountParam ? parseInt(minCountParam, 10) : undefined;
    
    if (minCount && !isNaN(minCount)) {
      filteredCategories = filteredCategories.filter(cat => cat.count >= minCount);
    }
    
    // Sort parameter
    const sort = searchParams.get('sort');
    if (sort === 'alphabetical') {
      filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'reverse_alphabetical') {
      filteredCategories.sort((a, b) => b.name.localeCompare(a.name));
    }
    // Default is already popularity (by count)
    
    return NextResponse.json({
      categories: filteredCategories,
      total: allCategories.length
    });
  } catch (error) {
    console.error('Error processing categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 
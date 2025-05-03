import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Content, FilmMeta } from '../../../../types/content';

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
    const { data, content } = matter(fileContents);

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

// Normalize category/genre name
function normalizeCategory(category: string): string {
  return category.trim().toLowerCase();
}

// Get films by category name (case-insensitive)
function getFilmsByCategory(categoryName: string): Content<FilmMeta>[] {
  const slugs = getFilmSlugs();
  const normalizedCategoryName = normalizeCategory(categoryName);
  const matchingFilms: Content<FilmMeta>[] = [];
  
  for (const slug of slugs) {
    const filmMeta = getFilmMeta(slug);
    if (!filmMeta) continue;
    
    let isMatch = false;
    
    // Check categories array
    if (filmMeta.categories && Array.isArray(filmMeta.categories)) {
      if (filmMeta.categories.some((cat: string) => 
        normalizeCategory(cat) === normalizedCategoryName
      )) {
        isMatch = true;
      }
    }
    
    // Check genre (many films will use genre instead of categories)
    if (!isMatch && filmMeta.genre) {
      const genres = Array.isArray(filmMeta.genre) 
        ? filmMeta.genre 
        : [filmMeta.genre];
        
      if (genres.some((genre: string) => 
        normalizeCategory(genre) === normalizedCategoryName
      )) {
        isMatch = true;
      }
    }
    
    if (isMatch) {
      matchingFilms.push({
        meta: filmMeta,
        content: '', // We don't need the full content for the API
        html: ''
      });
    }
  }
  
  return matchingFilms;
}

export async function GET(
  request: Request,
  { params }: { params: { categoryName: string } }
) {
  const { categoryName } = params;
  
  if (!categoryName) {
    return NextResponse.json(
      { error: 'Category name is required' },
      { status: 400 }
    );
  }
  
  try {
    const films = getFilmsByCategory(categoryName);
    
    return NextResponse.json({
      category: categoryName,
      count: films.length,
      films
    });
  } catch (error) {
    console.error(`Error fetching films for category ${categoryName}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch films for this category' },
      { status: 500 }
    );
  }
} 
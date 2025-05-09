import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FranchiseData, FranchiseFrontmatter, Location } from '../../types/franchise';

const FRANCHISES_DIRECTORY = path.join(process.cwd(), 'content/franchises');

/**
 * Gets all franchise slugs from the franchises directory
 */
export function getFranchiseSlugs(): string[] {
  try {
    if (!fs.existsSync(FRANCHISES_DIRECTORY)) {
      fs.mkdirSync(FRANCHISES_DIRECTORY, { recursive: true });
      return [];
    }

    return fs
      .readdirSync(FRANCHISES_DIRECTORY)
      .filter(filename => filename.endsWith('.md'))
      .map(filename => filename.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading franchise slugs:', error);
    return [];
  }
}

/**
 * Reads a franchise markdown file and returns the parsed data
 */
export function getFranchiseBySlug(slug: string): FranchiseData | null {
  try {
    const fullPath = path.join(FRANCHISES_DIRECTORY, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convert frontmatter to FranchiseData structure
    const frontmatter = data as FranchiseFrontmatter;
    
    // Transform mapLocations to the correct structure
    const mapLocations: Location[] = frontmatter.mapLocations.map(location => ({
      id: location.id,
      name: location.name,
      description: location.description,
      coordinates: {
        lat: location.lat,
        lng: location.lng
      },
      filmSlugs: location.filmSlugs,
      address: location.address,
      isVisitable: location.isVisitable,
      visitInfo: location.visitInfo
    }));

    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      description: frontmatter.description,
      bannerImage: frontmatter.bannerImage,
      logoImage: frontmatter.logoImage,
      overview: content.trim(),
      films: frontmatter.films,
      mapLocations,
      travelGuides: frontmatter.travelGuides,
      galleryImages: frontmatter.galleryImages,
      meta: frontmatter.meta
    };
  } catch (error) {
    console.error(`Error reading franchise data for ${slug}:`, error);
    return null;
  }
}

/**
 * Gets all franchises data
 */
export function getAllFranchises(): FranchiseData[] {
  const slugs = getFranchiseSlugs();
  const franchises = slugs
    .map(slug => getFranchiseBySlug(slug))
    .filter((franchise): franchise is FranchiseData => franchise !== null);
  
  return franchises;
}

/**
 * Finds all films associated with a franchise
 */
export function getFranchiseFilmSlugs(franchiseSlug: string): string[] {
  const franchise = getFranchiseBySlug(franchiseSlug);
  if (!franchise) return [];
  
  return franchise.films.map(film => film.slug);
}

/**
 * Gets all locations associated with a franchise
 */
export function getFranchiseLocations(franchiseSlug: string): Location[] {
  const franchise = getFranchiseBySlug(franchiseSlug);
  if (!franchise) return [];
  
  return franchise.mapLocations;
}

/**
 * Gets the franchise a film belongs to (if any)
 */
export function getFranchiseByFilmSlug(filmSlug: string): FranchiseData | null {
  const franchises = getAllFranchises();
  
  return franchises.find(franchise => 
    franchise.films.some(film => film.slug === filmSlug)
  ) || null;
}

/**
 * Creates franchise directory if it doesn't exist
 */
export function ensureFranchiseDirectory(): void {
  if (!fs.existsSync(FRANCHISES_DIRECTORY)) {
    fs.mkdirSync(FRANCHISES_DIRECTORY, { recursive: true });
  }
} 
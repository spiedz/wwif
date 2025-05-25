import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ContentCreateRequest {
  type: 'film' | 'series' | 'blog';
  title: string;
  slug: string;
  description: string;
  content: string;
  meta: {
    year?: number;
    director?: string;
    genre?: string[];
    countries?: string[];
    coordinates?: Array<{
      lat: number;
      lng: number;
      name: string;
      description: string;
    }>;
    posterImage?: string;
    trailer?: string;
    category?: string;
    tags?: string[];
    author?: string;
  };
}

// Content validation and optimization
const validateContent = (data: ContentCreateRequest): string[] => {
  const errors: string[] = [];
  
  if (!data.title || data.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  
  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must be lowercase letters, numbers, and hyphens only');
  }
  
  if (!data.description || data.description.length < 50) {
    errors.push('Description must be at least 50 characters');
  }
  
  if (!data.content || data.content.length < 200) {
    errors.push('Content must be at least 200 characters');
  }
  
  return errors;
};

const optimizeContent = (data: ContentCreateRequest): ContentCreateRequest => {
  // Auto-generate SEO-friendly elements
  const optimized = { ...data };
  
  // Ensure description is within SEO limits
  if (optimized.description.length > 160) {
    optimized.description = optimized.description.substring(0, 157) + '...';
  }
  
  // Auto-generate coordinates if missing for films/series
  if ((data.type === 'film' || data.type === 'series') && !data.meta.coordinates) {
    optimized.meta.coordinates = [];
  }
  
  return optimized;
};

const generateMarkdown = (data: ContentCreateRequest): string => {
  const frontmatter = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    ...data.meta
  };
  
  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n')}`;
      }
      return `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`;
    })
    .join('\n');
    
  return `---\n${frontmatterString}\n---\n\n${data.content}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const data: ContentCreateRequest = req.body;
    
    // Validate content
    const validationErrors = validateContent(data);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Check if content already exists
    const contentDir = join(process.cwd(), 'content', data.type === 'film' ? 'films' : data.type === 'series' ? 'series' : 'blog');
    const filePath = join(contentDir, `${data.slug}.md`);
    
    if (existsSync(filePath)) {
      return res.status(409).json({ 
        error: 'Content already exists', 
        slug: data.slug 
      });
    }
    
    // Optimize content
    const optimizedData = optimizeContent(data);
    
    // Generate markdown
    const markdown = generateMarkdown(optimizedData);
    
    // Ensure directory exists
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true });
    }
    
    // Write file
    writeFileSync(filePath, markdown, 'utf-8');
    
    // Calculate quality score (simplified version)
    const qualityScore = Math.min(100, 
      (data.title.length >= 10 ? 20 : 10) +
      (data.description.length >= 120 ? 20 : 10) +
      (data.content.length >= 500 ? 25 : 15) +
      (data.meta.posterImage ? 15 : 0) +
      (data.meta.coordinates && data.meta.coordinates.length > 0 ? 10 : 0) +
      (data.meta.genre && data.meta.genre.length > 0 ? 10 : 0)
    );
    
    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: {
        slug: data.slug,
        path: filePath,
        qualityScore,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${data.type === 'film' ? 'films' : data.type === 'series' ? 'series' : 'blog'}/${data.slug}`
      }
    });
    
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ 
      error: 'Failed to create content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
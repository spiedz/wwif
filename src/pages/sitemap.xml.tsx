import { GetServerSideProps } from 'next';
import { getFilmSlugs, getBlogSlugs, getSeriesSlugs } from '../lib/server/serverMarkdown';
// Removed location utilities import
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

// Get the last modified date of a file
function getFileLastModified(filepath: string): string {
  try {
    const stats = fs.statSync(filepath);
    return stats.mtime.toISOString();
  } catch (error) {
    console.error(`Error getting last modified time for ${filepath}:`, error);
    return new Date().toISOString();
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Validate a slug is a valid URL path segment
function isValidSlug(slug: string): boolean {
  // Basic validation to ensure the slug doesn't contain characters that would break XML
  return Boolean(slug) && 
         !/[<>&'"()]/.test(slug) && 
         slug.length > 0 && 
         slug.length < 200; // Reasonable max length for a URL segment
}

function generateSiteMap(
  filmSlugs: string[], 
  blogSlugs: string[], 
  seriesSlugs: string[],
  lastModDates: {
    films: Record<string, string>,
    blogs: Record<string, string>,
    series: Record<string, string>
  }
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${escapeXml(BASE_URL)}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${escapeXml(BASE_URL)}/films</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${escapeXml(BASE_URL)}/blog</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${escapeXml(BASE_URL)}/series</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>

     ${filmSlugs
       .filter(slug => isValidSlug(slug))
       .map(slug => {
         return `
       <url>
           <loc>${escapeXml(`${BASE_URL}/films/${slug}`)}</loc>
           <lastmod>${lastModDates.films[slug] || new Date().toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
     ${blogSlugs
       .filter(slug => isValidSlug(slug))
       .map(slug => {
         return `
       <url>
           <loc>${escapeXml(`${BASE_URL}/blog/${slug}`)}</loc>
           <lastmod>${lastModDates.blogs[slug] || new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
     ${seriesSlugs
       .filter(slug => isValidSlug(slug))
       .map(slug => {
         return `
       <url>
           <loc>${escapeXml(`${BASE_URL}/series/${slug}`)}</loc>
           <lastmod>${lastModDates.series[slug] || new Date().toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}

   </urlset>
 `;
}

function SiteMap() {
  // Server-side rendering so we don't need a component
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const filmSlugs = getFilmSlugs();
    const blogSlugs = getBlogSlugs();
    const seriesSlugs = getSeriesSlugs();
    
    // Removed location slugs functionality
    
    // Get last modified dates for all content files
    const filmsDir = path.join(process.cwd(), 'content/films');
    const blogsDir = path.join(process.cwd(), 'content/blog');
    const seriesDir = path.join(process.cwd(), 'content/series');
    
    const lastModDates = {
      films: {} as Record<string, string>,
      blogs: {} as Record<string, string>,
      series: {} as Record<string, string>
    };
    
    // Get last modified dates for film files
    filmSlugs.forEach(slug => {
      const filePath = path.join(filmsDir, `${slug}.md`);
      lastModDates.films[slug] = getFileLastModified(filePath);
    });
    
    // Get last modified dates for blog files
    blogSlugs.forEach(slug => {
      const filePath = path.join(blogsDir, `${slug}.md`);
      lastModDates.blogs[slug] = getFileLastModified(filePath);
    });
    
    // Get last modified dates for series files
    seriesSlugs.forEach(slug => {
      const filePath = path.join(seriesDir, `${slug}.md`);
      lastModDates.series[slug] = getFileLastModified(filePath);
    });

    // Generate the XML sitemap with the film, blog, and series data
    const sitemap = generateSiteMap(filmSlugs, blogSlugs, seriesSlugs, lastModDates);

    res.setHeader('Content-Type', 'text/xml');
    // Add Cache-Control header to help with CDN caching
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400'); // 1 hour client cache, 24 hours CDN cache
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a minimal sitemap with just the homepage in case of errors
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${escapeXml(BASE_URL)}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      </urlset>`;
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(fallbackSitemap);
    res.end();
  }

  return {
    props: {},
  };
};

export default SiteMap; 
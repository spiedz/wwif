/**
 * This script generates a sitemap.xml file for the Where Was It Filmed website
 * Run with: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.com';

// Get all film slugs
function getFilmSlugs() {
  const filmsDirectory = path.join(process.cwd(), 'content/films');
  try {
    return fs
      .readdirSync(filmsDirectory)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading film directory:', error);
    return [];
  }
}

// Get all blog slugs
function getBlogSlugs() {
  const blogDirectory = path.join(process.cwd(), 'content/blog');
  try {
    return fs
      .readdirSync(blogDirectory)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

async function generateSitemap() {
  // Get dynamic routes
  const filmSlugs = getFilmSlugs();
  const blogSlugs = getBlogSlugs();

  // Add static routes
  const staticPages = ['', 'films', 'blog'];

  // Generate sitemap XML
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(page => {
          return `
            <url>
              <loc>${BASE_URL}/${page}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>${page === '' ? '1.0' : '0.8'}</priority>
            </url>
          `;
        })
        .join('')}
      ${filmSlugs
        .map(slug => {
          return `
            <url>
              <loc>${BASE_URL}/films/${slug}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
      ${blogSlugs
        .map(slug => {
          return `
            <url>
              <loc>${BASE_URL}/blog/${slug}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.6</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  // Format the XML
  const formatted = prettier.format(sitemap, {
    parser: 'html',
    printWidth: 100,
  });

  // Write the sitemap to public directory
  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), formatted);
  console.log('✅ Sitemap generated successfully!');
}

// Run the sitemap generator
generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
}); 
import fs from 'fs';
import path from 'path';
import { getFilmSlugs, getBlogSlugs, getSeriesSlugs, getLocationSlugs } from './serverMarkdown';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

/**
 * Generate XML sitemap for all static pages and content
 */
export function generateSitemap(): string {
  const staticPages = [
    '',
    '/films',
    '/blog', 
    '/locations',
    '/privacy'
  ];

  const filmSlugs = getFilmSlugs();
  const blogSlugs = getBlogSlugs();
  const seriesSlugs = getSeriesSlugs();
  const locationSlugs = getLocationSlugs();

  const urlEntries = [
    ...staticPages.map(page => ({
      url: `${baseUrl}${page}`,
      lastmod: new Date().toISOString(),
      changefreq: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? '1.0' : page === '/locations' ? '0.9' : '0.8'
    })),
    ...filmSlugs.map(slug => ({
      url: `${baseUrl}/films/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    })),
    ...blogSlugs.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    })),
    ...seriesSlugs.map(slug => ({
      url: `${baseUrl}/series/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    })),
    ...locationSlugs.map(slug => ({
      url: `${baseUrl}/locations/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

/**
 * Generate image sitemap for location featured images
 */
export function generateLocationImageSitemap(): string {
  try {
    const locationSlugs = getLocationSlugs();
    const locationsDirectory = path.join(process.cwd(), 'content/locations');
    
    const imageEntries: any[] = [];

    locationSlugs.forEach(slug => {
      try {
        const fullPath = path.join(locationsDirectory, `${slug}.md`);
        if (fs.existsSync(fullPath)) {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matter = require('gray-matter');
          const { data } = matter(fileContents);

          if (data.image) {
            imageEntries.push({
              url: `${baseUrl}/locations/${slug}`,
              image: data.image,
              title: data.name || slug,
              caption: `${data.name} filming location in ${data.country}`,
              location: `${data.city}, ${data.country}`
            });
          }
        }
      } catch (error) {
        console.error(`Error processing location image for ${slug}:`, error);
      }
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <image:image>
      <image:loc>${entry.image}</image:loc>
      <image:title>${entry.title}</image:title>
      <image:caption>${entry.caption}</image:caption>
      <image:geo_location>${entry.location}</image:geo_location>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  } catch (error) {
    console.error('Error generating location image sitemap:', error);
    return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  }
} 
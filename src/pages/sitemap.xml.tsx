import { GetServerSideProps } from 'next';
import { generateSitemap } from '../lib/server/sitemaps';

function SiteMap() {
  // Server-side rendering so we don't need a component
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Generate the XML sitemap with all content including locations
    const sitemap = generateSitemap();

    res.setHeader('Content-Type', 'text/xml');
    // Add Cache-Control header to help with CDN caching
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400'); // 1 hour client cache, 24 hours CDN cache
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a minimal sitemap with just the homepage in case of errors
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}</loc>
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
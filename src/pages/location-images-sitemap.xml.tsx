import { GetServerSideProps } from 'next';
import { generateLocationImageSitemap } from '../lib/server/sitemaps';

function LocationImageSitemap() {
  // Server-side rendering so we don't need a component
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Generate the location image sitemap
    const sitemap = generateLocationImageSitemap();

    res.setHeader('Content-Type', 'text/xml');
    // Add Cache-Control header to help with CDN caching
    res.setHeader('Cache-Control', 'public, max-age=7200, s-maxage=86400'); // 2 hours client cache, 24 hours CDN cache
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Error generating location image sitemap:', error);
    
    // Return a minimal sitemap in case of errors
    const fallbackSitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(fallbackSitemap);
    res.end();
  }

  return {
    props: {},
  };
};

export default LocationImageSitemap; 
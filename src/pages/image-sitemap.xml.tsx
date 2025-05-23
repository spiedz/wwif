import { GetServerSideProps } from 'next';
import { getFilmSlugs, getBlogSlugs, getSeriesSlugs } from '../lib/server/serverMarkdown';
import { getAllLocationSlugs } from '../utils/locationUtils';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

// Interface for image data
interface ImageData {
  url: string;
  title: string;
  caption?: string;
  geoLocation?: string;
  license?: string;
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

// Extract images from film content
function extractFilmImages(slug: string): ImageData[] {
  const images: ImageData[] = [];
  
  try {
    const filePath = path.join(process.cwd(), 'content/films', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);
    
    // Add poster image
    if (frontmatter.posterImage) {
      images.push({
        url: frontmatter.posterImage,
        title: `${frontmatter.title} Movie Poster`,
        caption: `Official poster for ${frontmatter.title} (${frontmatter.year})`,
        geoLocation: frontmatter.coordinates?.[0]?.name || ''
      });
    }

    // Add featured image
    if (frontmatter.featuredImage) {
      images.push({
        url: frontmatter.featuredImage,
        title: `${frontmatter.title} Featured Image`,
        caption: `Featured image from ${frontmatter.title} filming locations`,
        geoLocation: frontmatter.coordinates?.[0]?.name || ''
      });
    }

    // Add location images from coordinates
    if (frontmatter.coordinates && Array.isArray(frontmatter.coordinates)) {
      frontmatter.coordinates.forEach((coord: any, index: number) => {
        if (coord.image) {
          images.push({
            url: coord.image,
            title: `${frontmatter.title} - ${coord.name}`,
            caption: coord.description || `Filming location for ${frontmatter.title}`,
            geoLocation: coord.name
          });
        }
      });
    }

    // Add gallery images
    if (frontmatter.gallery && Array.isArray(frontmatter.gallery)) {
      frontmatter.gallery.forEach((imageUrl: string, index: number) => {
        images.push({
          url: imageUrl,
          title: `${frontmatter.title} Gallery Image ${index + 1}`,
          caption: `Behind the scenes image from ${frontmatter.title}`,
          geoLocation: frontmatter.coordinates?.[0]?.name || ''
        });
      });
    }

  } catch (error) {
    console.error(`Error extracting images from film ${slug}:`, error);
  }

  return images;
}

// Extract images from series content
function extractSeriesImages(slug: string): ImageData[] {
  const images: ImageData[] = [];
  
  try {
    const filePath = path.join(process.cwd(), 'content/series', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);
    
    // Add poster image
    if (frontmatter.posterImage) {
      images.push({
        url: frontmatter.posterImage,
        title: `${frontmatter.title} Series Poster`,
        caption: `Official poster for ${frontmatter.title} TV series`,
        geoLocation: frontmatter.mainLocation || ''
      });
    }

    // Add featured image
    if (frontmatter.featuredImage) {
      images.push({
        url: frontmatter.featuredImage,
        title: `${frontmatter.title} Featured Image`,
        caption: `Featured image from ${frontmatter.title} filming locations`,
        geoLocation: frontmatter.mainLocation || ''
      });
    }

    // Add filming location images
    if (frontmatter.filmingLocations && Array.isArray(frontmatter.filmingLocations)) {
      frontmatter.filmingLocations.forEach((location: any) => {
        if (location.image) {
          images.push({
            url: location.image,
            title: `${frontmatter.title} - ${location.name}`,
            caption: location.description || `Filming location for ${frontmatter.title}`,
            geoLocation: location.name
          });
        }
      });
    }

  } catch (error) {
    console.error(`Error extracting images from series ${slug}:`, error);
  }

  return images;
}

// Extract images from blog content
function extractBlogImages(slug: string): ImageData[] {
  const images: ImageData[] = [];
  
  try {
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);
    
    // Add featured image
    if (frontmatter.featuredImage) {
      images.push({
        url: frontmatter.featuredImage,
        title: frontmatter.title,
        caption: frontmatter.description || `Blog post: ${frontmatter.title}`,
        geoLocation: frontmatter.coordinates?.[0]?.name || ''
      });
    }

    // Add coordinate images
    if (frontmatter.coordinates && Array.isArray(frontmatter.coordinates)) {
      frontmatter.coordinates.forEach((coord: any) => {
        if (coord.image) {
          images.push({
            url: coord.image,
            title: `${frontmatter.title} - ${coord.name}`,
            caption: coord.description || `Location featured in ${frontmatter.title}`,
            geoLocation: coord.name
          });
        }
      });
    }

  } catch (error) {
    console.error(`Error extracting images from blog ${slug}:`, error);
  }

  return images;
}

// Generate the image sitemap XML
function generateImageSitemap(allImages: ImageData[]): string {
  const imageEntries = allImages
    .filter(image => image.url && image.title)
    .map(image => {
      return `    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      ${image.caption ? `<image:caption>${escapeXml(image.caption)}</image:caption>` : ''}
      ${image.geoLocation ? `<image:geo_location>${escapeXml(image.geoLocation)}</image:geo_location>` : ''}
      ${image.license ? `<image:license>${escapeXml(image.license)}</image:license>` : ''}
    </image:image>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(BASE_URL)}</loc>
${imageEntries}
  </url>
</urlset>`;
}

function ImageSitemap() {
  // Server-side rendering so we don't need a component
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const filmSlugs = getFilmSlugs();
    const blogSlugs = getBlogSlugs();
    const seriesSlugs = getSeriesSlugs();
    
    let allImages: ImageData[] = [];

    // Extract images from all films
    filmSlugs.forEach(slug => {
      const filmImages = extractFilmImages(slug);
      allImages = allImages.concat(filmImages);
    });

    // Extract images from all series
    seriesSlugs.forEach(slug => {
      const seriesImages = extractSeriesImages(slug);
      allImages = allImages.concat(seriesImages);
    });

    // Extract images from all blog posts
    blogSlugs.forEach(slug => {
      const blogImages = extractBlogImages(slug);
      allImages = allImages.concat(blogImages);
    });

    // Remove duplicates based on URL
    const uniqueImages = allImages.filter((image, index, self) => 
      index === self.findIndex(img => img.url === image.url)
    );

    // Generate the image sitemap
    const imageSitemap = generateImageSitemap(uniqueImages);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.write(imageSitemap);
    res.end();

  } catch (error) {
    console.error('Error generating image sitemap:', error);
    
    // Return a minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(BASE_URL)}</loc>
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

export default ImageSitemap; 
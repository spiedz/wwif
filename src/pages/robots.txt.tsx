import { GetServerSideProps } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';

function generateRobotsTxt() {
  return `# Robots.txt for Where Was It Filmed
# Optimized for SEO and crawl efficiency

# Host declaration
Host: ${BASE_URL}

# Allow all crawlers access to public content
User-agent: *
Allow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /user/
Disallow: /login/
Disallow: /register/

# Block search and filter parameters to prevent duplicate content
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*page=
Disallow: /*?*search=
Disallow: /*?*q=
Disallow: /*?*utm_*

# Block development and testing paths
Disallow: /test/
Disallow: /dev/
Disallow: /.well-known/
Disallow: /debug/

# Block temporary and cache files
Disallow: /tmp/
Disallow: /cache/
Disallow: /*.json$

# Allow important static assets and sitemaps
Allow: /images/
Allow: /css/
Allow: /js/
Allow: /fonts/
Allow: /icons/
Allow: /sitemap.xml
Allow: /image-sitemap.xml

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Block aggressive crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Sitemap references
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/image-sitemap.xml
`;
}

function RobotsTxt() {
  // Server-side rendering so we don't need a component
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Generate the robots.txt content
  const robotsTxt = generateRobotsTxt();

  res.setHeader('Content-Type', 'text/plain');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default RobotsTxt; 
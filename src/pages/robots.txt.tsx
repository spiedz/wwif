import { GetServerSideProps } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.com';

function generateRobotsTxt() {
  return `# *
User-agent: *
Allow: /

# Host
Host: ${BASE_URL}

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
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
import { GetServerSideProps } from 'next';
import { generateLocationSlug } from '../../utils/locationUtils';

/**
 * This page exists solely to redirect from the SEO-friendly format
 * 'what-was-filmed-in-[location]' to the simpler '[slug]' format.
 * It helps maintain compatibility with both URL formats.
 */
export default function LocationRedirectPage() {
  // This page will never render - we're redirecting at the server level
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const location = params?.location as string;
  
  if (!location) {
    return {
      notFound: true
    };
  }
  
  // Extract the base location name from the slug
  const baseLocationSlug = location;
  
  // Redirect to the simple slug version
  return {
    redirect: {
      destination: `/locations/${baseLocationSlug}`,
      permanent: true, // 301 redirect for SEO benefit
    }
  };
}; 
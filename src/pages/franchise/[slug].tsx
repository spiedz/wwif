import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { ParsedUrlQuery } from 'querystring';
import { FranchiseData } from '../../types/franchise';
import { getAllFranchises, getFranchiseBySlug } from '../../lib/franchise/franchiseUtils';
import FranchiseNotFound from '../../components/FranchiseNotFound';

// Dynamically import the franchise template with a loading state
const FranchiseTemplate = dynamic(() => import('../../components/franchise/FranchiseTemplate'), {
  loading: () => <div className="h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading franchise data...</p>
    </div>
  </div>
});

// Import franchise components dynamically to improve performance
const FranchiseHero = dynamic(() => import('../../components/franchise/FranchiseHero'));
const FranchiseNavigation = dynamic(() => import('../../components/franchise/FranchiseNavigation'));
const FranchiseOverview = dynamic(() => import('../../components/franchise/FranchiseOverview'));
const FranchiseFilmGrid = dynamic(() => import('../../components/franchise/FranchiseFilmGrid'));
const FranchiseLocationMap = dynamic(() => import('../../components/franchise/FranchiseLocationMap'));
const FranchiseTravelGuide = dynamic(() => import('../../components/franchise/FranchiseTravelGuide'));
const FranchiseGallery = dynamic(() => import('../../components/franchise/FranchiseGallery'));

interface FranchisePageProps {
  franchise: FranchiseData | null;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export default function FranchisePage({ franchise }: FranchisePageProps) {
  // Handle case where franchise is not found
  if (!franchise) {
    return <FranchiseNotFound />;
  }

  // Calculate location count for each film based on mapLocations
  const filmsWithLocationCount = franchise.films?.map(film => {
    const locationCount = franchise.mapLocations?.filter(
      location => location.filmSlugs.includes(film.slug)
    ).length || 0;
    return {
      ...film,
      locationCount
    };
  });

  // Build updated franchise data with location counts
  const franchiseWithCounts = {
    ...franchise,
    films: filmsWithLocationCount
  };

  return (
    <FranchiseTemplate franchise={franchiseWithCounts}>
      {/* Hero Section */}
      <FranchiseHero
        title={franchise.title}
        description={franchise.description}
        bannerImage={franchise.bannerImage}
        logoImage={franchise.logoImage}
      />
      
      {/* Navigation - only show if there are multiple films */}
      {franchise.films && franchise.films.length > 1 && (
        <FranchiseNavigation 
          films={franchise.films}
        />
      )}
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview section with markdown content */}
        {franchise.overview && (
          <FranchiseOverview overview={franchise.overview} />
        )}
        
        {/* Films Grid */}
        {franchise.films && franchise.films.length > 0 && (
          <FranchiseFilmGrid 
            films={franchiseWithCounts.films || []} 
          />
        )}
        
        {/* Map of Locations */}
        {franchise.mapLocations && franchise.mapLocations.length > 0 && (
          <FranchiseLocationMap locations={franchise.mapLocations} />
        )}
        
        {/* Travel Guide */}
        {franchise.travelGuides && franchise.travelGuides.length > 0 && (
          <FranchiseTravelGuide guides={franchise.travelGuides} />
        )}
        
        {/* Gallery */}
        {franchise.galleryImages && franchise.galleryImages.length > 0 && (
          <FranchiseGallery images={franchise.galleryImages} />
        )}
      </div>
    </FranchiseTemplate>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Temporarily disable franchise slug pages to prevent build errors
  // TODO: Fix component import issues causing "Element type is invalid" errors
  return {
    paths: [],
    fallback: false,
  };
  
  // Original code commented out:
  /*
  try {
    const franchises = await getAllFranchises();
    const paths = franchises.map((franchise) => ({
      params: { slug: franchise.slug },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error in getStaticPaths for franchise:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
  */
};

export const getStaticProps: GetStaticProps<FranchisePageProps, Params> = async ({ params }) => {
  try {
    // Ensure params.slug exists
    if (!params?.slug) {
      return { notFound: true };
    }

    const franchise = await getFranchiseBySlug(params.slug);
    
    // If franchise not found, return 404
    if (!franchise) {
      return { notFound: true };
    }

    return {
      props: {
        franchise,
      },
      // Re-generate the page every hour (3600 seconds)
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching franchise data:', error);
    return { notFound: true };
  }
}; 
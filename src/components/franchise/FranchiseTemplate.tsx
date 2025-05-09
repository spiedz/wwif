import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { FranchiseData } from '../../types/franchise';
import SEO from '../SEO';

// Dynamically import components to improve initial load time
const FranchiseHero = dynamic(() => import('./FranchiseHero'), {
  loading: () => <div className="h-[60vh] min-h-[400px] max-h-[600px] w-full bg-gray-100 animate-pulse" />
});

const FranchiseNavigation = dynamic(() => import('./FranchiseNavigation'), {
  ssr: true
});

const FranchiseOverview = dynamic(() => import('./FranchiseOverview'), {
  ssr: true
});

const FranchiseFilmGrid = dynamic(() => import('./FranchiseFilmGrid'), {
  loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse rounded-lg" />
});

const FranchiseLocationMap = dynamic(() => import('./FranchiseLocationMap'), {
  loading: () => <div className="h-[50vh] w-full bg-gray-50 animate-pulse rounded-lg" />,
  ssr: false // Map component uses window, can't be SSR'd
});

const FranchiseTravelGuide = dynamic(() => import('./FranchiseTravelGuide'), {
  ssr: true
});

const FranchiseGallery = dynamic(() => import('./FranchiseGallery'), {
  loading: () => <div className="h-80 w-full bg-gray-50 animate-pulse rounded-lg" />
});

interface FranchiseTemplateProps {
  franchise: FranchiseData;
  children?: ReactNode;
}

/**
 * Main wrapper component for franchise pages
 * Provides layout structure and common functionality for all franchise pages
 */
const FranchiseTemplate: React.FC<FranchiseTemplateProps> = ({ 
  franchise,
  children 
}) => {
  // Create meta data for SEO
  const seoMeta = {
    title: franchise.meta?.title,
    description: franchise.meta?.description,
    slug: franchise.slug,
  };

  // Generate schema.org JSON-LD for the franchise
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: franchise.title,
    description: franchise.description,
    url: `https://wherewasitfilmed.co/franchise/${franchise.slug}`,
    image: franchise.bannerImage,
    keywords: franchise.meta?.keywords?.join(', '),
    numberOfEpisodes: franchise.films?.length,
    containsSeason: franchise.films?.map(film => ({
      '@type': 'CreativeWorkSeason',
      name: film.title,
      url: `https://wherewasitfilmed.co/films/${film.slug}`
    }))
  };
  
  return (
    <div className="franchise-template">
      {/* SEO component with structured data */}
      <SEO 
        meta={seoMeta}
        type="article"
        imageUrl={franchise.bannerImage}
        jsonLd={jsonLd}
      />
      
      {/* Main content wrapper */}
      <div className="franchise-content">
        {children}
      </div>

      {/* Franchise footer - links to related franchises, etc. could go here */}
      <div className="franchise-footer mt-16 pt-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-gray-500 text-sm">
            Explore more film franchises on Where Was It Filmed
          </p>
        </div>
      </div>
    </div>
  );
};

export default FranchiseTemplate; 
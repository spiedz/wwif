import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import { getAllFranchises } from '../../lib/franchise/franchiseUtils';
import { FranchiseData } from '../../types/franchise';

interface FranchiseIndexProps {
  franchises: FranchiseData[];
}

/**
 * Main franchise listing page
 * Displays all available film franchises with links to their detail pages
 */
const FranchiseIndex: React.FC<FranchiseIndexProps> = ({ franchises }) => {
  return (
    <Layout>
      <SEO 
        meta={{
          title: "Film Franchises | Where Was It Filmed",
          description: "Explore famous film franchises and discover their real-world filming locations around the globe.",
          slug: "franchise"
        }}
        type="website"
      />
      
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Film Franchises
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the real-world locations of your favorite film franchises, from Harry Potter to Marvel, Star Wars and beyond.
          </p>
        </header>

        {franchises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {franchises.map(franchise => (
              <Link 
                key={franchise.slug} 
                href={`/franchise/${franchise.slug}`}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  {/* Banner overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                  
                  {/* Banner image */}
                  <Image
                    src={franchise.bannerImage}
                    alt={franchise.title}
                    fill
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                
                {/* Logo/title overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  {franchise.logoImage ? (
                    <div className="relative w-full h-16 mb-4">
                      <Image
                        src={franchise.logoImage}
                        alt={franchise.title}
                        fill
                        className="object-contain object-left"
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
                      />
                    </div>
                  ) : (
                    <h3 className="text-2xl font-bold text-white mb-2">{franchise.title}</h3>
                  )}
                  
                  <p className="text-white/90 text-sm line-clamp-2">{franchise.description}</p>
                  
                  {/* Film and location count badges */}
                  <div className="flex gap-4 mt-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {franchise.films.length} Films
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {franchise.mapLocations.length} Locations
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600 mb-4">No franchises found</h3>
            <p className="text-gray-500">Check back soon for franchise content.</p>
          </div>
        )}
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Get all franchises data
  const franchises = await getAllFranchises();
  
  return {
    props: {
      franchises,
    },
    // Revalidate every hour
    revalidate: 3600
  };
};

export default FranchiseIndex; 
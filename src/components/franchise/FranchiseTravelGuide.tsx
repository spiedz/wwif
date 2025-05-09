import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TravelGuide } from '../../types/franchise';

interface FranchiseTravelGuideProps {
  guides: TravelGuide[];
  title?: string;
}

/**
 * Component for displaying franchise-related travel guides
 * Showcases curated travel content related to franchise filming locations
 */
const FranchiseTravelGuide: React.FC<FranchiseTravelGuideProps> = ({
  guides,
  title = 'Travel Guides'
}) => {
  if (!guides || guides.length === 0) {
    return null;
  }
  
  // Group guides by type if types are available
  const hasTypes = guides.some(guide => guide.type);
  const groupedGuides = hasTypes 
    ? guides.reduce((groups, guide) => {
        const type = guide.type || 'general';
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(guide);
        return groups;
      }, {} as Record<string, TravelGuide[]>)
    : { all: guides };
  
  // Helper to get a nice display name for guide types
  const getTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'tour': return 'Guided Tours';
      case 'accommodation': return 'Where to Stay';
      case 'transportation': return 'Getting Around';
      case 'general': return 'General Guides';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{title}</h2>
        
        {hasTypes ? (
          // Render guides grouped by type
          Object.entries(groupedGuides).map(([type, typeGuides]) => (
            <div key={type} className="mb-12 last:mb-0">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {getTypeDisplayName(type)}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {typeGuides.map((guide, index) => (
                  <GuideCard key={index} guide={guide} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Render all guides in a single grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <GuideCard key={index} guide={guide} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Card component for individual guides
interface GuideCardProps {
  guide: TravelGuide;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  return (
    <Link 
      href={guide.link} 
      className="block group bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
    >
      {guide.image && (
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={guide.image} 
            alt={guide.title} 
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {guide.type && (
            <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full capitalize">
              {guide.type}
            </span>
          )}
        </div>
      )}
      
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {guide.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{guide.description}</p>
        <span className="inline-flex items-center text-primary text-sm font-medium">
          Read guide
          <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default FranchiseTravelGuide; 
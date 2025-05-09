import React from 'react';
import ReactMarkdown from 'react-markdown';

interface FranchiseOverviewProps {
  overview: string;
  title?: string;
}

/**
 * Overview component for franchise pages
 * Displays formatted franchise description and information with markdown support
 */
const FranchiseOverview: React.FC<FranchiseOverviewProps> = ({
  overview,
  title = 'Franchise Overview'
}) => {
  if (!overview) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
        
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{overview}</ReactMarkdown>
        </div>
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: title,
              description: overview.substring(0, 200) + '...',
              articleBody: overview,
            })
          }}
        />
      </div>
    </section>
  );
};

export default FranchiseOverview; 
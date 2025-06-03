import React from 'react';
import Link from 'next/link';
import { TVSeries } from '../types/series';

interface SeriesBreadcrumbsProps {
  series: TVSeries;
  selectedSeason?: number;
  activeTab?: string;
  className?: string;
}

const SeriesBreadcrumbs: React.FC<SeriesBreadcrumbsProps> = ({
  series,
  selectedSeason,
  activeTab,
  className = ''
}) => {
  const breadcrumbItems = [
    {
      label: 'Home',
      href: '/',
      current: false
    },
    {
      label: 'TV Series',
      href: '/series',
      current: false
    },
    {
      label: series.meta.title,
      href: `/series/${series.meta.slug}`,
      current: !selectedSeason && (!activeTab || activeTab === 'overview')
    }
  ];

  // Add season breadcrumb if applicable
  if (selectedSeason) {
    breadcrumbItems.push({
      label: `Season ${selectedSeason}`,
      href: `/series/${series.meta.slug}?season=${selectedSeason}`,
      current: !activeTab || activeTab === 'overview'
    });
  }

  // Add tab breadcrumb if applicable
  if (activeTab && activeTab !== 'overview') {
    const tabNames = {
      'locations': 'Filming Locations',
      'episodes': 'Episodes',
      'gallery': 'Gallery'
    };
    
    const tabLabel = tabNames[activeTab as keyof typeof tabNames] || activeTab;
    breadcrumbItems.push({
      label: tabLabel,
      href: `/series/${series.meta.slug}${selectedSeason ? `?season=${selectedSeason}` : ''}#${activeTab}`,
      current: true
    });
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-6 h-6 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            
            {item.current ? (
              <span className="text-gray-500 text-sm font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-700 hover:text-primary text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default SeriesBreadcrumbs; 
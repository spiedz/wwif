import React from 'react';
import Link from 'next/link';

interface CategoryItem {
  name: string;
  count: number;
}

interface PopularCategoriesProps {
  categories: CategoryItem[];
  title?: string;
  showViewAll?: boolean;
  maxCategories?: number;
  loading?: boolean;
}

const PopularCategories: React.FC<PopularCategoriesProps> = ({
  categories,
  title = 'Popular Categories',
  showViewAll = true,
  maxCategories = 6,
  loading = false,
}) => {
  // Take only the number of categories specified
  const displayCategories = categories.slice(0, maxCategories);
  
  return (
    <section className="mb-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {showViewAll && (
          <Link 
            href="/films" 
            className="text-primary hover:text-red-700 font-medium flex items-center mt-3 sm:mt-0"
          >
            View All
            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
      </div>
      
      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(maxCategories).fill(0).map((_, index) => (
            <div 
              key={`skeleton-${index}`} 
              className="bg-gray-100 animate-pulse text-center p-4 rounded-lg shadow-md border border-gray-200 h-24"
            >
              <div className="h-5 bg-gray-200 rounded mb-3 w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : displayCategories.length > 0 ? (
        // Regular display with data
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <Link 
              key={category.name} 
              href={`/films?category=${encodeURIComponent(category.name.toLowerCase())}`}
              className="bg-white text-center p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow transform hover:-translate-y-1 transition-transform duration-200"
            >
              <h3 className="font-medium text-gray-800">{category.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{category.count} film{category.count !== 1 ? 's' : ''}</p>
            </Link>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            ></path>
          </svg>
          <p className="text-gray-600 text-lg mb-2">No categories found</p>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            We couldn&apos;t find any film categories. Try refreshing or check back later when more content is available.
          </p>
          <Link 
            href="/films" 
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-red-700 transition-colors inline-flex items-center"
          >
            Browse All Films
            <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
};

export default PopularCategories; 
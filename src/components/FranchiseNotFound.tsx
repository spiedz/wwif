import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const FranchiseNotFound: React.FC = () => {
  return (
    <>
      <Head>
        <title>Franchise Not Found | Where Was It Filmed</title>
        <meta name="description" content="The franchise you're looking for could not be found." />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Franchise Not Found</h1>
          
          <p className="text-gray-600 mb-6">
            The movie franchise you're looking for could not be found. It may have been removed or the URL might be incorrect.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/franchises"
              className="block w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Browse All Franchises
            </Link>
            
            <Link
              href="/"
              className="block w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FranchiseNotFound; 
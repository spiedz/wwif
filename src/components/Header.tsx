import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SearchBar from './search/SearchBar';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return router.pathname === path || 
           (path !== '/' && router.pathname.startsWith(path));
  };
  
  // Handle search function to navigate to search page
  const handleHeaderSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl flex items-center">
            <span className="text-primary">Where Was It</span>
            <span className="ml-1">Filmed</span>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`nav-link ${isActive('/') ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              href="/films" 
              className={`nav-link ${isActive('/films') ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
            >
              Films
            </Link>
            <Link 
              href="/series" 
              className={`nav-link ${isActive('/series') ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
            >
              Series
            </Link>
            <Link 
              href="/locations" 
              className={`nav-link ${isActive('/locations') ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
            >
              Locations
            </Link>
            <Link 
              href="/about" 
              className={`nav-link ${isActive('/about') ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
            >
              About
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:block w-1/3 max-w-sm">
            <SearchBar 
              onSearch={handleHeaderSearch}
              placeholder="Search films, locations..."
              className="w-full"
              showSuggestions={true}
            />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-primary focus:outline-none focus:text-primary"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className={`nav-link py-2 ${isActive('/') ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/films" 
              className={`nav-link py-2 ${isActive('/films') ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Films
            </Link>
            <Link 
              href="/series" 
              className={`nav-link py-2 ${isActive('/series') ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Series
            </Link>
            <Link 
              href="/locations" 
              className={`nav-link py-2 ${isActive('/locations') ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Locations
            </Link>
            <Link 
              href="/about" 
              className={`nav-link py-2 ${isActive('/about') ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="py-2">
              <SearchBar 
                onSearch={(query) => {
                  handleHeaderSearch(query);
                  setIsMenuOpen(false);
                }}
                placeholder="Search films, locations..."
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 
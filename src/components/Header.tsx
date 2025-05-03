import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">WWIF</span>
            <span className="hidden sm:inline text-gray-700 font-medium">Where Was It Filmed</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/"
              className={`${isActive('/') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition-colors`}
            >
              Home
            </Link>
            <Link 
              href="/films"
              className={`${isActive('/films') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition-colors`}
            >
              Films
            </Link>
            <Link 
              href="/blog"
              className={`${isActive('/blog') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition-colors`}
            >
              Blog
            </Link>
            <Link 
              href="/about"
              className={`${isActive('/about') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition-colors`}
            >
              About
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-primary focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="pt-4 pb-2 mt-3 border-t border-gray-200 md:hidden">
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/"
                  className={`${isActive('/') ? 'text-primary font-semibold' : 'text-gray-700'} block hover:text-primary transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/films"
                  className={`${isActive('/films') ? 'text-primary font-semibold' : 'text-gray-700'} block hover:text-primary transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Films
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className={`${isActive('/blog') ? 'text-primary font-semibold' : 'text-gray-700'} block hover:text-primary transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className={`${isActive('/about') ? 'text-primary font-semibold' : 'text-gray-700'} block hover:text-primary transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 
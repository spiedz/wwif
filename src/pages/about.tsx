import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { getWebPageSchema, getOrganizationSchema } from '../utils/schema';
import { useRouter } from 'next/router';
import Link from 'next/link';

// FAQ Accordion Item Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex justify-between items-center w-full py-4 px-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        <svg
          className={`w-5 h-5 text-primary transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-2 px-4 text-gray-600">{answer}</div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const currentUrl = `${BASE_URL}${router.asPath}`;
  
  // Create page metadata
  const pageMeta = {
    title: 'About Where Was It Filmed',
    description: 'Learn about Where Was It Filmed, our mission to connect film enthusiasts with real-world movie locations, and the team behind the project.',
    slug: 'about',
  };
  
  // Generate webpage schema and organization schema
  const webpageSchema = getWebPageSchema(
    'About Where Was It Filmed',
    'Learn about Where Was It Filmed, our mission to connect film enthusiasts with real-world movie locations, and the team behind the project.',
    currentUrl
  );
  
  const organizationSchema = getOrganizationSchema();
  
  // Combine schemas
  const jsonLdData = JSON.stringify([webpageSchema, organizationSchema]);

  return (
    <>
      <SEO 
        meta={pageMeta} 
        jsonLd={jsonLdData}
      />
      
      {/* Page Container */}
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-800 to-primary py-16 md:py-24 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                About Where Was It Filmed
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
                Connecting film enthusiasts with the real-world locations 
                where movie magic happens.
              </p>
            </div>
          </div>
        </section>
        
        {/* Content Container */}
        <div className="container mx-auto px-4 py-12">
          {/* Mission Statement Section */}
          <section id="mission" className="mb-20 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Mission</h2>
            <div className="w-20 h-1 bg-primary/30 rounded mx-auto mb-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary/10 -z-10"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-primary/5 -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=800&q=80" 
                  alt="Film location tourism" 
                  className="rounded-xl shadow-xl w-full h-auto object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="text-primary font-semibold text-xl">Where Was It Filmed</span> was born from a simple idea: to connect the magic of cinema with the real places where that magic happens.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our mission is to bridge the gap between the stories we love on screen and the tangible world around us, creating a community of film enthusiasts who can experience their favorite movies and TV shows in a whole new dimension.
                </p>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-l-4 border-primary shadow-md">
                  <p className="text-xl text-gray-800 italic">
                    "We believe that every filming location has a story to tell beyond what we see on screen."
                  </p>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  By meticulously documenting and sharing these locations, we're not only preserving film history but also supporting film tourism and the local communities that host these iconic settings.
                </p>
              </div>
            </div>
            
            {/* Core Values */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Core Values</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Authenticity</h4>
                  <p className="text-gray-600">
                    We're committed to providing accurate, well-researched information about every filming location we feature.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Accessibility</h4>
                  <p className="text-gray-600">
                    We strive to make film tourism accessible to everyone by providing practical travel information and tips.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Community</h4>
                  <p className="text-gray-600">
                    We foster a community of like-minded film enthusiasts who share experiences and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section id="team" className="mb-20">
            {/* Team section - will be implemented in subtask 3 */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Meet Our Team</h2>
            <div className="w-20 h-1 bg-primary/30 rounded mx-auto mb-10"></div>
            
            <div className="max-w-6xl mx-auto">
              <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
                Our passionate team of film enthusiasts, travel experts, and technology professionals 
                work together to bring you the most comprehensive film location database.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Team Member 1 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80" 
                      alt="Michael Roberts, Founder & CEO" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Michael Roberts</h3>
                    <p className="text-primary font-medium mb-3">Founder & CEO</p>
                    <p className="text-gray-600 mb-4">
                      Former film location scout with over 15 years of experience working on major Hollywood productions.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Team Member 2 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" 
                      alt="Sarah Chen, Head of Content" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Sarah Chen</h3>
                    <p className="text-primary font-medium mb-3">Head of Content</p>
                    <p className="text-gray-600 mb-4">
                      Film historian and travel writer who's visited over 200 filming locations across 30 countries.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Team Member 3 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80" 
                      alt="David Thompson, Lead Developer" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">David Thompson</h3>
                    <p className="text-primary font-medium mb-3">Lead Developer</p>
                    <p className="text-gray-600 mb-4">
                      Full-stack developer with expertise in mapping technologies and location-based applications.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Team Member 4 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80" 
                      alt="Emily Rodriguez, Travel Coordinator" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Emily Rodriguez</h3>
                    <p className="text-primary font-medium mb-3">Travel Coordinator</p>
                    <p className="text-gray-600 mb-4">
                      Former travel agent specializing in creating custom itineraries for film enthusiasts and location tourists.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Team Member 5 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" 
                      alt="James Wilson, Photography Director" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">James Wilson</h3>
                    <p className="text-primary font-medium mb-3">Photography Director</p>
                    <p className="text-gray-600 mb-4">
                      Award-winning photographer who specializes in architectural and landscape photography.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Team Member 6 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80" 
                      alt="Olivia Kim, Community Manager" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Olivia Kim</h3>
                    <p className="text-primary font-medium mb-3">Community Manager</p>
                    <p className="text-gray-600 mb-4">
                      Social media strategist who builds and nurtures our online community of film location enthusiasts.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Join Our Team CTA */}
              <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 shadow-md border border-gray-200">
                <div className="text-center max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Team</h3>
                  <p className="text-gray-600 mb-6">
                    Passionate about films and travel? We're always looking for enthusiastic individuals to join our growing team.
                  </p>
                  <a 
                    href="#contact" 
                    className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                  >
                    Get In Touch
                  </a>
                </div>
              </div>
            </div>
          </section>
          
          <section id="history" className="mb-20">
            {/* History Timeline section - will be implemented in subtask 4 */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Journey</h2>
            <div className="w-20 h-1 bg-primary/30 rounded mx-auto mb-10"></div>
            
            <div className="max-w-6xl mx-auto">
              <p className="text-lg text-gray-700 text-center mb-16 max-w-3xl mx-auto">
                From a simple blog to a comprehensive film location database, 
                here's how Where Was It Filmed evolved over the years.
              </p>
              
              {/* Timeline */}
              <div className="relative">
                {/* Timeline Center Line */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 z-0"></div>
                
                {/* Mobile Timeline Line */}
                <div className="md:hidden absolute left-8 top-0 h-full w-1 bg-gray-200 z-0"></div>
                
                {/* Timeline Items */}
                <div className="relative z-10">
                  {/* 2018 - Beginning */}
                  <div className="flex flex-col md:flex-row items-start mb-16 md:mb-20 relative">
                    <div className="flex items-center order-1 md:w-5/12 md:text-right md:pr-10">
                      <div className="md:hidden mr-4 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        2018
                      </div>
                      <div>
                        <div className="hidden md:block text-3xl text-primary font-bold mb-2">2018</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">The Beginning</h3>
                        <p className="text-gray-600">
                          Michael Roberts started a personal blog sharing locations from his favorite films, drawing from his experience as a location scout.
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        2018
                      </div>
                    </div>
                    <div className="flex order-2 md:w-5/12 md:pl-10 mt-6 md:mt-0">
                      <div className="md:block hidden w-full h-44 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1512149177596-f817c7ef5984?auto=format&fit=crop&w=800&q=80" 
                          alt="A blog about film locations" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 2019 - First Map */}
                  <div className="flex flex-col md:flex-row-reverse items-start mb-16 md:mb-20 relative">
                    <div className="flex items-center order-1 md:w-5/12 md:pl-10">
                      <div className="md:hidden mr-4 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        2019
                      </div>
                      <div>
                        <div className="hidden md:block text-3xl text-primary font-bold mb-2">2019</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Maps</h3>
                        <p className="text-gray-600">
                          The site expanded to include interactive maps, allowing users to visually explore filming locations.
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        2019
                      </div>
                    </div>
                    <div className="flex order-2 md:w-5/12 md:text-right md:pr-10 mt-6 md:mt-0">
                      <div className="md:block hidden w-full h-44 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c8bf?auto=format&fit=crop&w=800&q=80" 
                          alt="Interactive map implementation" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 2020 - Team Expansion */}
                  <div className="flex flex-col md:flex-row items-start mb-16 md:mb-20 relative">
                    <div className="flex items-center order-1 md:w-5/12 md:text-right md:pr-10">
                      <div className="md:hidden mr-4 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        2020
                      </div>
                      <div>
                        <div className="hidden md:block text-3xl text-primary font-bold mb-2">2020</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Team Expansion</h3>
                        <p className="text-gray-600">
                          Sarah Chen and David Thompson joined the team, bringing expertise in film history and technology.
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        2020
                      </div>
                    </div>
                    <div className="flex order-2 md:w-5/12 md:pl-10 mt-6 md:mt-0">
                      <div className="md:block hidden w-full h-44 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                          alt="Team expansion" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 2021 - Mobile App */}
                  <div className="flex flex-col md:flex-row-reverse items-start mb-16 md:mb-20 relative">
                    <div className="flex items-center order-1 md:w-5/12 md:pl-10">
                      <div className="md:hidden mr-4 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        2021
                      </div>
                      <div>
                        <div className="hidden md:block text-3xl text-primary font-bold mb-2">2021</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Mobile App Launch</h3>
                        <p className="text-gray-600">
                          We launched our mobile app, making it easier for travelers to find film locations on the go.
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        2021
                      </div>
                    </div>
                    <div className="flex order-2 md:w-5/12 md:text-right md:pr-10 mt-6 md:mt-0">
                      <div className="md:block hidden w-full h-44 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80" 
                          alt="Mobile app launch" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 2022 - Community Growth */}
                  <div className="flex flex-col md:flex-row items-start mb-16 md:mb-20 relative">
                    <div className="flex items-center order-1 md:w-5/12 md:text-right md:pr-10">
                      <div className="md:hidden mr-4 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        2022
                      </div>
                      <div>
                        <div className="hidden md:block text-3xl text-primary font-bold mb-2">2022</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Community Growth</h3>
                        <p className="text-gray-600">
                          Our community grew to over 100,000 members, contributing location tips and photos from around the world.
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        2022
                      </div>
                    </div>
                    <div className="flex order-2 md:w-5/12 md:pl-10 mt-6 md:mt-0">
                      <div className="md:block hidden w-full h-44 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" 
                          alt="Community growth" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 2023 - Today */}
                  <div className="flex flex-col md:flex-row-reverse items-start relative">
                    <div className="flex items-center order-1 md:w-5/12 md:pl-10">
                      <div className="md:hidden mr-4 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        2023
                      </div>
                      <div>
                        <div className="hidden md:block text-3xl text-primary font-bold mb-2">2023</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Today & Beyond</h3>
                        <p className="text-gray-600">
                          Today, we continue to expand our database, form partnerships with tourism boards, and develop new features to enhance your film location exploration.
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        2023
                      </div>
                    </div>
                    <div className="flex order-2 md:w-5/12 md:text-right md:pr-10 mt-6 md:mt-0">
                      <div className="md:block hidden w-full h-44 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1516315720917-231ef9f560a6?auto=format&fit=crop&w=800&q=80" 
                          alt="Today and beyond" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section id="methodology" className="mb-20">
            {/* Methodology section - will be implemented in subtask 5 */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Approach</h2>
            <div className="w-20 h-1 bg-primary/30 rounded mx-auto mb-10"></div>
            
            <div className="max-w-6xl mx-auto">
              <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
                We follow a meticulous research and verification process to ensure 
                the accuracy of every film location we feature.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Research Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-lg">
                  <div className="h-48 bg-gray-50 flex items-center justify-center">
                    <svg className="w-20 h-20 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">1. Research</h3>
                    <p className="text-gray-600">
                      Our research team starts by consulting production notes, filming permits, interviews, and official sources to compile an initial list of potential filming locations.
                    </p>
                  </div>
                </div>
                
                {/* Verification Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-lg">
                  <div className="h-48 bg-gray-50 flex items-center justify-center">
                    <svg className="w-20 h-20 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">2. Verification</h3>
                    <p className="text-gray-600">
                      We verify each location through multiple sources, including scene comparisons, satellite imagery, street views, and when possible, first-hand visits by our team.
                    </p>
                  </div>
                </div>
                
                {/* Documentation Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-lg">
                  <div className="h-48 bg-gray-50 flex items-center justify-center">
                    <svg className="w-20 h-20 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">3. Documentation</h3>
                    <p className="text-gray-600">
                      Once verified, we document the location with precise coordinates, photos, scene comparisons, and practical information for visitors.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Methodology Details */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Crowdsourced Contributions</h3>
                    <p className="text-gray-600 mb-4">
                      We actively engage our community in the research process. Users can submit potential filming locations, which are then reviewed by our verification team before publication.
                    </p>
                    <p className="text-gray-600">
                      This collaborative approach allows us to cover more ground and benefit from local knowledge, while maintaining our high standards for accuracy.
                    </p>
                  </div>
                  <div className="bg-gray-100 p-8 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" 
                      alt="Research and verification process" 
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="order-2 md:order-1 bg-gray-100 p-8 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=800&q=80" 
                      alt="Travel information gathering" 
                      className="rounded-lg shadow-md"
                    />
                  </div>
                  <div className="order-1 md:order-2 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Travel Information</h3>
                    <p className="text-gray-600 mb-4">
                      Beyond just identifying locations, we gather practical travel information such as accessibility, opening hours, entry fees, and nearby attractions.
                    </p>
                    <p className="text-gray-600">
                      Our travel coordinators research local transportation options, accommodation, and tour services to provide comprehensive guides for film tourists.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section id="contact" className="mb-20">
            {/* Contact section - will be implemented in subtask 6 */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Get In Touch</h2>
            <div className="w-20 h-1 bg-primary/30 rounded mx-auto mb-10"></div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Information */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-gray-800 mb-1">Phone</h4>
                        <p className="text-gray-600">+1 (123) 456-7890</p>
                        <p className="text-gray-600">Monday - Friday, 9am - 5pm PST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-gray-800 mb-1">Email</h4>
                        <p className="text-gray-600">info@wherewasitfilmed.co</p>
                        <p className="text-gray-600">support@wherewasitfilmed.co</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-gray-800 mb-1">Office</h4>
                        <p className="text-gray-600">123 Film Street, Suite 456</p>
                        <p className="text-gray-600">Los Angeles, CA 90210</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <h4 className="text-xl font-medium text-gray-800 mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a 
                        href="https://twitter.com/wherewasitfilmed" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                      <a 
                        href="https://facebook.com/wherewasitfilmed" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      </a>
                      <a 
                        href="https://instagram.com/wherewasitfilmed" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                      <a 
                        href="https://www.youtube.com/channel/wherewasitfilmed" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
                  
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="John Doe" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="john@example.com" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        placeholder="Film Location Suggestion" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        placeholder="Your message here..." 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-colors"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <button 
                        type="submit" 
                        className="w-full bg-primary text-white font-medium py-3 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
          
          <section id="faq" className="mb-20">
            {/* FAQ section - will be implemented in subtask 7 */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-primary/30 rounded mx-auto mb-10"></div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <FAQItem 
                  question="How do you verify filming locations?" 
                  answer="We use a rigorous verification process that includes research from official sources, production notes, and interviews. We then verify these locations through visual comparison of film scenes with actual locations, satellite imagery, and when possible, visiting the locations ourselves. Finally, we document them with precise coordinates and details."
                />
                
                <FAQItem 
                  question="Can I suggest a filming location?" 
                  answer="Absolutely! We welcome suggestions from our community. You can submit a location through our contact form with as much detail as possible, including the film or TV show name, approximate location, and any images or scene references that might help us verify it."
                />
                
                <FAQItem 
                  question="Do you provide guided tours of filming locations?" 
                  answer="While we don't directly operate tours, we do partner with reputable local tour companies in many popular filming locations. We provide links to these partners on our location pages, along with information about self-guided options for those who prefer to explore independently."
                />
                
                <FAQItem 
                  question="Are all the locations accessible to the public?" 
                  answer="Not all filming locations are publicly accessible. Some may be on private property, require permits, or have restricted access. We always include accessibility information in our location details, along with any requirements for visiting (such as tours, fees, or opening hours)."
                />
                
                <FAQItem 
                  question="How often do you add new locations?" 
                  answer="We're constantly adding new locations! We typically add several new film or TV show location guides each week, prioritizing recent releases and popular requests from our community."
                />
                
                <FAQItem 
                  question="Do you cover international filming locations?" 
                  answer="Yes! We cover filming locations worldwide. Our database includes locations from North America, Europe, Asia, Australia, and beyond. We're particularly focused on expanding our coverage of international locations."
                />
                
                <FAQItem 
                  question="How can I contribute to Where Was It Filmed?" 
                  answer="There are several ways to contribute: suggest new locations, provide updated information about existing locations, submit your photos from visits, or even join our team as a contributor. Check our 'Join Our Team' section or contact us for more details."
                />
                
                <FAQItem 
                  question="Is there a mobile app available?" 
                  answer="Yes, we offer mobile apps for both iOS and Android platforms. Our apps include offline maps, location-based notifications when you're near filming locations, and the ability to create custom filming location itineraries for your travels."
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
} 
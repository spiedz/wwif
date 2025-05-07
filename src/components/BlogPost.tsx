import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogMeta } from '../types/content';
import { formatDate } from '../utils/dates';
import TableOfContents from './TableOfContents';
import { MapMarker, RelatedPost } from '../types/blog-interfaces';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
});

// Example location data for demonstration
const locationExamples: MapMarker[] = [
  {
    title: "San Francisco Hills - Bullitt (1968)",
    lat: 37.8024,
    lng: -122.4058,
    description: "The iconic car chase scene from Bullitt featuring Steve McQueen was filmed here."
  },
  {
    title: "Paris Streets - Ronin (1998)",
    lat: 48.8566,
    lng: 2.3522,
    description: "The heart-pounding car chase through the streets of Paris."
  },
  {
    title: "Los Angeles River - Terminator 2 (1991)",
    lat: 34.0522,
    lng: -118.2437,
    description: "The T-1000 pursued John Connor through the LA River drainage canals."
  }
];

// Image gallery examples (if needed)
const galleryExamples = [
  "https://source.unsplash.com/random/800x600?car+chase+san+francisco",
  "https://source.unsplash.com/random/800x600?paris+street",
  "https://source.unsplash.com/random/800x600?los+angeles+river",
  "https://source.unsplash.com/random/800x600?rome+spanish+steps"
];

export interface BlogPostProps {
  meta: BlogMeta;
  content: string;
  html: string;
  relatedPosts?: RelatedPost[];
}

/**
 * Enhanced BlogPost component with improved typography and styling
 * This component provides a more engaging and visually appealing blog post layout
 */
const BlogPost: React.FC<BlogPostProps> = ({ meta, content, html }): React.ReactElement => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=800&q=80";
  
  // Function to enhance HTML content with section dividers and special formatting
  const enhancedHtml = useMemo(() => {
    if (!html) return '';
    
    let processedHtml = html;
    
    // Add visual separators after each h2 section
    processedHtml = processedHtml.replace(/<\/h2>/g, '</h2><div class="w-32 h-1 bg-primary/30 rounded my-6"></div>');
    
    // Enhance the first paragraph after h1 with larger text
    processedHtml = processedHtml.replace(
      /(<h1[^>]*>.*?<\/h1>)(\s*<p>)(.*?)(<\/p>)/,
      '$1$2<span class="text-lg text-gray-700 leading-relaxed">$3</span>$4'
    );
    
    // Add drop cap to first paragraph text
    processedHtml = processedHtml.replace(
      /(<h1[^>]*>.*?<\/h1>\s*<p>)<span class="text-lg text-gray-700 leading-relaxed">(\w)([^<]*)<\/span>/,
      '$1<span class="text-lg text-gray-700 leading-relaxed"><span class="float-left text-5xl font-serif text-primary mr-2 mt-1">$2</span>$3</span>'
    );
    
    // Enhance blockquotes
    processedHtml = processedHtml.replace(
      /<blockquote>/g,
      '<blockquote class="pl-4 border-l-4 border-primary/50 italic text-gray-700 my-6 py-2">'
    );
    
    // Enhance lists
    processedHtml = processedHtml.replace(
      /<ul>/g,
      '<ul class="list-disc pl-6 space-y-2 my-6 text-gray-700">'
    );
    
    processedHtml = processedHtml.replace(
      /<ol>/g,
      '<ol class="list-decimal pl-6 space-y-2 my-6 text-gray-700">'
    );
    
    // Style headings
    processedHtml = processedHtml.replace(
      /<h2/g,
      '<h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4"'
    );
    
    processedHtml = processedHtml.replace(
      /<h3/g,
      '<h3 class="text-xl font-semibold text-gray-800 mt-8 mb-3"'
    );
    
    // Add ID attributes to headings for TOC linking if they don't have one
    processedHtml = processedHtml.replace(
      /<h([23])((?![^>]*id=)[^>]*)>(.*?)<\/h\1>/g,
      (match, level, attrs, content) => {
        const id = content.toLowerCase().replace(/[^\w]+/g, '-');
        return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
      }
    );
    
    // Create location cards for sections that match the pattern
    processedHtml = processedHtml.replace(
      /<h2[^>]*>([\d]+\.\s+([^<]+))<\/h2>.*?<h3[^>]*>The Location<\/h3>.*?<p>(.*?)<\/p>.*?<h3[^>]*>Where to Visit<\/h3>.*?<p>(.*?)<\/p>.*?<h3[^>]*>Visitor Experience<\/h3>.*?<p>(.*?)<\/p>/g,
      (match, fullTitle, locationTitle, locationDesc, whereToVisit, visitorExp) => {
        // Creating HTML without JSX or template literals to avoid TypeScript errors
        return '<div class="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg shadow-md p-6 my-8">' +
          '<h2 class="text-2xl font-bold text-gray-900 mb-4">' + fullTitle + '</h2>' +
          '<div class="grid md:grid-cols-3 gap-6">' +
            '<div class="md:col-span-2 space-y-4">' +
              '<div>' +
                '<h3 class="text-lg font-semibold text-gray-800">The Location</h3>' +
                '<p class="text-gray-700">' + locationDesc + '</p>' +
              '</div>' +
              '<div>' +
                '<h3 class="text-lg font-semibold text-gray-800">Where to Visit</h3>' +
                '<p class="text-gray-700">' + whereToVisit + '</p>' +
              '</div>' +
              '<div>' +
                '<h3 class="text-lg font-semibold text-gray-800">Visitor Experience</h3>' +
                '<p class="text-gray-700">' + visitorExp + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="md:col-span-1">' +
              '<div class="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">' +
                '<img src="https://source.unsplash.com/random/600x600?' + encodeURIComponent(locationTitle) + '" ' +
                'alt="' + locationTitle + '" ' +
                'class="w-full h-full object-cover" />' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }
    );
    
    return processedHtml;
  }, [html]);

  // Parse location data from content
  const extractMapMarkers = (content: string): MapMarker[] => {
    const markers: MapMarker[] = [];
    const regex = /\*\*Location Coordinates\*\*: {([^}]+)}/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      try {
        // Parse the JSON object from the matched string
        const jsonStr = '{' + match[1] + '}';
        const marker = JSON.parse(jsonStr);
        
        if (marker.lat && marker.lng && marker.title) {
          markers.push({
            lat: marker.lat,
            lng: marker.lng,
            title: marker.title,
            description: marker.description || ''
          });
        }
      } catch (e) {
        console.error('Failed to parse location data:', e);
      }
    }
    
    return markers;
  };

  const mapMarkers = useMemo(() => content ? extractMapMarkers(content) : [], [content]);
  const hasMapMarkers = mapMarkers.length > 0;

  // Determine if this is a location-based blog post (has numbered location sections)
  const hasLocations = content ? (content.match(/\n\d+\.\s+.+\n/g)?.length ?? 0) > 0 : false;

  return (
    <article className="max-w-5xl mx-auto">
      {/* Header with featured image */}
      <header className="relative mb-12">
        {meta.featuredImage && !imageError ? (
          <div className="relative h-[60vh] min-h-[400px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src={meta.featuredImage}
              alt={meta.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              onError={(e) => {
                console.error(`Failed to load featured image: ${meta.featuredImage}`);
                setImageError(true);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{meta.title}</h1>
              {meta.description && (
                <p className="mt-4 text-lg md:text-xl text-white/80 max-w-3xl">{meta.description}</p>
              )}
              
              <div className="flex flex-wrap items-center mt-6 text-sm text-white/70">
                <time dateTime={meta.date || ''}>{meta.date ? formatDate(meta.date) : 'No date'}</time>
                <span className="mx-2">•</span>
                <span>{content ? Math.ceil(content.split(/\s+/).length / 200) + ' min read' : '5 min read'}</span>
                {meta.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span>By {meta.author}</span>
                  </>
                )}
              </div>
              
              {/* Tags */}
              {meta.categories && meta.categories.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/30">
                  <h3 className="text-lg font-medium text-white mb-3">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {meta.categories.map((category, i) => (
                      <Link 
                        key={i} 
                        href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 text-sm transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Fallback header without image or with fallback image
          <div className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-r from-primary to-primary-dark">
            <div className="relative h-[40vh] min-h-[300px]">
              {imageError && (
                <Image
                  src={fallbackImage}
                  alt={meta.title}
                  fill
                  className="object-cover opacity-30"
                  priority
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 md:p-12 text-white text-center max-w-3xl">
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{meta.title}</h1>
                  {meta.description && (
                    <p className="mt-4 text-lg md:text-xl text-white/80">{meta.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center justify-center mt-6 text-sm text-white/70">
                    <time dateTime={meta.date || ''}>{meta.date ? formatDate(meta.date) : 'No date'}</time>
                    <span className="mx-2">•</span>
                    <span>{content ? Math.ceil(content.split(/\s+/).length / 200) + ' min read' : '5 min read'}</span>
                    {meta.author && (
                      <>
                        <span className="mx-2">•</span>
                        <span>By {meta.author}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 mb-8 md:mb-0">
          <div className="sticky top-24">
            <TableOfContents content={html} />
          </div>
        </aside>
        
        <div className="md:w-3/4">
          {/* Markdown content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="blog-content" 
              dangerouslySetInnerHTML={{ __html: enhancedHtml }} 
            />
          </div>
          
          {/* Map section for location-based posts */}
          {hasLocations && (
            <div className="my-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit These Locations</h2>
              <div className="h-[500px] relative rounded-lg overflow-hidden shadow-md">
                <Map markers={locationExamples} zoom={2} />
              </div>
              <p className="mt-4 text-gray-500 text-sm text-center">
                Map shows approximate locations of filming sites mentioned in this article
              </p>
            </div>
          )}
          
          {/* Example: Location Cards for Car Chase Blog */}
          {meta.categories && meta.categories.includes('Filming Locations') && (
            <div className="my-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit These Locations</h2>
              <div className="h-[500px] relative rounded-lg overflow-hidden shadow-md">
                <Map markers={locationExamples} zoom={2} />
              </div>
              <p className="mt-4 text-gray-500 text-sm text-center">
                Map shows approximate locations of filming sites mentioned in this article
              </p>
            </div>
          )}

          {/* Display map if there are location markers */}
          {hasMapMarkers && (
            <div className="my-8 rounded-lg overflow-hidden shadow-lg">
              <h2 className="text-xl font-bold mb-4">Filming Locations Map</h2>
              <Map 
                markers={mapMarkers} 
                height="500px"
                zoom={mapMarkers.length === 1 ? 14 : 10}
                center={mapMarkers.length === 1 ? { lat: mapMarkers[0].lat, lng: mapMarkers[0].lng } : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPost; 
import React, { useState, useEffect, RefObject } from 'react';
import { useRouter } from 'next/router';
import { TocItem } from '../types/blog-interfaces';

export interface TableOfContentsProps {
  content?: string;
  contentRef?: RefObject<HTMLDivElement>;
}

/**
 * TableOfContents component that extracts headings from the blog content
 * and generates a navigation menu
 */
const TableOfContents: React.FC<TableOfContentsProps> = ({ content, contentRef }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const router = useRouter();

  // Extract headings from content or contentRef
  useEffect(() => {
    if (content) {
      // Extract headings from HTML string
      const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
      const items: TocItem[] = [];
      let match;
      
      while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1], 10);
        const id = match[2];
        // Remove any HTML tags from the heading text
        const text = match[3].replace(/<[^>]*>/g, '');
        
        items.push({ level, id, text });
      }
      
      setTocItems(items);
    } else if (contentRef?.current) {
      // Extract headings from DOM
      const headings = contentRef.current.querySelectorAll('h2, h3');
      const items: TocItem[] = [];
      
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1), 10);
        const id = heading.id || `heading-${items.length}`;
        // If heading doesn't have an ID, assign one
        if (!heading.id) {
          heading.id = id;
        }
        
        items.push({
          level,
          id,
          text: heading.textContent || ''
        });
      });
      
      setTocItems(items);
    }
  }, [content, contentRef, router.asPath]);

  // Set up intersection observer to track active heading
  useEffect(() => {
    if (typeof window === 'undefined' || (!content && !contentRef?.current)) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px'
      }
    );
    
    // Observe all headings
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [tocItems, content, contentRef]);

  // Scroll to heading when a TOC item is clicked
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Adjust for header height
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Table of Contents</h3>
      <nav>
        <ul className="space-y-1">
          {tocItems.map((item) => (
            <li 
              key={item.id}
              className={`
                ${item.level === 3 ? 'ml-4' : ''}
                ${activeId === item.id ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}
              `}
            >
              <button
                onClick={() => scrollToHeading(item.id)}
                className="text-left block w-full py-1 transition-colors duration-200 focus:outline-none"
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents; 
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FilmMeta } from '../../types/content';

interface SearchSuggestionProps {
  results: Array<{
    item: {
      meta: FilmMeta;
      content?: string;
      html?: string;
    };
    matches?: Array<{ indices: number[][]; key: string; value: string }>;
  }>;
  query: string;
  onSelect: () => void;
  onItemClick?: (film: FilmMeta) => void;
  isLoading?: boolean;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionProps> = ({
  results,
  query,
  onSelect,
  onItemClick,
  isLoading = false,
  className = '',
}) => {
  // No suggestions to show
  if ((!results || results.length === 0) && !isLoading) {
    return null;
  }

  // Highlight matched text in a string
  const highlightMatch = (text: string | null | undefined, indices: number[][] | undefined) => {
    if (!text) return '';
    if (!indices || !Array.isArray(indices) || indices.length === 0) return text;

    try {
      let result = '';
      let lastIndex = 0;

      // Sort indices to ensure proper highlighting order
      const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

      for (const [start, end] of sortedIndices) {
        // Skip invalid indices
        if (typeof start !== 'number' || typeof end !== 'number' || 
            start < 0 || end >= text.length || start > end) {
          continue;
        }
        
        // Add text before match
        result += text.substring(lastIndex, start);
        // Add highlighted match
        const matchedText = text.substring(start, end + 1);
        result += `<mark class="bg-yellow-200 rounded-sm">${matchedText}</mark>`;
        lastIndex = end + 1;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        result += text.substring(lastIndex);
      }
      return result;
    } catch (error) {
      console.error('Error highlighting match:', error);
      return text; // Return original text if highlighting fails
    }
  };

  return (
    <div className={`absolute z-50 left-0 right-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden border border-gray-200 ${className}`}>
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-pulse flex justify-center">
            <div className="h-4 w-4 bg-gray-300 rounded-full mr-1"></div>
            <div className="h-4 w-4 bg-gray-300 rounded-full mr-1"></div>
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ) : (
        <>
          {results.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((result, index) => {
                const film = result.item.meta;
                if (!film) return null;
                
                // Find the match for the title if it exists
                const titleMatch = result.matches?.find(match => match.key === 'meta.title');
                const locationMatch = result.matches?.find(match => match.key.includes('location') || match.key.includes('coordinates'));
                const directorMatch = result.matches?.find(match => match.key === 'meta.director');
                
                return (
                  <li key={film.slug || `suggestion-${index}`} className="border-b border-gray-100 last:border-b-0">
                    <Link
                      href={`/films/${film.slug || `unknown-${index}`}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        onSelect();
                        if (onItemClick) onItemClick(film);
                      }}
                    >
                      {/* Thumbnail */}
                      {film.posterImage && (
                        <div className="flex-shrink-0 mr-3 h-12 w-10 relative rounded overflow-hidden">
                          <Image
                            src={film.posterImage}
                            alt={film.title || 'Film poster'}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Film details */}
                      <div className="flex-grow min-w-0">
                        <div 
                          className="text-sm font-medium text-gray-900 truncate"
                          dangerouslySetInnerHTML={{
                            __html: titleMatch && film.title
                              ? highlightMatch(film.title, titleMatch.indices)
                              : (film.title || 'Untitled Film')
                          }}
                        />
                        <div className="flex flex-wrap text-xs text-gray-500 mt-1">
                          {film.year && (
                            <span className="mr-2">{film.year}</span>
                          )}
                          {film.director && (
                            <span 
                              className="mr-2"
                              dangerouslySetInnerHTML={{
                                __html: directorMatch && film.director
                                  ? highlightMatch(film.director, directorMatch.indices)
                                  : film.director
                              }}
                            />
                          )}
                          {film.genre && Array.isArray(film.genre) && film.genre.length > 0 && (
                            <span className="truncate">{film.genre.slice(0, 2).join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : query.trim().length > 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SearchSuggestions; 
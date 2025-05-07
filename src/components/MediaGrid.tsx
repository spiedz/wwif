import Link from 'next/link';
import Image from 'next/image';
import { MediaItem } from '../utils/locationUtils';

interface MediaGridProps {
  items: MediaItem[];
}

export default function MediaGrid({ items }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No media items found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <Link
          key={`${item.type}-${item.slug}-${index}`}
          href={`/${item.type === 'film' ? 'films' : 'series'}/${item.slug}`}
          className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
        >
          <div className="relative h-48 overflow-hidden bg-gray-200">
            {item.posterImage ? (
              <Image
                src={item.posterImage}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              {item.type === 'film' ? 'Film' : 'TV Series'}
            </div>
          </div>
          
          <div className="p-4 flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm mb-2">{item.year}</p>
            {item.description && (
              <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
            )}
          </div>
          
          <div className="px-4 pb-4">
            <span className="inline-flex items-center text-sm text-primary font-medium">
              View details
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
} 
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { TVSeries, Season } from '../types/series';
import EnhancedImageGallery, { GalleryImage } from './EnhancedImageGallery';

interface SeasonImageGalleryProps {
  series: TVSeries;
  selectedSeason?: number;
  showSeasonFilter?: boolean;
  className?: string;
}

const SeasonImageGallery: React.FC<SeasonImageGalleryProps> = ({
  series,
  selectedSeason,
  showSeasonFilter = true,
  className = ''
}) => {
  const router = useRouter();
  const [filterSeason, setFilterSeason] = useState<number | null>(selectedSeason || null);
  const [imageCategory, setImageCategory] = useState<'all' | 'posters' | 'locations' | 'episodes'>('all');

  // Prepare gallery images from series data
  const galleryImages = useMemo(() => {
    const images: GalleryImage[] = [];

    // Add series poster and banner
    if (imageCategory === 'all' || imageCategory === 'posters') {
      if (series.meta.posterImage) {
        images.push({
          src: series.meta.posterImage,
          alt: `${series.meta.title} poster`,
          title: `${series.meta.title} Official Poster`,
          description: `Official poster for ${series.meta.title}`,
          aspectRatio: 'portrait',
          category: 'poster'
        });
      }

      if (series.meta.bannerImage) {
        images.push({
          src: series.meta.bannerImage,
          alt: `${series.meta.title} banner`,
          title: `${series.meta.title} Banner Image`,
          description: `Official banner image for ${series.meta.title}`,
          aspectRatio: 'landscape',
          category: 'poster'
        });
      }

      // Add season-specific posters if available
      series.seasons?.forEach(season => {
        if (season.posterImage && (!filterSeason || season.number === filterSeason)) {
          images.push({
            src: season.posterImage,
            alt: `${series.meta.title} Season ${season.number} poster`,
            title: `Season ${season.number} Poster`,
            description: `Official poster for Season ${season.number}`,
            aspectRatio: 'portrait',
            category: 'poster',
            seasonNumber: season.number
          });
        }
      });
    }

    // Add location images
    if (imageCategory === 'all' || imageCategory === 'locations') {
      series.locations?.forEach(location => {
        // Filter by season if specified
        if (filterSeason) {
          const hasSeasonEpisodes = location.episodes?.some(ep => ep.season === filterSeason);
          if (!hasSeasonEpisodes) return;
        }

        if (location.image) {
          const seasonInfo = filterSeason 
            ? ` (Season ${filterSeason})`
            : location.episodes?.length > 0 
              ? ` (Seasons ${[...new Set(location.episodes.map(ep => ep.season))].sort().join(', ')})`
              : '';

          images.push({
            src: location.image,
            alt: location.name,
            title: location.name,
            description: `${location.description}${seasonInfo}`,
            aspectRatio: 'landscape',
            category: 'location',
            locationId: location.id
          });
        }
      });
    }

    // Add episode thumbnails if available
    if (imageCategory === 'all' || imageCategory === 'episodes') {
      series.seasons?.forEach(season => {
        if (filterSeason && season.number !== filterSeason) return;

        season.episodes?.forEach(episode => {
          if (episode.thumbnail) {
            images.push({
              src: episode.thumbnail,
              alt: `${series.meta.title} S${season.number}E${episode.number}`,
              title: `S${season.number}E${episode.number}: ${episode.title}`,
              description: episode.description || `Episode ${episode.number} of Season ${season.number}`,
              aspectRatio: 'landscape',
              category: 'episode',
              seasonNumber: season.number,
              episodeNumber: episode.number
            });
          }
        });
      });
    }

    return images;
  }, [series, filterSeason, imageCategory]);

  const handleSeasonFilter = (seasonNumber: number | null) => {
    setFilterSeason(seasonNumber);
    
    // Update URL if needed
    if (seasonNumber && router.query.season !== seasonNumber?.toString()) {
      const currentQuery = { ...router.query };
      currentQuery.season = seasonNumber.toString();
      router.push({
        pathname: router.pathname,
        query: currentQuery,
      }, undefined, { shallow: true });
    }
  };

  const getFilteredImageCount = (category: string) => {
    return galleryImages.filter(img => category === 'all' || img.category === category).length;
  };

  return (
    <div className={`season-image-gallery ${className}`}>
      {/* Filter Controls */}
      {(showSeasonFilter || series.seasons?.length > 1) && (
        <div className="mb-8 space-y-4">
          {/* Season Filter */}
          {showSeasonFilter && series.seasons && series.seasons.length > 1 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Season
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSeasonFilter(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterSeason === null
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Seasons
                </button>
                {series.seasons.map(season => (
                  <button
                    key={season.number}
                    onClick={() => handleSeasonFilter(season.number)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterSeason === season.number
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Season {season.number}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Category Filter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Image Category
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Images', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { id: 'posters', label: 'Posters', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z' },
                { id: 'locations', label: 'Locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                { id: 'episodes', label: 'Episodes', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' }
              ].map(category => {
                const count = getFilteredImageCount(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setImageCategory(category.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      imageCategory === category.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={count === 0}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon} />
                    </svg>
                    <span>{category.label}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      imageCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Display */}
      {galleryImages.length > 0 ? (
        <EnhancedImageGallery
          images={galleryImages.filter(img => imageCategory === 'all' || img.category === imageCategory)}
          title={`${series.meta.title} Gallery${filterSeason ? ` - Season ${filterSeason}` : ''}`}
          columns={imageCategory === 'posters' ? 4 : 3}
          enableLightbox={true}
          lazyLoad={true}
          showThumbnails={true}
        />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-3">No images found</h3>
          <p className="text-gray-600 mb-6">
            {filterSeason 
              ? `No images available for Season ${filterSeason} in the ${imageCategory} category.`
              : `No images available in the ${imageCategory} category.`
            }
          </p>
          <button
            onClick={() => {
              setFilterSeason(null);
              setImageCategory('all');
            }}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Show All Images
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SeasonImageGallery; 
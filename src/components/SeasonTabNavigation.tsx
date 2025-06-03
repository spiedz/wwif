import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Season } from '../types/series';

interface SeasonTabNavigationProps {
  seasons: Season[];
  activeSeasonNumber?: number;
  onSeasonChange?: (seasonNumber: number) => void;
  className?: string;
}

const SeasonTabNavigation: React.FC<SeasonTabNavigationProps> = ({
  seasons,
  activeSeasonNumber,
  onSeasonChange,
  className = ''
}) => {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState<number>(
    activeSeasonNumber || seasons[0]?.number || 1
  );

  // Update selected season when URL changes
  useEffect(() => {
    const seasonFromUrl = router.query.season ? parseInt(router.query.season as string) : null;
    if (seasonFromUrl && seasons.some(s => s.number === seasonFromUrl)) {
      setSelectedSeason(seasonFromUrl);
    } else if (!seasonFromUrl && seasons.length > 0) {
      setSelectedSeason(seasons[0].number);
    }
  }, [router.query.season, seasons]);

  // Update URL when season changes
  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    
    // Update URL with shallow routing to avoid page reload
    const currentQuery = { ...router.query };
    if (seasonNumber === seasons[0]?.number) {
      // Remove season parameter if it's the first season
      delete currentQuery.season;
    } else {
      currentQuery.season = seasonNumber.toString();
    }

    router.push(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true }
    );

    // Call external handler if provided
    onSeasonChange?.(seasonNumber);
  };

  if (!seasons || seasons.length === 0) {
    return null;
  }

  // Don't show tabs if there's only one season
  if (seasons.length === 1) {
    return (
      <div className={`season-single ${className}`}>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Season {seasons[0].number}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {seasons[0].episodeCount} episodes • Released in {seasons[0].releaseYear}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`season-tab-navigation ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Browse by Season
        </h3>
        
        {/* Desktop Tab Navigation */}
        <div className="hidden md:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {seasons.map((season) => {
                const isActive = selectedSeason === season.number;
                return (
                  <button
                    key={season.number}
                    onClick={() => handleSeasonChange(season.number)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Season {season.number}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {season.episodeCount} ep
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <div className="md:hidden">
          <label htmlFor="season-select" className="sr-only">
            Choose a season
          </label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
          >
            {seasons.map((season) => (
              <option key={season.number} value={season.number}>
                Season {season.number} ({season.episodeCount} episodes)
              </option>
            ))}
          </select>
        </div>

        {/* Season Info Display */}
        {seasons.find(s => s.number === selectedSeason) && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-800">
                  Season {selectedSeason}
                </h4>
                <p className="text-gray-600 text-sm">
                  Released in {seasons.find(s => s.number === selectedSeason)?.releaseYear}
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {seasons.find(s => s.number === selectedSeason)?.episodeCount} Episodes
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonTabNavigation; 
import React, { useState } from 'react';
import { TVSeries } from '../types/series';

interface SeriesEpisodesDisplayProps {
  series: TVSeries;
}

const SeriesEpisodesDisplay: React.FC<SeriesEpisodesDisplayProps> = ({ series }) => {
  const [activeSeason, setActiveSeason] = useState<number>(series.seasons?.[0]?.number || 1);
  const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);

  // Get the active season data
  const seasonData = series.seasons?.find(season => season.number === activeSeason);
  
  if (!series.seasons || series.seasons.length === 0) {
    return null;
  }
  
  return (
    <div className="series-episodes-display mt-16 mb-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-7 h-7 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        Seasons & Episodes
      </h2>
      
      {/* Seasons Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex space-x-2">
          {series.seasons.map(season => (
            <button
              key={`season-${season.number}`}
              onClick={() => setActiveSeason(season.number)}
              className={`px-5 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSeason === season.number
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Season {season.number} 
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-black/10">
                {season.episodeCount} episodes
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Season Info */}
      {seasonData && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Season {seasonData.number}</h3>
            <p className="text-gray-600 text-sm">Released in {seasonData.releaseYear}</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {seasonData.episodeCount} Episodes
            </span>
          </div>
        </div>
      )}
      
      {/* Episodes List */}
      {seasonData && seasonData.episodes && (
        <div className="space-y-4">
          {seasonData.episodes.map((episode, index) => {
            const isExpanded = expandedEpisode === episode.number;
            
            return (
              <div 
                key={`episode-${episode.number}`}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'transform scale-[1.02]' : ''
                }`}
              >
                <button
                  onClick={() => setExpandedEpisode(isExpanded ? null : episode.number)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-3">
                      {episode.number}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{episode.title}</h4>
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Expanded Episode Content */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 pt-2">
                    <p className="text-gray-600 mb-4">{episode.description}</p>
                    
                    {/* Locations featured in this episode */}
                    {series.locations && series.locations.filter(location => 
                      location.episodes.some(ep => ep.season === activeSeason && ep.episode === episode.number)
                    ).length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Featured Locations:</h5>
                        <div className="space-y-2">
                          {series.locations
                            .filter(location => 
                              location.episodes.some(ep => ep.season === activeSeason && ep.episode === episode.number)
                            )
                            .map((location, locIndex) => {
                              const episodeInfo = location.episodes.find(
                                ep => ep.season === activeSeason && ep.episode === episode.number
                              );
                              
                              return (
                                <div 
                                  key={`loc-${locIndex}`}
                                  className="bg-gray-50 rounded-lg p-3 flex items-start"
                                >
                                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <div>
                                    <p className="font-medium text-gray-800">{location.name}</p>
                                    {episodeInfo?.sceneDescription && (
                                      <p className="text-sm text-gray-600 mt-1">{episodeInfo.sceneDescription}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Netflix Link Button */}
                    <div className="mt-4 flex justify-end">
                      <a
                        href={`https://www.netflix.com/search?q=${encodeURIComponent(series.meta.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5.398 0v24l6.334-7.508 6.17 7.508V0H5.398Z" />
                        </svg>
                        Watch on Netflix
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Empty state */}
      {(!seasonData || !seasonData.episodes || seasonData.episodes.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500">No episodes found for this season.</p>
        </div>
      )}
    </div>
  );
};

export default SeriesEpisodesDisplay; 
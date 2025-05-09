import React, { useState } from 'react';
import { VideoContent } from '../types/content';
import { getVideoObjectSchema } from '../utils/schema';

interface VideoTrailerProps {
  video: VideoContent;
  filmTitle: string;
  showSchemaMarkup?: boolean;
}

/**
 * VideoTrailer component for displaying film trailers or video content
 * with proper VideoObject schema markup
 */
const VideoTrailer: React.FC<VideoTrailerProps> = ({ 
  video, 
  filmTitle,
  showSchemaMarkup = true 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Default values for required fields if not provided
  const videoTitle = video.title || `${filmTitle} - Official Trailer`;
  const videoDescription = video.description || `Watch the official trailer for ${filmTitle}`;
  const videoThumbnail = video.thumbnailUrl || 'https://wherewasitfilmed.co/images/default-trailer-thumbnail.jpg';
  const videoUploadDate = video.uploadDate || new Date().toISOString().split('T')[0];
  
  // Generate video schema
  const videoSchema = getVideoObjectSchema({
    name: videoTitle,
    description: videoDescription,
    thumbnailUrl: videoThumbnail,
    uploadDate: videoUploadDate,
    embedUrl: video.embedUrl,
    contentUrl: video.contentUrl,
    duration: video.duration
  });

  // Extract YouTube video ID from embedUrl if available
  const getYouTubeId = (url?: string): string => {
    if (!url) return '';
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };
  
  const youtubeId = getYouTubeId(video.embedUrl);
  
  return (
    <div className="video-trailer relative">
      <div className="aspect-video relative bg-gray-100 overflow-hidden rounded-xl shadow-md">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={videoTitle}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        ) : video.contentUrl ? (
          <video
            src={video.contentUrl}
            controls
            poster={videoThumbnail}
            className="absolute top-0 left-0 w-full h-full bg-black"
            onLoadedData={() => setIsLoading(false)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <p className="text-gray-500">No video available</p>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {showSchemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
    </div>
  );
};

export default VideoTrailer; 
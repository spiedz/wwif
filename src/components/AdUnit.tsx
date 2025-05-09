import React, { useEffect, useRef } from 'react';

type AdSize = 
  | 'responsive'
  | 'auto'
  | 'horizontal'
  | 'vertical'
  | 'rectangle'
  | 'leaderboard'
  | [number, number]; // Width, height in pixels

interface AdProps {
  className?: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  layout?: 'in-article' | 'display' | 'in-feed';
  slot?: string;
  size?: AdSize;
  adTest?: boolean; // For development testing only
}

/**
 * Adaptive sizes mapping for predefined formats
 */
const getAdSizeMapping = (size: AdSize): { width?: number; height?: number } => {
  if (Array.isArray(size)) {
    return { width: size[0], height: size[1] };
  }

  // Predefined size mappings
  switch (size) {
    case 'responsive':
      return {}; // Let AdSense determine the size
    case 'horizontal':
      return { width: 728, height: 90 }; // Leaderboard
    case 'vertical':
      return { width: 300, height: 600 }; // Large skyscraper
    case 'rectangle':
      return { width: 300, height: 250 }; // Medium rectangle
    case 'leaderboard':
      return { width: 728, height: 90 }; // Leaderboard
    case 'auto':
    default:
      return {}; // Let AdSense determine the size
  }
};

/**
 * AdUnit component for displaying Google AdSense advertisements
 */
const AdUnit: React.FC<AdProps> = ({
  className = '',
  style = {},
  format = 'auto',
  layout,
  slot = '',
  size = 'auto',
  adTest = false,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Check if AdSense is loaded
      if (window.adsbygoogle) {
        // Push the ad to AdSense for rendering
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error rendering AdSense ad:', error);
    }
  }, []);

  // Get size dimensions based on the size prop
  const sizeStyles = getAdSizeMapping(size);
  
  // Combine styles
  const containerStyles: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    overflow: 'hidden',
    ...sizeStyles,
    ...style,
  };

  // Data attributes for the ins element
  const adAttributes: Record<string, string> = {
    'data-ad-client': 'ca-pub-1419518181504900',
    'data-ad-format': format,
  };

  // Add layout if provided
  if (layout) {
    adAttributes['data-ad-layout'] = layout;
  }

  // Add slot if provided
  if (slot) {
    adAttributes['data-ad-slot'] = slot;
  }

  // Add test mode if enabled
  if (adTest) {
    adAttributes['data-adtest'] = 'on';
  }

  return (
    <div className={`ad-container ${className}`} style={containerStyles} ref={adRef}>
      <div className="ad-label text-xs text-gray-400 mb-1">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(sizeStyles.width && { width: `${sizeStyles.width}px` }),
          ...(sizeStyles.height && { height: `${sizeStyles.height}px` }),
        }}
        {...adAttributes}
      />
    </div>
  );
};

// Add the global AdSense type definition for TypeScript
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export default AdUnit; 
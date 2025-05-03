import React from 'react';
import AdUnit from '../AdUnit';

interface ResponsiveAdProps {
  slot?: string;
  className?: string;
}

/**
 * ResponsiveAd component for displaying responsive ads
 * that adapt to container size
 */
const ResponsiveAd: React.FC<ResponsiveAdProps> = ({
  slot = '',
  className = '',
}) => {
  return (
    <div className={`responsive-ad-container my-4 ${className}`}>
      <AdUnit
        size="responsive"
        format="auto"
        slot={slot}
        className="mx-auto w-full"
      />
    </div>
  );
};

export default ResponsiveAd; 
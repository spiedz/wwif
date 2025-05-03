import React from 'react';
import AdUnit from '../AdUnit';

interface BannerAdProps {
  slot?: string;
  className?: string;
  showOnMobile?: boolean;
}

/**
 * BannerAd component for displaying horizontal banner ads
 * typically used at the top or bottom of pages
 */
const BannerAd: React.FC<BannerAdProps> = ({
  slot = '',
  className = '',
  showOnMobile = true,
}) => {
  return (
    <div className={`banner-ad-container w-full my-4 ${!showOnMobile ? 'hidden md:block' : ''} ${className}`}>
      <AdUnit
        size="horizontal"
        format="horizontal"
        slot={slot}
        className="mx-auto max-w-screen-lg"
      />
    </div>
  );
};

export default BannerAd; 
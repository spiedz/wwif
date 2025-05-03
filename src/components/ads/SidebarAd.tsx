import React from 'react';
import AdUnit from '../AdUnit';

interface SidebarAdProps {
  slot?: string;
  className?: string;
}

/**
 * SidebarAd component for displaying vertical ads
 * typically used in sidebars or rails
 */
const SidebarAd: React.FC<SidebarAdProps> = ({
  slot = '',
  className = '',
}) => {
  return (
    <div className={`sidebar-ad-container my-4 ${className}`}>
      <AdUnit
        size="vertical"
        format="vertical"
        slot={slot}
        className="mx-auto"
      />
    </div>
  );
};

export default SidebarAd; 
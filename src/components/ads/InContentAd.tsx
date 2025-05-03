import React from 'react';
import AdUnit from '../AdUnit';

interface InContentAdProps {
  slot?: string;
  className?: string;
}

/**
 * InContentAd component for displaying ads within content
 * typically used between paragraphs or sections of articles
 */
const InContentAd: React.FC<InContentAdProps> = ({
  slot = '',
  className = '',
}) => {
  return (
    <div className={`in-content-ad-container my-6 ${className}`}>
      <AdUnit
        size="rectangle"
        format="rectangle"
        layout="in-article"
        slot={slot}
        className="mx-auto"
      />
    </div>
  );
};

export default InContentAd; 
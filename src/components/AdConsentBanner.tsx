import React, { useState, useEffect } from 'react';
import { hasAdConsent, setAdConsent, refreshAds } from '../utils/adManager';

interface AdConsentBannerProps {
  className?: string;
}

/**
 * AdConsentBanner component that asks users for consent to personalized ads
 * and manages the consent state
 */
const AdConsentBanner: React.FC<AdConsentBannerProps> = ({
  className = '',
}) => {
  const [showBanner, setShowBanner] = useState(false);
  
  // Check if we need to show the banner
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // If consent not already given, show banner
    const consentGiven = hasAdConsent();
    setShowBanner(!consentGiven);
  }, []);
  
  // Handle accept action
  const handleAccept = () => {
    setAdConsent(true);
    setShowBanner(false);
    refreshAds();
  };
  
  // Handle reject action
  const handleReject = () => {
    setAdConsent(false);
    setShowBanner(false);
    refreshAds();
  };
  
  if (!showBanner) {
    return null;
  }
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 ${className}`}>
      <div className="container mx-auto max-w-screen-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-8">
            <h3 className="text-lg font-medium mb-1">We use cookies for ads</h3>
            <p className="text-sm text-gray-300">
              We use cookies to personalize ads and analyze our traffic. 
              By accepting, you allow us to use cookies for these purposes. 
              You can change your preferences anytime in our privacy settings.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-transparent border border-gray-400 rounded hover:bg-gray-700 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdConsentBanner; 
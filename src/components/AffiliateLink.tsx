import React from 'react';

export interface AffiliateLinkProps {
  name: string;
  url: string;
  type: 'booking' | 'streaming' | 'tour';
  logo?: string;
  price?: string;
  discount?: string;
  isPartner?: boolean;
}

const AffiliateLink: React.FC<AffiliateLinkProps> = ({
  name,
  url,
  type,
  logo,
  price,
  discount,
  isPartner = false,
}) => {
  // Icon based on type
  const getIcon = () => {
    switch (type) {
      case 'booking':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 19H5V8H19V19ZM16 1V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H18V1H16ZM12 12H17V17H12V12Z" fill="currentColor"/>
          </svg>
        );
      case 'streaming':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20V8H4V6ZM6 12H10V10H6V12ZM12 12H18V10H12V12ZM6 16H9V14H6V16ZM11 16H14V14H11V16ZM16 16H18V14H16V16Z" fill="currentColor"/>
          </svg>
        );
      case 'tour':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 9H18.5L13 3.5V9ZM6 2H14L20 8V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C4.89 22 4 21.1 4 20V4C4 2.89 4.89 2 6 2ZM15 18V16H6V18H15ZM18 14V12H6V14H18Z" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Background and text colors based on type
  const getStyles = () => {
    switch (type) {
      case 'booking':
        return {
          bg: 'bg-blue-600',
          hover: 'hover:bg-blue-700',
          text: 'text-white',
        };
      case 'streaming':
        return {
          bg: 'bg-red-600',
          hover: 'hover:bg-red-700',
          text: 'text-white',
        };
      case 'tour':
        return {
          bg: 'bg-green-600',
          hover: 'hover:bg-green-700',
          text: 'text-white',
        };
      default:
        return {
          bg: 'bg-gray-600',
          hover: 'hover:bg-gray-700',
          text: 'text-white',
        };
    }
  };

  const styles = getStyles();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex items-center justify-between rounded-lg p-4 mb-2 ${styles.bg} ${styles.text} ${styles.hover} transition-colors`}
    >
      <div className="flex items-center">
        {logo ? (
          <img src={logo} alt={name} className="w-6 h-6 mr-3 rounded" />
        ) : (
          <div className="mr-3">{getIcon()}</div>
        )}
        <div>
          <div className="font-medium">{name}</div>
          {price && (
            <div className="text-xs opacity-90 mt-0.5">
              {discount ? (
                <span>
                  <span className="line-through mr-1">{price}</span>
                  <span className="font-bold">{discount}</span>
                </span>
              ) : (
                <span>From {price}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {isPartner && (
          <span className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded mr-2">
            Partner
          </span>
        )}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
};

export default AffiliateLink; 
// Ad slots configuration
// These slots should be created in Google AdSense account
export const AD_SLOTS = {
  HOME_TOP_BANNER: 'your-home-top-banner-slot-id',
  SIDEBAR: 'your-sidebar-slot-id',
  IN_CONTENT: 'your-in-content-slot-id',
  FILM_PAGE_BANNER: 'your-film-page-banner-slot-id',
  SERIES_PAGE_BANNER: 'your-series-page-banner-slot-id',
  BLOG_TOP_BANNER: 'your-blog-top-banner-slot-id',
  FOOTER: 'your-footer-slot-id',
};

// Check if user has consented to personalized ads
export const hasAdConsent = (): boolean => {
  // If in server environment, return false
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for consent cookie or localStorage value
  const consentCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('ad_consent='));
  
  if (consentCookie) {
    return consentCookie.split('=')[1] === 'true';
  }
  
  // Check localStorage fallback
  try {
    return localStorage.getItem('ad_consent') === 'true';
  } catch (e) {
    return false;
  }
};

// Set ad consent preference
export const setAdConsent = (consent: boolean): void => {
  // If in server environment, do nothing
  if (typeof window === 'undefined') {
    return;
  }

  // Set consent cookie (expires in 365 days)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
  document.cookie = `ad_consent=${consent}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  
  // Set localStorage fallback
  try {
    localStorage.setItem('ad_consent', consent ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to store ad consent in localStorage', e);
  }
};

// Refresh ads - can be called after consent changes
export const refreshAds = (): void => {
  // If in server environment or no window.adsbygoogle, do nothing
  if (typeof window === 'undefined' || !window.adsbygoogle) {
    return;
  }

  try {
    // Push new ad configurations to refresh ads
    (window.adsbygoogle as any[]).push({});
  } catch (e) {
    console.error('Failed to refresh ads', e);
  }
};

// Check if an ad blocker is present (simple detection)
export const hasAdBlocker = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  return new Promise(resolve => {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.opacity = '0';
    document.body.appendChild(testAd);

    // Check if ad blocker blocks the test ad
    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0;
      testAd.remove();
      resolve(isBlocked);
    }, 100);
  });
}; 
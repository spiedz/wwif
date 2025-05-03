import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import AdConsentBanner from './AdConsentBanner';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <AdConsentBanner />
    </div>
  );
};

export default Layout; 
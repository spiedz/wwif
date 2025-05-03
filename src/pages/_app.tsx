import '../../styles/globals.css';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { getOrganizationSchema } from '../utils/schema';
import Layout from '../components/Layout';
import React from 'react';

// Function to initialize comments system only on server
let initializeCommentsSystem: (() => void) | undefined;
if (typeof window === 'undefined') {
  // Using dynamic import instead of require
  import('../utils/comments')
    .then((commentsModule) => {
      initializeCommentsSystem = commentsModule.initializeCommentsSystem;
    })
    .catch((error) => {
      console.error('Failed to import comments module:', error);
    });
}

function MyApp({ Component, pageProps }: AppProps) {
  // Generate organization schema for the website
  const organizationSchema = getOrganizationSchema();

  return (
    <>
      <Head>
        {/* Default SEO tags for all pages */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#D32F2F" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="google-site-verification" content="your-verification-code" />
        
        {/* Global JSON-LD schema for the organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Set default OpenGraph meta tags */}
        <meta property="og:site_name" content="Where Was It Filmed" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:site" content="@wherewasitfilmed" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

// Initialize server-side components
MyApp.getInitialProps = async (appContext: AppContext) => {
  // Initialize comments system (only on server)
  if (typeof window === 'undefined' && initializeCommentsSystem) {
    try {
      initializeCommentsSystem();
    } catch (error) {
      console.error('Failed to initialize comments system:', error);
    }
  }

  // Get the props for AppProps
  const appProps = appContext.Component.getInitialProps 
    ? { pageProps: await appContext.Component.getInitialProps(appContext.ctx) }
    : { pageProps: {} };

  return { ...appProps };
};

export default MyApp; 
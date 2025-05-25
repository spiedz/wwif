import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOOptimizerProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'video.movie' | 'video.tv_show';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  schema?: object;
  noindex?: boolean;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export default function SEOOptimizer({
  title,
  description,
  canonicalUrl,
  ogImage = '/images/default-og.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  schema,
  noindex = false,
  priority = 0.8,
  changefreq = 'weekly'
}: SEOOptimizerProps) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const fullUrl = canonicalUrl || `${baseUrl}${router.asPath}`;
  
  // Optimize title for SEO
  const optimizedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const fullTitle = title.includes('Where Was It Filmed') ? title : `${title} | Where Was It Filmed`;
  
  // Optimize description
  const optimizedDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  };

  // Add breadcrumb items based on URL path
  const pathSegments = router.asPath.split('/').filter(segment => segment);
  pathSegments.forEach((segment, index) => {
    const position = index + 2;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const item = `${baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`;
    
    breadcrumbSchema.itemListElement.push({
      "@type": "ListItem",
      "position": position,
      "name": name,
      "item": item
    });
  });

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Where Was It Filmed",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo.png`,
    "description": "Discover the real filming locations of your favorite movies and TV shows.",
    "sameAs": [
      "https://twitter.com/wherewasitfilmed",
      "https://facebook.com/wherewasitfilmed",
      "https://instagram.com/wherewasitfilmed"
    ]
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Where Was It Filmed",
    "url": baseUrl,
    "description": "Discover the real filming locations of your favorite movies and TV shows.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={optimizedTitle} />
      <meta property="og:site_name" content="Where Was It Filmed" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph */}
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@wherewasitfilmed" />
      <meta name="twitter:creator" content="@wherewasitfilmed" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content={optimizedTitle} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#D32F2F" />
      <meta name="msapplication-TileColor" content="#D32F2F" />
      <meta name="application-name" content="Where Was It Filmed" />
      <meta name="apple-mobile-web-app-title" content="Where Was It Filmed" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://maps.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//maps.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      
      {/* Custom Schema */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      )}
      
      {/* Sitemap Priority and Change Frequency (for XML sitemap generation) */}
      <meta name="sitemap-priority" content={priority.toString()} />
      <meta name="sitemap-changefreq" content={changefreq} />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Copyright and Author */}
      <meta name="copyright" content="Where Was It Filmed" />
      <meta name="author" content={author || "Where Was It Filmed Team"} />
      
      {/* Cache Control */}
      <meta httpEquiv="cache-control" content="public, max-age=31536000" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
} 
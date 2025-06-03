# Enhanced Series Page Template & Usage Guide

This document provides a comprehensive template and usage guide for the enhanced series page system with rich season navigation, advanced image galleries, and SEO optimization.

## 🎯 Overview

The enhanced series page provides:
- **Season-based navigation** with URL state management
- **Advanced image galleries** with lightbox and filtering
- **Comprehensive SEO optimization** with structured data
- **Mobile-responsive design** with accessibility features
- **Tab-based content organization** (Overview, Locations, Episodes, Gallery)

## 📁 File Structure

```
src/
├── components/
│   ├── SeasonTabNavigation.tsx      # Season selection with URL routing
│   ├── EnhancedImageGallery.tsx     # Advanced gallery with lightbox
│   ├── SeasonImageGallery.tsx       # Season-specific image filtering
│   ├── SeriesBreadcrumbs.tsx        # Hierarchical navigation
│   └── SeriesLocationsGuide.tsx     # Existing location component
├── pages/series/
│   └── [slug].tsx                   # Enhanced series page
├── types/
│   └── series.ts                    # Type definitions
└── utils/
    └── seriesSEO.ts                 # SEO utilities and structured data
```

## 🖼️ Placeholder Image URLs

All examples use the placehold.co service with the specified format:
- **Base URL**: `https://placehold.co/600x400/EEE/31343C`
- **Custom text**: Add `?text=Your+Text+Here`
- **Different sizes**: Change dimensions as needed

### Image Size Guidelines

| Image Type | Recommended Size | Aspect Ratio | Example URL |
|------------|------------------|--------------|-------------|
| Series Poster | 400x600 | 2:3 (Portrait) | `https://placehold.co/400x600/8B0000/FFFFFF?text=Series+Poster` |
| Series Banner | 1920x1080 | 16:9 (Landscape) | `https://placehold.co/1920x1080/1a1a1a/FFFFFF?text=Series+Banner` |
| Season Poster | 400x600 | 2:3 (Portrait) | `https://placehold.co/400x600/8B0000/FFFFFF?text=Season+1+Poster` |
| Episode Thumbnail | 640x360 | 16:9 (Landscape) | `https://placehold.co/640x360/2C2C2C/FFFFFF?text=S1E1+Thumbnail` |
| Location Image | 800x600 | 4:3 (Landscape) | `https://placehold.co/800x600/228B22/FFFFFF?text=Location+Name` |
| Trailer Thumbnail | 1280x720 | 16:9 (Landscape) | `https://placehold.co/1280x720/8B0000/FFFFFF?text=Trailer+Thumbnail` |

## 📊 Data Structure Template

### Complete Series Data Example

```typescript
interface TVSeriesExample {
  meta: {
    title: "Where Was [Series Name] Filmed?";
    slug: "series-slug";
    description: "SEO-optimized description with filming locations";
    overview: "Detailed overview of the series and filming";
    releaseYearStart: 2020;
    releaseYearEnd: 2024; // or null if ongoing
    genres: ["Drama", "Thriller", "Action"];
    creator: "Creator Name";
    
    // Images with placeholder URLs
    posterImage: "https://placehold.co/400x600/8B0000/FFFFFF?text=Series+Poster";
    bannerImage: "https://placehold.co/1920x1080/1a1a1a/FFFFFF?text=Series+Banner";
    
    // Streaming and booking options
    streamingServices: [
      {
        name: "Netflix";
        url: "https://netflix.com/title/example";
        logo: "https://placehold.co/100x50/E50914/FFFFFF?text=Netflix";
      }
    ];
    
    bookingOptions: [
      {
        name: "Location Tour";
        type: "tour";
        price: "$45";
        url: "https://example.com/tour";
        isPartner: true;
      }
    ];
  };
  
  seasons: [
    {
      number: 1;
      episodeCount: 10;
      releaseYear: 2020;
      posterImage: "https://placehold.co/400x600/8B0000/FFFFFF?text=Season+1+Poster";
      episodes: [
        {
          number: 1;
          title: "Episode Title";
          description: "Episode description";
          airDate: "2020-01-01";
          thumbnail: "https://placehold.co/640x360/2C2C2C/FFFFFF?text=S1E1+Thumbnail";
          locations: ["location-id-1", "location-id-2"];
        }
      ];
    }
  ];
  
  locations: [
    {
      id: "location-id";
      name: "Location Name";
      description: "Location description with filming details";
      coordinates: { lat: 40.7128, lng: -74.0060 };
      image: "https://placehold.co/800x600/228B22/FFFFFF?text=Location+Name";
      episodes: [
        { season: 1, episode: 1, sceneDescription: "Scene details" }
      ];
    }
  ];
}
```

## 🎨 Component Usage Examples

### 1. Season Tab Navigation

```tsx
import SeasonTabNavigation from '../components/SeasonTabNavigation';

// Basic usage
<SeasonTabNavigation
  seasons={series.seasons}
  activeSeasonNumber={selectedSeason}
  onSeasonChange={handleSeasonChange}
  className="mb-12"
/>

// Features:
// - Automatic URL state management (?season=2)
// - Responsive design (tabs on desktop, dropdown on mobile)
// - Episode count badges
// - Browser history support
```

### 2. Enhanced Image Gallery

```tsx
import EnhancedImageGallery from '../components/EnhancedImageGallery';

// Gallery with all features
<EnhancedImageGallery
  images={galleryImages}
  title="Series Gallery"
  columns={3}
  enableLightbox={true}
  lazyLoad={true}
  showThumbnails={true}
  layout="grid"
/>

// Image data structure
const galleryImages = [
  {
    src: "https://placehold.co/800x600/EEE/31343C?text=Main+Image",
    alt: "Image description",
    title: "Image title",
    description: "Detailed description",
    thumbnail: "https://placehold.co/400x300/EEE/31343C?text=Thumbnail",
    webp: "https://placehold.co/800x600/EEE/31343C?text=WebP+Version",
    aspectRatio: "landscape", // 'square', 'portrait', 'landscape', 'auto'
    category: "poster", // 'poster', 'location', 'episode'
    seasonNumber: 1,
    episodeNumber: 1
  }
];
```

### 3. Season Image Gallery with Filtering

```tsx
import SeasonImageGallery from '../components/SeasonImageGallery';

// Season-specific gallery with filtering
<SeasonImageGallery
  series={series}
  selectedSeason={selectedSeason}
  showSeasonFilter={true}
  className="mt-8"
/>

// Features:
// - Automatic image organization by season
// - Category filtering (All, Posters, Locations, Episodes)
// - URL state synchronization
// - Empty state handling
```

### 4. Series Breadcrumbs

```tsx
import SeriesBreadcrumbs from '../components/SeriesBreadcrumbs';

// Contextual breadcrumbs
<SeriesBreadcrumbs
  series={series}
  selectedSeason={selectedSeason}
  activeTab={activeTab}
  className="mb-8"
/>

// Generates: Home > TV Series > Series Name > Season 2 > Episodes
```

## 🔍 SEO Implementation

### Structured Data Generation

```tsx
import {
  generateSeriesStructuredData,
  generateSeriesBreadcrumbs,
  generateSeriesMetaTags,
  generateSeriesCanonicalUrl,
  generateSeriesFAQSchema
} from '../utils/seriesSEO';

// In your series page component
const structuredData = generateSeriesStructuredData(series, selectedSeason);
const breadcrumbsSchema = generateSeriesBreadcrumbs(series, selectedSeason, activeTab);
const faqSchema = generateSeriesFAQSchema(series);
const metaTags = generateSeriesMetaTags(series, selectedSeason, activeTab);
const canonicalUrl = generateSeriesCanonicalUrl(series, selectedSeason, activeTab);

// Add to Head component
<Head>
  <title>{metaTags.title}</title>
  <meta name="description" content={metaTags.description} />
  <link rel="canonical" href={canonicalUrl} />
  
  {/* Structured Data */}
  <script type="application/ld+json">
    {JSON.stringify(structuredData)}
  </script>
  <script type="application/ld+json">
    {JSON.stringify(breadcrumbsSchema)}
  </script>
  <script type="application/ld+json">
    {JSON.stringify(faqSchema)}
  </script>
</Head>
```

### Meta Tag Examples

The SEO utilities generate context-aware meta tags:

```html
<!-- Base series page -->
<title>Where Was Stranger Things Filmed? - Complete Location Guide</title>
<meta name="description" content="Discover the real filming locations of Netflix's Stranger Things. From Hawkins High School to the Upside Down portal locations, explore where this supernatural thriller was actually filmed." />

<!-- Season-specific page -->
<title>Where Was Stranger Things Filmed? - Season 2 - Complete Location Guide</title>
<meta name="description" content="Explore Season 2 of Stranger Things filming locations. Discover the real filming locations of Netflix's Stranger Things. From Hawkins High School to the Upside Down portal locations, explore where this supernatural thriller was actually filmed." />

<!-- Tab-specific page -->
<title>Where Was Stranger Things Filmed? - Season 2 - Episodes Guide</title>
<meta name="description" content="Complete episode guide for Stranger Things Season 2. Episode summaries, filming locations, and behind-the-scenes details." />
```

## 🎯 URL Structure & Navigation

### URL Patterns

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| Series Overview | `/series/[slug]` | `/series/stranger-things` |
| Season Content | `/series/[slug]?season=N` | `/series/stranger-things?season=2` |
| Tab Navigation | `/series/[slug]#tab` | `/series/stranger-things#gallery` |
| Season + Tab | `/series/[slug]?season=N#tab` | `/series/stranger-things?season=2#episodes` |

### Navigation State Management

```tsx
// URL state is automatically managed by components
const router = useRouter();

// Season changes update URL with shallow routing
const handleSeasonChange = (seasonNumber: number) => {
  const currentQuery = { ...router.query };
  currentQuery.season = seasonNumber.toString();
  
  router.push({
    pathname: router.pathname,
    query: currentQuery,
  }, undefined, { shallow: true });
};

// Tab changes update URL hash
const handleTabChange = (tab: string) => {
  const newUrl = `${router.asPath.split('#')[0]}#${tab}`;
  router.replace(newUrl, undefined, { shallow: true });
};
```

## 📱 Mobile Responsiveness

### Responsive Design Features

```tsx
// Season navigation adapts to screen size
<div className="hidden md:block">
  {/* Desktop tabs */}
</div>
<div className="md:hidden">
  {/* Mobile dropdown */}
</div>

// Gallery columns adjust automatically
const getGridClasses = () => {
  switch (columns) {
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    // ...
  }
};

// Touch-friendly interactions
<button className="p-4 touch-manipulation">
  {/* Touch target is at least 44px */}
</button>
```

## ♿ Accessibility Features

### ARIA Labels and Roles

```tsx
// Proper ARIA labeling
<nav aria-label="Season navigation">
  <button
    aria-current={isActive ? 'page' : undefined}
    aria-label={`Season ${season.number}`}
  >
    Season {season.number}
  </button>
</nav>

// Screen reader support
<img
  src={image.src}
  alt={image.alt}
  aria-describedby={image.description ? 'image-desc' : undefined}
/>

// Keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

## 🚀 Performance Optimizations

### Image Loading

```tsx
// Lazy loading with intersection observer
<img
  src={getImageSrc(image)}
  alt={image.alt}
  loading="lazy"
  onLoad={() => handleImageLoad(index)}
  className={`transition-opacity ${
    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
  }`}
/>

// WebP support with fallbacks
const getImageSrc = (image: GalleryImage, isFullSize = false) => {
  const supportsWebP = /* WebP detection logic */;
  
  if (supportsWebP && image.webp) {
    return image.webp;
  }
  
  return isFullSize ? image.src : (image.thumbnail || image.src);
};
```

### Component Optimization

```tsx
// Memoized image processing
const galleryImages = useMemo(() => {
  // Process and filter images
  return processedImages;
}, [series, filterSeason, imageCategory]);

// Optimized re-renders
const MemoizedGallery = React.memo(EnhancedImageGallery);
```

## 🧪 Testing Guidelines

### Component Testing

```tsx
// Test season navigation
test('updates URL when season changes', () => {
  const mockPush = jest.fn();
  useRouter.mockReturnValue({ push: mockPush, query: {} });
  
  render(<SeasonTabNavigation seasons={mockSeasons} />);
  fireEvent.click(screen.getByText('Season 2'));
  
  expect(mockPush).toHaveBeenCalledWith(
    expect.objectContaining({
      query: { season: '2' }
    }),
    undefined,
    { shallow: true }
  );
});

// Test image gallery
test('opens lightbox on image click', () => {
  render(<EnhancedImageGallery images={mockImages} enableLightbox={true} />);
  fireEvent.click(screen.getAllByRole('img')[0]);
  
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

### SEO Testing

```bash
# Test structured data
npx @google/structured-data-testing-tool https://yoursite.com/series/example

# Test meta tags
curl -s https://yoursite.com/series/example | grep -E '<title>|<meta.*description'

# Test canonical URLs
curl -s https://yoursite.com/series/example | grep 'rel="canonical"'
```

## 📋 Implementation Checklist

### Setup Checklist

- [ ] Install required dependencies
- [ ] Set up TypeScript interfaces
- [ ] Configure image optimization
- [ ] Set up SEO utilities
- [ ] Implement responsive design system

### Component Checklist

- [ ] SeasonTabNavigation with URL routing
- [ ] EnhancedImageGallery with lightbox
- [ ] SeasonImageGallery with filtering
- [ ] SeriesBreadcrumbs with context
- [ ] SEO meta tag generation
- [ ] Structured data implementation

### Testing Checklist

- [ ] URL state management
- [ ] Image loading and optimization
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] SEO validation
- [ ] Performance metrics

### Deployment Checklist

- [ ] Image CDN configuration
- [ ] SEO meta tag validation
- [ ] Structured data testing
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Error monitoring

## 🔧 Customization Options

### Theme Customization

```tsx
// Custom color scheme
const theme = {
  primary: '#D32F2F',      // Red
  secondary: '#424242',    // Dark Gray
  background: '#FFFFFF',   // White
  accent: '#F5F5F5'       // Light Gray
};

// Apply to components
<SeasonTabNavigation
  className="custom-season-nav"
  // Custom styling via CSS classes
/>
```

### Layout Variations

```tsx
// Different gallery layouts
<EnhancedImageGallery
  layout="masonry"     // 'grid', 'masonry', 'carousel'
  columns={4}          // 2, 3, 4, 5
  aspectRatio="auto"   // 'square', 'landscape', 'portrait', 'auto'
/>

// Custom tab configurations
const customTabs = [
  { id: 'overview', label: 'Overview', icon: '...' },
  { id: 'locations', label: 'Locations', icon: '...' },
  { id: 'episodes', label: 'Episodes', icon: '...' },
  { id: 'gallery', label: 'Gallery', icon: '...' },
  { id: 'trivia', label: 'Trivia', icon: '...' }  // Custom tab
];
```

## 🎨 Visual Demo & Examples

### Complete Page Layout Example

Here's how the enhanced series page looks with all components integrated:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Where Was Stranger Things Filmed? - Season 2 - Complete Location Guide</title>
    <meta name="description" content="Explore Season 2 of Stranger Things filming locations. From Hawkins High School to Starcourt Mall, discover the real Georgia locations used in this supernatural thriller.">
    <link rel="canonical" href="https://yoursite.com/series/stranger-things?season=2">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .tab-active { @apply border-red-500 text-red-600 bg-red-50; }
        .tab-inactive { @apply border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300; }
        .season-tab-active { @apply bg-red-600 text-white; }
        .season-tab-inactive { @apply bg-gray-200 text-gray-700 hover:bg-gray-300; }
        .lightbox-overlay { backdrop-filter: blur(4px); }
    </style>
</head>
<body class="bg-white">
    <!-- Breadcrumbs -->
    <nav class="bg-gray-50 py-3" aria-label="Breadcrumb">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol class="flex items-center space-x-2 text-sm">
                <li><a href="/" class="text-gray-500 hover:text-gray-700">Home</a></li>
                <li class="text-gray-400">/</li>
                <li><a href="/series" class="text-gray-500 hover:text-gray-700">TV Series</a></li>
                <li class="text-gray-400">/</li>
                <li><a href="/series/stranger-things" class="text-gray-500 hover:text-gray-700">Stranger Things</a></li>
                <li class="text-gray-400">/</li>
                <li class="text-gray-900 font-medium">Season 2</li>
            </ol>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative bg-gray-900">
        <img src="https://placehold.co/1920x1080/1a1a1a/FFFFFF?text=Stranger+Things+Banner" 
             alt="Stranger Things Banner" 
             class="w-full h-96 object-cover opacity-70">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
                <div class="flex items-end space-x-8">
                    <img src="https://placehold.co/400x600/8B0000/FFFFFF?text=Stranger+Things+Poster" 
                         alt="Stranger Things Poster" 
                         class="w-32 h-48 object-cover rounded-lg shadow-xl">
                    <div class="text-white">
                        <h1 class="text-4xl font-bold mb-2">Where Was Stranger Things Filmed?</h1>
                        <p class="text-xl text-gray-300 mb-4">Discover the real filming locations in Georgia</p>
                        <div class="flex items-center space-x-4 text-sm">
                            <span class="bg-red-600 px-2 py-1 rounded">2016-2025</span>
                            <span>4 Seasons</span>
                            <span>34 Episodes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Season Navigation -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between py-4">
                <h2 class="text-lg font-semibold text-gray-900">Season Navigation</h2>
                
                <!-- Desktop Season Tabs -->
                <div class="hidden md:flex space-x-1">
                    <button class="season-tab-inactive px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Season 1 <span class="ml-1 text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded-full">8</span>
                    </button>
                    <button class="season-tab-active px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Season 2 <span class="ml-1 text-xs bg-white text-red-600 px-1.5 py-0.5 rounded-full">9</span>
                    </button>
                    <button class="season-tab-inactive px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Season 3 <span class="ml-1 text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded-full">8</span>
                    </button>
                    <button class="season-tab-inactive px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Season 4 <span class="ml-1 text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded-full">9</span>
                    </button>
                </div>

                <!-- Mobile Season Dropdown -->
                <div class="md:hidden">
                    <select class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option>Season 1 (8 episodes)</option>
                        <option selected>Season 2 (9 episodes)</option>
                        <option>Season 3 (8 episodes)</option>
                        <option>Season 4 (9 episodes)</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- Content Tabs -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex space-x-8" aria-label="Content navigation">
                <a href="#overview" class="tab-active border-b-2 py-4 px-1 text-sm font-medium">Overview</a>
                <a href="#locations" class="tab-inactive border-b-2 py-4 px-1 text-sm font-medium">Locations</a>
                <a href="#episodes" class="tab-inactive border-b-2 py-4 px-1 text-sm font-medium">Episodes</a>
                <a href="#gallery" class="tab-inactive border-b-2 py-4 px-1 text-sm font-medium">Gallery</a>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Overview Tab Content -->
        <div id="overview" class="tab-content">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Season 2 Overview</h2>
                    <p class="text-gray-700 mb-6">
                        In Season 2, the story continues one year after the events of Season 1. Will Byers has been rescued from the Upside Down, but he continues to have visions of the dark alternate dimension. The season introduces new characters including Max Mayfield and expands the mythology of the Upside Down with the introduction of the Mind Flayer.
                    </p>
                    
                    <!-- Season Poster -->
                    <div class="mb-8">
                        <img src="https://placehold.co/400x600/8B0000/FFFFFF?text=Season+2+Poster" 
                             alt="Stranger Things Season 2 Poster" 
                             class="w-64 h-96 object-cover rounded-lg shadow-lg mx-auto lg:mx-0">
                    </div>

                    <!-- Behind the Scenes -->
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">Behind the Scenes</h3>
                    <ul class="space-y-2 text-gray-700">
                        <li>• Filmed primarily in Atlanta and surrounding Georgia locations</li>
                        <li>• The arcade scenes were filmed at a real 1980s arcade in Atlanta</li>
                        <li>• Many exterior shots were filmed in Jackson, Georgia</li>
                        <li>• The pumpkin patch scenes required over 1,000 artificial pumpkins</li>
                    </ul>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <!-- Season Info -->
                    <div class="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Season 2 Details</h3>
                        <dl class="space-y-2">
                            <div class="flex justify-between">
                                <dt class="text-gray-600">Episodes:</dt>
                                <dd class="text-gray-900 font-medium">9</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-gray-600">Release Year:</dt>
                                <dd class="text-gray-900 font-medium">2017</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-gray-600">Runtime:</dt>
                                <dd class="text-gray-900 font-medium">~50 min/ep</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Streaming Services -->
                    <div class="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Watch Now</h3>
                        <a href="#" class="flex items-center space-x-3 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <img src="https://placehold.co/100x50/E50914/FFFFFF?text=Netflix" 
                                 alt="Netflix" 
                                 class="w-8 h-4 object-contain">
                            <span class="font-medium">Watch on Netflix</span>
                        </a>
                    </div>

                    <!-- Booking Options -->
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Visit Filming Locations</h3>
                        <div class="space-y-3">
                            <a href="#" class="block p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-medium text-gray-900">Stranger Things Tour</h4>
                                        <p class="text-sm text-gray-600">Guided tour of filming locations</p>
                                    </div>
                                    <span class="text-red-600 font-semibold">$45</span>
                                </div>
                            </a>
                            <a href="#" class="block p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-medium text-gray-900">Hawkins Hotel</h4>
                                        <p class="text-sm text-gray-600">Stay near filming locations</p>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-sm text-gray-500 line-through">$120</span>
                                        <span class="text-red-600 font-semibold block">$95/night</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Episodes Tab Content (Hidden by default) -->
        <div id="episodes" class="tab-content hidden">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Season 2 Episodes</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Episode 1 -->
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img src="https://placehold.co/640x360/2C2C2C/FFFFFF?text=S2E1+Thumbnail" 
                         alt="Episode 1 Thumbnail" 
                         class="w-full h-48 object-cover">
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-red-600">Episode 1</span>
                            <span class="text-sm text-gray-500">Oct 27, 2017</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">Chapter One: MADMAX</h3>
                        <p class="text-sm text-gray-600 mb-3">
                            As the town preps for Halloween, a high-scoring rival shakes things up in the arcade, and a skeptical Hopper inspects a field of rotting pumpkins.
                        </p>
                        <div class="flex flex-wrap gap-1">
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Hawkins High</span>
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Arcade</span>
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Pumpkin Patch</span>
                        </div>
                    </div>
                </div>

                <!-- Episode 2 -->
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img src="https://placehold.co/640x360/2C2C2C/FFFFFF?text=S2E2+Thumbnail" 
                         alt="Episode 2 Thumbnail" 
                         class="w-full h-48 object-cover">
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-red-600">Episode 2</span>
                            <span class="text-sm text-gray-500">Oct 27, 2017</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">Chapter Two: Trick or Treat, Freak</h3>
                        <p class="text-sm text-gray-600 mb-3">
                            After Will sees something terrible on trick-or-treat night, Mike wonders whether Eleven's still out there. Nancy wrestles with the truth about Barb.
                        </p>
                        <div class="flex flex-wrap gap-1">
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Neighborhoods</span>
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Byers House</span>
                        </div>
                    </div>
                </div>

                <!-- Episode 3 -->
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img src="https://placehold.co/640x360/2C2C2C/FFFFFF?text=S2E3+Thumbnail" 
                         alt="Episode 3 Thumbnail" 
                         class="w-full h-48 object-cover">
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-red-600">Episode 3</span>
                            <span class="text-sm text-gray-500">Oct 27, 2017</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">Chapter Three: The Pollywog</h3>
                        <p class="text-sm text-gray-600 mb-3">
                            Dustin adopts a strange new pet, and Eleven grows increasingly impatient. A well-meaning Bob urges Will to stand up to his fears.
                        </p>
                        <div class="flex flex-wrap gap-1">
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Dustin House</span>
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Hawkins Lab</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gallery Tab Content (Hidden by default) -->
        <div id="gallery" class="tab-content hidden">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Season 2 Gallery</h2>
                
                <!-- Gallery Filters -->
                <div class="flex space-x-2">
                    <button class="px-3 py-1 text-sm bg-red-600 text-white rounded-md">All</button>
                    <button class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Posters</button>
                    <button class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Locations</button>
                    <button class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Episodes</button>
                </div>
            </div>

            <!-- Image Gallery Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <!-- Gallery Image 1 -->
                <div class="group cursor-pointer" onclick="openLightbox(0)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Season+2+Poster" 
                             alt="Season 2 Poster" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Season 2 Poster</p>
                        <p class="text-xs text-gray-500">Official promotional poster</p>
                    </div>
                </div>

                <!-- Gallery Image 2 -->
                <div class="group cursor-pointer" onclick="openLightbox(1)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Hawkins+Lab+Exterior" 
                             alt="Hawkins Lab Exterior" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Hawkins Lab</p>
                        <p class="text-xs text-gray-500">Georgia Mental Health Institute</p>
                    </div>
                </div>

                <!-- Gallery Image 3 -->
                <div class="group cursor-pointer" onclick="openLightbox(2)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Arcade+Scene" 
                             alt="Arcade Scene" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Palace Arcade</p>
                        <p class="text-xs text-gray-500">Episode 1 - MADMAX introduction</p>
                    </div>
                </div>

                <!-- Gallery Image 4 -->
                <div class="group cursor-pointer" onclick="openLightbox(3)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Pumpkin+Patch" 
                             alt="Pumpkin Patch" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Pumpkin Patch</p>
                        <p class="text-xs text-gray-500">Infected pumpkin field scene</p>
                    </div>
                </div>

                <!-- Gallery Image 5 -->
                <div class="group cursor-pointer" onclick="openLightbox(4)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Byers+House+Interior" 
                             alt="Byers House Interior" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Byers House</p>
                        <p class="text-xs text-gray-500">Will's episodes and visions</p>
                    </div>
                </div>

                <!-- Gallery Image 6 -->
                <div class="group cursor-pointer" onclick="openLightbox(5)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Hawkins+High+Gym" 
                             alt="Hawkins High Gym" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Hawkins High Gym</p>
                        <p class="text-xs text-gray-500">School dance and basketball scenes</p>
                    </div>
                </div>

                <!-- Gallery Image 7 -->
                <div class="group cursor-pointer" onclick="openLightbox(6)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Mind+Flayer+Concept" 
                             alt="Mind Flayer Concept" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Mind Flayer</p>
                        <p class="text-xs text-gray-500">Season 2 main antagonist concept art</p>
                    </div>
                </div>

                <!-- Gallery Image 8 -->
                <div class="group cursor-pointer" onclick="openLightbox(7)">
                    <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/600x400/EEE/31343C?text=Cast+Behind+Scenes" 
                             alt="Cast Behind Scenes" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                             loading="lazy">
                    </div>
                    <div class="mt-2">
                        <p class="text-sm font-medium text-gray-900">Behind the Scenes</p>
                        <p class="text-xs text-gray-500">Cast and crew during filming</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Lightbox Modal -->
    <div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 lightbox-overlay hidden z-50 flex items-center justify-center">
        <div class="relative max-w-4xl max-h-full p-4">
            <!-- Close Button -->
            <button onclick="closeLightbox()" 
                    class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            <!-- Navigation Arrows -->
            <button onclick="navigateImage('prev')" 
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
            <button onclick="navigateImage('next')" 
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>

            <!-- Image Container -->
            <div class="text-center">
                <img id="lightbox-image" 
                     src="" 
                     alt="" 
                     class="max-w-full max-h-[80vh] object-contain rounded-lg">
                <div class="mt-4 text-white">
                    <h3 id="lightbox-title" class="text-xl font-semibold mb-2"></h3>
                    <p id="lightbox-description" class="text-gray-300"></p>
                    <div class="mt-2 text-sm text-gray-400">
                        <span id="lightbox-counter"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- JavaScript for Interactivity -->
    <script>
        // Gallery images data
        const galleryImages = [
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Season+2+Poster+HD',
                alt: 'Season 2 Poster',
                title: 'Stranger Things Season 2 Poster',
                description: 'Official promotional poster featuring the main cast and the Mind Flayer'
            },
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Hawkins+Lab+Exterior+HD',
                alt: 'Hawkins Lab Exterior',
                title: 'Hawkins National Laboratory',
                description: 'Georgia Mental Health Institute in Decatur, Georgia - the real filming location'
            },
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Arcade+Scene+HD',
                alt: 'Arcade Scene',
                title: 'Palace Arcade',
                description: 'The arcade where Max (MADMAX) is introduced in Episode 1'
            },
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Pumpkin+Patch+HD',
                alt: 'Pumpkin Patch',
                title: 'Infected Pumpkin Patch',
                description: 'The pumpkin field showing signs of Upside Down contamination'
            },
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Byers+House+Interior+HD',
                alt: 'Byers House Interior',
                title: 'Byers House Living Room',
                description: 'Where Will experiences his episodes and visions of the Upside Down'
            },
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Hawkins+High+Gym+HD',
                alt: 'Hawkins High Gym',
                title: 'Hawkins High School Gymnasium',
                description: 'Location for the Snow Ball dance and various school scenes'
            },
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Mind+Flayer+Concept+HD',
                alt: 'Mind Flayer Concept',
                title: 'The Mind Flayer',
                description: 'Concept art and design for Season 2\'s main antagonist'
            },
            {
                src: 'https://placehold.co/1200x800/EEE/31343C?text=Cast+Behind+Scenes+HD',
                alt: 'Cast Behind Scenes',
                title: 'Behind the Scenes',
                description: 'Cast and crew during filming of Season 2 in Georgia'
            }
        ];

        let currentImageIndex = 0;

        // Tab switching functionality
        function switchTab(tabName) {
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.remove('hidden');
            
            // Update tab styling
            document.querySelectorAll('nav a').forEach(tab => {
                tab.className = tab.className.replace('tab-active', 'tab-inactive');
            });
            document.querySelector(`a[href="#${tabName}"]`).className = 
                document.querySelector(`a[href="#${tabName}"]`).className.replace('tab-inactive', 'tab-active');
            
            // Update URL hash
            window.location.hash = tabName;
        }

        // Lightbox functionality
        function openLightbox(imageIndex) {
            currentImageIndex = imageIndex;
            const image = galleryImages[imageIndex];
            
            document.getElementById('lightbox-image').src = image.src;
            document.getElementById('lightbox-image').alt = image.alt;
            document.getElementById('lightbox-title').textContent = image.title;
            document.getElementById('lightbox-description').textContent = image.description;
            document.getElementById('lightbox-counter').textContent = `${imageIndex + 1} of ${galleryImages.length}`;
            
            document.getElementById('lightbox').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        function navigateImage(direction) {
            if (direction === 'next') {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            } else {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            }
            
            const image = galleryImages[currentImageIndex];
            document.getElementById('lightbox-image').src = image.src;
            document.getElementById('lightbox-image').alt = image.alt;
            document.getElementById('lightbox-title').textContent = image.title;
            document.getElementById('lightbox-description').textContent = image.description;
            document.getElementById('lightbox-counter').textContent = `${currentImageIndex + 1} of ${galleryImages.length}`;
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!document.getElementById('lightbox').classList.contains('hidden')) {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        navigateImage('prev');
                        break;
                    case 'ArrowRight':
                        navigateImage('next');
                        break;
                }
            }
        });

        // Tab navigation from URL hash
        document.addEventListener('DOMContentLoaded', function() {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                switchTab(hash);
            }
            
            // Add click handlers to tabs
            document.querySelectorAll('nav a[href^="#"]').forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    const tabName = this.getAttribute('href').substring(1);
                    switchTab(tabName);
                });
            });
        });

        // Close lightbox when clicking outside image
        document.getElementById('lightbox').addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    </script>

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        "name": "Stranger Things",
        "description": "Discover the real filming locations of Netflix's hit series Stranger Things. From Hawkins High School to the Upside Down portal locations, explore where this supernatural thriller was actually filmed.",
        "image": "https://placehold.co/400x600/8B0000/FFFFFF?text=Stranger+Things+Poster",
        "genre": ["Science Fiction", "Horror", "Drama", "Thriller"],
        "creator": {
            "@type": "Person",
            "name": "The Duffer Brothers"
        },
        "numberOfSeasons": 4,
        "startDate": "2016-07-15",
        "endDate": "2025-12-31",
        "productionCompany": {
            "@type": "Organization",
            "name": "Netflix"
        },
        "containsSeason": {
            "@type": "TVSeason",
            "seasonNumber": 2,
            "numberOfEpisodes": 9,
            "startDate": "2017-10-27",
            "episode": [
                {
                    "@type": "TVEpisode",
                    "episodeNumber": 1,
                    "name": "Chapter One: MADMAX",
                    "description": "As the town preps for Halloween, a high-scoring rival shakes things up in the arcade, and a skeptical Hopper inspects a field of rotting pumpkins.",
                    "datePublished": "2017-10-27"
                }
            ]
        }
    }
    </script>
</body>
</html>
```

### Quick Implementation Guide

To implement this enhanced series page in your WWIF project:

1. **Copy the components** from the completed subtasks (SeasonTabNavigation, EnhancedImageGallery, etc.)

2. **Update your series page** (`src/pages/series/[slug].tsx`) to use the new components:

```tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SeasonTabNavigation from '../../components/SeasonTabNavigation';
import EnhancedImageGallery from '../../components/EnhancedImageGallery';
import SeasonImageGallery from '../../components/SeasonImageGallery';
import SeriesBreadcrumbs from '../../components/SeriesBreadcrumbs';
import { generateSeriesStructuredData, generateSeriesMetaTags } from '../../utils/seriesSEO';

export default function SeriesPage({ series }) {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  // URL state management
  useEffect(() => {
    const season = parseInt(router.query.season as string) || 1;
    const tab = window.location.hash.substring(1) || 'overview';
    setSelectedSeason(season);
    setActiveTab(tab);
  }, [router.query.season]);

  const structuredData = generateSeriesStructuredData(series, selectedSeason);
  const metaTags = generateSeriesMetaTags(series, selectedSeason, activeTab);

  return (
    <>
      <Head>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="min-h-screen bg-white">
        <SeriesBreadcrumbs 
          series={series} 
          selectedSeason={selectedSeason} 
          activeTab={activeTab} 
        />
        
        {/* Hero Section */}
        <div className="relative bg-gray-900">
          <img 
            src={series.meta.bannerImage} 
            alt={`${series.meta.title} Banner`}
            className="w-full h-96 object-cover opacity-70"
          />
          {/* Hero content */}
        </div>

        <SeasonTabNavigation
          seasons={series.seasons}
          activeSeasonNumber={selectedSeason}
          onSeasonChange={setSelectedSeason}
        />

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          {/* Tab buttons */}
        </div>

        {/* Tab Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'gallery' && (
            <SeasonImageGallery
              series={series}
              selectedSeason={selectedSeason}
              showSeasonFilter={true}
            />
          )}
          {/* Other tab content */}
        </main>
      </div>
    </>
  );
}
```

3. **Use the example data structure** from `example-series-data.json` as a template for your series content

4. **Replace placeholder images** with actual content while maintaining the same aspect ratios and structure

This template provides a complete, production-ready enhanced series page with all the features implemented in the completed subtasks.

This template provides a comprehensive foundation for implementing the enhanced series page system with rich navigation, advanced image galleries, and SEO optimization. All placeholder images use the specified format and can be easily replaced with actual content. 
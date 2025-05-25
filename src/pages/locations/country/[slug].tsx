import { GetStaticProps, GetStaticPaths } from 'next';
import LocationIndexTemplate from '../../../components/LocationIndexTemplate';
import { 
  getLocationsByCountry, 
  getCountryBySlug, 
  getLocationsForCountry,
  getLocationsByCity
} from '../../../utils/locationUtils';
import { FAQItem } from '../../../components/FAQSection';

interface CountryPageProps {
  name: string;
  slug: string;
  locationCount: number;
  mediaItemCount: number;
  cities: string[];
  locations: any[];
  relatedCountries?: { title: string; slug: string; description: string }[];
}

export default function CountryPage({
  name,
  slug,
  locationCount,
  mediaItemCount,
  cities,
  locations,
  relatedCountries = []
}: CountryPageProps) {
  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Locations', url: '/locations' },
    { label: 'Countries', url: '/locations/countries' },
    { label: name }
  ];

  // Create page title
  const title = `Movies and TV Shows Filmed in ${name} - ${name} Film Locations`;
  
  // Create optimized description
  const description = `Discover ${locationCount} filming locations across ${cities.length} cities in ${name}. Interactive map and guides to ${mediaItemCount} films and TV shows filmed in ${name}.`;
  
  // Create hero title and subtitle
  const heroTitle = `${name} Film Locations`;
  const heroSubtitle = `Explore ${locationCount} filming locations from ${mediaItemCount} films and TV shows in ${cities.length} cities across ${name}`;
  
  // Generate FAQs
  const faqs: FAQItem[] = [
    {
      question: `What famous movies were filmed in ${name}?`,
      answer: `${name} has been a popular filming location for ${mediaItemCount} movies and TV shows. Some of the most notable productions filmed here include ${locations.slice(0, 3).map(loc => loc.mediaItems[0]?.title).filter(Boolean).join(', ')}.`
    },
    {
      question: `Which cities in ${name} have the most filming locations?`,
      answer: `The cities in ${name} with the most filming locations include ${cities.slice(0, 3).join(', ')}. ${cities[0]} in particular is home to many iconic film scenes.`
    },
    {
      question: `Is ${name} a popular filming destination?`,
      answer: `Yes, ${name} is ${mediaItemCount > 50 ? 'very popular' : 'an increasingly popular'} filming destination with ${locationCount} distinct filming locations that have been featured in ${mediaItemCount} different films and TV series.`
    },
    {
      question: `Can tourists visit film locations in ${name}?`,
      answer: `Yes, most filming locations in ${name} are accessible to tourists. Some may require tickets or have specific visiting hours, while others are freely accessible public spaces. Check our detailed location guides for specific visiting information.`
    }
  ];

  // Use first location image as hero image if available
  const heroImageUrl = locations[0]?.image || undefined;

  return (
    <LocationIndexTemplate
      title={title}
      description={description}
      locations={locations}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      locationCount={locationCount}
      mediaItemCount={mediaItemCount}
      breadcrumbItems={breadcrumbItems}
      relatedLocations={relatedCountries}
      pageType="country"
      name={name}
      faqs={faqs}
      heroImageUrl={heroImageUrl}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Temporarily disable country location pages to prevent build errors
  // TODO: Fix component import issues causing "Element type is invalid" errors
  return {
    paths: [],
    fallback: false,
  };
  
  // Original code commented out:
  /*
  // Get all countries
  const countries = await getLocationsByCountry();
  
  // Generate paths
  const paths = countries.map((country) => ({
    params: { slug: country.slug }
  }));
  
  return {
    paths,
    fallback: false,
  };
  */
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  // Get country info
  const countryInfo = await getCountryBySlug(slug);
  
  // Return 404 if country not found
  if (!countryInfo) {
    return {
      notFound: true,
    };
  }
  
  // Get all locations for this country
  const countryLocations = await getLocationsForCountry(countryInfo.name);
  
  // Get other countries to use as related locations
  const allCountries = await getLocationsByCountry();
  const otherCountries = allCountries
    .filter(country => country.slug !== slug)
    .slice(0, 6)
    .map(country => ({
      title: country.name,
      slug: `/locations/country/${country.slug}`,
      description: `Explore ${country.locationCount} filming locations in ${country.name}, including ${country.cities.slice(0, 2).join(' and ')}`
    }));
  
  return {
    props: {
      name: countryInfo.name,
      slug: countryInfo.slug,
      locationCount: countryInfo.locationCount,
      mediaItemCount: countryInfo.mediaItemCount,
      cities: countryInfo.cities,
      locations: countryLocations,
      relatedCountries: otherCountries,
    },
    revalidate: 86400, // Revalidate once per day
  };
}; 
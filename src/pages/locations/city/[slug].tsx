import { GetStaticProps, GetStaticPaths } from 'next';
import LocationIndexTemplate from '../../../components/LocationIndexTemplate';
import { 
  getLocationsByCity, 
  getCityBySlug, 
  getLocationsForCity,
  getLocationsByCountry
} from '../../../utils/locationUtils';
import { FAQItem } from '../../../components/FAQSection';

interface CityPageProps {
  name: string;
  slug: string;
  country: string;
  locationCount: number;
  mediaItemCount: number;
  locations: any[];
  relatedCities?: { title: string; slug: string; description: string }[];
}

export default function CityPage({
  name,
  slug,
  country,
  locationCount,
  mediaItemCount,
  locations,
  relatedCities = []
}: CityPageProps) {
  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Locations', url: '/locations' },
    { label: 'Cities', url: '/locations/cities' },
    { label: name }
  ];

  // Create page title
  const title = `Movies and TV Shows Filmed in ${name} - ${country} Film Locations`;
  
  // Create optimized description
  const description = `Discover ${locationCount} filming locations in ${name}, ${country}. Interactive map and guides to ${mediaItemCount} films and TV shows filmed in ${name}.`;
  
  // Create hero title and subtitle
  const heroTitle = `${name} Film Locations`;
  const heroSubtitle = `Explore ${locationCount} filming locations from ${mediaItemCount} films and TV shows in ${name}, ${country}`;
  
  // Generate FAQs
  const faqs: FAQItem[] = [
    {
      question: `What famous movies were filmed in ${name}?`,
      answer: `${name} has been a popular filming location for ${mediaItemCount} movies and TV shows. Some of the most notable productions filmed here include ${locations.slice(0, 3).map(loc => loc.mediaItems[0]?.title).filter(Boolean).join(', ')}.`
    },
    {
      question: `How many filming locations are in ${name}?`,
      answer: `We've identified ${locationCount} distinct filming locations in ${name}, ${country}. These locations have been featured in ${mediaItemCount} different films and TV series.`
    },
    {
      question: `Can I visit the filming locations in ${name}?`,
      answer: `Yes, most filming locations in ${name} are accessible to the public. Some may require tickets or have specific visiting hours, while others are freely accessible public spaces. Check our detailed location guides for specific visiting information.`
    },
    {
      question: `What's the best time to visit film locations in ${name}?`,
      answer: `The best time to visit film locations in ${name} depends on the specific sites you want to see. Generally, visiting during weekdays or off-season will help you avoid crowds. Early morning is also a good time for photography at popular locations.`
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
      relatedLocations={relatedCities}
      pageType="city"
      name={name}
      faqs={faqs}
      heroImageUrl={heroImageUrl}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all cities
  const cities = await getLocationsByCity();
  
  // Generate paths
  const paths = cities.map((city) => ({
    params: { slug: city.slug }
  }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  // Get city info
  const cityInfo = await getCityBySlug(slug);
  
  // Return 404 if city not found
  if (!cityInfo) {
    return {
      notFound: true,
    };
  }
  
  // Get all locations for this city
  const cityLocations = await getLocationsForCity(cityInfo.name);
  
  // Get other cities in the same country to use as related locations
  const allCities = await getLocationsByCity();
  const citiesInCountry = allCities
    .filter(city => 
      city.country === cityInfo.country && 
      city.slug !== slug
    )
    .slice(0, 6)
    .map(city => ({
      title: city.name,
      slug: `/locations/city/${city.slug}`,
      description: `Explore ${city.locationCount} filming locations in ${city.name}, ${city.country}`
    }));
  
  return {
    props: {
      name: cityInfo.name,
      slug: cityInfo.slug,
      country: cityInfo.country,
      locationCount: cityInfo.locationCount,
      mediaItemCount: cityInfo.mediaItemCount,
      locations: cityLocations,
      relatedCities: citiesInCountry,
    },
    revalidate: 86400, // Revalidate once per day
  };
}; 
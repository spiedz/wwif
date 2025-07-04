import Link from 'next/link';
import { useRouter } from 'next/router';
import { getBreadcrumbSchema } from '../utils/schema';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  includeSchemaMarkup?: boolean;
  currentUrl?: string;
}

export default function Breadcrumbs({ items, includeSchemaMarkup = true, currentUrl }: BreadcrumbsProps) {
  const router = useRouter();
  
  // Generate the current page URL if not provided
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const fullCurrentUrl = currentUrl || `${baseUrl}${router.asPath}`;
  
  // Generate schema data for breadcrumbs
  const schemaItems = items.map(item => ({
    name: item.label,
    url: item.url || fullCurrentUrl
  }));
  
  const breadcrumbSchema = getBreadcrumbSchema(schemaItems);
  
  return (
    <>
      <nav className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              
              {item.url ? (
                <Link 
                  href={item.url} 
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-medium truncate max-w-xs">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Schema.org BreadcrumbList markup */}
      {includeSchemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      )}
    </>
  );
} 
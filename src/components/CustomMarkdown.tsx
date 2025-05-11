import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AutoImageLocation from './AutoImageLocation';
import { parseTemplates } from '../utils/templateParser';

interface CustomMarkdownProps {
  content: string;
  className?: string;
  coordinates?: Array<{ 
    lat: number; 
    lng: number; 
    name: string; 
    description?: string;
    image?: string;
  }>;
  processAutoImages?: boolean;
}

/**
 * Enhanced markdown component that supports custom components and auto-images
 */
const CustomMarkdown: React.FC<CustomMarkdownProps> = ({
  content,
  className = 'prose prose-lg max-w-none',
  coordinates = [],
  processAutoImages = true,
}) => {
  // Process the content to replace auto-image tags if requested
  const processedContent = processAutoImages 
    ? parseTemplates(content)
    : content;

  // Find AutoImageLocation component tags in processed content
  const componentRegex = /<AutoImageLocation[^>]+\/>/g;
  const components = processedContent.match(componentRegex) || [];
  
  // Replace each component tag with a unique placeholder that won't be processed by markdown
  const placeholders: { [key: string]: string } = {};
  let finalContent = processedContent;
  
  components.forEach((component, index) => {
    const placeholder = `__AUTO_IMAGE_PLACEHOLDER_${index}__`;
    placeholders[placeholder] = component;
    finalContent = finalContent.replace(component, placeholder);
  });

  // Create a components object for ReactMarkdown to use
  const customComponents: any = {
    // Handle paragraphs that might contain our placeholders
    p: ({ node, children, ...props }: any) => {
      // Check if this paragraph contains one of our placeholders
      const content = node.children[0]?.value || '';
      
      if (content.startsWith('__AUTO_IMAGE_PLACEHOLDER_') && content.endsWith('__')) {
        // Extract the component data
        const componentString = placeholders[content];
        
        // Parse the component props
        const locationNameMatch = componentString.match(/locationName="([^"]+)"/);
        const descriptionMatch = componentString.match(/description="([^"]*)"/);
        const widthMatch = componentString.match(/width=\{(\d+)\}/);
        const heightMatch = componentString.match(/height=\{(\d+)\}/);
        const layoutMatch = componentString.match(/layout="([^"]+)"/);
        
        // Find existing image from coordinates if available
        const locationName = locationNameMatch ? locationNameMatch[1] : '';
        const coordinate = coordinates.find(
          c => c.name.toLowerCase() === locationName.toLowerCase()
        );
        
        // Render the AutoImageLocation component
        return (
          <AutoImageLocation
            locationName={locationName}
            description={descriptionMatch ? descriptionMatch[1] : undefined}
            existingImageUrl={coordinate?.image}
            width={widthMatch ? parseInt(widthMatch[1], 10) : 800}
            height={heightMatch ? parseInt(heightMatch[1], 10) : 500}
            layout={layoutMatch ? layoutMatch[1] as any : 'rounded'}
          />
        );
      }
      
      // Otherwise, render a normal paragraph
      return <p {...props}>{children}</p>;
    },
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {finalContent}
      </ReactMarkdown>
    </div>
  );
};

export default CustomMarkdown; 
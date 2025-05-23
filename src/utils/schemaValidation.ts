/**
 * Structured Data Validation and Monitoring Utilities
 * Validates JSON-LD schema markup for SEO compliance
 */

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number; // 0-100 quality score
}

export interface SchemaObject {
  '@context': string;
  '@type': string | string[];
  [key: string]: any;
}

/**
 * Required fields for different schema types
 */
const REQUIRED_FIELDS = {
  Movie: ['name', 'director', 'datePublished'],
  TVSeries: ['name', 'creator', 'numberOfSeasons'],
  Article: ['headline', 'author', 'datePublished'],
  BlogPosting: ['headline', 'author', 'datePublished'],
  Place: ['name', 'address'],
  TouristAttraction: ['name', 'address'],
  Organization: ['name', 'url'],
  Person: ['name'],
  WebSite: ['name', 'url'],
  WebPage: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  ImageObject: ['url', 'name'],
  VideoObject: ['name', 'uploadDate'],
};

/**
 * Recommended fields for better SEO
 */
const RECOMMENDED_FIELDS = {
  Movie: ['image', 'genre', 'duration', 'aggregateRating', 'description'],
  TVSeries: ['image', 'genre', 'description', 'aggregateRating'],
  Article: ['image', 'description', 'mainEntityOfPage'],
  BlogPosting: ['image', 'description', 'mainEntityOfPage'],
  Place: ['geo', 'image', 'description'],
  TouristAttraction: ['geo', 'image', 'description'],
  Organization: ['logo', 'description', 'sameAs'],
  Person: ['image', 'description', 'sameAs'],
  WebSite: ['description', 'potentialAction'],
  WebPage: ['description', 'mainEntity'],
  ImageObject: ['caption', 'contentLocation'],
  VideoObject: ['description', 'thumbnailUrl', 'duration'],
};

/**
 * Validate basic schema structure
 */
function validateBasicStructure(schema: any): SchemaValidationResult {
  const result: SchemaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    score: 100
  };

  // Check if it's an object
  if (typeof schema !== 'object' || schema === null) {
    result.errors.push('Schema must be an object');
    result.isValid = false;
    result.score = 0;
    return result;
  }

  // Check for required @context
  if (!schema['@context']) {
    result.errors.push('Missing required @context field');
    result.isValid = false;
    result.score -= 30;
  } else if (typeof schema['@context'] !== 'string' || !schema['@context'].includes('schema.org')) {
    result.warnings.push('@context should reference schema.org');
    result.score -= 10;
  }

  // Check for required @type
  if (!schema['@type']) {
    result.errors.push('Missing required @type field');
    result.isValid = false;
    result.score -= 30;
  }

  return result;
}

/**
 * Validate schema type-specific requirements
 */
function validateTypeSpecificFields(schema: SchemaObject): SchemaValidationResult {
  const result: SchemaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    score: 100
  };

  const schemaType = Array.isArray(schema['@type']) ? schema['@type'][0] : schema['@type'];
  
  if (!schemaType) {
    result.errors.push('Schema type is undefined');
    result.isValid = false;
    return result;
  }

  // Check required fields
  const requiredFields = REQUIRED_FIELDS[schemaType as keyof typeof REQUIRED_FIELDS];
  if (requiredFields) {
    const missingRequired = requiredFields.filter(field => !schema[field]);
    if (missingRequired.length > 0) {
      result.errors.push(`Missing required fields for ${schemaType}: ${missingRequired.join(', ')}`);
      result.isValid = false;
      result.score -= missingRequired.length * 15;
    }
  }

  // Check recommended fields
  const recommendedFields = RECOMMENDED_FIELDS[schemaType as keyof typeof RECOMMENDED_FIELDS];
  if (recommendedFields) {
    const missingRecommended = recommendedFields.filter(field => !schema[field]);
    if (missingRecommended.length > 0) {
      result.suggestions.push(`Consider adding recommended fields for ${schemaType}: ${missingRecommended.join(', ')}`);
      result.score -= missingRecommended.length * 5;
    }
  }

  return result;
}

/**
 * Validate specific field formats and values
 */
function validateFieldFormats(schema: SchemaObject): SchemaValidationResult {
  const result: SchemaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    score: 100
  };

  // Validate URLs
  const urlFields = ['url', 'image', 'logo', 'mainEntityOfPage'];
  urlFields.forEach(field => {
    if (schema[field] && typeof schema[field] === 'string') {
      try {
        new URL(schema[field]);
      } catch {
        result.warnings.push(`Invalid URL format in field: ${field}`);
        result.score -= 5;
      }
    }
  });

  // Validate dates
  const dateFields = ['datePublished', 'dateModified', 'uploadDate'];
  dateFields.forEach(field => {
    if (schema[field] && typeof schema[field] === 'string') {
      const date = new Date(schema[field]);
      if (isNaN(date.getTime())) {
        result.warnings.push(`Invalid date format in field: ${field}`);
        result.score -= 5;
      }
    }
  });

  // Validate rating values
  if (schema.aggregateRating) {
    const rating = schema.aggregateRating;
    if (rating.ratingValue && (rating.ratingValue < 0 || rating.ratingValue > 5)) {
      result.warnings.push('Rating value should be between 0 and 5');
      result.score -= 5;
    }
  }

  return result;
}

/**
 * Combine validation results
 */
function combineResults(results: SchemaValidationResult[]): SchemaValidationResult {
  const combined: SchemaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    score: 100
  };

  results.forEach(result => {
    combined.errors.push(...result.errors);
    combined.warnings.push(...result.warnings);
    combined.suggestions.push(...result.suggestions);
    combined.isValid = combined.isValid && result.isValid;
    combined.score = Math.min(combined.score, result.score);
  });

  return combined;
}

/**
 * Main validation function for JSON-LD schema
 */
export function validateSchema(schema: any): SchemaValidationResult {
  try {
    // Parse if it's a string
    let parsedSchema = schema;
    if (typeof schema === 'string') {
      try {
        parsedSchema = JSON.parse(schema);
      } catch (error) {
        return {
          isValid: false,
          errors: ['Invalid JSON format'],
          warnings: [],
          suggestions: ['Ensure the schema is valid JSON'],
          score: 0
        };
      }
    }

    // Handle array of schemas
    if (Array.isArray(parsedSchema)) {
      const results = parsedSchema.map(s => validateSchema(s));
      return combineResults(results);
    }

    // Validate single schema
    const basicResult = validateBasicStructure(parsedSchema);
    if (!basicResult.isValid) {
      return basicResult;
    }

    const typeResult = validateTypeSpecificFields(parsedSchema);
    const formatResult = validateFieldFormats(parsedSchema);

    return combineResults([basicResult, typeResult, formatResult]);

  } catch (error) {
    return {
      isValid: false,
      errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
      suggestions: [],
      score: 0
    };
  }
}

/**
 * Validate schema for a specific content type
 */
export function validateContentSchema(
  schema: any, 
  contentType: 'film' | 'series' | 'blog' | 'location'
): SchemaValidationResult {
  const result = validateSchema(schema);
  
  // Add content-type specific validations
  if (result.isValid) {
    const parsedSchema = typeof schema === 'string' ? JSON.parse(schema) : schema;
    const schemaType = Array.isArray(parsedSchema['@type']) ? parsedSchema['@type'][0] : parsedSchema['@type'];
    
    // Check if schema type matches content type
    const expectedTypes = {
      film: ['Movie'],
      series: ['TVSeries'],
      blog: ['Article', 'BlogPosting'],
      location: ['Place', 'TouristAttraction']
    };
    
    const expected = expectedTypes[contentType];
    if (expected && !expected.includes(schemaType)) {
      result.warnings.push(`Schema type "${schemaType}" may not be optimal for ${contentType} content. Consider: ${expected.join(' or ')}`);
      result.score -= 10;
    }
  }
  
  return result;
}

/**
 * Generate schema validation report for development
 */
export function generateValidationReport(schemas: Array<{ name: string; schema: any }>): string {
  let report = '# Schema Validation Report\n\n';
  
  schemas.forEach(({ name, schema }) => {
    const result = validateSchema(schema);
    
    report += `## ${name}\n`;
    report += `**Score:** ${result.score}/100\n`;
    report += `**Valid:** ${result.isValid ? '✅' : '❌'}\n\n`;
    
    if (result.errors.length > 0) {
      report += '### Errors\n';
      result.errors.forEach(error => report += `- ❌ ${error}\n`);
      report += '\n';
    }
    
    if (result.warnings.length > 0) {
      report += '### Warnings\n';
      result.warnings.forEach(warning => report += `- ⚠️ ${warning}\n`);
      report += '\n';
    }
    
    if (result.suggestions.length > 0) {
      report += '### Suggestions\n';
      result.suggestions.forEach(suggestion => report += `- 💡 ${suggestion}\n`);
      report += '\n';
    }
    
    report += '---\n\n';
  });
  
  return report;
}

/**
 * Monitor schema errors in production
 */
export function logSchemaError(
  schemaName: string, 
  error: string, 
  context?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'production') {
    // In production, log to your monitoring service
    console.error('Schema Validation Error:', {
      schema: schemaName,
      error,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    });
    
    // You could integrate with services like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(new Error(`Schema Error: ${error}`), { tags: { schema: schemaName } });
  } else {
    // In development, log to console
    console.warn(`Schema validation warning for ${schemaName}:`, error, context);
  }
}

/**
 * Pre-publish validation hook
 */
export function validateBeforePublish(content: {
  title: string;
  type: 'film' | 'series' | 'blog' | 'location';
  schema?: any;
}): { canPublish: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!content.schema) {
    issues.push('No structured data found - SEO impact may be reduced');
    return { canPublish: true, issues }; // Allow publishing without schema
  }
  
  const result = validateContentSchema(content.schema, content.type);
  
  if (!result.isValid) {
    issues.push(...result.errors);
    return { canPublish: false, issues }; // Block publishing with invalid schema
  }
  
  if (result.score < 70) {
    issues.push(`Schema quality score is low (${result.score}/100)`);
    issues.push(...result.warnings);
    issues.push(...result.suggestions);
  }
  
  return { canPublish: true, issues };
} 
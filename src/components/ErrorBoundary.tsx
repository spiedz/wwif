import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component for catching and handling errors in React components
 * Particularly useful for catching image loading errors and providing guidance
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is an image domain error
    if (error.message && error.message.includes('Invalid src prop') && error.message.includes('hostname')) {
      // Extract the domain name from the error message
      const domainMatch = error.message.match(/hostname "([^"]+)"/);
      const domain = domainMatch ? domainMatch[1] : 'unknown domain';
      
      console.error(`
        =====================================================
        ⚠️ IMAGE DOMAIN ERROR: ${domain} ⚠️
        
        This domain needs to be added to next.config.js
        
        Please follow these steps:
        1. Add '${domain}' to the domains array in next.config.js
        2. Add it to remotePatterns as well
        3. Restart the dev server
        4. Update the README.md documentation
        
        See README.md "External Image Domain Configuration" section
        =====================================================
      `);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Check for image domain error
      if (this.state.error?.message && this.state.error.message.includes('Invalid src prop') && this.state.error.message.includes('hostname')) {
        const domainMatch = this.state.error.message.match(/hostname "([^"]+)"/);
        const domain = domainMatch ? domainMatch[1] : 'unknown domain';
        
        // Custom error message for image domain errors
        return this.props.fallback || (
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <h3 className="text-lg font-semibold text-red-800">Image Loading Error</h3>
            <p className="text-red-700 mt-1">
              Unable to load image from <code className="bg-red-100 px-1 rounded">{domain}</code>
            </p>
            <p className="text-sm text-red-600 mt-2">
              This domain needs to be added to <code className="bg-red-100 px-1 rounded">next.config.js</code>.
              Please see the README documentation on "External Image Domain Configuration".
            </p>
            <p className="text-xs text-red-500 mt-4">
              Error details: {this.state.error.message}
            </p>
          </div>
        );
      }
      
      // Generic error fallback
      return this.props.fallback || (
        <div className="my-4 p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg">
          <h3 className="font-semibold mb-2">Something went wrong</h3>
          <p>We&apos;re sorry, a rendering error occurred. Please try refreshing the page.</p>
          {this.state.error && (
            <div className="mt-2 p-3 bg-red-100 rounded text-sm font-mono overflow-auto max-h-[200px]">
              {this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
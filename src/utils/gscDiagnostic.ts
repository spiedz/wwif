/**
 * Google Search Console Diagnostic Utility
 * Checks configuration and provides setup guidance
 */

export interface GSCDiagnosticResult {
  isConfigured: boolean;
  hasServiceAccount: boolean;
  hasApiKey: boolean;
  hasSiteUrl: boolean;
  errors: string[];
  warnings: string[];
  setupSteps: string[];
  nextActions: string[];
}

/**
 * Diagnose Google Search Console configuration
 */
export function diagnoseGSCSetup(): GSCDiagnosticResult {
  const result: GSCDiagnosticResult = {
    isConfigured: false,
    hasServiceAccount: false,
    hasApiKey: false,
    hasSiteUrl: false,
    errors: [],
    warnings: [],
    setupSteps: [],
    nextActions: []
  };

  // Check environment variables
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const serviceAccountKeyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const accessToken = process.env.GSC_ACCESS_TOKEN;

  // Check site URL
  if (siteUrl) {
    result.hasSiteUrl = true;
  } else {
    result.errors.push('NEXT_PUBLIC_BASE_URL environment variable is not set');
    result.setupSteps.push('Set NEXT_PUBLIC_BASE_URL to your site URL (e.g., https://wherewasitfilmed.co)');
  }

  // Check authentication methods
  if (serviceAccountKey) {
    try {
      JSON.parse(serviceAccountKey);
      result.hasServiceAccount = true;
      result.hasApiKey = true;
    } catch (error) {
      result.errors.push('GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON');
      result.setupSteps.push('Ensure GOOGLE_SERVICE_ACCOUNT_KEY contains valid JSON service account credentials');
    }
  } else if (serviceAccountKeyPath) {
    result.hasServiceAccount = true;
    result.warnings.push('Using service account key file path - ensure file exists and is accessible');
  } else if (accessToken) {
    result.hasApiKey = true;
    result.warnings.push('Using access token - ensure it has proper Search Console permissions');
  } else {
    result.errors.push('No authentication method configured');
    result.setupSteps.push('Configure one of: GOOGLE_SERVICE_ACCOUNT_KEY, GOOGLE_SERVICE_ACCOUNT_KEY_PATH, or GSC_ACCESS_TOKEN');
  }

  // Determine if configured
  result.isConfigured = result.hasSiteUrl && (result.hasServiceAccount || result.hasApiKey);

  // Generate next actions
  if (!result.isConfigured) {
    result.nextActions.push('Complete environment variable setup');
    result.nextActions.push('Create Google Cloud service account');
    result.nextActions.push('Add service account to Search Console property');
  } else {
    result.nextActions.push('Test API connection using /api/gsc/test');
    result.nextActions.push('Verify property access in Search Console');
  }

  return result;
}

/**
 * Get detailed setup instructions
 */
export function getGSCSetupInstructions(): string[] {
  return [
    '1. Go to Google Cloud Console (console.cloud.google.com)',
    '2. Create a new project or select existing project',
    '3. Enable the "Google Search Console API"',
    '4. Create a Service Account:',
    '   - Go to IAM & Admin > Service Accounts',
    '   - Click "Create Service Account"',
    '   - Give it a name like "GSC API Access"',
    '   - Download the JSON key file',
    '5. Add the service account to your Search Console property:',
    '   - Go to Search Console (search.google.com/search-console)',
    '   - Select your property',
    '   - Go to Settings > Users and permissions',
    '   - Add user with the service account email (from the JSON file)',
    '   - Give it "Full" permission',
    '6. Set environment variables in your .env.local file:',
    '   GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account", "project_id": "...", ...}',
    '   NEXT_PUBLIC_BASE_URL=https://yoursite.com',
    '7. Test the connection using the /api/gsc/test endpoint'
  ];
}

/**
 * Generate sample environment configuration
 */
export function generateSampleEnvConfig(): string {
  return `# Google Search Console API Configuration
NEXT_PUBLIC_BASE_URL=https://wherewasitfilmed.co

# Option 1: Service Account JSON (recommended)
GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account", "project_id": "your-project", "private_key_id": "...", "private_key": "...", "client_email": "...", "client_id": "...", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "...", "client_x509_cert_url": "..."}

# Option 2: Service Account Key File Path
# GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json

# Option 3: Access Token (less secure, temporary)
# GSC_ACCESS_TOKEN=your_access_token

# Rate Limits:
# - URL Inspection API: 2,000 requests per day
# - Search Analytics API: 25,000 requests per day`;
}

/**
 * Check if GSC is working in current environment
 */
export function isGSCWorking(): boolean {
  const diagnostic = diagnoseGSCSetup();
  return diagnostic.isConfigured && diagnostic.errors.length === 0;
} 
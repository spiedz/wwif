# Google Search Console API Setup Guide

## Current Status: ❌ NOT CONFIGURED

The Google Search Console (GSC) API integration is implemented but not currently working because the required environment variables are not configured.

## What GSC API Does for Your Site

The GSC API integration provides:

1. **Indexing Status Monitoring**: Check which pages are indexed by Google
2. **Search Performance Analytics**: Get real search impression, click, and position data
3. **URL Inspection**: Detailed analysis of how Google sees your pages
4. **Sitemap Submission**: Programmatically submit URLs for indexing
5. **SEO Health Monitoring**: Track technical SEO issues and improvements

## Step-by-Step Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the **"Google Search Console API"**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Search Console API"
   - Click "Enable"

### 2. Create Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **"Create Service Account"**
3. Give it a name like `"WWIF GSC API Access"`
4. Click **"Create and Continue"**
5. Skip the optional role assignment (for now)
6. Click **"Done"**
7. Click on the newly created service account
8. Go to the **"Keys"** tab
9. Click **"Add Key"** > **"Create new key"**
10. Select **JSON** format
11. Download the JSON key file

### 3. Add Service Account to Search Console

1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Select your property (https://wherewasitfilmed.co)
3. Go to **Settings** > **Users and permissions**
4. Click **"Add user"**
5. Enter the service account email from the JSON file (ends with @your-project.iam.gserviceaccount.com)
6. Give it **"Full"** permission
7. Click **"Add"**

### 4. Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Site Configuration
NEXT_PUBLIC_BASE_URL=https://wherewasitfilmed.co

# Google Search Console API - Service Account JSON
GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account", "project_id": "your-project-id", "private_key_id": "your-private-key-id", "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n", "client_email": "your-service-account@your-project.iam.gserviceaccount.com", "client_id": "your-client-id", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"}
```

**Important**: Replace the placeholder JSON with the actual content from your downloaded service account key file.

### 5. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the connection:
   ```bash
   node scripts/check-gsc.js
   ```

3. Visit the API test endpoint:
   ```
   http://localhost:3000/api/gsc/test
   ```

## Alternative Configuration Options

### Option 2: Service Account Key File Path

If you prefer to store the JSON file separately:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/your/service-account-key.json
```

### Option 3: Access Token (Temporary)

For temporary testing (less secure):

```bash
GSC_ACCESS_TOKEN=your_temporary_access_token
```

## API Rate Limits

Be aware of Google's rate limits:

- **URL Inspection API**: 2,000 requests per day
- **Search Analytics API**: 25,000 requests per day

## Available API Endpoints

Once configured, you can use these endpoints:

- `GET /api/gsc/test` - Test the connection
- `POST /api/gsc/indexing` - Check indexing status for URLs
- `POST /api/gsc/performance` - Get search performance data
- `GET /api/gsc/diagnostic` - Run configuration diagnostic

## Example API Usage

### Check Indexing Status
```bash
curl -X POST http://localhost:3000/api/gsc/indexing \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://wherewasitfilmed.co/films/joker"]}'
```

### Get Search Performance
```bash
curl -X POST http://localhost:3000/api/gsc/performance \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://wherewasitfilmed.co/films/joker"], "startDate": "2024-01-01", "endDate": "2024-01-31"}'
```

## Troubleshooting

### Common Issues

1. **"Invalid GSC configuration"**
   - Check that your JSON is properly formatted
   - Ensure the service account email is added to Search Console

2. **"Property not found"**
   - Verify the site URL matches exactly in Search Console
   - Ensure the property is verified and you have access

3. **"Insufficient permissions"**
   - Make sure the service account has "Full" permission in Search Console
   - Check that the API is enabled in Google Cloud Console

### Verification Steps

Run the diagnostic script to check your configuration:

```bash
node scripts/check-gsc.js
```

This will show you exactly what's missing or misconfigured.

## Benefits Once Working

With GSC API working, you'll be able to:

- Monitor which of your film pages are indexed
- Track search performance for specific filming location queries
- Get real data on impressions, clicks, and search positions
- Automatically detect indexing issues
- Submit new content for faster indexing
- Build comprehensive SEO monitoring dashboards

## Security Notes

- Keep your service account key secure
- Never commit `.env.local` to version control
- Consider using environment-specific service accounts for production
- Regularly rotate service account keys for enhanced security

## Support

If you need help with the setup:

1. Run `node scripts/check-gsc.js` for diagnostics
2. Check the console logs when testing the API endpoints
3. Verify all steps in Google Cloud Console and Search Console

The implementation is ready - it just needs the authentication configured! 
# Deployment Instructions for Where Was It Filmed

This document outlines the steps to deploy the "Where Was It Filmed" website to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Git](https://git-scm.com/) installed on your local machine
3. A Google Maps API key with the Maps JavaScript API enabled

## Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `NEXT_PUBLIC_BASE_URL` | The base URL of your website | `https://wherewasitfilmed.com` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API key | `AIza...` |

## Deployment Steps

### Option 1: Deploy with Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:
   ```bash
   vercel login
   ```

3. Navigate to the project directory and run:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project.

### Option 2: Deploy with Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Log in to your Vercel account and click "Import Project".

3. Select "Import Git Repository" and choose your repository.

4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add the required environment variables.

6. Click "Deploy" to start the deployment process.

## Custom Domain Setup

To use a custom domain:

1. Go to your project in the Vercel dashboard.

2. Navigate to "Settings" > "Domains".

3. Add your custom domain and follow the verification process.

4. Update your DNS settings as instructed by Vercel.

## Continuous Deployment

Once set up, Vercel will automatically deploy new versions of your site when you push changes to your Git repository's main branch.

### GitHub Actions Integration (Recommended)

This project includes a GitHub Actions workflow for automated deployments:

1. **Setup repository secrets in GitHub**:
   - `VERCEL_TOKEN`: Generate from Vercel account settings
   - `VERCEL_ORG_ID`: Found in Vercel project settings
   - `VERCEL_PROJECT_ID`: Found in Vercel project settings
   - `NEXT_PUBLIC_BASE_URL`: Your production URL
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

2. The workflow will:
   - Run linting
   - Generate sitemap
   - Deploy to preview URLs for pull requests
   - Deploy to production when merged to main branch

The workflow file is located at `.github/workflows/deploy.yml`

## Troubleshooting

If your deployment fails or the site doesn't work as expected:

1. Check the build logs in the Vercel dashboard.

2. Verify that all environment variables are correctly set.

3. Ensure the Google Maps API key has the necessary permissions and API access.

4. Check that the content directories (content/films/ and content/blog/) are properly populated.

## Performance Optimization

The site is already optimized for performance with:

- Static site generation for all pages
- Tailwind CSS for minimal CSS footprint
- Optimized images (when using Next.js Image component)
- Proper caching headers (handled by Vercel)

No additional configuration is required for optimal performance. 
# Where Was It Filmed (WWIF)

A fast, SEO-optimized website that showcases real filming locations of popular movies and TV shows.

## Features

- Static site with fast performance and SEO support
- Fully responsive with clean Tailwind styling
- Simple comment system under each film/blog (no user login required)
- Google Maps integration for each filming location
- Blog support for articles, guides, and traffic growth
- Easy Git-based deploys via Vercel
- Enhanced markdown support for rich content formatting and image layouts

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/where-was-it-filmed.git
cd where-was-it-filmed
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDPaeU4--bVZ7HIT8swEIevmbD8w0lfb58
```

To get a Google Maps API key:
- Go to the [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable the Google Maps JavaScript API
- Create an API key
- Restrict the API key to HTTP referrers for security

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Content Management

Content is managed through Markdown files:

- Film/TV content goes in `/content/films/`
- Blog posts go in `/content/blog/`

Each Markdown file includes frontmatter with metadata and coordinates.

### Example Film Markdown:

```markdown
---
title: "Where Was The Dark Knight Filmed?"
description: "Explore the real filming locations of Christopher Nolan's The Dark Knight across Chicago, London, and Hong Kong."
slug: "where-was-dark-knight-filmed"
year: 2008
genre: ["Action", "Crime", "Drama"]
director: "Christopher Nolan"
categories: ["Movies", "Superhero", "Popular"]
coordinates: 
  - { lat: 41.8781, lng: -87.6298, name: "Chicago", description: "Primary filming location representing Gotham City" }
  - { lat: 22.3193, lng: 114.1694, name: "Hong Kong", description: "Scenes where Batman travels to extract Lau" }
  - { lat: 51.5074, lng: -0.1278, name: "London", description: "Several interior shots were filmed in London" }
date: "2023-05-12"
---

# The Dark Knight Filming Locations

Content goes here...
```

### Enhanced Markdown Support

The site supports enhanced markdown with rich image formatting capabilities:

- Embedded images within text content
- Side-by-side image comparisons
- Image galleries with grid layouts
- Images with captions
- Magazine-style text wrapping around images
- Card-based location displays

For detailed examples and formatting options, see:
- [FORMAT-GUIDE.md](content/FORMAT-GUIDE.md) - Quick reference for all formatting options
- [example-with-images.md](content/films/example-with-images.md) - Example film page demonstrating various image layouts
- [where-was-film-nonnas-filmed-veneto.md](content/films/where-was-film-nonnas-filmed-veneto.md) - Real-world example with all formatting techniques

#### Image Formatting Options

The site supports the following image formatting options:

1. **Basic Images**
   ```markdown
   ![Alt text](https://example.com/path/to/image.jpg)
   ```

2. **Images with Custom Styling**
   ```html
   <img 
     src="https://example.com/path/to/image.jpg" 
     alt="Descriptive alt text" 
     style="width: 100%; border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
   />
   ```

3. **Images with Captions**
   ```html
   <figure style="margin: 30px 0;">
     <img 
       src="https://example.com/path/to/image.jpg" 
       alt="Descriptive alt text"
       style="width: 100%; border-radius: 8px;"
     />
     <figcaption style="text-align: center; font-style: italic; margin-top: 8px;">
       Your caption text goes here
     </figcaption>
   </figure>
   ```

4. **Side-by-Side Images**
   ```html
   <div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 30px 0;">
     <div style="flex: 1; min-width: 300px;">
       <img src="https://example.com/image1.jpg" alt="First image" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" />
       <p style="text-align: center; font-weight: bold; margin-top: 8px;">First Image Caption</p>
     </div>
     <div style="flex: 1; min-width: 300px;">
       <img src="https://example.com/image2.jpg" alt="Second image" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" />
       <p style="text-align: center; font-weight: bold; margin-top: 8px;">Second Image Caption</p>
     </div>
   </div>
   ```

5. **Text with Image Wrap**
   ```html
   <div style="margin: 30px 0;">
     <img 
       src="https://example.com/path/to/image.jpg" 
       alt="Image description"
       style="float: right; width: 300px; margin: 0 0 20px 20px; border-radius: 8px;"
     />
     <p>Your text here will wrap around the image.</p>
     <p>Second paragraph continues the text flow.</p>
     <div style="clear: both;"></div>
   </div>
   ```

For the complete guide with more examples and detailed explanations, refer to the [FORMAT-GUIDE.md](content/FORMAT-GUIDE.md) file.

## External Image Domain Configuration

### Overview
This project loads images from multiple external domains for film posters, location photos, and other media. Next.js requires explicit configuration for any external domains used with the `next/image` component.

### Current Configuration
The following external domains are configured in `next.config.js`:

#### Movie & TV Content
- `image.tmdb.org` - The Movie Database API images
- `cdn.marvel.com` - Marvel Studios official content
- `www.themoviedb.org` - The Movie Database website content
- `m.media-amazon.com` - Amazon media content
- `www.hobbitontours.com` - Hobbiton tour location images

#### Stock & Placeholder Images
- `source.unsplash.com` - Unsplash API images
- `images.unsplash.com` - Unsplash hosted images
- `via.placeholder.com` - Placeholder image service
- `upload.wikimedia.org` - Wikimedia image hosting

#### Entertainment & Travel
- `variety.com` - Entertainment news images
- `www.universalorlando.com` - Theme park location images
- `www.robertmitchellevans.com` - Film location photography

### Adding New Domains

If you need to add a new external image domain:

1. Locate `next.config.js` in the project root
2. Add the domain to both the `domains` array and the `remotePatterns` array:

```javascript
// In next.config.js
images: {
  domains: [
    // existing domains...
    'new-domain.com', // Add your domain here
  ],
  remotePatterns: [
    // existing patterns...
    {
      protocol: 'https',
      hostname: 'new-domain.com',
    },
  ],
}
```

3. Add a comment explaining what the domain is used for
4. Restart the development server for changes to take effect
5. Test your images are loading correctly
6. Add the domain to this documentation

### Troubleshooting

If you encounter the error `Error: Invalid src prop on next/image, hostname is not configured under images in your next.config.js`:

1. Note the hostname mentioned in the error
2. Follow the steps above to add the domain to the configuration
3. If the domain is already configured, check for typos or protocol issues
4. Restart the development server completely after making changes

### Monitoring

We have established the following processes to monitor image domain usage:

1. Regular audits of film markdown files to discover new domains
2. Error logging in production to capture unconfigured domains
3. Pull request reviews include checking for new image domains
4. Quarterly cleanup to remove unused domains

## Deployment

The project is configured for deployment on Vercel, which provides:
- Instant deploys from GitHub
- Automatic preview deployments for pull requests
- Custom domains with automatic SSL
- Global CDN for optimal performance

For detailed deployment instructions, see [Deployment Instructions](docs/deployment-instructions.md).

### Quick Deploy Steps:

1. Push your repository to GitHub/GitLab/Bitbucket
2. Import your project in the Vercel dashboard
3. Configure these environment variables:
   - `NEXT_PUBLIC_BASE_URL`: Your website's URL
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
4. Deploy!

## Tech Stack

- **Framework**: Next.js (React, TypeScript)
- **Styling**: Tailwind CSS
- **Content**: Markdown with gray-matter and remark
- **Maps**: Google Maps API 
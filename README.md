# Where Was It Filmed (WWIF)

A fast, SEO-optimized website that showcases real filming locations of popular movies and TV shows.

## Features

- Static site with fast performance and SEO support
- Fully responsive with clean Tailwind styling
- Simple comment system under each film/blog (no user login required)
- Google Maps integration for each filming location
- Blog support for articles, guides, and traffic growth
- Easy Git-based deploys via Vercel

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
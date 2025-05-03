# context.md

## Project Name
Where Was It Filmed (WWIF)

## Description
A fast, SEO-optimized website that showcases real filming locations of popular movies and TV shows. Each page includes an introduction, mapped locations via Google Maps, trivia, travel tips, and a public comment section. Content is managed through Markdown files — just add to `/films/` or `/blog/` and the site updates automatically.

## Tech Stack
- **Framework**: Next.js (React, TypeScript)
- **Styling**: Tailwind CSS (red / white / gray theme)
- **Content Source**:
  - `/content/films/` → Movie & TV pages at `/films/[slug]`
  - `/content/blog/` → Blog posts at `/blog/[slug]`
- **Maps**: Google Maps API (location markers from frontmatter)
- **Comments**: Name + comment system (no accounts), stored via Supabase, Firebase, or flat files
- **Hosting**: **Vercel**
  - Instant deploys from GitHub
  - Supports dynamic routes and static generation
  - Handles custom domains, SSL, and environment variables

## Content Behavior
- Drop a `.md` file into `/films/` or `/blog/` to create a live page
- Each Markdown includes frontmatter (title, slug, meta, coordinates, etc.)
- Sitemap and navigation are auto-generated
- Google Maps renders based on coordinates from the file

## Core Components
- `FilmPage.tsx`: Renders individual film/show location pages
- `BlogPost.tsx`: Renders blog articles
- `Map.tsx`: Google Maps component
- `LocationCard.tsx`: Displays each real-world filming location
- `AffiliateLink.tsx`: Displays product or streaming links
- `CommentSection.tsx`: Lightweight comment thread (no login)

## Features
- ✅ Static site with fast performance and SEO support
- ✅ Fully responsive with clean Tailwind styling
- ✅ Simple comment system under each film/blog (no user login)
- ✅ Google Maps integration for each filming location
- ✅ Blog support for articles, guides, and traffic growth
- ✅ Easy Git-based deploys via Vercel

## SEO & Metadata
- Pulled from frontmatter:
  - Page `<title>`, `<meta description>`
  - Open Graph / Twitter Cards
  - JSON-LD schema (Movie, Place, Article)

## Color Palette
- **Primary:** Red (#D32F2F)
- **Background:** White (#FFFFFF)
- **Accent:** Light Gray (#F5F5F5), Dark Gray (#424242)

## Directory Example
```
/content/
  /films/
    where-was-joker-filmed.md
    where-was-dark-filmed.md
  /blog/
    best-filming-locations-in-paris.md
```

```
/components/
  FilmPage.tsx
  BlogPost.tsx
  Map.tsx
  LocationCard.tsx
  CommentSection.tsx
  AffiliateLink.tsx
```

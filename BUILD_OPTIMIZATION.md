# Build Optimization Guide for "Where Was It Filmed"

This document outlines the strategies and techniques implemented to optimize the build process for the "Where Was It Filmed" website.

## Optimization Summary

The following optimizations have been implemented:

1. **SWC Compiler Usage**
   - Enabled SWC minification for faster builds
   - Removed custom babel configuration to allow Next.js to use SWC by default

2. **Webpack Optimizations**
   - Added filesystem caching for faster rebuilds
   - Implemented chunk splitting strategy for better code distribution
   - Optimized module caching and loading

3. **Content Optimization**
   - Created utilities to optimize Markdown content files
   - Removed duplicate content and invalid frontmatter
   - Fixed YAML parsing errors in content files

4. **Image Optimization**
   - Added WebP format support
   - Implemented batch processing for images
   - Added cache TTL settings for better performance

5. **Build Scripts**
   - Added specialized build scripts for different scenarios
   - Created comprehensive optimization utilities

## Key Issues Addressed

1. **YAML Parsing Errors**
   - Fixed malformed coordinates arrays in several content files
   - Removed incorrect YAML code block markers from frontmatter
   - Added proper comma separation in JSON objects within YAML
   - Created a script (`fix-content-formatting.js`) to automatically fix these issues

2. **Large Data Payloads**
   - Several pages exceed the recommended 128KB data threshold:
     - /blog (277 KB)
     - /series (764 KB) 
     - /films (1.3 MB)
     - /locations (805 KB)
   - Consider implementing pagination or reducing initial data load

3. **Static Optimization Limitations**
   - Site has opted out of Automatic Static Optimization due to `getInitialProps` in `_app`
   - Consider refactoring to use `getStaticProps` where possible

## Available Scripts

The following npm scripts are available for optimized builds:

```bash
# Standard build
npm run build

# Optimized build with content processing
npm run build:optimized

# Full optimization including content and images
npm run build:full-optimize

# Quickest build with content formatting fixes
npm run build:faster

# Build with bundle analyzer to identify large dependencies
npm run build:analyze

# Build with sitemap generation
npm run build:with-sitemap

# Individual optimization steps
npm run optimize-content     # Optimize markdown content files
npm run optimize-images      # Optimize images
npm run fix-content-formatting # Fix common YAML/formatting issues
npm run clean                # Clean the build cache
```

## Next.js Upgrade Path

For significant performance improvements, upgrading Next.js is recommended:

```bash
# Update Next.js and React to the latest versions
npm run upgrade:next

# Check for codemods that should be applied after upgrade
npm run upgrade:check
```

## Performance Numbers

Current build performance:

- **Standard build**: ~2 minutes 21 seconds (141.32 seconds)
- **Optimized build**: ~2 minutes 30 seconds (150.57 seconds)
- **Faster build**: ~2 minutes 25 seconds (aims to fix YAML issues before building)

The increased time for the optimized build is due to the additional preprocessing steps, but results in more reliable and potentially faster runtime performance.

## Recommended Next Steps

1. **Upgrade Next.js**
   - Current version: 14.2.28
   - Latest version: 15.3.2
   - This will likely provide the most significant performance improvements

2. **Pagination Strategy**
   - Implement pagination for data-heavy pages (/films, /locations, /series)
   - Consider server-side filtering where appropriate

3. **Refactor for Static Optimization**
   - Move global data fetching from `_app` to individual page components
   - Utilize `getStaticProps` instead of `getInitialProps` where possible

4. **Content Structure Review**
   - Review and optimize the 340+ Markdown files
   - Consider splitting larger content files into smaller chunks

## Monitoring Build Performance

To measure build times on Windows:

```powershell
Measure-Command { npm run build }
Measure-Command { npm run build:optimized }
Measure-Command { npm run build:faster }
```

## Configuration

The optimizations are implemented through the following files:

1. `next.config.js` - Core Next.js configuration and webpack optimizations
2. `scripts/optimize-content.js` - Content optimization script
3. `scripts/optimize-images.js` - Image optimization script
4. `scripts/fix-content-formatting.js` - YAML and frontmatter formatting fixes
5. `scripts/upgrade-next.js` - Next.js upgrade helper

---

This document will be updated as additional optimizations are implemented. 
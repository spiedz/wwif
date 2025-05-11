# TypeScript Error Fixes for WWIF Website

This document outlines how to resolve the TypeScript errors and get the WWIF website running properly.

## 1. Fixed TypeScript Errors

The following TypeScript errors have been fixed in the codebase:

- `Property 'trailer' does not exist on type 'SeriesMeta'` - Fixed by adding the missing `trailer` property to the SeriesMeta interface in `src/types/series.ts`
- Added missing `seasons` and `episodes` properties to SeriesMeta interface for consistency with how they are used in serverMarkdown.ts

## 2. Running the Website

### Option 1: Use the Quick Fix Script (Recommended)

The quickest way to get the site running is to use one of these scripts:

- **Windows**: Run `.\quick-fix.ps1` in PowerShell
- **Linux/macOS**: Run `./quick-fix.sh` in your terminal

These scripts:
1. Clear the Next.js cache
2. Create a backup of your original serverMarkdown.ts file
3. Replace serverMarkdown.ts with a version that uses a custom fallback markdown processor
4. Create the custom fallback processor if it doesn't exist

This approach doesn't rely on npm installing packages and should work immediately.

### Option 2: Fix Dependencies Properly

If you want to try fixing the dependencies properly:

- **Windows**: Run `.\fix-dependencies.ps1` in PowerShell
- **Linux/macOS**: Run `./fix-dependencies.sh` in your terminal

These scripts:
1. Clean your node_modules and package-lock.json
2. Reinstall all dependencies
3. Specifically install rehype-raw and remark-gfm
4. Clear Next.js cache
5. Create an empty .next directory structure

## 3. Manual Fix Steps (If Scripts Don't Work)

If you're unable to run the scripts, you can manually implement the fixes:

1. **Clear Next.js cache**:
   - Delete the `.next` folder
   - Create an empty `.next` directory structure:
     ```
     .next/
     ├── cache/
     ├── server/
     └── static/
     ```

2. **Create fallback markdown processor**:
   - Create the file `src/utils/fallbackMarkdown.ts` with the content from the provided fallbackMarkdown.ts

3. **Update serverMarkdown.ts**:
   - Make a backup of the original `src/lib/server/serverMarkdown.ts` file
   - Replace it with the simplified version that uses the fallback processor

4. **Fix TypeScript errors**:
   - Ensure the `SeriesMeta` interface in `src/types/series.ts` includes:
     ```typescript
     trailer?: VideoContent;
     seasons?: Season[];
     episodes?: Episode[];
     ```

5. **Start development server**:
   - Run `npm run dev`

## 4. Verifying the Fix

After applying the fixes, you should be able to run the development server without errors. Visit the website and check that:

1. The series pages load correctly with trailers displayed when available
2. Blog posts and film pages display properly with HTML in markdown content
3. Maps and other interactive elements work as expected

## 5. Restoring Original Files

If you need to restore the original serverMarkdown.ts file:

```bash
# Windows (PowerShell)
Copy-Item "src\lib\server\serverMarkdown.ts.bak" "src\lib\server\serverMarkdown.ts"

# Linux/macOS
cp src/lib/server/serverMarkdown.ts.bak src/lib/server/serverMarkdown.ts
```

# Technical Notes

The core issue stems from missing dependencies:
- rehype-raw: Used to parse HTML embedded within markdown
- remark-gfm: Used for GitHub-flavored markdown support

The quick fix takes a different approach by:
1. Using a simplified markdown processor 
2. Creating a custom fallback utility that uses regex to preserve HTML in markdown
3. Bypassing the need for these external packages

For a permanent solution, you should consider installing the required dependencies:
```bash
npm install rehype-raw remark-gfm --save
``` 
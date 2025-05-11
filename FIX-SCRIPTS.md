# Fix Scripts for WWIF Website

This folder contains several scripts to help fix issues with the website, particularly around the rehype-raw and remark-gfm dependencies that may cause problems during development.

## TypeScript Errors Fixed

The following TypeScript errors have been fixed in the codebase:

- `Property 'trailer' does not exist on type 'SeriesMeta'` - Fixed by adding the missing `trailer` property to the SeriesMeta interface
- Added missing `seasons` and `episodes` properties to SeriesMeta interface for consistency with how they are used in serverMarkdown.ts

For a more detailed guide on all fixed TypeScript errors and troubleshooting steps, see the [FIX-STEPS.md](./FIX-STEPS.md) file.

## Quick Fix (Recommended)

The quickest way to get the site running is to use one of these scripts:

- **Windows**: Run `.\quick-fix.ps1` in PowerShell
- **Linux/macOS**: Run `./quick-fix.sh` in your terminal

These scripts:
1. Clear the Next.js cache
2. Create a backup of your original serverMarkdown.ts file
3. Replace serverMarkdown.ts with a version that uses a custom fallback markdown processor
4. Create the custom fallback processor if it doesn't exist

This approach doesn't rely on npm installing packages and should work immediately.

## Full Dependency Fix

If you want to try fixing the dependencies properly:

- **Windows**: Run `.\fix-dependencies.ps1` in PowerShell
- **Linux/macOS**: Run `./fix-dependencies.sh` in your terminal

These scripts:
1. Clean your node_modules and package-lock.json
2. Reinstall all dependencies
3. Specifically install rehype-raw and remark-gfm
4. Clear Next.js cache
5. Create an empty .next directory structure

This approach tries to properly fix the missing dependencies, but may fail if there are npm registry issues.

## Restoring Original Files

If you used the quick fix and want to restore your original serverMarkdown.ts file:

```bash
# Windows (PowerShell)
Copy-Item "src\lib\server\serverMarkdown.ts.bak" "src\lib\server\serverMarkdown.ts"

# Linux/macOS
cp src/lib/server/serverMarkdown.ts.bak src/lib/server/serverMarkdown.ts
```

## Technical Details

The issue stems from missing dependencies:
- rehype-raw: Used to parse HTML embedded within markdown
- remark-gfm: Used for GitHub-flavored markdown support

The quick fix takes a different approach by:
1. Using a simplified markdown processor 
2. Creating a custom fallback utility that uses regex to preserve HTML in markdown
3. Bypassing the need for these external packages

The fallback processor preserves most HTML elements but may not render complex markdown features exactly the same as the original processor.

## Getting Help

If you continue to encounter issues:
1. Try the alternative fix script if one didn't work
2. Check the Next.js logs for specific error messages
3. Try running `npm install rehype-raw remark-gfm --save` manually
4. Ensure your Node.js version is compatible with the project 
/**
 * Next.js Upgrade Script
 * 
 * This script updates package.json to upgrade Next.js to the latest version
 * and adds a script to run the upgrade.
 */

const fs = require('fs');
const path = require('path');
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Store current Next.js version for reference
const currentNextVersion = packageJson.dependencies.next;

// Update the scripts section with upgrade commands
packageJson.scripts = {
  ...packageJson.scripts,
  "upgrade:next": "npm install next@latest react@latest react-dom@latest",
  "upgrade:check": "npx @next/codemod@latest next-11-to-12",
  "build:report": "cross-env ANALYZE=true next build",
  "dev:turbo": "next dev --turbo"
};

// Write the updated package.json back to disk
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + '\n'
);

console.log(`✅ Added upgrade scripts to package.json`);
console.log(`Current Next.js version: ${currentNextVersion}`);
console.log(`\nTo upgrade Next.js, run the following commands:`);
console.log(`\n1. npm run upgrade:next`);
console.log(`2. npm run upgrade:check     # Checks for codemods that should be applied`);
console.log(`\nTo optimize build performance without upgrading:`);
console.log(`- npm run dev:turbo          # Run dev server with turbopack (faster)`);
console.log(`- npm run build:optimized    # Run optimized production build`);
console.log(`- npm run build:report       # Run build with bundle analyzer to identify large dependencies\n`); 
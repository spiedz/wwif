/**
 * Content Formatting Fix Script
 * 
 * This script automatically fixes common YAML formatting issues in content files:
 * 1. Removes YAML code blocks that might wrap frontmatter
 * 2. Fixes coordinate formatting issues
 * 3. Ensures proper comma usage in arrays and objects
 * 4. Removes trailing backticks
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

// Directories to scan
const contentDirs = [
  'content/films',
  'content/series',
  'content/blog',
  'content/franchises'
];

// Get all markdown files
function getAllMarkdownFiles() {
  const files = [];
  
  contentDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const dirFiles = glob.sync(`${dir}/**/*.md`);
      files.push(...dirFiles);
    }
  });
  
  return files;
}

// Fix a single file
function fixFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove YAML code blocks if they exist
    if (content.startsWith('```yaml')) {
      content = content.replace('```yaml', '');
    }
    
    // Remove trailing backticks that might be at the end
    if (content.endsWith('```')) {
      content = content.slice(0, -3);
    }
    
    // Fix common coordinate formatting issues
    content = content.replace(/coordinates:\s*\n\s*-\s*\n/g, 'coordinates: [\n  { ');
    content = content.replace(/\s*-\s*\n\s*"lat"/g, '  },\n  { \n    "lat"');
    
    // Add missing commas in lat/lng pairs
    content = content.replace(/"lat":\s*(-?\d+\.?\d*)\s*\n\s*"lng"/g, '"lat": $1,\n    "lng"');
    content = content.replace(/"lng":\s*(-?\d+\.?\d*)\s*\n\s*"name"/g, '"lng": $1,\n    "name"');
    content = content.replace(/"name":\s*"([^"]*)"\s*\n\s*"description"/g, '"name": "$1",\n    "description"');
    
    // Fix unterminated coordinate arrays
    content = content.replace(/}\s*\n(streamingServices|bookingOptions)/g, '}\n]\n$1');
    
    // Try to parse with gray-matter to verify
    try {
      const parsed = matter(content);
      // If parsing succeeds, write the content back
      fs.writeFileSync(filePath, content);
      return { success: true, path: filePath };
    } catch (parseError) {
      return { 
        success: false, 
        path: filePath, 
        error: `YAML parsing error: ${parseError.message}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      path: filePath, 
      error: error.message 
    };
  }
}

// Main function
async function main() {
  console.log('🔍 Scanning content files for formatting issues...');
  const files = getAllMarkdownFiles();
  console.log(`Found ${files.length} markdown files`);
  
  console.log('\n⚙️ Fixing formatting issues...');
  const results = {
    success: 0,
    failed: 0,
    failures: []
  };
  
  for (const file of files) {
    const result = fixFile(file);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.failures.push(result);
    }
    
    // Show progress
    if ((results.success + results.failed) % 50 === 0) {
      console.log(`  Processed ${results.success + results.failed}/${files.length} files`);
    }
  }
  
  console.log('\n✅ Formatting fixes complete!');
  console.log(`Successfully fixed: ${results.success} files`);
  console.log(`Failed to fix: ${results.failed} files`);
  
  if (results.failures.length > 0) {
    console.log('\nFailed files (may need manual fixing):');
    results.failures.forEach(failure => {
      console.log(`  - ${failure.path}: ${failure.error}`);
    });
  }
}

main().catch(error => {
  console.error('Error during formatting fixes:', error);
  process.exit(1);
}); 
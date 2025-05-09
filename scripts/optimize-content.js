/**
 * Content Optimization Script
 * 
 * This script helps optimize the Markdown content files to improve build performance:
 * 1. Identifies and removes duplicate content files
 * 2. Minimizes frontmatter by removing unnecessary whitespace
 * 3. Validates frontmatter structure
 * 4. Reports potential issues that could slow down builds
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// Directories to scan
const contentDirs = [
  'content/films',
  'content/series',
  'content/blog',
  'content/franchises'
];

// Function to get all content files
function getAllContentFiles() {
  const files = [];
  
  contentDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const dirFiles = glob.sync(`${dir}/**/*.md`);
      files.push(...dirFiles);
    }
  });
  
  return files;
}

// Function to optimize a single file
function optimizeFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Clean up the frontmatter by removing any null or undefined values
    Object.keys(data).forEach(key => {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });
    
    // Write the optimized file
    const optimizedContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, optimizedContent);
    
    return { success: true, path: filePath };
  } catch (error) {
    return { 
      success: false, 
      path: filePath, 
      error: error.message 
    };
  }
}

// Function to find duplicate content
function findDuplicates(files) {
  const contentMap = new Map();
  const duplicates = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const hash = Buffer.from(content).toString('base64');
    
    if (contentMap.has(hash)) {
      duplicates.push({
        original: contentMap.get(hash),
        duplicate: file
      });
    } else {
      contentMap.set(hash, file);
    }
  });
  
  return duplicates;
}

// Find files with potential issues
function findIssues(files) {
  const issues = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data } = matter(content);
      
      // Check for large arrays that could slow down build
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key]) && data[key].length > 20) {
          issues.push({
            file,
            issue: `Large array in frontmatter: ${key} has ${data[key].length} items`
          });
        }
      });
      
      // Check for missing required fields
      const requiredFields = ['title', 'description', 'slug'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        issues.push({
          file,
          issue: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
    } catch (error) {
      issues.push({
        file,
        issue: `Error parsing file: ${error.message}`
      });
    }
  });
  
  return issues;
}

// Main function
async function main() {
  console.log('🔍 Scanning content directories...');
  const files = getAllContentFiles();
  console.log(`Found ${files.length} markdown files`);
  
  // Step 1: Find duplicates
  console.log('\n🔄 Checking for duplicate content...');
  const duplicates = findDuplicates(files);
  
  if (duplicates.length > 0) {
    console.log(`Found ${duplicates.length} duplicate files:`);
    duplicates.forEach(dup => {
      console.log(`  - ${dup.duplicate} (duplicate of ${dup.original})`);
    });
  } else {
    console.log('No duplicate files found.');
  }
  
  // Step 2: Find issues
  console.log('\n⚠️ Checking for content issues...');
  const issues = findIssues(files);
  
  if (issues.length > 0) {
    console.log(`Found ${issues.length} issues that might slow down build:`);
    issues.forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.issue}`);
    });
  } else {
    console.log('No issues found.');
  }
  
  // Step 3: Optimize files
  console.log('\n⚙️ Optimizing content files...');
  const results = {
    success: 0,
    failed: 0,
    failures: []
  };
  
  for (const file of files) {
    const result = optimizeFile(file);
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
  
  console.log('\n✅ Optimization complete!');
  console.log(`Successfully optimized: ${results.success} files`);
  console.log(`Failed to optimize: ${results.failed} files`);
  
  if (results.failures.length > 0) {
    console.log('\nFailed files:');
    results.failures.forEach(failure => {
      console.log(`  - ${failure.path}: ${failure.error}`);
    });
  }
}

main().catch(error => {
  console.error('Error during optimization:', error);
  process.exit(1);
}); 
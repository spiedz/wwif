const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filmsDir = path.join(process.cwd(), 'content/films');

console.log('=== COMPREHENSIVE SLUG DEBUG ===\n');

// Get all files
const files = fs.readdirSync(filmsDir).filter(f => f.endsWith('.md'));
console.log(`Found ${files.length} markdown files in content/films/\n`);

const slugs = [];
const problematicFiles = [];

files.forEach((file, index) => {
  console.log(`${index + 1}. Processing: ${file}`);
  
  try {
    const content = fs.readFileSync(path.join(filmsDir, file), 'utf8');
    const { data } = matter(content);
    
    // Get slug from frontmatter or derive from filename
    const frontmatterSlug = data.slug;
    const derivedSlug = file.replace(/\.md$/, '');
    const finalSlug = frontmatterSlug || derivedSlug;
    
    console.log(`   - Frontmatter slug: ${frontmatterSlug || 'NONE'}`);
    console.log(`   - Derived slug: ${derivedSlug}`);
    console.log(`   - Final slug: ${finalSlug}`);
    
    // Check for conflicts
    if (finalSlug === 'films') {
      console.log(`   *** CONFLICT: This file generates slug "films" ***`);
      problematicFiles.push({ file, slug: finalSlug, reason: 'slug equals "films"' });
    }
    
    if (finalSlug === '') {
      console.log(`   *** PROBLEM: Empty slug ***`);
      problematicFiles.push({ file, slug: finalSlug, reason: 'empty slug' });
    }
    
    if (slugs.includes(finalSlug)) {
      console.log(`   *** PROBLEM: Duplicate slug "${finalSlug}" ***`);
      problematicFiles.push({ file, slug: finalSlug, reason: 'duplicate slug' });
    }
    
    slugs.push(finalSlug);
    
  } catch (error) {
    console.log(`   *** ERROR: ${error.message} ***`);
    problematicFiles.push({ file, slug: 'ERROR', reason: error.message });
  }
  
  console.log('');
});

console.log('=== SUMMARY ===');
console.log(`Total files processed: ${files.length}`);
console.log(`Total slugs generated: ${slugs.length}`);
console.log(`Problematic files: ${problematicFiles.length}`);

if (problematicFiles.length > 0) {
  console.log('\n=== PROBLEMATIC FILES ===');
  problematicFiles.forEach((item, index) => {
    console.log(`${index + 1}. ${item.file}`);
    console.log(`   Slug: "${item.slug}"`);
    console.log(`   Reason: ${item.reason}`);
  });
}

// Check for the specific "films" conflict
const filmsConflicts = slugs.filter(slug => slug === 'films');
if (filmsConflicts.length > 0) {
  console.log(`\n*** FOUND ${filmsConflicts.length} FILES WITH SLUG "films" ***`);
} else {
  console.log('\n✓ No files found with slug "films"');
}

console.log('\n=== ALL GENERATED SLUGS ===');
slugs.forEach((slug, index) => {
  console.log(`${index + 1}. "${slug}"`);
}); 
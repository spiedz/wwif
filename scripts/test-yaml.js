const fs = require('fs');
const yaml = require('js-yaml');

try {
  console.log('🔍 Testing YAML frontmatter...');
  
  const content = fs.readFileSync('content/films/where-was-the-last-of-us-filmed.md', 'utf8');
  console.log('✅ File read successfully');
  
  // Extract frontmatter
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    console.log('❌ No frontmatter found');
    console.log('First 200 characters:', content.substring(0, 200));
    process.exit(1);
  }
  
  console.log('✅ Frontmatter found');
  const frontmatterText = match[1];
  
  // Parse YAML
  const frontmatter = yaml.load(frontmatterText);
  console.log('✅ YAML parsed successfully!');
  
  console.log('\n📊 Frontmatter data:');
  console.log('Title:', frontmatter.title);
  console.log('Genre:', frontmatter.genre);
  console.log('Coordinates count:', frontmatter.coordinates?.length || 0);
  
} catch (error) {
  console.log('❌ Error:', error.message);
  if (error.mark) {
    console.log('Error at line:', error.mark.line + 1);
    console.log('Error at column:', error.mark.column + 1);
  }
  process.exit(1);
} 
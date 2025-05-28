const fs = require('fs');
const matter = require('gray-matter');

const problematicFiles = [
  'where-was-avatar-the-way-of-water-filmed.md',
  'where-was-dune-part-two-filmed.md', 
  'where-was-oppenheimer-filmed.md',
  'where-was-karate-kid-legends-filmed.md',
  'where-was-the-batman-2022-filmed.md',
  'where-was-top-gun-maverick-filmed.md'
];

problematicFiles.forEach(filename => {
  const filepath = `content/films/${filename}`;
  
  if (!fs.existsSync(filepath)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`\n=== ${filename} ===`);
    
    // Try to parse with gray-matter to see the exact error
    try {
      matter(content);
      console.log('✅ YAML parses correctly');
    } catch (error) {
      console.log(`❌ YAML Error: ${error.message}`);
      
      // Find the problematic line
      const match = error.message.match(/at line (\d+)/);
      if (match) {
        const lineNum = parseInt(match[1]);
        console.log(`Line ${lineNum}: "${lines[lineNum - 1]}"`);
        
        // Show context around the error
        for (let i = Math.max(0, lineNum - 3); i < Math.min(lines.length, lineNum + 2); i++) {
          const marker = i === lineNum - 1 ? '>>> ' : '    ';
          console.log(`${marker}${i + 1}: ${lines[i]}`);
        }
      }
    }
  } catch (error) {
    console.log(`Error reading file: ${error.message}`);
  }
}); 
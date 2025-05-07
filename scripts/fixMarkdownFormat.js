const fs = require('fs');
const path = require('path');

const CONTENT_DIRS = [
  path.join(__dirname, '../content/films'),
  path.join(__dirname, '../content/series'),
  path.join(__dirname, '../content/blog'),
];

const CODE_FENCES = [
  '```yaml',
  '```markdown',
  '```md',
  '```',
];

function isCodeFence(line) {
  return CODE_FENCES.includes(line.trim());
}

function fixMarkdownFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);
  let changed = false;

  // Remove code fences that sometimes wrap frontmatter or the whole file
  const filtered = lines.filter(line => {
    if (isCodeFence(line)) {
      changed = true;
      return false;
    }
    return true;
  });

  // Optionally, ensure frontmatter is surrounded by --- only (not needed if AI always uses ---)
  // Could add more checks here if needed

  if (changed) {
    fs.writeFileSync(filePath, filtered.join('\n'), 'utf8');
  }
  return changed;
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (f.endsWith('.md')) {
      callback(fullPath);
    }
  });
}

function main() {
  let fixedFiles = [];
  CONTENT_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      walkDir(dir, file => {
        if (fixMarkdownFile(file)) {
          fixedFiles.push(file);
        }
      });
    }
  });
  if (fixedFiles.length > 0) {
    console.log('Fixed code fences in the following files:');
    fixedFiles.forEach(f => console.log(' -', f));
  } else {
    console.log('No code fence issues found. All markdown files are clean.');
  }
}

if (require.main === module) {
  main();
} 
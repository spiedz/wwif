/**
 * Test script for the Where Was It Filmed website
 * This script helps verify the bug fixes and application functionality
 * 
 * Usage: node scripts/test-app.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Define essential directories and files
const CONTENT_DIRS = [
  path.join(process.cwd(), 'content'),
  path.join(process.cwd(), 'content/films'),
  path.join(process.cwd(), 'content/blog'),
  path.join(process.cwd(), 'content/templates'),
];

const DATA_DIRS = [
  path.join(process.cwd(), 'data'),
  path.join(process.cwd(), 'data/comments'),
];

const PUBLIC_DIRS = [
  path.join(process.cwd(), 'public/images'),
  path.join(process.cwd(), 'public/images/films'),
  path.join(process.cwd(), 'public/images/blog'),
];

// Terminal colors for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Test functions
async function runTests() {
  console.log(`${colors.magenta}========================================${colors.reset}`);
  console.log(`${colors.magenta}  WWIF Test and Verification Script     ${colors.reset}`);
  console.log(`${colors.magenta}========================================${colors.reset}`);
  
  // Check for directories
  console.log(`\n${colors.cyan}Checking required directories...${colors.reset}`);
  
  const allDirs = [...CONTENT_DIRS, ...DATA_DIRS, ...PUBLIC_DIRS];
  for (const dir of allDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`${colors.yellow}Creating missing directory: ${dir}${colors.reset}`);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log(`✅ Directory exists: ${dir}`);
    }
  }
  
  // Check for content files
  console.log(`\n${colors.cyan}Checking content files...${colors.reset}`);
  const contentPaths = [
    { 
      type: 'Film',
      dir: path.join(process.cwd(), 'content/films'),
      minCount: 1
    },
    { 
      type: 'Blog',
      dir: path.join(process.cwd(), 'content/blog'),
      minCount: 1
    }
  ];
  
  for (const { type, dir, minCount } of contentPaths) {
    try {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
      console.log(`${files.length >= minCount ? '✅' : '❌'} ${type} content: ${files.length} files found`);
      if (files.length < minCount) {
        console.log(`${colors.red}Warning: Fewer than ${minCount} ${type.toLowerCase()} content files found.${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}Error checking ${type.toLowerCase()} content: ${error.message}${colors.reset}`);
    }
  }
  
  // Check env vars
  console.log(`\n${colors.cyan}Checking environment variables...${colors.reset}`);
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.log(`${colors.yellow}Warning: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set${colors.reset}`);
    console.log('Map component will use fallback view without an API key');
  } else {
    console.log('✅ Google Maps API key is set');
  }
  
  // Offer to run next.js development server
  console.log(`\n${colors.cyan}Testing complete!${colors.reset}`);
  console.log(`\nWould you like to start the development server to test the application?`);
  console.log(`Type 'yes' to start the server or any other key to exit: `);
  
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === 'yes' || input === 'y') {
      console.log(`\n${colors.green}Starting development server...${colors.reset}`);
      const child = exec('npm run dev');
      
      child.stdout.on('data', (data) => {
        console.log(data);
      });
      
      child.stderr.on('data', (data) => {
        console.error(`${colors.red}${data}${colors.reset}`);
      });
      
      child.on('error', (error) => {
        console.error(`${colors.red}Error starting server: ${error.message}${colors.reset}`);
        process.exit(1);
      });
    } else {
      console.log(`\n${colors.blue}Exiting test script.${colors.reset}`);
      process.exit(0);
    }
  });
}

// Run the tests
runTests(); 
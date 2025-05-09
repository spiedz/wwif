/**
 * Image Optimization Script
 * 
 * This script optimizes images in the public directory to improve load times
 * and reduce the overall build size.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

// Directories to scan for images
const imagesDirs = [
  'public/images',
  'public/assets'
];

// Image extensions to process
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

// Optimization options
const jpegOptions = { quality: 85 };
const pngOptions = { quality: 85 };
const webpOptions = { quality: 85 };

// Function to get all image files
function getAllImageFiles() {
  const files = [];
  
  imagesDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      imageExtensions.forEach(ext => {
        const pattern = `${dir}/**/*${ext}`;
        const matchingFiles = glob.sync(pattern);
        files.push(...matchingFiles);
      });
    }
  });
  
  return files;
}

// Function to get file size in KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

// Function to optimize a single image
async function optimizeImage(imagePath) {
  try {
    const extension = path.extname(imagePath).toLowerCase();
    const originalSize = getFileSizeKB(imagePath);
    const imageBuffer = fs.readFileSync(imagePath);
    
    let optimizedBuffer;
    
    // Process based on file extension
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        optimizedBuffer = await sharp(imageBuffer)
          .jpeg(jpegOptions)
          .toBuffer();
        break;
      case '.png':
        optimizedBuffer = await sharp(imageBuffer)
          .png(pngOptions)
          .toBuffer();
        break;
      case '.webp':
        optimizedBuffer = await sharp(imageBuffer)
          .webp(webpOptions)
          .toBuffer();
        break;
      default:
        return {
          success: false,
          path: imagePath,
          error: 'Unsupported file type'
        };
    }
    
    // Save the optimized image
    fs.writeFileSync(imagePath, optimizedBuffer);
    
    // Get new size
    const newSize = getFileSizeKB(imagePath);
    const savings = originalSize - newSize;
    const savingsPercent = Math.round((savings / originalSize) * 100);
    
    return {
      success: true,
      path: imagePath,
      originalSize,
      newSize,
      savings,
      savingsPercent
    };
  } catch (error) {
    return {
      success: false,
      path: imagePath,
      error: error.message
    };
  }
}

// Main function
async function main() {
  console.log('🔍 Scanning for images...');
  const imageFiles = getAllImageFiles();
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  if (imageFiles.length === 0) {
    console.log('No images found in specified directories.');
    return;
  }
  
  console.log('\n⚙️ Optimizing images...');
  const results = {
    success: 0,
    failed: 0,
    savings: 0,
    failures: []
  };
  
  // Process images in batches to avoid memory issues
  const batchSize = 10;
  const batches = Math.ceil(imageFiles.length / batchSize);
  
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, imageFiles.length);
    const batch = imageFiles.slice(start, end);
    
    console.log(`Processing batch ${i + 1}/${batches} (${batch.length} images)...`);
    
    const batchResults = await Promise.all(
      batch.map(async file => await optimizeImage(file))
    );
    
    batchResults.forEach(result => {
      if (result.success) {
        results.success++;
        results.savings += result.savings;
        console.log(`  ✓ ${result.path}: ${result.originalSize}KB → ${result.newSize}KB (${result.savingsPercent}% savings)`);
      } else {
        results.failed++;
        results.failures.push(result);
        console.log(`  ✗ ${result.path}: ${result.error}`);
      }
    });
  }
  
  console.log('\n✅ Optimization complete!');
  console.log(`Successfully optimized: ${results.success} images`);
  console.log(`Failed to optimize: ${results.failed} images`);
  console.log(`Total savings: ${results.savings}KB (${Math.round(results.savings / 1024)}MB)`);
  
  if (results.failures.length > 0) {
    console.log('\nFailed images:');
    results.failures.forEach(failure => {
      console.log(`  - ${failure.path}: ${failure.error}`);
    });
  }
}

main().catch(error => {
  console.error('Error during optimization:', error);
  process.exit(1);
}); 
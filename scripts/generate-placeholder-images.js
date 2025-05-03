const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const authorsDir = path.join(__dirname, '../public/images/authors');
const blogDir = path.join(__dirname, '../public/images/blog');

if (!fs.existsSync(authorsDir)) {
  fs.mkdirSync(authorsDir, { recursive: true });
}

if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Generate author avatar placeholders
const generateAvatar = async (name, color) => {
  await sharp({
    create: {
      width: 200,
      height: 200,
      channels: 4,
      background: color
    }
  })
    .png()
    .toFile(path.join(authorsDir, `${name}.jpg`));
  
  console.log(`Created avatar for ${name}`);
};

// Generate blog post placeholders
const generateBlogImage = async (name, width, height, color) => {
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: color
    }
  })
    .png()
    .toFile(path.join(blogDir, `${name}.jpg`));
  
  console.log(`Created blog image: ${name}.jpg`);
};

// Generate author avatars
(async () => {
  try {
    await generateAvatar('default-avatar', { r: 200, g: 200, b: 200 });
    await generateAvatar('action-film-expert', { r: 41, g: 128, b: 185 });
    await generateAvatar('travel-guide', { r: 39, g: 174, b: 96 });
    
    // Generate blog post images
    await generateBlogImage('car-chase-cover', 1200, 630, { r: 231, g: 76, b: 60 });
    
    console.log('All placeholder images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
  }
})(); 
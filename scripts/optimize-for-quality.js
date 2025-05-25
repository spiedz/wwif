#!/usr/bin/env node

/**
 * Content Quality Optimization Script
 * 
 * This script analyzes your existing content and provides specific recommendations
 * to achieve 90+ quality scores based on the scoring algorithm.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Quality scoring algorithm (matches the one in audit.ts)
const calculateQualityScore = (item, type) => {
  let score = 0;
  
  const content = item.content || '';
  let wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  
  // Add words from rich metadata for films/series
  if (type === 'film' || type === 'series') {
    if (item.meta?.description) {
      wordCount += item.meta.description.split(/\s+/).filter(word => word.length > 0).length;
    }
    
    if (item.meta?.coordinates) {
      item.meta.coordinates.forEach(coord => {
        if (coord.description) {
          wordCount += coord.description.split(/\s+/).filter(word => word.length > 0).length;
        }
      });
    }
    
    if (item.meta?.behindTheScenes) {
      if (item.meta.behindTheScenes.intro) {
        wordCount += item.meta.behindTheScenes.intro.split(/\s+/).filter(word => word.length > 0).length;
      }
      if (item.meta.behindTheScenes.facts) {
        item.meta.behindTheScenes.facts.forEach(fact => {
          wordCount += fact.split(/\s+/).filter(word => word.length > 0).length;
        });
      }
    }
  }
  
  // Word count scoring (0-25 points)
  if (wordCount > 1500) score += 25;
  else if (wordCount > 800) score += 23;
  else if (wordCount > 400) score += 20;
  else if (wordCount > 200) score += 18;
  else if (wordCount > 100) score += 15;
  else if (wordCount > 50) score += 10;
  else score += 5;
  
  // Meta description quality (0-15 points)
  if (item.meta?.description) {
    const metaLength = item.meta.description.length;
    if (metaLength >= 120 && metaLength <= 160) score += 15;
    else if (metaLength >= 100 && metaLength <= 180) score += 12;
    else if (metaLength >= 80 && metaLength <= 200) score += 10;
    else if (metaLength > 0) score += 7;
  }
  
  // Rich metadata content (0-20 points)
  if (type === 'film' || type === 'series') {
    // Coordinates/locations (0-8 points)
    if (item.meta?.coordinates) {
      const coordCount = item.meta.coordinates.length;
      if (coordCount >= 8) score += 8;
      else if (coordCount >= 5) score += 6;
      else if (coordCount >= 3) score += 4;
      else if (coordCount >= 1) score += 2;
    }
    
    // Behind the scenes content (0-6 points)
    if (item.meta?.behindTheScenes) {
      if (item.meta.behindTheScenes.facts && item.meta.behindTheScenes.facts.length >= 3) score += 6;
      else if (item.meta.behindTheScenes.facts && item.meta.behindTheScenes.facts.length >= 1) score += 4;
      else if (item.meta.behindTheScenes.intro) score += 2;
    }
    
    // Streaming/booking options (0-6 points)
    let optionsCount = 0;
    if (item.meta?.streamingServices) optionsCount += item.meta.streamingServices.length;
    if (item.meta?.bookingOptions) optionsCount += item.meta.bookingOptions.length;
    if (optionsCount >= 5) score += 6;
    else if (optionsCount >= 3) score += 4;
    else if (optionsCount >= 1) score += 2;
  }
  
  // Images and media (0-10 points)
  const hasImages = content.includes('<img') || content.includes('![') || item.meta?.posterImage;
  if (hasImages) score += 8;
  if (item.meta?.posterImage) score += 2;
  
  // Structure and headings (0-10 points)
  const headingCount = (content.match(/#+ /g) || []).length;
  if (headingCount >= 5) score += 10;
  else if (headingCount >= 3) score += 8;
  else if (headingCount >= 2) score += 6;
  else if (headingCount >= 1) score += 4;
  
  // Links (0-10 points)
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount >= 8) score += 10;
  else if (linkCount >= 5) score += 8;
  else if (linkCount >= 3) score += 6;
  else if (linkCount >= 1) score += 4;
  
  // Type-specific metadata scoring (0-10 points)
  if (type === 'film' || type === 'series') {
    if (item.meta?.genre && item.meta.genre.length > 0) score += 3;
    if (item.meta?.director || item.meta?.creator) score += 2;
    if (item.meta?.year) score += 2;
    if (item.meta?.countries && item.meta.countries.length > 0) score += 2;
    if (item.meta?.slug && item.meta.slug.length > 10) score += 1;
  }
  
  return Math.min(100, Math.round(score));
};

// Generate improvement recommendations
const generateRecommendations = (item, type, currentScore) => {
  const recommendations = [];
  const content = item.content || '';
  
  // Calculate current word count
  let wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  if (type === 'film' || type === 'series') {
    if (item.meta?.description) {
      wordCount += item.meta.description.split(/\s+/).filter(word => word.length > 0).length;
    }
    if (item.meta?.coordinates) {
      item.meta.coordinates.forEach(coord => {
        if (coord.description) {
          wordCount += coord.description.split(/\s+/).filter(word => word.length > 0).length;
        }
      });
    }
  }
  
  // Word count recommendations
  if (wordCount < 1500) {
    const needed = 1500 - wordCount;
    recommendations.push({
      category: 'Content Length',
      priority: 'HIGH',
      points: 25 - Math.floor(wordCount / 100),
      action: `Add ${needed} more words to reach 1500+ words for maximum points`,
      suggestions: [
        'Expand location descriptions (100+ words each)',
        'Add detailed travel tips and visitor information',
        'Include fan experiences and testimonials',
        'Add historical context for filming locations',
        'Include photography tips and best viewing times'
      ]
    });
  }
  
  // Meta description recommendations
  if (!item.meta?.description) {
    recommendations.push({
      category: 'Meta Description',
      priority: 'HIGH',
      points: 15,
      action: 'Add a meta description (120-160 characters optimal)',
      suggestions: [
        'Include primary keywords naturally',
        'Mention main filming locations',
        'Create compelling call-to-action',
        'Keep between 120-160 characters'
      ]
    });
  } else {
    const metaLength = item.meta.description.length;
    if (metaLength < 120 || metaLength > 160) {
      recommendations.push({
        category: 'Meta Description',
        priority: 'MEDIUM',
        points: 3,
        action: `Optimize meta description length (currently ${metaLength} chars, optimal: 120-160)`,
        suggestions: ['Adjust length to 120-160 characters for maximum SEO impact']
      });
    }
  }
  
  // Coordinates/locations recommendations
  if (type === 'film' || type === 'series') {
    const coordCount = item.meta?.coordinates?.length || 0;
    if (coordCount < 5) {
      recommendations.push({
        category: 'Filming Locations',
        priority: 'HIGH',
        points: 8 - Math.floor(coordCount * 1.6),
        action: `Add ${5 - coordCount} more filming locations (currently ${coordCount}, target: 5+)`,
        suggestions: [
          'Research additional filming locations',
          'Add detailed descriptions for each location',
          'Include visitor information (hours, fees, tips)',
          'Add coordinates and addresses',
          'Include nearby attractions and amenities'
        ]
      });
    }
    
    // Behind-the-scenes recommendations
    const factsCount = item.meta?.behindTheScenes?.facts?.length || 0;
    if (factsCount < 5) {
      recommendations.push({
        category: 'Behind-the-Scenes',
        priority: 'HIGH',
        points: 6 - Math.floor(factsCount * 1.2),
        action: `Add ${5 - factsCount} more behind-the-scenes facts (currently ${factsCount}, target: 5+)`,
        suggestions: [
          'Research production challenges and solutions',
          'Include cast and crew anecdotes',
          'Add technical filming details',
          'Include budget and economic impact information',
          'Add weather and logistical challenges'
        ]
      });
    }
    
    // Streaming services recommendations
    const streamingCount = item.meta?.streamingServices?.length || 0;
    const bookingCount = item.meta?.bookingOptions?.length || 0;
    const totalOptions = streamingCount + bookingCount;
    
    if (totalOptions < 3) {
      recommendations.push({
        category: 'Streaming & Booking',
        priority: 'MEDIUM',
        points: 4,
        action: `Add ${3 - totalOptions} more streaming/booking options (currently ${totalOptions}, target: 3+)`,
        suggestions: [
          'Add Netflix, Amazon Prime, Hulu options',
          'Include rental and purchase prices',
          'Add tour booking options',
          'Include partner affiliate links',
          'Add regional availability information'
        ]
      });
    }
  }
  
  // Images recommendations
  const hasImages = content.includes('<img') || content.includes('![') || item.meta?.posterImage;
  if (!hasImages) {
    recommendations.push({
      category: 'Images & Media',
      priority: 'HIGH',
      points: 8,
      action: 'Add images to content',
      suggestions: [
        'Add poster image in frontmatter',
        'Include location photos in content',
        'Add behind-the-scenes images',
        'Include maps and infographics',
        'Optimize images for web (WebP format)'
      ]
    });
  }
  
  // Structure recommendations
  const headingCount = (content.match(/#+ /g) || []).length;
  if (headingCount < 5) {
    recommendations.push({
      category: 'Content Structure',
      priority: 'MEDIUM',
      points: 10 - Math.floor(headingCount * 2),
      action: `Add ${5 - headingCount} more headings for better structure (currently ${headingCount}, target: 5+)`,
      suggestions: [
        'Add "Major Filming Locations" section',
        'Include "Behind-the-Scenes" section',
        'Add "Travel Guide" section',
        'Include "Fan Experiences" section',
        'Add "Related Films" section'
      ]
    });
  }
  
  // Links recommendations
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount < 5) {
    recommendations.push({
      category: 'Internal/External Links',
      priority: 'MEDIUM',
      points: 8 - Math.floor(linkCount * 1.6),
      action: `Add ${5 - linkCount} more links (currently ${linkCount}, target: 5+)`,
      suggestions: [
        'Link to related film pages',
        'Add external links to official sources',
        'Include links to booking/streaming services',
        'Link to location websites and tourism boards',
        'Add social media and review links'
      ]
    });
  }
  
  return recommendations;
};

// Analyze a single file
const analyzeFile = (filePath, type) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: meta, content } = matter(fileContent);
    
    const item = { meta, content };
    const currentScore = calculateQualityScore(item, type);
    const recommendations = generateRecommendations(item, type, currentScore);
    
    return {
      file: path.basename(filePath),
      path: filePath,
      currentScore,
      recommendations,
      potentialScore: currentScore + recommendations.reduce((sum, rec) => sum + rec.points, 0)
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
};

// Main execution
const main = () => {
  console.log('🎯 Content Quality Optimization Analysis\n');
  
  const contentDirs = [
    { path: 'content/films', type: 'film' },
    { path: 'content/series', type: 'series' },
    { path: 'content/blog', type: 'blog' }
  ];
  
  const results = [];
  
  contentDirs.forEach(({ path: dirPath, type }) => {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory ${dirPath} not found, skipping...`);
      return;
    }
    
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md'))
      .slice(0, 10); // Analyze first 10 files for demo
    
    console.log(`📁 Analyzing ${files.length} ${type} files in ${dirPath}...\n`);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const analysis = analyzeFile(filePath, type);
      
      if (analysis) {
        results.push(analysis);
        
        console.log(`📄 ${analysis.file}`);
        console.log(`   Current Score: ${analysis.currentScore}/100`);
        console.log(`   Potential Score: ${Math.min(100, analysis.potentialScore)}/100`);
        
        if (analysis.currentScore < 90) {
          console.log(`   🎯 Top Recommendations:`);
          analysis.recommendations
            .sort((a, b) => b.points - a.points)
            .slice(0, 3)
            .forEach(rec => {
              console.log(`      • ${rec.action} (+${rec.points} points)`);
            });
        } else {
          console.log(`   ✅ Already achieving 90+ quality score!`);
        }
        console.log('');
      }
    });
  });
  
  // Summary
  console.log('📊 SUMMARY\n');
  const lowScoreFiles = results.filter(r => r.currentScore < 90);
  const highScoreFiles = results.filter(r => r.currentScore >= 90);
  
  console.log(`✅ Files with 90+ score: ${highScoreFiles.length}`);
  console.log(`🎯 Files needing improvement: ${lowScoreFiles.length}`);
  
  if (lowScoreFiles.length > 0) {
    console.log('\n🚀 QUICK WINS (Highest Impact):');
    
    const allRecommendations = lowScoreFiles
      .flatMap(file => file.recommendations.map(rec => ({ ...rec, file: file.file })))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
    
    allRecommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.file}: ${rec.action} (+${rec.points} points)`);
    });
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Focus on files with lowest current scores first');
    console.log('2. Implement high-point recommendations first');
    console.log('3. Use the template in templates/high-quality-film-template.md');
    console.log('4. Monitor progress with /admin/content-audit');
    console.log('5. Aim for 90+ scores on all pages');
  }
  
  console.log('\n🎯 Target: Transform all pages to 90+ quality scores!');
};

// Run the analysis
main(); 
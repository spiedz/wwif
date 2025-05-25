/**
 * Content Quality Checker for Where Was It Filmed
 * 
 * This script analyzes all film content files and generates a quality report
 * to help identify potential issues that could affect Google AdSense approval.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// Quality thresholds
const QUALITY_THRESHOLDS = {
  MIN_CONTENT_LENGTH: 800,
  MIN_DESCRIPTION_LENGTH: 120,
  MAX_DESCRIPTION_LENGTH: 160,
  MIN_COORDINATES: 2,
  MIN_BEHIND_SCENES_FACTS: 3
};

// Problem patterns to detect
const PROBLEM_PATTERNS = [
  /specific.{0,20}details.{0,20}(are|not|kept).{0,20}under wraps/i,
  /locations.{0,20}(are|not).{0,20}widely.{0,20}(documented|publicized)/i,
  /filming.{0,20}locations.{0,20}(are|not).{0,20}(well|widely).{0,20}documented/i,
  /while.{0,20}specific.{0,20}details/i,
  /exact.{0,20}filming.{0,20}locations.{0,20}(are|remain).{0,20}(largely|not)/i,
  /specify\s+(director|genre|location)/i,
  /lorem ipsum/i,
  /placeholder/i,
  /\[.*\]/g, // Template placeholders in brackets
  /example\.com/i,
  /specific\s+addresses?\s+(are|not)\s+(not\s+)?widely/i
];

// Generic coordinate patterns (same coords for different "locations")
const GENERIC_COORDS = [
  { lat: 34.0522, lng: -118.2437 }, // Generic LA coords
  { lat: 40.7128, lng: -74.0060 },  // Generic NYC coords
  { lat: 51.5074, lng: -0.1278 },   // Generic London coords
];

function analyzeContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: body } = matter(content);
    
    const issues = [];
    const warnings = [];
    let qualityScore = 100;

    // Check content length
    const bodyLength = body.length;
    if (bodyLength < QUALITY_THRESHOLDS.MIN_CONTENT_LENGTH) {
      issues.push(`Content too short: ${bodyLength} chars (minimum: ${QUALITY_THRESHOLDS.MIN_CONTENT_LENGTH})`);
      qualityScore -= 25;
    }

    // Check description length
    const description = frontmatter.description || '';
    if (description.length < QUALITY_THRESHOLDS.MIN_DESCRIPTION_LENGTH) {
      issues.push(`Description too short: ${description.length} chars`);
      qualityScore -= 15;
    } else if (description.length > QUALITY_THRESHOLDS.MAX_DESCRIPTION_LENGTH) {
      warnings.push(`Description too long: ${description.length} chars (may be truncated)`);
      qualityScore -= 5;
    }

    // Check for problem patterns in content
    const fullText = `${description} ${body}`;
    PROBLEM_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(fullText)) {
        issues.push(`Contains problematic pattern: "${fullText.match(pattern)?.[0] || 'Pattern ' + index}"`);
        qualityScore -= 20;
      }
    });

    // Check coordinates
    const coordinates = frontmatter.coordinates || [];
    if (coordinates.length < QUALITY_THRESHOLDS.MIN_COORDINATES) {
      issues.push(`Insufficient coordinates: ${coordinates.length} (minimum: ${QUALITY_THRESHOLDS.MIN_COORDINATES})`);
      qualityScore -= 15;
    }

    // Check for generic/duplicate coordinates
    coordinates.forEach((coord, index) => {
      GENERIC_COORDS.forEach(generic => {
        if (Math.abs(coord.lat - generic.lat) < 0.001 && Math.abs(coord.lng - generic.lng) < 0.001) {
          warnings.push(`Coordinate ${index + 1} appears to be generic (${coord.lat}, ${coord.lng})`);
          qualityScore -= 10;
        }
      });
    });

    // Check behind the scenes facts
    const behindTheScenes = frontmatter.behindTheScenes || {};
    const facts = behindTheScenes.facts || [];
    if (facts.length < QUALITY_THRESHOLDS.MIN_BEHIND_SCENES_FACTS) {
      warnings.push(`Few behind-the-scenes facts: ${facts.length} (recommended: ${QUALITY_THRESHOLDS.MIN_BEHIND_SCENES_FACTS}+)`);
      qualityScore -= 5;
    }

    // Check for missing required fields
    const requiredFields = ['title', 'description', 'slug', 'year', 'director'];
    requiredFields.forEach(field => {
      if (!frontmatter[field]) {
        issues.push(`Missing required field: ${field}`);
        qualityScore -= 10;
      }
    });

    // Check for template artifacts
    if (frontmatter.director === 'Unknown' || frontmatter.director === 'Specify Director Name') {
      issues.push('Director field contains placeholder text');
      qualityScore -= 15;
    }

    return {
      filePath,
      title: frontmatter.title || 'Untitled',
      qualityScore: Math.max(0, qualityScore),
      issues,
      warnings,
      wordCount: body.split(/\s+/).length,
      coordinateCount: coordinates.length
    };

  } catch (error) {
    return {
      filePath,
      title: 'Error reading file',
      qualityScore: 0,
      issues: [`File error: ${error.message}`],
      warnings: [],
      wordCount: 0,
      coordinateCount: 0
    };
  }
}

function generateReport() {
  console.log('🔍 Analyzing content quality...\n');
  
  const filmsDir = path.join(process.cwd(), 'content/films');
  const files = glob.sync(`${filmsDir}/**/*.md`);
  
  const results = files.map(analyzeContent);
  
  // Sort by quality score (lowest first)
  results.sort((a, b) => a.qualityScore - b.qualityScore);
  
  // Generate statistics
  const stats = {
    total: results.length,
    highQuality: results.filter(r => r.qualityScore >= 80).length,
    mediumQuality: results.filter(r => r.qualityScore >= 60 && r.qualityScore < 80).length,
    lowQuality: results.filter(r => r.qualityScore < 60).length,
    averageScore: results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length
  };

  // Console output
  console.log('📊 Quality Statistics:');
  console.log(`Total files: ${stats.total}`);
  console.log(`High quality (80+): ${stats.highQuality} (${((stats.highQuality/stats.total)*100).toFixed(1)}%)`);
  console.log(`Medium quality (60-79): ${stats.mediumQuality} (${((stats.mediumQuality/stats.total)*100).toFixed(1)}%)`);
  console.log(`Low quality (<60): ${stats.lowQuality} (${((stats.lowQuality/stats.total)*100).toFixed(1)}%)`);
  console.log(`Average quality score: ${stats.averageScore.toFixed(1)}/100\n`);

  // Show worst offenders
  console.log('⚠️  Lowest Quality Content (may need review/deletion):');
  results.slice(0, 10).forEach((result, index) => {
    console.log(`${index + 1}. ${result.title} (Score: ${result.qualityScore})`);
    console.log(`   File: ${path.basename(result.filePath)}`);
    if (result.issues.length > 0) {
      console.log(`   Issues: ${result.issues.slice(0, 2).join(', ')}${result.issues.length > 2 ? '...' : ''}`);
    }
    console.log('');
  });

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'scripts/content-quality-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    statistics: stats,
    thresholds: QUALITY_THRESHOLDS,
    results: results
  }, null, 2));

  console.log(`📄 Detailed report saved to: ${reportPath}`);
  console.log('\n💡 Recommendation: Consider removing or improving content with scores below 60');
  
  return results;
}

// Run the analysis
if (require.main === module) {
  generateReport();
}

module.exports = { analyzeContent, generateReport, QUALITY_THRESHOLDS }; 
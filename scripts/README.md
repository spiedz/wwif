# Content Management Scripts

This directory contains scripts for managing and optimizing content for the Where Was It Filmed website.

## Available Scripts

### Content Quality Checker
```bash
npm run quality-check
```
Analyzes all film content files and generates a quality report to identify potential issues that could affect Google AdSense approval.

**Features:**
- Detects placeholder text and template artifacts
- Validates required fields and content length
- Identifies generic coordinates and duplicate content
- Generates quality scores (0-100) for each film page
- Creates detailed reports with actionable recommendations

**Quality Thresholds:**
- Minimum content length: 800 characters
- Minimum description length: 120 characters
- Maximum description length: 160 characters
- Minimum coordinates: 2 locations
- Minimum behind-the-scenes facts: 3

### Content Optimization
```bash
npm run optimize-content
```
Optimizes Markdown content files to improve build performance by removing duplicates and cleaning frontmatter.

### Image Optimization
```bash
npm run optimize-images
```
Optimizes images for web delivery and performance.

## Quality Control Guidelines

### High-Quality Content Requirements
1. **Minimum 800 words** of unique, valuable content
2. **At least 2 verified filming locations** with detailed descriptions
3. **Complete metadata** including title, description, year, director
4. **No placeholder text** or template artifacts
5. **Proper image attribution** and high-quality visuals
6. **Behind-the-scenes facts** that provide unique insights

### Content to Avoid
- Pages that admit filming locations are "unknown" or "under wraps"
- Generic coordinates used for multiple different locations
- Placeholder text like "Specify Director Name" or "example.com"
- Template artifacts in brackets like "[Film Name]"
- Speculation without verified sources

### AdSense Compliance
The quality checker specifically looks for issues that could cause Google AdSense rejection:
- Thin content with minimal value
- Duplicate or templated content
- Missing or incomplete information
- Poor user experience indicators

## Task Master Integration

This project uses Task Master for tracking development tasks. The film content management system (Task #18) includes:

1. **Admin Dashboard** - View all films with status and quality metrics
2. **Quality Scoring** - Automated content evaluation
3. **Content Validation** - Pre-publish checks for quality issues
4. **Metadata Management** - Track completion and verification status
5. **Bulk Operations** - Manage multiple films simultaneously
6. **Analytics Integration** - Track performance and engagement
7. **Content Pipeline** - Workflow from draft to published
8. **Task Integration** - Sync with existing task management

## Usage Examples

### Check content quality before publishing:
```bash
npm run quality-check
```

### Optimize content for better performance:
```bash
npm run optimize-content
```

### Full optimization pipeline:
```bash
npm run quality-check && npm run optimize-content && npm run build
```

## Reports

Quality reports are saved to `scripts/content-quality-report.json` and include:
- Overall statistics and quality distribution
- Detailed analysis for each film page
- Specific issues and recommendations
- Quality scores and thresholds

## Best Practices

1. **Run quality checks regularly** to catch issues early
2. **Focus on unique value** - what can't users find elsewhere?
3. **Verify all filming locations** through multiple sources
4. **Include practical visitor information** when possible
5. **Use high-quality, properly attributed images**
6. **Write for humans first, SEO second**

## Troubleshooting

If you encounter issues:
1. Check that all dependencies are installed: `npm install`
2. Ensure you're in the project root directory
3. Verify file paths in the scripts match your content structure
4. Check the console output for specific error messages

For Task Master integration issues, ensure the task management system is properly configured and accessible. 
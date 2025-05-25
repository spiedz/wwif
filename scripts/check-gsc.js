#!/usr/bin/env node

/**
 * Google Search Console Configuration Checker
 * Run with: node scripts/check-gsc.js
 */

const fs = require('fs');
const path = require('path');

// Simple env file parser (fallback if no dotenv)
function loadEnvFile() {
  // Load .env first (lower priority)
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    console.log('📁 Found .env file');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }

  // Load .env.local second (higher priority, overwrites .env)
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    console.log('📁 Found .env.local file');
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        process.env[key] = value; // Override any existing values
      }
    });
  }

  if (!fs.existsSync(envPath) && !fs.existsSync(envLocalPath)) {
    console.log('📁 No .env or .env.local files found');
  }
}

function checkGSCConfig() {
  // Load .env and .env.local if they exist
  loadEnvFile();

  console.log('\n🔍 Google Search Console Configuration Check\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const config = {
    serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    serviceAccountKeyPath: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
    accessToken: process.env.GSC_ACCESS_TOKEN,
  };

  let isConfigured = true;
  const issues = [];
  const warnings = [];

  // Check site URL
  if (config.siteUrl) {
    console.log('✅ NEXT_PUBLIC_BASE_URL:', config.siteUrl);
  } else {
    console.log('❌ NEXT_PUBLIC_BASE_URL: Not set');
    issues.push('Set NEXT_PUBLIC_BASE_URL in your .env or .env.local file');
    isConfigured = false;
  }

  // Check authentication
  let authMethod = 'None';
  if (config.serviceAccountKey) {
    try {
      const parsed = JSON.parse(config.serviceAccountKey);
      if (parsed.type === 'service_account') {
        console.log('✅ GOOGLE_SERVICE_ACCOUNT_KEY: Valid service account JSON');
        console.log('   📧 Service Account Email:', parsed.client_email);
        console.log('   🏗️  Project ID:', parsed.project_id);
        authMethod = 'Service Account JSON';
      } else {
        console.log('❌ GOOGLE_SERVICE_ACCOUNT_KEY: Invalid service account format');
        issues.push('Service account JSON appears invalid');
        isConfigured = false;
      }
    } catch (error) {
      console.log('❌ GOOGLE_SERVICE_ACCOUNT_KEY: Invalid JSON format');
      console.log('   Error:', error.message);
      issues.push('Service account key is not valid JSON');
      isConfigured = false;
    }
  } else if (config.serviceAccountKeyPath) {
    console.log('✅ GOOGLE_SERVICE_ACCOUNT_KEY_PATH:', config.serviceAccountKeyPath);
    authMethod = 'Service Account File';
    warnings.push('Ensure the service account key file exists and is accessible');
  } else if (config.accessToken) {
    console.log('✅ GSC_ACCESS_TOKEN: Set (length:', config.accessToken.length, 'chars)');
    authMethod = 'Access Token';
    warnings.push('Access tokens are temporary and less secure than service accounts');
  } else {
    console.log('❌ Authentication: No method configured');
    issues.push('Configure GOOGLE_SERVICE_ACCOUNT_KEY, GOOGLE_SERVICE_ACCOUNT_KEY_PATH, or GSC_ACCESS_TOKEN');
    isConfigured = false;
  }

  console.log('\n📊 Configuration Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Status: ${isConfigured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}`);
  console.log(`Authentication Method: ${authMethod}`);
  console.log(`Issues: ${issues.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (issues.length > 0) {
    console.log('\n🚨 Issues to Fix:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning}`);
    });
  }

  if (!isConfigured) {
    console.log('\n📋 Quick Fix:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (!config.siteUrl) {
      console.log('Add this line to your .env file:');
      console.log('NEXT_PUBLIC_BASE_URL=https://wherewasitfilmed.co');
      console.log('');
    }
    console.log('📋 Full Setup Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Go to Google Cloud Console (console.cloud.google.com)');
    console.log('2. Create a new project or select existing project');
    console.log('3. Enable the "Google Search Console API"');
    console.log('4. Create a Service Account:');
    console.log('   - Go to IAM & Admin > Service Accounts');
    console.log('   - Click "Create Service Account"');
    console.log('   - Give it a name like "GSC API Access"');
    console.log('   - Download the JSON key file');
    console.log('5. Add the service account to your Search Console property:');
    console.log('   - Go to Search Console (search.google.com/search-console)');
    console.log('   - Select your property');
    console.log('   - Go to Settings > Users and permissions');
    console.log('   - Add user with the service account email');
    console.log('   - Give it "Full" permission');
  } else {
    console.log('\n🎉 Next Steps:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Build your project: npm run build');
    console.log('2. Start your dev server: npm run dev');
    console.log('3. Test the connection: http://localhost:3000/api/gsc/test');
    console.log('4. Run indexing check: http://localhost:3000/api/gsc/indexing');
    console.log('5. Check performance: http://localhost:3000/api/gsc/performance');
  }

  console.log('\n🔗 Useful Links:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Google Cloud Console: https://console.cloud.google.com/');
  console.log('Search Console: https://search.google.com/search-console/');
  console.log('API Documentation: https://developers.google.com/webmaster-tools/search-console-api-original');

  console.log('\n');
  return isConfigured;
}

if (require.main === module) {
  const isWorking = checkGSCConfig();
  process.exit(isWorking ? 0 : 1);
} 
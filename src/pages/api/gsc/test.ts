import type { NextApiRequest, NextApiResponse } from 'next';
import { testGSCConnection, getGSCConfig, validateGSCConfig } from '../../../utils/googleSearchConsole';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

interface TestResponse {
  success: boolean;
  error?: string;
  config?: {
    siteUrl: string;
    hasServiceAccount: boolean;
    hasAccessToken: boolean;
  };
  sites?: any[];
  siteInfo?: any;
  diagnostics?: {
    canListSites: boolean;
    siteMatch: boolean;
    availableSites: string[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const config = getGSCConfig();
    const validation = validateGSCConfig(config);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: `Configuration invalid: ${validation.errors.join(', ')}`,
        config: {
          siteUrl: config.siteUrl,
          hasServiceAccount: !!config.serviceAccountKey,
          hasAccessToken: !!config.accessToken,
        }
      });
    }

    // Test basic connection and get detailed diagnostics
    let auth;
    if (config.serviceAccountKey) {
      auth = new GoogleAuth({
        credentials: config.serviceAccountKey,
        scopes: [
          'https://www.googleapis.com/auth/webmasters.readonly',
          'https://www.googleapis.com/auth/webmasters'
        ],
      });
    } else if (config.serviceAccountKeyPath) {
      auth = new GoogleAuth({
        keyFile: config.serviceAccountKeyPath,
        scopes: [
          'https://www.googleapis.com/auth/webmasters.readonly',
          'https://www.googleapis.com/auth/webmasters'
        ],
      });
    } else {
      throw new Error('No valid authentication method provided');
    }

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    // Try to list all sites
    const sitesResponse = await searchconsole.sites.list();
    const sites = sitesResponse.data.siteEntry || [];
    const availableSites = sites.map(site => site.siteUrl || '');
    
    // Check if our configured site is in the list
    const siteMatch = sites.find(site => site.siteUrl === config.siteUrl);
    
    const diagnostics = {
      canListSites: true,
      siteMatch: !!siteMatch,
      availableSites
    };

    if (!siteMatch) {
      return res.json({
        success: false,
        error: `Site ${config.siteUrl} not found in Google Search Console. Available sites: ${availableSites.join(', ')}`,
        config: {
          siteUrl: config.siteUrl,
          hasServiceAccount: !!config.serviceAccountKey,
          hasAccessToken: !!config.accessToken,
        },
        sites,
        diagnostics
      });
    }

    // Test actual functionality with a simple query
    try {
      const testResponse = await searchconsole.searchanalytics.query({
        siteUrl: config.siteUrl,
        requestBody: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          dimensions: ['page'],
          rowLimit: 1
        },
      });

      return res.json({
        success: true,
        config: {
          siteUrl: config.siteUrl,
          hasServiceAccount: !!config.serviceAccountKey,
          hasAccessToken: !!config.accessToken,
        },
        sites,
        siteInfo: siteMatch,
        diagnostics
      });
    } catch (searchError) {
      return res.json({
        success: false,
        error: `Site found but search analytics failed: ${searchError instanceof Error ? searchError.message : 'Unknown error'}`,
        config: {
          siteUrl: config.siteUrl,
          hasServiceAccount: !!config.serviceAccountKey,
          hasAccessToken: !!config.accessToken,
        },
        sites,
        siteInfo: siteMatch,
        diagnostics
      });
    }

  } catch (error: any) {
    console.error('GSC test error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to test GSC connection'
    });
  }
} 
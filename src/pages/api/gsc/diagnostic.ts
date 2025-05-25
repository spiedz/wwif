import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  diagnoseGSCSetup, 
  getGSCSetupInstructions, 
  generateSampleEnvConfig 
} from '../../../utils/gscDiagnostic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const diagnostic = diagnoseGSCSetup();
    const setupInstructions = getGSCSetupInstructions();
    const sampleConfig = generateSampleEnvConfig();

    return res.json({
      diagnostic,
      setupInstructions,
      sampleConfig,
      timestamp: new Date().toISOString(),
      summary: {
        status: diagnostic.isConfigured ? 'CONFIGURED' : 'NOT_CONFIGURED',
        readyToUse: diagnostic.isConfigured && diagnostic.errors.length === 0,
        criticalIssues: diagnostic.errors.length,
        warnings: diagnostic.warnings.length
      }
    });

  } catch (error) {
    console.error('GSC diagnostic error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to run GSC diagnostic'
    });
  }
} 
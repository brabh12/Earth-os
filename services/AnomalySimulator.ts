import { EnvironmentalIssue } from '../types';

const ISSUE_TYPES: any[] = ['desertification', 'water_scarcity', 'pollution', 'deforestation', 'climate_anomaly'];
const SEVERITIES: any[] = ['low', 'medium', 'high', 'critical'];

export const AnomalySimulator = {
  generateRandomIssue(): Partial<EnvironmentalIssue> {
    const type = ISSUE_TYPES[Math.floor(Math.random() * ISSUE_TYPES.length)];
    const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
    
    // Random location across Earth
    const latitude = (Math.random() * 140) - 70;
    const longitude = (Math.random() * 360) - 180;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      severity,
      latitude,
      longitude,
      explanation: `Automated scan detected ${type.replace('_', ' ')} pattern with ${severity} severity. AI confidence: ${(Math.random() * 20 + 80).toFixed(1)}%.`,
      status: 'active',
      created_at: new Date().toISOString()
    };
  }
};

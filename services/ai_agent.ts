import { openRouterCall } from '../lib/openrouter';
import { EnvironmentalIssue, Mission } from '../types';

export const EarthIntelligenceAgent = {
  /**
   * Analyzes raw environmental data and detects anomalies.
   */
  async detectAnomalies(sensorData: any): Promise<Partial<EnvironmentalIssue>[]> {
    const prompt = `
      Analyze environmental sensor data and identify anomalies.
      Data: ${JSON.stringify(sensorData)}
      
      Respond with a JSON object in this format: 
      {"anomalies": [{"type": "...", "severity": "...", "latitude": 0, "longitude": 0, "causes": [], "confidence": 0, "explanation": "..."}]}
    `;

    try {
      const content = await openRouterCall(prompt);
      const parsedResponse = JSON.parse(content);
      return parsedResponse.anomalies || [];
    } catch (error: any) {
      console.error('OpenRouter Detection Error Details:', error?.message || error);
      return [];
    }
  },

  /**
   * Generates a solution plan for a detected issue.
   */
  async generateSolution(issue: EnvironmentalIssue): Promise<Partial<Mission>> {
    const prompt = `
      As an advanced planetary intelligence, create a highly detailed environmental intervention plan for this issue:
      Type: ${issue.type} | Severity: ${issue.severity} | Location: ${issue.latitude}, ${issue.longitude}
      Explanation: ${issue.explanation}
      
      You MUST respond with a valid JSON object in this EXACT format:
      {
        "title": "Short Impactful Title",
        "description": "A comprehensive 3-stage environmental intervention strategy",
        "resources_needed": ["Equipment 1", "Equipment 2", "Equipment 3"],
        "estimated_volunteers": 50,
        "estimated_cost_usd": 15000,
        "impact_estimate": "Estimated recovery time and CO2 sequestration in MT"
      }
    `;

    try {
      const content = await openRouterCall(prompt);
      console.log('OpenRouter Solution Response:', content);
      
      return JSON.parse(content);
    } catch (error: any) {
      console.error('OpenRouter Solution Error Details:', error?.message || error);
      // Return a realistic fallback if AI fails
      return {
        title: "EMERGENCY PROTOCOL ALPHA",
        description: "OpenRouter Link failed. Deploying standard regional intervention: Establish perimeter, initialize water recycling, and coordinate with local monitoring stations.",
        resources_needed: ["Water Filtration", "Soil Stabilization", "Volunteer Transport"],
        impact_estimate: "15% recovery over 3 months"
      };
    }
  }
};

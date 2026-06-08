import { NextRequest, NextResponse } from 'next/server';
import { EarthIntelligenceAgent } from '@/services/ai_agent';

export async function POST(req: NextRequest) {
  try {
    const { issue } = await req.json();
    if (!issue) return NextResponse.json({ error: 'Issue is required' }, { status: 400 });

    const solution = await EarthIntelligenceAgent.generateSolution(issue);
    return NextResponse.json(solution);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate solution' }, { status: 500 });
  }
}

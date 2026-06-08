'use client';

import { Sparkles, Brain, Target, TrendingUp, Loader2 } from 'lucide-react';

interface AIInsightsProps {
  issue: any;
  solution?: any;
  loading?: boolean;
}

export default function AIInsights({ issue, solution, loading }: AIInsightsProps) {
  if (loading) {
    return (
      <div className="panel" style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '15px', padding: '40px' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-info)" />
        <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#888' }}>CORE_NEURAL_LINK: PROCESSING...</p>
      </div>
    );
  }

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={14} color="var(--accent-info)" />
          <span>EARTH INTELLIGENCE CORE ANALYSIS</span>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(6, 182, 212, 0.05)', borderLeft: '2px solid var(--accent-info)' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-info)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={12} /> AUTONOMOUS EXPLANATION
          </h4>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            {issue?.explanation || "Performing deep regional scan..."}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="panel" style={{ padding: '12px' }}>
            <h5 style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>CONFIDENCE SCORE</h5>
            <div className="data-value" style={{ fontSize: '1.2rem', color: 'var(--accent-success)' }}>
              {issue?.confidence ? (issue.confidence * 10).toFixed(1) + '%' : '94.2%'}
            </div>
          </div>
          <div className="panel" style={{ padding: '12px' }}>
            <h5 style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>RECOVERY PROJECTION</h5>
            <div className="data-value" style={{ fontSize: '1.2rem', color: 'var(--accent-warning)' }}>
              +{(Math.random() * 15 + 5).toFixed(1)}% / Mo
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>AI-GENERATED MISSION: <span style={{ color: 'var(--foreground)' }}>{solution?.title?.toUpperCase() || 'CALCULATING STRATEGY...'}</span></h4>
          <div style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '15px', lineHeight: '1.4' }}>
            {solution?.description || 'AI is formulating a step-by-step intervention plan based on current satellite telemetry.'}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {solution?.resources_needed ? (
              solution.resources_needed.map((res: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#888' }}>
                  <div style={{ width: '4px', height: '4px', background: 'var(--accent-info)' }}></div>
                  <span>{res.toUpperCase()}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#555' }}>Awaiting resource allocation...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

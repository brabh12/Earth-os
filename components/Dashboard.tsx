'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Activity, 
  AlertTriangle, 
  Globe, 
  Layers, 
  Menu, 
  Shield, 
  Users, 
  Wind,
  Droplets,
  TreePine,
  Thermometer,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIInsights from './AIInsights';
import VerificationPortal from './VerificationPortal';
import { AnomalySimulator } from '../services/AnomalySimulator';
import { supabase } from '../lib/supabase';
import { generateMissionPDF } from '../lib/pdfGenerator';

// Dynamic import for the map to avoid SSR issues
const EarthMap = dynamic(() => import('./EarthMap'), { ssr: false });

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [solution, setSolution] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>(['[SYSTEM] Earth OS initialization complete.', '[SCANNER] Global satellite downlink active.']);
  const [issues, setIssues] = useState([
    {
      id: '1',
      type: 'deforestation',
      severity: 'critical',
      latitude: -3.4653,
      longitude: -62.2159,
      explanation: 'Rapid canopy loss detected in Amazon sector 7G.',
      status: 'active'
    },
    {
      id: '2',
      type: 'water_scarcity',
      severity: 'high',
      latitude: 15.3229,
      longitude: 38.9251,
      explanation: 'Aquifer levels dropped below threshold in Eritrea.',
      status: 'active'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newIssue = AnomalySimulator.generateRandomIssue();
      setIssues(prev => [newIssue as any, ...prev].slice(0, 10));
      setSystemLogs(prev => [`[ALERT] New ${newIssue.type?.toUpperCase()} anomaly detected at ${newIssue.latitude?.toFixed(2)}, ${newIssue.longitude?.toFixed(2)}`, ...prev].slice(0, 50));
    }, 15000);

    const logInterval = setInterval(() => {
      const msg = [
        '[SENSOR] Atmospheric CO2 levels fluctuating in sector 4B',
        '[AI] Recalculating recovery projection for Amazon Basin',
        '[NETWORK] Local node 712 reporting increased soil moisture',
        '[SYSTEM] Encrypted uplink verified via Sentinel Hub'
      ][Math.floor(Math.random() * 4)];
      setSystemLogs(prev => [msg, ...prev].slice(0, 50));
    }, 4000);

    setMounted(true);
    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  const handleAIAnalysis = async (issue: any) => {
    setSelectedIssue(issue);
    setLoadingAI(true);
    setSolution(null);
    
    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue }),
      });
      const data = await res.json();
      setSolution(data);
      if (data && issue) {
        generateMissionPDF(data, issue);
        setSystemLogs(prev => [`[ALERT] AI Strategy finalized. PDF Report initiated.`, ...prev].slice(0, 50));
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setSolution({
        title: "OFFLINE PROTOCOL",
        description: "AI generation unavailable. Please verify satellite downlink and try again.",
        resources_needed: ["Manual Verification", "Emergency Kits"]
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleDownloadReport = () => {
    if (solution && selectedIssue) {
      generateMissionPDF(solution, selectedIssue);
      setSystemLogs(prev => [`[SYSTEM] PDF Report generated for mission: ${solution.title?.toUpperCase()}`, ...prev].slice(0, 50));
    }
  };

  const handleCreateMission = () => {
    if (!solution) return;
    const newMission = {
      ...solution,
      id: Math.random().toString(36).substr(2, 9),
      issue_id: selectedIssue.id,
      status: 'pending',
      volunteers: 0
    };
    setMissions(prev => [newMission, ...prev]);
    setSystemLogs(prev => [`[STRATEGY] New mission created: ${newMission.title?.toUpperCase()}`, ...prev].slice(0, 50));
    setActiveTab('missions');
  };

  const handleDeployMission = (missionId: string) => {
    setMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, status: 'deployed', volunteers: Math.floor(Math.random() * 12) + 5 } : m
    ));
    setSystemLogs(prev => [`[COMMAND] Tactical deployment confirmed for mission ID ${missionId.toUpperCase()}`, ...prev].slice(0, 50));
  };

  if (!mounted) return <div style={{ background: '#0a0a0a', height: '100vh' }} />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="panel" style={{ width: '280px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px' }}>EARTH OS</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 0' }}>
          {[
            { id: 'overview', icon: Activity, label: 'OVERVIEW' },
            { id: 'map', icon: Globe, label: 'PLANETARY MAP' },
            { id: 'issues', icon: AlertTriangle, label: 'ACTIVE ISSUES' },
            { id: 'missions', icon: Shield, label: 'MISSIONS' },
            { id: 'impact', icon: Zap, label: 'IMPACT TRACKING' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`panel-header`}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: 'none',
                borderLeft: activeTab === item.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                background: activeTab === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: activeTab === item.id ? 'var(--foreground)' : 'var(--foreground-muted)',
                marginBottom: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="panel-header" style={{ borderTop: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={16} />
            <span>2,481 VOLUNTEERS ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Header */}
        <header className="panel-header" style={{ padding: '0 20px', height: '60px', minHeight: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span className="data-value">SYSTEM STATUS: <span style={{ color: 'var(--accent-success)' }}>OPTIMAL</span></span>
            <span className="data-value" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
               USER_ROLE: <span style={{ color: 'var(--accent-info)' }}>ADMIN</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <span className="data-value" style={{ fontSize: '0.7rem', color: '#888' }}>SECURE_UPLINK: ACTIVE</span>
             <button onClick={handleLogout} className="panel" style={{ padding: '4px 12px', fontSize: '0.7rem', background: 'var(--accent-primary)', color: 'white' }}>DISCONNECT</button>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
          {activeTab === 'map' ? (
            <EarthMap 
              issues={issues} 
              onRegionSelect={(issue) => {
                setSelectedIssue(issue);
                setActiveTab('issues');
              }} 
            />
          ) : activeTab === 'impact' ? (
            <div style={{ padding: '30px' }} className="grid-bg">
              <div className="panel-header" style={{ marginBottom: '20px' }}>GLOBAL IMPACT VERIFICATION METRICS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="panel">
                  <div className="panel-header">TOTAL RECOVERED AREA</div>
                  <div style={{ padding: '20px' }}>
                    <h2 className="data-value" style={{ fontSize: '2rem' }}>14,204 KM²</h2>
                    <p style={{ color: 'var(--accent-success)', fontSize: '0.8rem' }}>+240 KM² THIS WEEK</p>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-header">CO2 SEQUESTRATION GAIN</div>
                  <div style={{ padding: '20px' }}>
                    <h2 className="data-value" style={{ fontSize: '2rem' }}>84.5 MT</h2>
                    <p style={{ color: 'var(--accent-info)', fontSize: '0.8rem' }}>AI ESTIMATED PROJECTED IMPACT</p>
                  </div>
                </div>
              </div>

              <div className="panel" style={{ marginTop: '20px' }}>
                <div className="panel-header">REGIONAL RECOVERY TRENDS (LAST 12 MONTHS)</div>
                <div style={{ padding: '40px', height: '300px', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                   {Array.from({ length: 12 }).map((_, i) => (
                     <div key={i} style={{ flex: 1, background: 'var(--accent-info)', height: `${30 + Math.random() * 50}%`, opacity: 0.8 }} />
                   ))}
                </div>
                <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#666' }}>
                   <span>JUNE 2025</span>
                   <span>DECEMBER 2025</span>
                   <span>JUNE 2026</span>
                </div>
              </div>
            </div>
          ) : activeTab === 'missions' ? (
            <div style={{ padding: '30px' }} className="grid-bg">
              <div className="panel-header" style={{ marginBottom: '20px' }}>GLOBAL INTERVENTION NETWORK / ACTIVE MISSIONS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {missions.length > 0 ? missions.map((mission) => (
                  <div key={mission.id} className="panel">
                    <div className="panel-header">MISSION: {mission.title?.toUpperCase()}</div>
                    <div style={{ padding: '20px' }}>
                      <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>{mission.description}</p>
                      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>RESOURCES ALLOCATED:</strong>
                          <ul style={{ marginTop: '5px' }}>
                            {mission.resources_needed?.map((res: string, i: number) => (
                              <li key={i}>{res}</li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: 'var(--accent-info)', fontWeight: 'bold' }}>{mission.volunteers} VOLUNTEERS</p>
                          <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>STATUS: {mission.status?.toUpperCase()}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="panel" 
                          disabled={mission.status === 'deployed'}
                          onClick={() => handleDeployMission(mission.id)}
                          style={{ 
                            flex: 1, 
                            padding: '12px', 
                            background: mission.status === 'deployed' ? 'transparent' : 'var(--accent-success)', 
                            color: mission.status === 'deployed' ? 'var(--accent-success)' : 'black', 
                            fontWeight: 'bold',
                            opacity: mission.status === 'deployed' ? 0.7 : 1,
                            borderColor: mission.status === 'deployed' ? 'var(--accent-success)' : 'transparent'
                          }}
                        >
                          {mission.status === 'deployed' ? 'DEPLOYMENT ACTIVE' : 'DEPLOY TO FIELD'}
                        </button>
                        <button className="panel" style={{ flex: 1, padding: '12px', background: 'transparent' }} onClick={() => { setSelectedIssue({ id: mission.issue_id }); setActiveTab('issues'); }}>
                          VERIFY IMPACT
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="panel" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#555' }}>NO ACTIVE MISSIONS. USE AI ANALYSIS TO GENERATE STRATEGIES.</p>
                  </div>
                )}

                <div className="panel">
                  <div className="panel-header">REAL-TIME FIELD REPORTS</div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', padding: '10px', background: '#222' }}>
                      <div style={{ width: '60px', height: '60px', background: '#333' }}></div>
                      <div>
                        <p style={{ fontSize: '0.8rem' }}><strong>Report #912</strong> - Vegetation Match</p>
                        <p style={{ fontSize: '0.7rem', color: '#888' }}>Status: AI_VERIFIED | Confidence: 98%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'issues' ? (
            <div style={{ padding: '30px' }} className="grid-bg">
              <div className="panel-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>PLANETARY ANOMALY REGISTRY</span>
                <span style={{ color: 'var(--accent-critical)' }}>{issues.length} DETECTED EVENTS</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {issues.map(issue => (
                    <motion.div 
                      key={issue.id} 
                      className="panel"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ borderLeft: `4px solid var(--accent-${issue.severity})` }}
                    >
                      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px' }}>
                        <span>ID: {issue.id.toUpperCase()} | {issue.type.toUpperCase()}</span>
                        <span style={{ color: `var(--accent-${issue.severity})`, fontSize: '0.7rem' }}>[{issue.severity.toUpperCase()}]</span>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.5' }}>{issue.explanation}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>COORD: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              className="panel" 
                              style={{ padding: '8px 16px', fontSize: '0.8rem', borderColor: selectedIssue?.id === issue.id ? 'var(--accent-info)' : 'var(--border)', background: selectedIssue?.id === issue.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent' }}
                              onClick={() => handleAIAnalysis(issue)}
                            >
                              INVOKE AI ANALYSIS
                            </button>
                            <button className="panel" style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'var(--accent-primary)', color: 'white' }} onClick={handleCreateMission}>
                              {solution && selectedIssue?.id === issue.id ? 'CONFIRM MISSION' : 'STRATEGIZE'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div style={{ position: 'sticky', top: '0' }}>
                  {selectedIssue ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="panel-header" style={{ color: 'var(--accent-info)' }}>AI COMMAND CONSOLE</div>
                      <AIInsights issue={selectedIssue} solution={solution} loading={loadingAI} onDownloadReport={handleDownloadReport} />
                      <VerificationPortal issueId={selectedIssue.id} />
                    </div>
                  ) : (
                    <div className="panel" style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                      <AlertTriangle size={48} style={{ margin: '0 auto 20px' }} />
                      <p>SELECT AN ANOMALY TO INITIATE DEEP AI ANALYSIS</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', overflowY: 'auto', height: '100%' }} className="grid-bg">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="panel">
                  <div className="panel-header">PLANETARY HEALTH INDEX</div>
                  <div style={{ padding: '20px' }}>
                    <h2 className="data-value" style={{ fontSize: '2.5rem', margin: '10px 0' }}>74.2%</h2>
                    <p style={{ color: 'var(--accent-warning)', fontSize: '0.8rem' }}>↓ 1.4% FROM LAST QUARTER</p>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-header">ACTIVE ANOMALIES</div>
                  <div style={{ padding: '20px' }}>
                    <h2 className="data-value" style={{ fontSize: '2.5rem', margin: '10px 0' }}>{issues.length}</h2>
                    <p style={{ color: 'var(--accent-critical)', fontSize: '0.8rem' }}>
                      {issues.filter(i => i.severity === 'critical').length} CRITICAL THREATS
                    </p>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-header">AI PROCESSING LOAD</div>
                  <div style={{ padding: '20px' }}>
                    <h2 className="data-value" style={{ fontSize: '2.5rem', margin: '10px 0' }}>12.4 TFLOPS</h2>
                    <p style={{ color: 'var(--accent-info)', fontSize: '0.8rem' }}>AUTONOMOUS SCANNING ENABLED</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="panel">
                  <div className="panel-header">GLOBAL SYSTEM ACTIVITY</div>
                  <div style={{ padding: '20px', height: '400px', overflowY: 'auto', background: '#080808' }}>
                    {systemLogs.map((log, i) => (
                      <div key={i} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: log.includes('[ALERT]') ? 'var(--accent-critical)' : '#777', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #111' }}>
                        <span style={{ color: 'var(--accent-info)', marginRight: '10px' }}>[{new Date().toLocaleTimeString()}]</span>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">THREAT DISTRIBUTION & RATIOS</div>
                  <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {[
                      { icon: TreePine, label: 'Deforestation', value: '45%', color: 'var(--accent-critical)' },
                      { icon: Droplets, label: 'Water Stress', value: '30%', color: 'var(--accent-warning)' },
                      { icon: Thermometer, label: 'Heat Anomalies', value: '65%', color: 'var(--accent-critical)' },
                      { icon: Wind, label: 'Air Pollution', value: '20%', color: 'var(--accent-info)' },
                    ].map((threat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <threat.icon size={20} color={threat.color} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                            <span>{threat.label}</span>
                            <span>{threat.value}</span>
                          </div>
                          <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                            <div style={{ width: threat.value, height: '100%', background: threat.color, borderRadius: '2px' }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--accent-info)', textAlign: 'center' }}>
                        GLOBAL STABILITY INDEX: <span style={{ fontWeight: 'bold' }}>74.2%</span>
                        <br/>
                        AI RECOMMENDATION: INCREASE REFORESTATION IN SECTOR 7G
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .dashboard-container {
          background: var(--background);
          color: var(--foreground);
        }
        .nasa-popup .leaflet-popup-content-wrapper {
          background: transparent;
          padding: 0;
          border: none;
          box-shadow: none;
        }
        .nasa-popup .leaflet-popup-tip {
          background: var(--surface);
        }
      `}</style>
    </div>
  );
}

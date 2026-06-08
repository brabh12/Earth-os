'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Globe, Shield, Lock, Mail } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="grid-bg" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--background)' }}>
      <div className="panel" style={{ width: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Globe size={48} color="var(--accent-primary)" style={{ marginBottom: '15px' }} />
          <h1 style={{ letterSpacing: '4px', fontSize: '1.5rem', marginBottom: '5px' }}>EARTH OS</h1>
          <p style={{ color: '#888', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>PLANETARY INTELLIGENCE NETWORK</p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            <input
              type="email"
              placeholder="TERMINAL_ID@EARTH.OS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="panel"
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0a0a0a', color: '#fff', fontFamily: 'var(--font-mono)' }}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            <input
              type="password"
              placeholder="ACCESS_CODE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="panel"
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0a0a0a', color: '#fff', fontFamily: 'var(--font-mono)' }}
              required
            />
          </div>

          {isSignUp && (
            <div style={{ position: 'relative' }}>
              <Shield size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
              <input
                type="password"
                placeholder="CONFIRM_ACCESS_CODE"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="panel"
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0a0a0a', color: '#fff', fontFamily: 'var(--font-mono)' }}
                required
              />
            </div>
          )}

          {error && (
            <div style={{ color: 'var(--accent-critical)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
              [ERROR]: {error.toUpperCase()}
            </div>
          )}

          <button 
            type="submit" 
            className="panel" 
            style={{ padding: '12px', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? 'INITIALIZING...' : (isSignUp ? 'ENROLL IN NETWORK' : 'ESTABLISH UPLINK')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ fontSize: '0.7rem', color: '#888', textDecoration: 'underline' }}
          >
            {isSignUp ? 'ALREADY ENROLLED? LOGIN' : 'NOT IN NETWORK? REGISTER'}
          </button>
        </div>
      </div>
    </div>
  );
}

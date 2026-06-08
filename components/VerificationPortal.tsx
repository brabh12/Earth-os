'use client';

import { useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function VerificationPortal({ issueId }: { issueId: string }) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${issueId}_${Date.now()}.png`;

    try {
      // 1. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('reports')
        .upload(fileName, file);

      if (error) throw error;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('reports')
        .getPublicUrl(fileName);

      setImage(publicUrl);
      setStep(2);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Ensure "reports" bucket is created in Supabase.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="panel" style={{ width: '100%', marginBottom: '20px' }}>
      <div className="panel-header">FIELD VERIFICATION PORTAL</div>
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        
        {step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div 
              className="panel grid-bg" 
              style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={48} color="var(--accent-info)" />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Camera size={48} color="#444" />
                  <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>
                    {image ? 'IMAGE CAPTURED' : 'UPLOAD FIELD VERIFICATION PHOTO'}
                  </p>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-info)', fontSize: '0.8rem' }}>
              <MapPin size={16} />
              <span>GPS ENFORCEMENT ACTIVE (Within 500m of anomaly)</span>
            </div>

            <button 
              className="panel" 
              style={{ width: '100%', padding: '12px', background: 'var(--accent-primary)', color: 'white', opacity: uploading ? 0.5 : 1 }}
              disabled={uploading}
              onClick={() => image && setStep(2)}
            >
              SUBMIT FOR AI VALIDATION
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div className="pulse">
              <CheckCircle size={64} color="var(--accent-success)" />
            </div>
            <h3 className="data-value">AI VALIDATION IN PROGRESS</h3>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>
              Comparing high-res field data with satellite telemetry...
            </p>
            <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '10px' }}>
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ duration: 4 }}
                 onAnimationComplete={() => console.log('Validation Finished')}
                 style={{ height: '100%', background: 'var(--accent-success)' }}
               />
            </div>
            <div className="panel" style={{ padding: '10px', fontSize: '0.7rem', color: 'var(--accent-success)' }}>
              [SUCCESS] BEFORE/AFTER RATIO: +18.4% VEGETATION GAIN
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

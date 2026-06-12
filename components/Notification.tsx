'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={18} color="var(--accent-success)" />,
    error: <AlertCircle size={18} color="var(--accent-critical)" />,
    info: <Info size={18} color="var(--accent-info)" />,
  };

  const colors = {
    success: 'var(--accent-success)',
    error: 'var(--accent-critical)',
    info: 'var(--accent-info)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="panel"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '320px',
        zIndex: 1000,
        overflow: 'hidden',
        borderLeft: `4px solid ${colors[type]}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="panel-header" style={{ padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icons[type]}
          <span style={{ fontSize: '0.7rem', color: colors[type] }}>
            {type.toUpperCase()} TRANSMISSION
          </span>
        </div>
        <button onClick={onClose} style={{ opacity: 0.6 }}>
          <X size={14} />
        </button>
      </div>
      <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
        <p style={{ 
          fontSize: '0.85rem', 
          fontFamily: 'var(--font-mono)', 
          lineHeight: '1.4',
          color: '#fff' 
        }}>
          {message}
        </p>
      </div>
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
        style={{ 
          height: '2px', 
          background: colors[type],
          opacity: 0.5 
        }}
      />
    </motion.div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Dashboard from '@/components/Dashboard';
import Auth from '@/components/Auth';
import Notification, { NotificationType } from '@/components/Notification';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  }, []);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT') {
        showNotification('TERMINATING UPLINK. SESSION CLOSED.', 'info');
      } else if (event === 'USER_UPDATED') {
        showNotification('USER DATA SYNCHRONIZED.', 'success');
      }

      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [showNotification]);

  if (loading) {
    return <div className="grid-bg" style={{ height: '100vh', background: '#0a0a0a' }} />;
  }

  return (
    <main>
      {session ? <Dashboard /> : <Auth onNotify={showNotification} />}
      
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

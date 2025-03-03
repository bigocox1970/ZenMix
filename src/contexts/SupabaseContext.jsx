import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize with additional options for better reliability
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'meditation-app'
    },
    fetch: (...args) => fetch(...args)
  }
});

const SupabaseContext = createContext(null);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export const SupabaseProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true); // Default to true to prevent initial errors
  const [connectionError, setConnectionError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkConnection = async () => {
    try {
      setIsRetrying(true);
      // Simple query to test connection - we'll just check if Supabase is reachable
      // without actually querying tables to avoid permission issues
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('SupabaseContext: Connection test failed:', error);
        setConnectionError(error.message);
        setIsConnected(false);
        return false;
      } else {
        console.log('SupabaseContext: Connection to Supabase successful');
        setIsConnected(true);
        setConnectionError(null);
        setRetryCount(0);
        return true;
      }
    } catch (err) {
      console.error('SupabaseContext: Error testing connection:', err);
      setConnectionError(err.message);
      setIsConnected(false);
      return false;
    } finally {
      setIsRetrying(false);
    }
  };

  // Retry connection with exponential backoff
  const retryConnection = async () => {
    if (isRetrying || retryCount >= 5) return;
    
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 second delay
    console.log(`SupabaseContext: Retrying connection in ${delay/1000} seconds...`);
    
    setRetryCount(prev => prev + 1);
    
    setTimeout(async () => {
      const success = await checkConnection();
      if (!success && retryCount < 5) {
        retryConnection();
      }
    }, delay);
  };

  useEffect(() => {
    // Check connection on mount
    checkConnection();
    
    // Set up event listeners for online/offline status
    const handleOnline = () => {
      console.log('SupabaseContext: Browser is online, checking connection...');
      checkConnection();
    };
    
    const handleOffline = () => {
      console.log('SupabaseContext: Browser is offline');
      setIsConnected(false);
      setConnectionError('Your device appears to be offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Provide connection status along with client
  const value = {
    supabase,
    isConnected,
    connectionError,
    isRetrying,
    retryConnection,
    checkConnection
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
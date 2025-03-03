import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

export const useMeditationSessions = (userId) => {
  const { supabase } = useSupabase();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setSessions(data || []);
      } catch (err) {
        console.error('Error fetching meditation sessions:', err);
        setError(err);
        // Return empty array on error
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId, supabase]);

  // Function to add a new session
  const addSession = async (sessionData) => {
    try {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert([sessionData])
        .select();
      
      if (error) throw error;
      
      // Update local state with the new session
      setSessions(prev => [data[0], ...prev]);
      return { data: data[0], error: null };
    } catch (err) {
      console.error('Error adding session:', err);
      return { data: null, error: err };
    }
  };

  return { sessions, loading, error, addSession };
};
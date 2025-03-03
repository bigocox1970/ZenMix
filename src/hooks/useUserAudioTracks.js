import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';

export const useUserAudioTracks = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch user tracks
  const fetchUserTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tracks from the database
      const { data, error: dbError } = await supabase
        .from('audio_tracks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (dbError) throw dbError;
      
      setTracks(data || []);
    } catch (err) {
      console.error('Error fetching audio tracks:', err);
      setError('Failed to load audio tracks. Please try again.');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch tracks on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUserTracks();
    } else {
      setTracks([]);
      setLoading(false);
    }
  }, [user]);
  
  return {
    tracks,
    loading,
    error,
    fetchUserTracks
  };
};

export default useUserAudioTracks;
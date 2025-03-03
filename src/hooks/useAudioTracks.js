import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';

export const useAudioTracks = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tracks from the database
      if (user) {
        const { data, error: fetchError } = await supabase
          .from('audio_tracks')
          .select('*')
          .or(`user_id.eq.${user.id},is_public.eq.true`)
          .order('created_at', { ascending: false });
          
        if (fetchError) throw fetchError;
        
        setTracks(data || []);
      } else {
        // If no user, only fetch public tracks
        const { data, error: fetchError } = await supabase
          .from('audio_tracks')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });
          
        if (fetchError) throw fetchError;
        
        setTracks(data || []);
      }
      
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
    fetchTracks();
  }, [user]);

  // Get track by ID
  const getTrackById = (id) => {
    const track = tracks.find(t => t.id === id);
    if (!track) {
      // Return empty track
      return {
        id,
        title: 'Unknown Track',
        name: 'Unknown Track',
        category: 'unknown',
        url: '',
        duration: 0
      };
    }
    return track;
  };

  return { 
    tracks,
    loading, 
    error,
    fetchTracks,
    getTrackById
  };
};

export default useAudioTracks;
import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';

export const useMixerTracks = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  const [builtInTracks, setBuiltInTracks] = useState([]);
  const [userTracks, setUserTracks] = useState([]);
  const [communityTracks, setCommunityTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tracks
  const fetchAllTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize with empty built-in tracks
      setBuiltInTracks([]);
      
      if (user) {
        // Fetch user's tracks
        const { data: userData, error: userError } = await supabase
          .from('audio_tracks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (userError) throw userError;
        
        // Add source property to user tracks
        const userTracksWithSource = (userData || []).map(track => ({
          ...track,
          source: 'user-library'
        }));
        
        setUserTracks(userTracksWithSource);
        
        // Fetch community tracks (public tracks from all users, including current user)
        const { data: communityData, error: communityError } = await supabase
          .from('audio_tracks')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });
        
        if (communityError) throw communityError;
        
        // Add source property to community tracks
        const communityTracksWithSource = (communityData || []).map(track => ({
          ...track,
          source: 'community',
          type: 'track'
        }));
        
        // Fetch public mixes for the community tab
        let publicMixesWithSource = [];
        try {
          const { data: publicMixesData, error: publicMixesError } = await supabase
            .from('mixes')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false });
            
          if (publicMixesError) {
            console.error('Error fetching public mixes:', publicMixesError);
            // Continue even if there's an error fetching mixes
          } else if (publicMixesData) {
            // Add source property to public mixes
            publicMixesWithSource = publicMixesData.map(mix => ({
              ...mix,
              source: 'community',
              type: 'mix'
            }));
          }
        } catch (err) {
          console.error('Exception fetching public mixes:', err);
          // Continue even if there's an exception
        }
        
        // Combine tracks and mixes for the community tab
        setCommunityTracks([...communityTracksWithSource, ...publicMixesWithSource]);
        
        // Fetch user tracks marked as built-in
        try {
          const { data: builtInUserData, error: builtInUserError } = await supabase
            .from('audio_tracks')
            .select('*')
            .eq('is_built_in', true)
            .order('created_at', { ascending: false });
          
          if (builtInUserError) {
            // If the error is related to the column not existing, just log it
            if (builtInUserError.message && (
                builtInUserError.message.includes("column") || 
                builtInUserError.message.includes("does not exist") ||
                builtInUserError.message.includes("is_built_in")
              )) {
              console.log('Note: Could not fetch built-in tracks. The column may not exist yet:', builtInUserError);
            } else {
              // For other errors, throw them
              throw builtInUserError;
            }
          } else if (builtInUserData && builtInUserData.length > 0) {
            // Add these to built-in tracks
            const builtInUserTracks = builtInUserData.map(track => ({
              ...track,
              source: 'built-in'
            }));
            
            setBuiltInTracks(builtInUserTracks);
          }
        } catch (err) {
          console.error('Error fetching built-in user tracks:', err);
          // Don't throw the error, just log it
        }
      }
    } catch (err) {
      console.error('Error fetching tracks for mixer:', err);
      setError('Failed to load tracks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tracks on mount and when user changes
  useEffect(() => {
    fetchAllTracks();
  }, [user]);

  // Get all tracks combined
  const getAllTracks = () => {
    // Create a map to ensure unique IDs
    const tracksMap = new Map();
    
    // Add built-in tracks to the map
    builtInTracks.forEach(track => {
      tracksMap.set(track.id, track);
    });
    
    // Add user tracks to the map
    userTracks.forEach(track => {
      tracksMap.set(track.id, track);
    });
    
    // Add community tracks to the map
    communityTracks.forEach(track => {
      tracksMap.set(track.id, track);
    });
    
    // Convert map values back to array
    return Array.from(tracksMap.values());
  };

  return {
    builtInTracks,
    userTracks,
    communityTracks,
    allTracks: getAllTracks(),
    loading,
    error,
    refreshTracks: fetchAllTracks
  };
};

export default useMixerTracks; 
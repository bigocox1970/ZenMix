import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log configuration status
console.log('Supabase URL:', supabaseUrl ? 'Configured' : 'Missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Configured' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Make sure .env file exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
};

// User profile functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { profile: data, error };
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

// Meditation sessions functions
export const saveMeditationSession = async (sessionData) => {
  const { data, error } = await supabase
    .from('meditation_sessions')
    .insert([sessionData]);
  return { data, error };
};

export const getUserSessions = async (userId) => {
  try {
    if (!userId) {
      return { sessions: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('meditation_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    return { sessions: data || [], error };
  } catch (err) {
    console.error('Error in getUserSessions:', err);
    return { sessions: [], error: err };
  }
};

// Audio tracks functions
export const getAudioTracks = async () => {
  try {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*');
      
    // If no tracks or error, return sample tracks
    if (error || !data || data.length === 0) {
      const sampleTracks = [
        { id: 'rain', name: 'Rain', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
        { id: 'forest', name: 'Forest', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
        { id: 'waves', name: 'Ocean Waves', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' },
        { id: 'fire', name: 'Crackling Fire', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3' },
        { id: 'piano', name: 'Gentle Piano', category: 'music', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3' },
        { id: 'meditation', name: 'Guided Meditation', category: 'voice', url: 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3' },
        { id: 'binaural', name: 'Binaural Beats', category: 'beats', url: 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3' },
      ];
      return { tracks: sampleTracks, error: null };
    }
    
    return { tracks: data, error: null };
  } catch (err) {
    console.error('Error in getAudioTracks:', err);
    // Return sample tracks on error
    const sampleTracks = [
      { id: 'rain', name: 'Rain', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
      { id: 'forest', name: 'Forest', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
      { id: 'waves', name: 'Ocean Waves', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' },
      { id: 'fire', name: 'Crackling Fire', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3' },
      { id: 'piano', name: 'Gentle Piano', category: 'music', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3' },
      { id: 'meditation', name: 'Guided Meditation', category: 'voice', url: 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3' },
      { id: 'binaural', name: 'Binaural Beats', category: 'beats', url: 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3' },
    ];
    return { tracks: sampleTracks, error: null };
  }
};

export const uploadAudioFile = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('audio')
    .upload(path, file);
  return { data, error };
};
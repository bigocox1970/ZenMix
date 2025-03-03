import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// These will be populated when you connect to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { sessions: data, error };
};

// Audio tracks functions
export const getAudioTracks = async () => {
  const { data, error } = await supabase
    .from('audio_tracks')
    .select('*');
  return { tracks: data, error };
};

export const uploadAudioFile = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('audio')
    .upload(path, file);
  return { data, error };
};
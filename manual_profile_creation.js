// This script can be used to manually create a profile for a user
// if the trigger approach doesn't work due to permission issues

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to manually create a profile for a user
export async function createProfileForUser(userId, email) {
  try {
    // First check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', checkError);
      return { success: false, error: checkError };
    }
    
    // If profile already exists, return it
    if (existingProfile) {
      console.log('Profile already exists');
      return { success: true, data: existingProfile };
    }
    
    // Create new profile
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { id: userId, email: email }
      ])
      .select();
    
    if (error) {
      console.error('Error creating profile:', error);
      return { success: false, error };
    }
    
    console.log('Profile created successfully');
    return { success: true, data };
  } catch (err) {
    console.error('Exception creating profile:', err);
    return { success: false, error: err };
  }
}

// Function to ensure all users have profiles
export async function ensureAllUsersHaveProfiles() {
  try {
    // Get all authenticated users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      return { success: false, error: authError };
    }
    
    // Get all existing profiles
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');
      
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return { success: false, error: profilesError };
    }
    
    // Create a set of existing profile IDs for quick lookup
    const existingProfileIds = new Set(existingProfiles.map(p => p.id));
    
    // Create profiles for users who don't have one
    const profileCreationPromises = authUsers.users
      .filter(user => !existingProfileIds.has(user.id))
      .map(user => createProfileForUser(user.id, user.email));
    
    const results = await Promise.all(profileCreationPromises);
    
    return {
      success: true,
      created: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      total: authUsers.users.length
    };
  } catch (err) {
    console.error('Exception ensuring profiles:', err);
    return { success: false, error: err };
  }
}

// Example usage:
// createProfileForUser('user-uuid-here', 'user-email@example.com');
// ensureAllUsersHaveProfiles();
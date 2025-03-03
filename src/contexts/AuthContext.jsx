import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabase } from './SupabaseContext';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { supabase } = useSupabase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  // Auth functions
  const signUp = async (email, password) => {
    console.log('AuthContext: signUp called with email:', email);
    try {
      console.log('AuthContext: Calling supabase.auth.signUp');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('AuthContext: signUp response:', { data, error });
      
      if (error) {
        console.error('AuthContext: Supabase signUp error:', error);
        throw error;
      }
      
      // If successful, check if profile exists, if not create one
      if (data?.user) {
        console.log('AuthContext: User created, checking/creating profile for user ID:', data.user.id);
        try {
          // First check if profile exists
          const { data: profileData, error: profileCheckError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileCheckError && profileCheckError.code !== 'PGRST116') {
            // If error is not "no rows returned", log it
            console.error('AuthContext: Error checking profile:', profileCheckError);
          }
          
          if (!profileData) {
            // Profile doesn't exist, create one
            console.log('AuthContext: No profile found, creating one');
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ id: data.user.id, email: email }]);
            
            if (profileError) {
              // If error is duplicate key, that's fine - profile already exists
              if (profileError.code === '23505') {
                console.log('AuthContext: Profile already exists (created by trigger)');
              } else {
                console.error('AuthContext: Error creating profile:', profileError);
              }
            } else {
              console.log('AuthContext: Profile created successfully');
            }
          } else {
            console.log('AuthContext: Profile already exists:', profileData);
          }
        } catch (profileErr) {
          console.error('AuthContext: Exception handling profile:', profileErr);
        }
      } else {
        console.log('AuthContext: No user in signUp response data:', data);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('AuthContext: Exception in signUp:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    console.log('AuthContext: signIn called with email:', email);
    try {
      console.log('AuthContext: Calling supabase.auth.signInWithPassword');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('AuthContext: signIn response:', { data, error });
      
      if (error) {
        console.error('AuthContext: Supabase signIn error:', error);
        throw error;
      }
      
      // Check if profile exists, if not create one
      if (data?.user) {
        console.log('AuthContext: User authenticated, checking profile for user ID:', data.user.id);
        try {
          // Check if profile exists
          const { data: profileData, error: profileCheckError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileCheckError || !profileData) {
            console.log('AuthContext: Profile not found, creating one');
            // Profile doesn't exist, create one
            const { error: profileCreateError } = await supabase
              .from('profiles')
              .insert([{ id: data.user.id, email: email }]);
              
            if (profileCreateError) {
              console.error('AuthContext: Error creating profile on login:', profileCreateError);
            } else {
              console.log('AuthContext: Profile created successfully on login');
            }
          } else {
            console.log('AuthContext: Existing profile found:', profileData);
          }
        } catch (profileErr) {
          console.error('AuthContext: Exception handling profile on login:', profileErr);
        }
      } else {
        console.log('AuthContext: No user in signIn response data:', data);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('AuthContext: Exception in signIn:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

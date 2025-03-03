import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { supabase } = useSupabase();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching admin status:', error);
          setError(error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.is_admin || false);
        }
      } catch (err) {
        console.error('Error in admin check:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, supabase]);

  return {
    isAdmin,
    loading,
    error
  };
};

export default useAdmin;
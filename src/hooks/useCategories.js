import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

export const useCategories = () => {
  const { supabase } = useSupabase();
  const [soundCategories, setSoundCategories] = useState([]);
  const [mixCategories, setMixCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sound categories
        const { data: soundData, error: soundError } = await supabase
          .from('sound_categories')
          .select('*')
          .order('name');

        if (soundError) throw soundError;

        // Fetch mix categories
        const { data: mixData, error: mixError } = await supabase
          .from('mix_categories')
          .select('*')
          .order('name');

        if (mixError) throw mixError;

        // If no categories found, use default categories
        const defaultSoundCategories = [
          { id: 'nature', name: 'Nature', slug: 'nature', description: 'Natural ambient sounds' },
          { id: 'music', name: 'Music', slug: 'music', description: 'Calming music' },
          { id: 'voice', name: 'Voice', slug: 'voice', description: 'Guided meditations' },
          { id: 'beats', name: 'Beats', slug: 'beats', description: 'Binaural beats' },
          { id: 'uploads', name: 'Uploads', slug: 'uploads', description: 'Your uploads' }
        ];

        const defaultMixCategories = [
          { id: 'sleep', name: 'Sleep', slug: 'sleep', description: 'Sleep mixes' },
          { id: 'focus', name: 'Focus', slug: 'focus', description: 'Focus mixes' },
          { id: 'relax', name: 'Relax', slug: 'relax', description: 'Relaxation mixes' },
          { id: 'meditate', name: 'Meditate', slug: 'meditate', description: 'Meditation mixes' },
          { id: 'my-mixes', name: 'My Mixes', slug: 'my-mixes', description: 'Your mixes' }
        ];

        setSoundCategories(soundData?.length > 0 ? soundData : defaultSoundCategories);
        setMixCategories(mixData?.length > 0 ? mixData : defaultMixCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        
        // Use default categories as fallback
        setSoundCategories([
          { id: 'nature', name: 'Nature', slug: 'nature', description: 'Natural ambient sounds' },
          { id: 'music', name: 'Music', slug: 'music', description: 'Calming music' },
          { id: 'voice', name: 'Voice', slug: 'voice', description: 'Guided meditations' },
          { id: 'beats', name: 'Beats', slug: 'beats', description: 'Binaural beats' },
          { id: 'uploads', name: 'Uploads', slug: 'uploads', description: 'Your uploads' }
        ]);
        
        setMixCategories([
          { id: 'sleep', name: 'Sleep', slug: 'sleep', description: 'Sleep mixes' },
          { id: 'focus', name: 'Focus', slug: 'focus', description: 'Focus mixes' },
          { id: 'relax', name: 'Relax', slug: 'relax', description: 'Relaxation mixes' },
          { id: 'meditate', name: 'Meditate', slug: 'meditate', description: 'Meditation mixes' },
          { id: 'my-mixes', name: 'My Mixes', slug: 'my-mixes', description: 'Your mixes' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [supabase]);

  return {
    soundCategories,
    mixCategories,
    loading,
    error
  };
};

export default useCategories;
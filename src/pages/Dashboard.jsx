import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentSessions from '../components/dashboard/RecentSessions';
import Recommendations from '../components/dashboard/Recommendations';
import { useMeditationSessions } from '../hooks/useMeditationSessions';
import { useAudioTracks } from '../hooks/useAudioTracks';
import MobileNavigation from '../components/MobileNavigation';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const { sessions, loading: sessionsLoading } = useMeditationSessions(user?.id);
  const { tracks, loading: tracksLoading } = useAudioTracks();
  
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const loading = sessionsLoading || tracksLoading || profileLoading;

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user, supabase]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get user's display name
  const getDisplayName = () => {
    if (profile?.nickname) return profile.nickname;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    return user?.email?.split('@')[0] || 'there';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Max width container for tablet size */}
      <div className="mx-auto max-w-3xl bg-black min-h-screen relative">
        <DashboardHeader user={user} onLogout={handleLogout} />
        
        <main className="pt-16 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">
              {getGreeting()}, {getDisplayName()}!
            </h1>
            
            <DashboardStats sessions={sessions} />
            
            <div className="grid grid-cols-1 gap-8 mb-8">
              <RecentSessions sessions={sessions} />
              <Recommendations />
            </div>
          </div>
        </main>
        
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Dashboard;
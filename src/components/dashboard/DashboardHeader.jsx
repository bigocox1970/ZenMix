import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Link } from 'react-router-dom';

const DashboardHeader = ({ user, onLogout }) => {
  const { supabase } = useSupabase();
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('nickname, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user, supabase]);

  const getDisplayName = () => {
    if (profile?.nickname) return profile.nickname;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="py-4 flex justify-between items-center">
      <Link to="/dashboard" className="flex items-center space-x-2">
        <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
        <span className="text-white font-semibold text-xl">
          ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span>
        </span>
      </Link>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-gray-300 hidden md:block">{getDisplayName()}</span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-dark border border-gray-700 rounded-lg shadow-lg py-1 z-50">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800"
                onClick={() => setShowDropdown(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import AppLayout from '../components/AppLayout';

const UserProfilePage = () => {
  const { user, signOut } = useAuth();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    email: '',
    defaultDuration: 10,
    preferredVoice: 'female',
    preferredBackground: 'nature',
    notifications: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            nickname: data.nickname || '',
            avatar: data.avatar_url || '',
            email: user.email || '',
            defaultDuration: data.default_duration || 10,
            preferredVoice: data.preferred_voice || 'female',
            preferredBackground: data.preferred_background || 'nature',
            notifications: data.notifications !== false
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({
          text: 'Error loading profile data',
          type: 'error'
        });
      }
    };
    
    fetchProfile();
  }, [user, navigate, supabase]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please select an image file', type: 'error' });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: 'Image must be less than 2MB', type: 'error' });
      return;
    }
    
    setAvatarFile(file);
    // Create preview URL
    setFormData(prev => ({
      ...prev,
      avatar: URL.createObjectURL(file)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      let avatarUrl = formData.avatar;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl;
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          nickname: formData.nickname,
          avatar_url: avatarUrl,
          default_duration: formData.defaultDuration,
          preferred_voice: formData.preferredVoice,
          preferred_background: formData.preferredBackground,
          notifications: formData.notifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  };
  
  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <main className="pt-16 pb-32">
        <div className="px-4">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Your Profile</h1>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
              {message.text}
            </div>
          )}
          
          <div className="bg-card rounded-xl p-8 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Avatar</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        {formData.avatar ? (
                          <img 
                            src={formData.avatar} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="gradient-button cursor-pointer inline-block"
                      >
                        Change Avatar
                      </label>
                      <p className="text-sm text-gray-400 mt-1">Max size: 2MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="nickname" className="block text-gray-300 mb-2">Nickname</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter your nickname"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    disabled
                  />
                  <p className="text-sm text-gray-400 mt-1">Email cannot be changed</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Meditation Preferences</h2>
                
                <div className="mb-4">
                  <label htmlFor="defaultDuration" className="block text-gray-300 mb-2">Default Meditation Duration (minutes)</label>
                  <select
                    id="defaultDuration"
                    name="defaultDuration"
                    value={formData.defaultDuration}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="preferredVoice" className="block text-gray-300 mb-2">Preferred Voice Type</label>
                  <select
                    id="preferredVoice"
                    name="preferredVoice"
                    value={formData.preferredVoice}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="neutral">Gender Neutral</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="preferredBackground" className="block text-gray-300 mb-2">Preferred Background Sound</label>
                  <select
                    id="preferredBackground"
                    name="preferredBackground"
                    value={formData.preferredBackground}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="nature">Nature Sounds</option>
                    <option value="rain">Rain</option>
                    <option value="ocean">Ocean Waves</option>
                    <option value="whitenoise">White Noise</option>
                    <option value="binaural">Binaural Beats</option>
                    <option value="silence">Silence</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Analytics & Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Meditation Stats</h3>
                    <p className="text-gray-400 text-sm mb-4">View your meditation progress and insights</p>
                    <button
                      type="button"
                      onClick={() => navigate('/analytics')}
                      className="text-primary hover:text-primary-dark"
                    >
                      View Analytics →
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium mb-2">App Settings</h3>
                    <p className="text-gray-400 text-sm mb-4">Configure app behavior and preferences</p>
                    <button
                      type="button"
                      className="text-primary hover:text-primary-dark"
                    >
                      Open Settings →
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="mr-3 h-5 w-5 accent-primary"
                  />
                  <label htmlFor="notifications" className="text-gray-300">Enable daily meditation reminders</label>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="gradient-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default UserProfilePage;
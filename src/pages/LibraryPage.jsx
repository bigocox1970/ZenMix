import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/AppLayout';
import AudioLibrary from '../components/AudioLibrary';
import UserAudioLibrary from '../components/UserAudioLibrary';
import MyMixes from '../components/MyMixes';
import MediaPlayer from '../components/MediaPlayer';
import { Music, Headphones, Users } from 'lucide-react';

const LibraryPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeMainCategory, setActiveMainCategory] = useState('built-in');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  
  // Handle track selection from child components
  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setShowPlayer(true);
  };
  
  // Handle player close
  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedTrack(null);
  };

  // Handle navigation to uploads tab
  const handleUploadClick = () => {
    if (user) {
      setActiveMainCategory('my-library');
      setActiveSubCategory('my-audio');
    } else {
      navigate('/login');
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

  // Handle category selection
  const handleCategorySelect = (main, sub) => {
    setActiveMainCategory(main);
    setActiveSubCategory(sub);
  };

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <main className="pt-16 pb-32">
        <div className="px-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold gradient-text">Audio Library</h1>
            <p className="text-gray-300 mt-2">
              Explore our collection of meditation sounds, music, and guided sessions.
            </p>
          </div>
          
          {/* Main Categories */}
          <div className="mb-4">
            <div className="flex space-x-4 border-b border-gray-700">
              <button
                className={`flex items-center space-x-2 py-3 px-4 ${activeMainCategory === 'built-in' ? 'border-b-2 border-primary text-white font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => handleCategorySelect('built-in', activeMainCategory === 'built-in' ? activeSubCategory : 'all')}
              >
                <Music size={18} />
                <span>Built-in Sounds</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-3 px-4 ${activeMainCategory === 'my-library' ? 'border-b-2 border-primary text-white font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => {
                  if (user) {
                    handleCategorySelect('my-library', activeMainCategory === 'my-library' ? activeSubCategory : 'my-mixes');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <Headphones size={18} />
                <span>My Library</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-3 px-4 ${activeMainCategory === 'community' ? 'border-b-2 border-primary text-white font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => handleCategorySelect('community', activeMainCategory === 'community' ? activeSubCategory : 'popular')}
              >
                <Users size={18} />
                <span>Community</span>
              </button>
            </div>
          </div>
          
          {/* Sub Categories */}
          <div className="mb-8">
            {activeMainCategory === 'built-in' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'nature' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('nature')}
                >
                  Nature
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'music' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('music')}
                >
                  Music
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'beats' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('beats')}
                >
                  Beats
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'voice' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('voice')}
                >
                  Voice Guided
                </button>
              </div>
            )}
            
            {activeMainCategory === 'my-library' && user && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'my-audio' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('my-audio')}
                >
                  My Uploads
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'my-mixes' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('my-mixes')}
                >
                  My Mixes
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'favorites' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('favorites')}
                >
                  Favorites
                </button>
              </div>
            )}
            
            {activeMainCategory === 'community' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'popular' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('popular')}
                >
                  Popular
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'recent' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('recent')}
                >
                  Recent
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${activeSubCategory === 'featured' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveSubCategory('featured')}
                >
                  Featured
                </button>
              </div>
            )}
          </div>
          
          {/* Content based on active categories */}
          {activeMainCategory === 'my-library' && activeSubCategory === 'my-mixes' ? (
            user ? (
              <MyMixes />
            ) : (
              <div className="text-center py-12 bg-card rounded-xl">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-1">Sign in required</h3>
                <p className="text-gray-500 mb-4">Please sign in to view your mixes</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="gradient-button"
                >
                  Sign In
                </button>
              </div>
            )
          ) : activeMainCategory === 'my-library' && activeSubCategory === 'my-audio' ? (
            user ? (
              <UserAudioLibrary onTrackSelect={handleTrackSelect} />
            ) : (
              <div className="text-center py-12 bg-card rounded-xl">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-1">Sign in required</h3>
                <p className="text-gray-500 mb-4">Please sign in to manage your audio tracks</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="gradient-button"
                >
                  Sign In
                </button>
              </div>
            )
          ) : (
            <AudioLibrary 
              category={activeSubCategory}
              onTrackSelect={handleTrackSelect}
              onUploadClick={handleUploadClick}
            />
          )}
          
          {/* Create Custom Mix CTA */}
          <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-primary/30 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Create Your Own Mix</h2>
                <p className="text-gray-300 max-w-xl">
                  Combine multiple sounds to create your perfect meditation environment.
                </p>
              </div>
              <button 
                onClick={() => navigate('/mixer')}
                className="gradient-button"
              >
                Open Audio Mixer
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {showPlayer && selectedTrack && (
        <MediaPlayer
          track={selectedTrack}
          onClose={handleClosePlayer}
        />
      )}
    </AppLayout>
  );
};

export default LibraryPage;
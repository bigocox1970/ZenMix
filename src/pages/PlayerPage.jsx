import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import MediaPlayer from '../components/MediaPlayer';

const PlayerPage = () => {
  const { user } = useAuth();
  const { tracks, loading, error } = useAudioTracks();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Set the first track as the current track when tracks are loaded
  useEffect(() => {
    if (tracks && tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0]);
      setShowPlayer(true);
    }
  }, [tracks, currentTrack]);

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  return (
    <>
      <Header isLoggedIn={!!user} />
      <main className="pt-24 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 gradient-text">Audio Player</h1>
            <p className="text-gray-300 mb-8">
              Play and enjoy your favorite audio tracks.
            </p>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 text-center">
                <p className="text-red-400">Error loading audio tracks. Please try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Track Selection */}
                <div className="bg-card rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Available Tracks</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {tracks.map((track) => (
                      <div
                        key={track.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentTrack && currentTrack.id === track.id
                            ? 'bg-primary/20 border border-primary/30'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        onClick={() => handleTrackSelect(track)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center ${getCategoryColor(track.category)}`}>
                            {getCategoryIcon(track.category)}
                          </div>
                          <div>
                            <h3 className="font-medium">{track.name}</h3>
                            <span className="text-xs text-gray-400">{track.category}</span>
                          </div>
                          {currentTrack && currentTrack.id === track.id && (
                            <div className="ml-auto">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player Info */}
                <div className="bg-card rounded-xl p-6">
                  {currentTrack ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
                      <div className="flex flex-col items-center">
                        <div className={`w-32 h-32 rounded-lg mb-4 flex items-center justify-center ${getCategoryColor(currentTrack.category)}`}>
                          {getCategoryIcon(currentTrack.category, 'w-16 h-16')}
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{currentTrack.name}</h3>
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm mb-6">
                          {currentTrack.category}
                        </span>
                        <p className="text-gray-400 text-center mb-6">
                          Use the player controls below to adjust volume, seek through the track, or pause playback.
                        </p>
                        <div className="w-full max-w-sm">
                          <button
                            onClick={() => setShowPlayer(true)}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Play Track
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <h3 className="text-xl font-medium text-gray-400 mb-1">No Track Selected</h3>
                      <p className="text-gray-500 text-center">
                        Select a track from the list to start playing
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showPlayer && currentTrack && (
        <MediaPlayer track={currentTrack} onClose={handleClosePlayer} />
      )}

      <Footer />
    </>
  );
};

// Helper functions for category colors and icons
const getCategoryColor = (category) => {
  const colors = {
    nature: 'bg-green-900/50',
    music: 'bg-blue-900/50',
    voice: 'bg-yellow-900/50',
    beats: 'bg-purple-900/50',
    default: 'bg-gray-800'
  };
  return colors[category] || colors.default;
};

const getCategoryIcon = (category, className = 'w-6 h-6') => {
  switch (category) {
    case 'nature':
      return (
        <svg className={`${className} text-green-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z" />
        </svg>
      );
    case 'music':
      return (
        <svg className={`${className} text-blue-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      );
    case 'voice':
      return (
        <svg className={`${className} text-yellow-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
        </svg>
      );
    case 'beats':
      return (
        <svg className={`${className} text-purple-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
        </svg>
      );
    default:
      return (
        <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
        </svg>
      );
  }
};

export default PlayerPage;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Howl } from 'howler';
import Header from '../components/Header';

const TestPlayer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tracks, loading, error: tracksError } = useAudioTracks();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize or update Howl instance when track changes
  useEffect(() => {
    if (!selectedTrack?.url) return;

    try {
      // Stop and unload previous sound
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }

      // Create new Howl instance with CORS settings
      soundRef.current = new Howl({
        src: [selectedTrack.url],
        html5: true, // Force HTML5 Audio for streaming
        format: ['mp3', 'wav', 'ogg'], // Support multiple formats
        xhr: {
          method: 'GET',
          headers: {
            'Origin': window.location.origin,
            'Range': 'bytes=0-',
          },
          withCredentials: false
        },
        onload: () => {
          setDuration(soundRef.current.duration());
          setError(null);
          console.log('Audio loaded successfully');
        },
        onloaderror: (id, err) => {
          console.error('Error loading audio:', err);
          setError('Failed to load audio file. Please try again.');
          setIsPlaying(false);
        },
        onplayerror: (id, err) => {
          console.error('Error playing audio:', err);
          setError('Failed to play audio file. Please try again.');
          setIsPlaying(false);
        },
        onend: () => {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      });

      // Start time update interval if playing
      if (isPlaying) {
        soundRef.current.play();
      }

      return () => {
        if (soundRef.current) {
          soundRef.current.unload();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } catch (err) {
      console.error('Error initializing audio:', err);
      setError('Failed to initialize audio player');
    }
  }, [selectedTrack?.url]);

  // Update time display
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isPlaying && soundRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(soundRef.current.seek());
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    
    try {
      if (isPlaying) {
        soundRef.current.pause();
        setIsPlaying(false);
      } else {
        setError(null);
        soundRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error toggling play:', err);
      setError('Failed to play audio');
      setIsPlaying(false);
    }
  };

  const handleTrackSelect = (track) => {
    // Stop current playback
    if (soundRef.current) {
      soundRef.current.stop();
    }
    
    setSelectedTrack(track);
    setError(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Format time display
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header isLoggedIn={!!user} />
      <main className="pt-24 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold gradient-text">Test Player</h1>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Dashboard
              </button>
            </div>

            {tracksError && (
              <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 mb-8 text-red-400">
                Error loading tracks: {tracksError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Track Selection */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Available Tracks</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTrack?.id === track.id
                          ? 'bg-primary/20 border border-primary/30'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => handleTrackSelect(track)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{track.name || track.title}</h3>
                          <span className="text-sm text-gray-400">{track.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player */}
              <div className="bg-card rounded-xl p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                    {selectedTrack ? (
                      <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                    {selectedTrack?.name || selectedTrack?.title || 'Select a Track'}
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {selectedTrack?.category || 'Choose from the list'}
                  </p>

                  {selectedTrack && (
                    <>
                      <div className="w-full mb-4">
                        <div className="h-1 bg-gray-800 rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      <button
                        onClick={togglePlay}
                        className="p-4 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                    </>
                  )}

                  {error && (
                    <div className="mt-4 text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {selectedTrack && (
                    <div className="mt-6 text-center text-sm text-gray-400">
                      <p>Now playing from URL:</p>
                      <p className="break-all mt-1">{selectedTrack.url}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TestPlayer;
import React, { useState, useRef } from 'react';

const AudioTest = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(new Audio());
  
  // Sample track from our bucket
  const testTrack = {
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3',
    title: 'Rain Sounds',
    category: 'nature'
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Reset any previous errors
        setError(null);
        
        // Set the source if not already set
        if (audioRef.current.src !== testTrack.url) {
          audioRef.current.src = testTrack.url;
        }
        
        // Play the audio
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Playback error:', err);
            setError('Failed to play audio. Please try again.');
            setIsPlaying(false);
          });
      }
    } catch (err) {
      console.error('Toggle play error:', err);
      setError('An error occurred. Please try again.');
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Audio Test Player</h2>
      
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium mb-2">{testTrack.title}</h3>
        <p className="text-gray-400 mb-4">{testTrack.category}</p>
        
        <button
          onClick={togglePlay}
          className="gradient-button mb-4"
        >
          {isPlaying ? (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pause
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Play
            </span>
          )}
        </button>
        
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Testing audio playback from Supabase storage bucket</p>
          <p className="mt-1">URL: {testTrack.url}</p>
        </div>
      </div>
    </div>
  );
};

export default AudioTest;
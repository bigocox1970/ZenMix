import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

const AudioPlayer = ({ track, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const soundRef = useRef(null);
  
  // Initialize or update Howl instance when track changes
  useEffect(() => {
    if (!track?.url) {
      setError('No audio source provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create new Howl instance
      soundRef.current = new Howl({
        src: [track.url],
        html5: true, // Force HTML5 Audio for better streaming
        format: ['mp3', 'wav', 'ogg', 'm4a'], // Support multiple formats
        volume: volume,
        onload: () => {
          setDuration(soundRef.current.duration());
          setIsLoading(false);
          setError(null);
        },
        onloaderror: (id, err) => {
          console.error('Error loading audio:', err);
          setError('Unable to load audio file. Please try a different format.');
          setIsLoading(false);
          setIsPlaying(false);
        },
        onplayerror: (id, err) => {
          console.error('Error playing audio:', err);
          setError('Unable to play audio file. Please try again.');
          setIsPlaying(false);
        },
        onend: () => {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      });

      // Update time
      const interval = setInterval(() => {
        if (soundRef.current && isPlaying) {
          setCurrentTime(soundRef.current.seek());
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        if (soundRef.current) {
          soundRef.current.unload();
        }
      };
    } catch (err) {
      console.error('Error initializing audio:', err);
      setError('Failed to initialize audio player');
      setIsLoading(false);
    }
  }, [track?.url]);

  // Update volume
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Play/Pause
  const togglePlay = () => {
    if (!soundRef.current || isLoading) return;
    
    try {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        setError(null);
        soundRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Error toggling play:', err);
      setError('Failed to play audio');
      setIsPlaying(false);
    }
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Seek
  const handleSeek = (e) => {
    if (!soundRef.current || isLoading) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    
    soundRef.current.seek(seekTime);
    setCurrentTime(seekTime);
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-black border-t border-gray-800 p-4 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <div className="font-medium">{track?.name || track?.title || 'Unknown Track'}</div>
            <div className="text-sm text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-primary"
            />
          </div>
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="gradient-button px-4 py-2"
          >
            {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div 
        className="max-w-3xl mx-auto mt-2 h-1 bg-gray-800 rounded-full cursor-pointer"
        onClick={handleSeek}
      >
        <div 
          className="h-full bg-primary rounded-full"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AudioPlayer;
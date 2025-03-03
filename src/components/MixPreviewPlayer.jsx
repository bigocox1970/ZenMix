import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

const MixPreviewPlayer = ({ tracks, isPlaying, onPlayingChange }) => {
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const soundsRef = useRef(new Map());
  const loadingRef = useRef(new Set());

  // Initialize or update Howl instances when tracks change
  useEffect(() => {
    const newSounds = new Map();
    let hasError = false;

    // Create Howl instances for new tracks
    tracks.forEach(track => {
      try {
        // Skip if already loading this track
        if (loadingRef.current.has(track.id)) {
          return;
        }

        // Reuse existing Howl instance if available
        if (soundsRef.current.has(track.id)) {
          newSounds.set(track.id, soundsRef.current.get(track.id));
          return;
        }

        // Validate URL
        if (!track.url) {
          console.error(`Missing URL for track: ${track.title || track.name}`);
          hasError = true;
          setError('One or more tracks have invalid URLs. Please try different tracks.');
          return;
        }

        // Start loading new track
        loadingRef.current.add(track.id);
        console.log('Loading track:', track.title || track.name);

        const sound = new Howl({
          src: [track.url],
          html5: true, // Force HTML5 Audio for streaming
          format: ['mp3', 'wav', 'ogg', 'm4a'], // Support multiple formats
          preload: true,
          loop: true,
          volume: track.volume || 0.7,
          onload: () => {
            console.log('Track loaded successfully:', track.title || track.name);
            loadingRef.current.delete(track.id);
          },
          onloaderror: (id, err) => {
            console.error(`Failed to load track: ${track.title || track.name}`, err);
            loadingRef.current.delete(track.id);
            hasError = true;
            setError('Unable to load one or more tracks. Please try different audio formats.');
            onPlayingChange(false);
          },
          onplayerror: (id, err) => {
            console.error(`Failed to play track: ${track.title || track.name}`, err);
            hasError = true;
            setError('Unable to play one or more tracks. Please try again.');
            onPlayingChange(false);
          }
        });

        newSounds.set(track.id, sound);
      } catch (err) {
        console.error(`Error creating Howl instance for track: ${track.id}`, err);
        hasError = true;
        setError('Failed to initialize one or more tracks. Please try again.');
        onPlayingChange(false);
      }
    });

    // Stop and unload removed tracks
    soundsRef.current.forEach((sound, id) => {
      if (!tracks.find(t => t.id === id)) {
        sound.stop();
        sound.unload();
      }
    });

    if (!hasError) {
      setError(null);
    }

    // Update ref
    soundsRef.current = newSounds;

    // Cleanup on unmount
    return () => {
      soundsRef.current.forEach(sound => {
        sound.stop();
        sound.unload();
      });
      soundsRef.current.clear();
      loadingRef.current.clear();
    };
  }, [tracks]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      let canPlay = true;

      // Check if any tracks are still loading
      if (loadingRef.current.size > 0) {
        console.log('Waiting for tracks to load:', Array.from(loadingRef.current));
        canPlay = false;
      }

      if (canPlay) {
        setError(null);
        soundsRef.current.forEach(sound => {
          try {
            sound.play();
          } catch (err) {
            console.error('Error playing sound:', err);
            setError('Failed to play one or more tracks. Please try again.');
            onPlayingChange(false);
          }
        });
      } else {
        setError('Please wait for all tracks to load...');
        onPlayingChange(false);
      }
    } else {
      soundsRef.current.forEach(sound => {
        try {
          sound.pause();
        } catch (err) {
          console.error('Error pausing sound:', err);
        }
      });
    }
  }, [isPlaying]);

  // Update volumes when tracks change
  useEffect(() => {
    tracks.forEach(track => {
      const sound = soundsRef.current.get(track.id);
      if (sound) {
        sound.volume(track.volume);
      }
    });
  }, [tracks]);

  // Update timer
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-black border-t border-gray-800 p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Preview Mix</div>
            <div className="text-sm text-gray-400">{formatTime(currentTime)}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={() => onPlayingChange(!isPlaying)}
            className="gradient-button px-4 py-2"
            disabled={loadingRef.current.size > 0}
          >
            {loadingRef.current.size > 0 ? 'Loading...' : isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MixPreviewPlayer;
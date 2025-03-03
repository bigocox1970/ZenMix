import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for audio playback functionality
 * @param {Array} tracks - Array of track objects with url, title, etc.
 * @returns {Object} - Media player state and controls
 */
export const useMediaPlayer = (initialTracks = []) => {
  const [tracks, setTracks] = useState(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Event listeners
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('error', handleError);
      
      // Set initial volume
      audioRef.current.volume = volume;
    }
    
    // Load first track if tracks are available
    if (tracks.length > 0) {
      loadTrack(currentTrackIndex);
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current = null;
      }
    };
  }, [tracks]); // Only re-run if tracks array changes
  
  // Update audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Handle metadata loaded
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setError(null);
    }
  };
  
  // Handle track end
  const handleTrackEnd = () => {
    if (currentTrackIndex < tracks.length - 1) {
      // Play next track if not the last one
      handleNext();
    } else {
      // Stop playback if it's the last track
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };
  
  // Handle audio errors
  const handleError = (e) => {
    console.error('Audio playback error:', e);
    setError('Failed to load audio file. Please try again.');
    setIsPlaying(false);
  };
  
  // Update progress
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Load track
  const loadTrack = (index) => {
    if (tracks[index]) {
      if (audioRef.current) {
        const wasPlaying = isPlaying;
        
        // Pause current playback
        audioRef.current.pause();
        
        // Set new source
        audioRef.current.src = tracks[index].url;
        audioRef.current.load();
        
        // Update state
        setCurrentTrackIndex(index);
        setCurrentTime(0);
        setError(null);
        
        // Resume playback if it was playing
        if (wasPlaying) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(handleError);
        }
      }
    }
  };
  
  // Play/Pause
  const togglePlay = () => {
    if (!audioRef.current || !tracks.length) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(handleError);
    }
  };
  
  // Previous track
  const handlePrevious = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(newIndex);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(handleError);
    }
  };
  
  // Next track
  const handleNext = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(newIndex);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(handleError);
    }
  };
  
  // Seek to position
  const handleSeek = (e, progressBarRef) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    if (isNaN(percent) || percent < 0 || percent > 1) return;
    
    audioRef.current.currentTime = percent * audioRef.current.duration;
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle track selection
  const handleTrackSelect = (index) => {
    if (index === currentTrackIndex) {
      // Toggle play/pause if selecting the current track
      togglePlay();
    } else {
      // Load and play the new track
      loadTrack(index);
      
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(handleError);
      }
    }
  };
  
  // Add tracks to the playlist
  const addTracks = (newTracks) => {
    setTracks(prevTracks => [...prevTracks, ...newTracks]);
  };
  
  // Clear the playlist
  const clearTracks = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    
    setTracks([]);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };
  
  // Replace the current playlist
  const replaceTracks = (newTracks) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    
    setTracks(newTracks);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Load the first track if available
    if (newTracks.length > 0 && audioRef.current) {
      audioRef.current.src = newTracks[0].url;
      audioRef.current.load();
    }
  };
  
  return {
    // State
    tracks,
    currentTrackIndex,
    currentTrack: tracks[currentTrackIndex],
    isPlaying,
    currentTime,
    duration,
    volume,
    error,
    
    // Controls
    togglePlay,
    handlePrevious,
    handleNext,
    handleSeek,
    handleTrackSelect,
    setVolume,
    formatTime,
    
    // Playlist management
    addTracks,
    clearTracks,
    replaceTracks,
    
    // Refs
    audioRef
  };
};

export default useMediaPlayer;

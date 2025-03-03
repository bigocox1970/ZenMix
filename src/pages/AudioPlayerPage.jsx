import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const AudioPlayerPage = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([
    { 
      id: 1, 
      title: 'Rain Sounds', 
      category: 'nature', 
      url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3',
      duration: 30
    },
    { 
      id: 2, 
      title: 'Forest Birds', 
      category: 'nature', 
      url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3',
      duration: 30
    },
    { 
      id: 3, 
      title: 'Ocean Waves', 
      category: 'nature', 
      url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3',
      duration: 30
    },
    { 
      id: 4, 
      title: 'Gentle Piano', 
      category: 'music', 
      url: 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3',
      duration: 30
    },
    { 
      id: 5, 
      title: 'Meditation Guide', 
      category: 'voice', 
      url: 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3',
      duration: 30
    },
    { 
      id: 6, 
      title: 'Binaural Beats', 
      category: 'beats', 
      url: 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3',
      duration: 30
    }
  ]);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    // Event listeners
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current.duration);
    });
    audioRef.current.addEventListener('ended', handleNext);
    
    // Load first track
    loadTrack(currentTrackIndex);
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('ended', handleNext);
      }
    };
  }, []);
  
  // Update audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Load track
  const loadTrack = (index) => {
    if (tracks[index]) {
      if (audioRef.current) {
        audioRef.current.src = tracks[index].url;
        audioRef.current.load();
        setCurrentTrackIndex(index);
        setCurrentTime(0);
      }
    }
  };
  
  // Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Previous track
  const handlePrevious = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(newIndex);
    if (isPlaying) {
      audioRef.current.play();
    }
  };
  
  // Next track
  const handleNext = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(newIndex);
    if (isPlaying) {
      audioRef.current.play();
    }
  };
  
  // Update progress
  const updateProgress = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Seek
  const handleSeek = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };
  
  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle track selection
  const handleTrackSelect = (index) => {
    loadTrack(index);
    setIsPlaying(true);
    audioRef.current.play();
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'nature':
        return (
          <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z" />
          </svg>
        );
      case 'music':
        return (
          <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        );
      case 'voice':
        return (
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
          </svg>
        );
      case 'beats':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
          </svg>
        );
    }
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'nature':
        return 'bg-green-900/50';
      case 'music':
        return 'bg-blue-900/50';
      case 'voice':
        return 'bg-yellow-900/50';
      case 'beats':
        return 'bg-purple-900/50';
      default:
        return 'bg-gray-800';
    }
  };
  
  // Get category text color
  const getCategoryTextColor = (category) => {
    switch (category) {
      case 'nature':
        return 'text-green-400';
      case 'music':
        return 'text-blue-400';
      case 'voice':
        return 'text-yellow-400';
      case 'beats':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };
  
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">Audio Player</h1>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Track List */}
            <div className="md:col-span-1">
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Tracks</h2>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentTrackIndex
                          ? 'bg-primary/20 border border-primary/30'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => handleTrackSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${getCategoryColor(track.category)}`}>
                          {getCategoryIcon(track.category)}
                        </div>
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <span className={`text-xs ${getCategoryTextColor(track.category)}`}>
                            {track.category.charAt(0).toUpperCase() + track.category.slice(1)}
                          </span>
                        </div>
                        {index === currentTrackIndex && (
                          <div className="ml-auto">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Player */}
            <div className="md:col-span-2">
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex flex-col items-center mb-8">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${getCategoryColor(tracks[currentTrackIndex].category)}`}>
                    {getCategoryIcon(tracks[currentTrackIndex].category)}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{tracks[currentTrackIndex].title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${getCategoryTextColor(tracks[currentTrackIndex].category)}`}>
                    {tracks[currentTrackIndex].category.charAt(0).toUpperCase() + tracks[currentTrackIndex].category.slice(1)}
                  </span>
                </div>
                
                <div className="mb-8">
                  {/* Progress Bar */}
                  <div 
                    className="h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer mb-2"
                    ref={progressBarRef}
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                <div className="flex justify-center items-center gap-6 mb-8">
                  {/* Previous Button */}
                  <button 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={handlePrevious}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Play/Pause Button */}
                  <button 
                    className="bg-primary hover:bg-primary-dark text-white rounded-full w-16 h-16 flex items-center justify-center transition-colors"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Next Button */}
                  <button 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={handleNext}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 2.828a9 9 0 010-12.728" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 accent-primary"
                  />
                </div>
              </div>
              
              <div className="mt-8 bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">About This Track</h2>
                <p className="text-gray-400 mb-4">
                  {tracks[currentTrackIndex].category === 'nature' && 'Natural sounds help reduce stress and anxiety, promoting a deeper state of relaxation.'}
                  {tracks[currentTrackIndex].category === 'music' && 'Gentle music can help calm the mind and create a peaceful atmosphere for meditation.'}
                  {tracks[currentTrackIndex].category === 'voice' && 'Guided meditations help focus your attention and provide structure to your meditation practice.'}
                  {tracks[currentTrackIndex].category === 'beats' && 'Binaural beats can help synchronize brainwaves to achieve specific mental states.'}
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">30 seconds</span>
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">Sample Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AudioPlayerPage;

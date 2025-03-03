import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Howl } from 'howler';

const AudioMixer = ({ tracks, userId }) => {
  const { supabase } = useSupabase();
  const [activeSounds, setActiveSounds] = useState({});
  const [sessionTime, setSessionTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [sessionName, setSessionName] = useState('Meditation Session');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop and unload all sounds
      Object.values(activeSounds).forEach(sound => {
        if (sound.sound) {
          sound.sound.stop();
          sound.sound.unload();
        }
      });
      
      // Clear timer interval
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [activeSounds, timerInterval]);

  // Add active sound
  const addActiveSound = (id, name, url) => {
    if (activeSounds[id]) return;
    
    // Create Howl instance
    const sound = new Howl({
      src: [url],
      loop: true,
      volume: 0.5,
    });
    
    setActiveSounds(prev => ({
      ...prev,
      [id]: {
        id,
        name,
        url,
        sound,
        volume: 0.5,
      }
    }));
  };

  // Remove active sound
  const removeActiveSound = (id) => {
    if (!activeSounds[id]) return;
    
    // Stop and unload sound
    activeSounds[id].sound.stop();
    activeSounds[id].sound.unload();
    
    // Remove from active sounds
    setActiveSounds(prev => {
      const newSounds = { ...prev };
      delete newSounds[id];
      return newSounds;
    });
  };

  // Update sound volume
  const updateSoundVolume = (id, volume) => {
    if (!activeSounds[id]) return;
    
    setActiveSounds(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        volume,
      }
    }));
    
    activeSounds[id].sound.volume(volume);
  };

  // Set timer
  const setTimer = (minutes) => {
    setSessionTime(minutes * 60);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Play meditation
  const playMeditation = () => {
    if (isPlaying) return;
    
    // Check if there are active sounds
    if (Object.keys(activeSounds).length === 0) {
      alert('Please add at least one sound to your meditation mix.');
      return;
    }
    
    // Check if timer is set
    if (sessionTime <= 0) {
      alert('Please set a timer for your meditation session.');
      return;
    }
    
    // Play all active sounds
    Object.values(activeSounds).forEach(sound => {
      sound.sound.play();
    });
    
    // Start timer
    const interval = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          stopMeditation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
    setIsPlaying(true);
  };

  // Pause meditation
  const pauseMeditation = () => {
    if (!isPlaying) return;
    
    // Pause all active sounds
    Object.values(activeSounds).forEach(sound => {
      sound.sound.pause();
    });
    
    // Pause timer
    clearInterval(timerInterval);
    setTimerInterval(null);
    setIsPlaying(false);
  };

  // Stop meditation
  const stopMeditation = () => {
    // Stop all active sounds
    Object.values(activeSounds).forEach(sound => {
      sound.sound.stop();
    });
     // Stop timer
    clearInterval(timerInterval);
    setTimerInterval(null);
    setIsPlaying(false);
  };

  // Save session
  const saveSession = async () => {
    try {
      if (Object.keys(activeSounds).length === 0) {
        alert('Please add at least one sound to your meditation mix.');
        return;
      }
      
      // Prepare session data
      const sessionData = {
        user_id: userId,
        name: sessionName || 'Meditation Session',
        duration: formatTime(sessionTime),
        sounds: Object.values(activeSounds).map(sound => ({
          id: sound.id,
          name: sound.name,
          volume: sound.volume
        })),
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert([sessionData]);
      
      if (error) throw error;
      
      alert('Session saved successfully!');
      
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session. Please try again.');
    }
  };

  return (
    <div id="mixer" className="bg-card rounded-xl p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6">Audio Mixer</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {/* Sound Library */}
          <div className="bg-dark rounded-xl p-6 mb-6">
            <h4 className="text-lg font-medium mb-4">Sound Library</h4>
            <div className="space-y-4">
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    </div>
                    <span>{track.name}</span>
                  </div>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-full transition-colors"
                    onClick={() => addActiveSound(track.id, track.name, track.url)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Equalizer */}
          <div className="bg-dark rounded-xl p-6">
            <h4 className="text-lg font-medium mb-4">Equalizer</h4>
            <div className="grid grid-cols-5 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-2">60Hz</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="50" 
                  className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
                  style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-2">250Hz</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="60" 
                  className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
                  style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-2">1kHz</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="70" 
                  className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
                  style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-2">4kHz</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="65" 
                  className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
                  style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-2">12kHz</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="55" 
                  className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
                  style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          {/* Active Sounds */}
          <div className="bg-dark rounded-xl p-6 mb-6">
            <h4 className="text-lg font-medium mb-4">Active Sounds</h4>
            <div className="space-y-4">
              {Object.keys(activeSounds).length === 0 ? (
                <p className="text-gray-400 text-center py-4">No sounds active. Add sounds from the library.</p>
              ) : (
                Object.values(activeSounds).map((sound) => (
                  <div key={sound.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                        </div>
                        <span>{sound.name}</span>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        onClick={() => removeActiveSound(sound.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sound.volume * 100} 
                        onChange={(e) => updateSoundVolume(sound.id, parseInt(e.target.value) / 100)}
                        className="w-full accent-primary" 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Meditation Controls */}
          <div className="bg-dark rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium">Meditation Controls</h4>
              <div className="text-sm text-gray-400">{formatTime(sessionTime)}</div>
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              {!isPlaying ? (
                <button 
                  onClick={playMeditation}
                  className="bg-primary hover:bg-primary-dark text-white p-3 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={pauseMeditation}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>
              )}
              <button 
                onClick={stopMeditation}
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12"></rect>
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Session Timer</label>
              <div className="flex space-x-2">
                {[5, 10, 15, 20, 30].map((minutes) => (
                  <button 
                    key={minutes}
                    onClick={() => setTimer(minutes)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      sessionTime === minutes * 60 
                        ? 'bg-primary hover:bg-primary-dark' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="session-name" className="block text-sm font-medium text-gray-300 mb-2">Session Name</label>
              <input 
                type="text" 
                id="session-name" 
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="My Meditation Session" 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <button 
              onClick={saveSession}
              className="mt-4 w-full gradient-button py-2"
            >
              Save Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioMixer;
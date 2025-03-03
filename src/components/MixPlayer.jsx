import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Music2, Equal as Equalizer, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';

// Add custom CSS to hide scrollbar for Webkit browsers
const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .progress-bar {
    height: 4px;
    background-color: rgba(79, 70, 229, 0.2);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  
  .progress-bar-fill {
    height: 100%;
    background-color: #4F46E5;
    position: absolute;
    top: 0;
    left: 0;
    transition: width 0.1s linear;
  }
`;

const MixPlayer = ({ mix, onClose }) => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedTracks, setLoadedTracks] = useState(0);
  const [showMixer, setShowMixer] = useState(false);
  const [showEQ, setShowEQ] = useState(false);
  const [showTrackEQs, setShowTrackEQs] = useState(new Map());
  const [eqValues, setEqValues] = useState({
    '60': 0,
    '170': 0,
    '310': 0,
    '600': 0,
    '1k': 0,
    '3k': 0,
    '6k': 0,
    '12k': 0,
  });
  const [trackEQValues, setTrackEQValues] = useState(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [trackProgress, setTrackProgress] = useState(new Map());
  const [trackTimers, setTrackTimers] = useState(new Map());
  const [mixProgress, setMixProgress] = useState(0);
  const [mixTimer, setMixTimer] = useState('0:00 / 0:00');
  const [mixDuration, setMixDuration] = useState(0);
  const [mixCurrentTime, setMixCurrentTime] = useState(0);
  
  const soundsRef = useRef(new Map());
  const loadingRef = useRef(new Set());
  const progressIntervalRef = useRef(null);
  const mixStartTimeRef = useRef(null);

  useEffect(() => {
    if (!mix?.tracks || !Array.isArray(mix.tracks)) {
      console.error('Invalid mix data:', mix);
      setError('Invalid mix data');
      setIsLoading(false);
      return;
    }

    // Set the mix duration when the component mounts
    const totalDurationInSeconds = (mix.duration || 15) * 60;
    setMixDuration(totalDurationInSeconds);

    const initializeTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadedTracks(0);

        // Stop and unload all existing sounds
        soundsRef.current.forEach(sound => {
          sound.stop();
          sound.unload();
        });
        soundsRef.current.clear();
        loadingRef.current.clear();

        // Initialize EQ values for each track
        const newTrackEQValues = new Map();
        mix.tracks.forEach(track => {
          newTrackEQValues.set(track.id, {
            '60': 0,
            '170': 0,
            '310': 0,
            '600': 0,
            '1k': 0,
            '3k': 0,
            '6k': 0,
            '12k': 0,
          });
        });
        setTrackEQValues(newTrackEQValues);

        // Create Howl instances for each track
        mix.tracks.forEach(track => {
          if (!track.url) {
            console.error('Track missing URL:', track);
            return;
          }

          // Skip if already loading this track
          if (loadingRef.current.has(track.id)) {
            return;
          }

          // Start loading track
          loadingRef.current.add(track.id);
          console.log('Loading track:', track.id);

          const sound = new Howl({
            src: [track.url],
            html5: true,
            format: ['mp3', 'wav', 'ogg', 'm4a'],
            volume: track.volume || 0.7,
            loop: true,
            preload: true,
            onload: () => {
              console.log('Track loaded successfully:', track.id);
              loadingRef.current.delete(track.id);
              setLoadedTracks(prev => prev + 1);
            },
            onloaderror: (id, err) => {
              console.error('Error loading track:', track.id, err);
              loadingRef.current.delete(track.id);
              setError('Failed to load one or more tracks');
              setIsPlaying(false);
            },
            onplayerror: (id, err) => {
              console.error('Error playing track:', track.id, err);
              setError('Failed to play one or more tracks');
              setIsPlaying(false);
            }
          });

          soundsRef.current.set(track.id, sound);
        });

      } catch (err) {
        console.error('Error initializing tracks:', err);
        setError('Failed to initialize audio player');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTracks();

    return () => {
      // Stop and unload all sounds
      soundsRef.current.forEach(sound => {
        sound.stop();
        sound.unload();
      });
      soundsRef.current.clear();
      
      // Clear the progress update interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [mix]);

  const togglePlay = () => {
    if (isLoading) return;
    
    if (isPlaying) {
      // Pause all sounds
      soundsRef.current.forEach(sound => {
        sound.pause();
      });
      
      // Clear the progress update interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Store the current time when paused
      if (mixStartTimeRef.current) {
        setMixCurrentTime(mixCurrentTime + (Date.now() - mixStartTimeRef.current) / 1000);
      }
      mixStartTimeRef.current = null;
      
      setIsPlaying(false);
    } else {
      // Set the mix duration based on the mix duration in minutes
      const totalDurationInSeconds = (mix.duration || 5) * 60;
      setMixDuration(totalDurationInSeconds);
      
      // Set the start time reference
      mixStartTimeRef.current = Date.now();
      
      // Play all sounds
      soundsRef.current.forEach(sound => {
        sound.play();
      });
      
      // Start the progress update interval
      updateTrackProgress();
      progressIntervalRef.current = setInterval(updateTrackProgress, 1000);
      
      setIsPlaying(true);
    }
  };
  
  const updateTrackProgress = () => {
    const newProgress = new Map();
    const newTimers = new Map();
    
    soundsRef.current.forEach((sound, trackId) => {
      if (sound) {
        const seek = sound.seek() || 0;
        const duration = sound.duration() || 1;
        const progress = (seek / duration) * 100;
        
        newProgress.set(trackId, progress);
        
        // Format the current time as MM:SS
        const minutes = Math.floor(seek / 60);
        const seconds = Math.floor(seek % 60);
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Format the duration as MM:SS
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        const formattedDuration = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        
        newTimers.set(trackId, `${formattedTime} / ${formattedDuration}`);
      }
    });
    
    setTrackProgress(newProgress);
    setTrackTimers(newTimers);
    
    // Update mix progress
    if (mixStartTimeRef.current && mixDuration > 0) {
      const elapsedTime = mixCurrentTime + (Date.now() - mixStartTimeRef.current) / 1000;
      const totalTime = mixDuration;
      
      // Calculate progress percentage (0-100)
      const progress = Math.min((elapsedTime / totalTime) * 100, 100);
      setMixProgress(progress);
      
      // Format the current time as MM:SS
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = Math.floor(elapsedTime % 60);
      const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Format the duration as MM:SS
      const durationMinutes = Math.floor(totalTime / 60);
      const durationSeconds = Math.floor(totalTime % 60);
      const formattedDuration = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
      
      setMixTimer(`${formattedTime} / ${formattedDuration}`);
      
      // Loop the mix if it reaches the end
      if (elapsedTime >= totalTime) {
        setMixCurrentTime(0);
        mixStartTimeRef.current = Date.now();
      }
    }
  };

  const saveMix = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (isPlaying) {
        soundsRef.current.forEach(sound => sound.pause());
        setIsPlaying(false);
      }

      const mixData = {
        user_id: user.id,
        name: mix.name,
        duration: mix.duration,
        is_public: mix.is_public || false,
        tracks: mix.tracks.map(track => ({
          id: track.id,
          volume: track.volume,
          duration: track.duration,
          start_time: track.startTime || 0,
          eq_values: trackEQValues.get(track.id)
        }))
      };

      const { data, error: saveError } = await supabase
        .from('mixes')
        .insert([mixData])
        .select();

      if (saveError) throw saveError;

      const successSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAZIAAGBgYGDQ0NDQ0UFBQUGxsbGxsiIiIiKSkpKSkwMDAwNzc3Nzc+Pj4+RUVFRU5OTk5OVVVVVVxcXFxcY2NjY2pqampqcXFxcXh4eHh4f39/f4aGhoaNjY2NjZSUlJSbm5ubm6KioqKpqampqbCwsLC3t7e3t76+vr7FxcXFzMzMzMzT09PT2tra2tra4eHh4ejo6Ojo7+/v7/b29vb2/f39/f7+/v7+//8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAGSCFYzeuAAAAAAAAAAAAAAAAAAAA//tQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
      successSound.play().catch(console.error);

      alert('Mix saved successfully!');

    } catch (err) {
      console.error('Error saving mix:', err);
      setError('Failed to save mix');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <style>{scrollbarHideStyle}</style>
      <div className="w-full h-full flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">{mix.name}</div>
                <div className="text-sm text-gray-400">
                  {mix.tracks.length} tracks • {mix.duration || 15} min mix
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMixer(!showMixer)}
                className={`p-2 rounded-full transition-colors ${
                  showMixer ? 'bg-primary text-white' : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                <Equalizer className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlay}
                className="gradient-button px-4 py-2"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : isPlaying ? 'Stop' : 'Play'}
              </button>

              <button
                onClick={saveMix}
                className="gradient-button px-4 py-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Mix
                  </span>
                )}
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
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            {showMixer && (
              <div className="flex-1 overflow-y-auto p-4 pb-20 scrollbar-hide" style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
              }}>
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <button 
                      onClick={() => setShowEQ(!showEQ)}
                      className="w-full flex items-center justify-between mb-4"
                    >
                      <h3 className="text-lg font-medium">Master Equalizer</h3>
                      {showEQ ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                    
                    {/* Mix progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">
                          {mixTimer}
                        </div>
                        {isPlaying && (
                          <div className="text-xs text-primary">
                            {Math.round(mixProgress)}%
                          </div>
                        )}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${mixProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {showEQ && (
                      <div className="grid grid-cols-8 gap-4">
                        {Object.entries(eqValues).map(([freq, value]) => (
                          <div key={freq} className="flex flex-col items-center">
                            <span className="text-sm text-primary mb-2">{value > 0 ? '+' : ''}{value}dB</span>
                            <input
                              type="range"
                              min="-12"
                              max="12"
                              step="1"
                              value={value}
                              onChange={(e) => setEqValues(prev => ({ ...prev, [freq]: parseInt(e.target.value) }))}
                              className="h-32 -rotate-90 mb-8"
                            />
                            <span className="text-sm text-gray-400">{freq}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {mix.tracks.map(track => (
                      <div key={track.id} className="bg-gray-800/50 rounded-lg p-4">
                        <button 
                          onClick={() => {
                            setShowTrackEQs(prev => {
                              const newMap = new Map(prev);
                              newMap.set(track.id, !prev.get(track.id));
                              return newMap;
                            });
                          }}
                          className="w-full flex items-center justify-between mb-2"
                        >
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 ${getCategoryColor(track.category)}`}>
                              <Music2 className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{track.name || 'Unknown Track'}</div>
                              <div className="text-xs text-gray-400">{track.category || 'Uncategorized'}</div>
                            </div>
                          </div>
                          {showTrackEQs.get(track.id) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                        
                        {showTrackEQs.get(track.id) && (
                          <div className="mb-4">
                            <div className="grid grid-cols-8 gap-2 mb-4">
                              {trackEQValues.get(track.id) && Object.entries(trackEQValues.get(track.id)).map(([freq, value]) => (
                                <div key={`${track.id}-${freq}`} className="flex flex-col items-center">
                                  <span className="text-xs text-primary">{value > 0 ? '+' : ''}{value}</span>
                                  <input
                                    type="range"
                                    min="-12"
                                    max="12"
                                    step="1"
                                    value={value}
                                    onChange={(e) => {
                                      setTrackEQValues(prev => {
                                        const newMap = new Map(prev);
                                        const trackValues = { ...newMap.get(track.id) };
                                        trackValues[freq] = parseInt(e.target.value);
                                        newMap.set(track.id, trackValues);
                                        return newMap;
                                      });
                                    }}
                                    className="h-32 -rotate-90 mb-8"
                                  />
                                  <span className="text-xs text-gray-400">{freq}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-3 mt-4">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 2.828a9 9 0 010-12.728" />
                              </svg>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                defaultValue={track.volume}
                                onChange={(e) => {
                                  const sound = soundsRef.current.get(track.id);
                                  if (sound) sound.volume(parseFloat(e.target.value));
                                }}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            {/* Display the track timer */}
                            {trackTimers.get(track.id) || `0:00 / ${Math.floor(track.duration / 60)}:${String(Math.floor(track.duration % 60)).padStart(2, '0')}`}
                          </div>
                          
                          {!showTrackEQs.get(track.id) && (
                            <button 
                              onClick={() => {
                                setShowTrackEQs(prev => {
                                  const newMap = new Map(prev);
                                  newMap.set(track.id, true);
                                  return newMap;
                                });
                              }}
                              className="text-xs text-primary hover:text-primary-dark"
                            >
                              Show Controls
                            </button>
                          )}
                        </div>
                        
                        {/* SoundCloud-like progress bar */}
                        <div className="progress-bar mt-2">
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${trackProgress.get(track.id) || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Add bottom padding to prevent overlap with mobile navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'nature':
      return 'bg-green-900/50 text-green-400';
    case 'music':
      return 'bg-blue-900/50 text-blue-400';
    case 'voice':
      return 'bg-yellow-900/50 text-yellow-400';
    case 'beats':
      return 'bg-purple-900/50 text-purple-400';
    default:
      return 'bg-gray-800 text-gray-400';
  }
};

export default MixPlayer;
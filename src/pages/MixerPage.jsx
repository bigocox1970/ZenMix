import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import useMixerTracks from '../hooks/useMixerTracks';
import { ChevronDown, ChevronUp, Grid, List, Music, Sliders, Plus, Volume2, Clock, User, Globe } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import MixPreviewPlayer from '../components/MixPreviewPlayer';
import { toast } from 'react-hot-toast';

const MixerPage = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const { 
    allTracks, 
    builtInTracks, 
    userTracks, 
    communityTracks, 
    loading, 
    error: tracksError 
  } = useMixerTracks();
  
  const [showSoundLibrary, setShowSoundLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [activeTracks, setActiveTracks] = useState([]);
  const [sessionName, setSessionName] = useState('My Meditation Mix');
  const [totalDuration, setTotalDuration] = useState(30);
  const [isPublic, setIsPublic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [showEQs, setShowEQs] = useState(new Map());
  const [eqValues, setEqValues] = useState(new Map());
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [showVolume, setShowVolume] = useState(new Map());
  const [showTime, setShowTime] = useState(new Map());

  // Filter tracks by category and source
  const filteredTracks = allTracks.filter(track => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || track.category === selectedCategory;
    
    // Filter by source
    let sourceMatch = true;
    if (selectedSource === 'built-in') {
      sourceMatch = track.source === 'built-in';
    } else if (selectedSource === 'user-library') {
      sourceMatch = track.source === 'user-library';
    } else if (selectedSource === 'community') {
      sourceMatch = track.source === 'community';
    }
    
    return categoryMatch && sourceMatch;
  });

  // Add track to mix
  const addTrack = (track) => {
    setActiveTracks(prev => [...prev, {
      ...track,
      volume: 0.7,
      duration: totalDuration,
      startTime: 0
    }]);
    setShowAddTrack(false);
  };

  // Load a mix from the community
  const handleLoadMix = async (mix) => {
    try {
      if (!mix || !mix.id) {
        console.error('Invalid mix object:', mix);
        toast.error("Cannot load this mix. Invalid mix data.");
        return;
      }
      
      // First, clear current tracks
      setActiveTracks([]);
      
      // Get the mix details including tracks
      const { data: mixData, error: mixError } = await supabase
        .from('mixes')
        .select('*')
        .eq('id', mix.id)
        .single();
        
      if (mixError) {
        console.error('Error fetching mix:', mixError);
        toast.error("Failed to load the mix. Please try again.");
        return;
      }
      
      if (!mixData) {
        console.error('No mix data found for id:', mix.id);
        toast.error("Mix not found. It may have been deleted.");
        return;
      }
      
      // Set the mix name
      setSessionName(mixData.name || 'Unnamed Mix');
      
      // Parse the tracks from the jsonb column
      let tracksToAdd = [];
      
      if (mixData.tracks && Array.isArray(mixData.tracks)) {
        // Get the track IDs from the mix
        const trackIds = mixData.tracks
          .filter(track => track && (track.id || track.track_id))
          .map(track => track.id || track.track_id);
        
        if (trackIds.length > 0) {
          // Fetch the actual track data
          const { data: tracksData, error: tracksError } = await supabase
            .from('audio_tracks')
            .select('*')
            .in('id', trackIds);
            
          if (tracksError) {
            console.error('Error fetching tracks:', tracksError);
            toast.error("Failed to load the tracks for this mix.");
            return;
          }
          
          if (tracksData && tracksData.length > 0) {
            // Map the tracks with their settings from the mix
            tracksToAdd = tracksData.map(trackData => {
              const trackSettings = mixData.tracks.find(t => 
                t && ((t.id === trackData.id) || (t.track_id === trackData.id))
              ) || {};
              
              return {
                ...trackData,
                volume: trackSettings.volume || 0.7,
                duration: trackSettings.duration || totalDuration,
                startTime: trackSettings.start_time || 0
              };
            });
          }
        }
      }
      
      setActiveTracks(tracksToAdd);
      setShowAddTrack(false);
      
      // Show a success message
      toast.success(`Successfully loaded "${mixData.name}"`);
      
    } catch (error) {
      console.error('Error loading mix:', error);
      toast.error("Failed to load the mix. Please try again.");
    }
  };

  // Remove track from mix
  const removeTrack = (trackId) => {
    setIsPlaying(false);
    setActiveTracks(prev => prev.filter(t => t.id !== trackId));
  };

  // Update track volume
  const updateTrackVolume = (trackId, volume) => {
    setActiveTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, volume } : track
    ));
  };

  // Initialize EQ values for a track
  const initializeEQ = (trackId) => {
    if (!eqValues.has(trackId)) {
      setEqValues(prev => new Map(prev).set(trackId, {
        '60': 0,
        '170': 0,
        '310': 0,
        '600': 0,
        '1k': 0,
        '3k': 0,
        '6k': 0,
        '12k': 0,
      }));
    }
  };

  // Toggle EQ panel for a track
  const toggleEQ = (trackId) => {
    initializeEQ(trackId);
    setShowEQs(prev => new Map(prev).set(trackId, !prev.get(trackId)));
    // Close other dropdowns
    setShowVolume(prev => new Map(prev).set(trackId, false));
    setShowTime(prev => new Map(prev).set(trackId, false));
  };

  // Update EQ value
  const updateEQValue = (trackId, frequency, value) => {
    setEqValues(prev => {
      const trackEQ = prev.get(trackId) || {};
      return new Map(prev).set(trackId, {
        ...trackEQ,
        [frequency]: value
      });
    });
  };

  // Toggle volume dropdown
  const toggleVolume = (trackId) => {
    setShowVolume(prev => new Map(prev).set(trackId, !prev.get(trackId)));
    // Close other dropdowns
    setShowTime(prev => new Map(prev).set(trackId, false));
    setShowEQs(prev => new Map(prev).set(trackId, false));
  };

  // Toggle time dropdown
  const toggleTime = (trackId) => {
    setShowTime(prev => new Map(prev).set(trackId, !prev.get(trackId)));
    // Close other dropdowns
    setShowVolume(prev => new Map(prev).set(trackId, false));
    setShowEQs(prev => new Map(prev).set(trackId, false));
  };

  // Update track duration
  const updateTrackDuration = (trackId, duration) => {
    setActiveTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, duration } : track
    ));
  };

  // Save mix
  const saveMix = async () => {
    try {
      setError(null);
      setSuccess(null);
      setIsSaving(true);

      if (activeTracks.length === 0) {
        setError('Please add at least one track to your mix');
        return;
      }

      setIsPlaying(false);
      await new Promise(resolve => setTimeout(resolve, 100));

      // For now, we're only saving basic track data
      // We'll add EQ settings and other advanced data later
      const mixData = {
        user_id: user.id,
        name: sessionName,
        duration: totalDuration,
        is_public: isPublic,
        tracks: activeTracks.map(track => ({
          id: track.id,
          volume: track.volume,
          duration: track.duration,
          start_time: track.startTime
        }))
      };
      
      const { data, error: saveError } = await supabase
        .from('mixes')
        .insert([mixData])
        .select();
        
      if (saveError) throw saveError;
      
      setSuccess('Mix saved successfully!');

      const successSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAZIAAGBgYGDQ0NDQ0UFBQUGxsbGxsiIiIiKSkpKSkwMDAwNzc3Nzc+Pj4+RUVFRU5OTk5OVVVVVVxcXFxcY2NjY2pqampqcXFxcXh4eHh4f39/f4aGhoaNjY2NjZSUlJSbm5ubm6KioqKpqampqbCwsLC3t7e3t76+vr7FxcXFzMzMzMzT09PT2tra2tra4eHh4ejo6Ojo7+/v7/b29vb2/f39/f7+/v7+//8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAGSCFYzeuAAAAAAAAAAAAAAAAAAAA//tQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
      successSound.play().catch(console.error);
      
      setTimeout(() => {
        navigate('/library');
      }, 2000);
    } catch (err) {
      console.error('Error saving mix:', err);
      setError('Failed to save mix. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <main className="pt-16 pb-48">
        <div className="px-4">
          <div className="bg-card rounded-xl p-6 mb-6">
            <div className="mb-4">
              <label htmlFor="sessionName" className="block text-sm font-medium text-gray-300 mb-1">
                Mix Name
              </label>
              <input
                type="text"
                id="sessionName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                Total Duration (minutes)
              </label>
              <select
                id="duration"
                value={totalDuration}
                onChange={(e) => setTotalDuration(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-300">
                Make this mix public
              </label>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 mb-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Mix</h2>
              <button
                onClick={() => setShowAddTrack(true)}
                className="gradient-button flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Track
              </button>
            </div>

            {activeTracks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                Add sounds to create your mix
              </p>
            ) : (
              <div className="space-y-4">
                {activeTracks.map(track => (
                  <div key={track.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{track.title || track.name}</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleVolume(track.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              showVolume.get(track.id) 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            <Volume2 size={16} />
                          </button>

                          <button
                            onClick={() => toggleTime(track.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              showTime.get(track.id) 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            <Clock size={16} />
                          </button>

                          <button
                            onClick={() => toggleEQ(track.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              showEQs.get(track.id) 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            <Sliders size={16} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeTrack(track.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Volume Dropdown */}
                    {showVolume.get(track.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-400 mb-4">Volume</h4>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={track.volume}
                          onChange={(e) => updateTrackVolume(track.id, Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    )}

                    {/* Time Dropdown */}
                    {showTime.get(track.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-400 mb-4">Duration</h4>
                        <input
                          type="range"
                          min="1"
                          max={totalDuration}
                          value={track.duration}
                          onChange={(e) => updateTrackDuration(track.id, Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                          <span>1m</span>
                          <span>{track.duration}m</span>
                          <span>{totalDuration}m</span>
                        </div>
                      </div>
                    )}

                    {/* EQ Dropdown */}
                    {showEQs.get(track.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-400 mb-4">Equalizer</h4>
                        <div className="grid grid-cols-8 gap-4">
                          {Object.entries(eqValues.get(track.id) || {}).map(([freq, value]) => (
                            <div key={freq} className="flex flex-col items-center">
                              <span className="text-xs text-primary mb-1">{value > 0 ? '+' : ''}{value}dB</span>
                              <input
                                type="range"
                                min="-12"
                                max="12"
                                step="1"
                                value={value}
                                onChange={(e) => updateEQValue(track.id, freq, parseInt(e.target.value))}
                                className="h-24 -rotate-90"
                              />
                              <span className="text-xs text-gray-400 mt-1">{freq}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Fixed Controls */}
      <div className="fixed bottom-20 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 p-4 z-40">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="gradient-button"
            disabled={activeTracks.length === 0}
          >
            {isPlaying ? 'Stop Preview' : 'Preview Mix'}
          </button>
          
          <button
            onClick={saveMix}
            className="gradient-button"
            disabled={activeTracks.length === 0 || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Mix'}
          </button>
        </div>
      </div>
      
      {/* Preview Player */}
      {activeTracks.length > 0 && (
        <MixPreviewPlayer
          tracks={activeTracks}
          isPlaying={isPlaying}
          onPlayingChange={setIsPlaying}
        />
      )}

      {/* Add Track Modal */}
      {showAddTrack && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Add Track</h3>
                <button
                  onClick={() => setShowAddTrack(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="all">All Sources</option>
                    <option value="built-in">Built-in Sounds</option>
                    <option value="user-library">My Library</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="nature">Nature</option>
                    <option value="music">Music</option>
                    <option value="voice">Voice</option>
                    <option value="beats">Beats</option>
                    <option value="user">User Uploads</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredTracks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No tracks found. Try changing your filters.
                  </div>
                ) : (
                  filteredTracks.map(track => (
                    <div 
                      key={track.id}
                      className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSourceColor(track.source)} ${getCategoryColor(track.category)}`}>
                          {track.source === 'built-in' ? (
                            <Music size={20} />
                          ) : track.source === 'user-library' ? (
                            <User size={20} />
                          ) : (
                            <Globe size={20} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{track.title || track.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                              {track.category}
                            </span>
                            {track.source === 'user-library' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300">
                                My Library
                              </span>
                            )}
                            {track.source === 'community' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-300">
                                Community {track.type && track.type === 'mix' && '• Mix'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {(track.type && track.type === 'mix') ? (
                        <button
                          onClick={() => handleLoadMix(track)}
                          className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                        >
                          Load Mix
                        </button>
                      ) : (
                        <button
                          onClick={() => addTrack(track)}
                          disabled={activeTracks.some(t => t.id === track.id)}
                          className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
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
    case 'user':
      return 'bg-orange-900/50 text-orange-400';
    default:
      return 'bg-gray-800 text-gray-400';
  }
};

const getSourceColor = (source) => {
  switch (source) {
    case 'built-in':
      return 'bg-gray-700';
    case 'user-library':
      return 'bg-blue-900/50';
    case 'community':
      return 'bg-green-900/50';
    default:
      return 'bg-gray-800';
  }
};

export default MixerPage;
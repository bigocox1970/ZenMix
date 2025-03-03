import React, { useState, useEffect } from 'react';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { useAdmin } from '../hooks/useAdmin';
import { useCategories } from '../hooks/useCategories';
import { Play, Pause, Music, Edit2, Trash2, Upload, Check, X } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';

const AudioLibrary = ({ category = 'nature', onTrackSelect, currentTrack = null, isPlaying = false, onUploadClick }) => {
  const { tracks, loading: tracksLoading, error: tracksError, fetchTracks } = useAudioTracks();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { soundCategories, loading: categoriesLoading } = useCategories();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('list');
  const [editingTrack, setEditingTrack] = useState(null);

  const loading = tracksLoading || adminLoading || categoriesLoading;
  const error = tracksError;

  // Filter tracks by category
  const filteredTracks = tracks.filter(track => 
    category === 'all' ? true : track.category === category
  );

  // Update filtered tracks when category changes
  useEffect(() => {
    // If we're in a community category, we might need different filtering logic
    if (category === 'popular' || category === 'recent' || category === 'featured') {
      // For now, just show all tracks for these categories
      // In a real app, you would implement specific filtering for each
    }
  }, [category]);

  // Handle track edit
  const handleEdit = async (track) => {
    if (!isAdmin && track.user_id !== user?.id) return;
    
    const { title, category } = editingTrack;
    
    try {
      const { error } = await supabase
        .from('audio_tracks')
        .update({ 
          title,
          category,
          updated_at: new Date().toISOString()
        })
        .eq('id', track.id);
        
      if (error) throw error;
      
      // Refresh tracks
      await fetchTracks();
      setEditingTrack(null);
      
    } catch (err) {
      console.error('Error updating track:', err);
      alert('Failed to update track');
    }
  };

  // Handle track delete
  const handleDelete = async (track) => {
    if (!isAdmin && track.user_id !== user?.id) return;
    
    if (!confirm('Are you sure you want to delete this track?')) return;
    
    try {
      const { error } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', track.id);
        
      if (error) throw error;
      
      // Refresh tracks
      await fetchTracks();
      
    } catch (err) {
      console.error('Error deleting track:', err);
      alert('Failed to delete track');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTrack(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 text-center">
        <p className="text-red-400">Error loading audio library. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* View Mode Toggle and Upload Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400'
            }`}
          >
            Grid
          </button>
        </div>
        {onUploadClick && (
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Upload size={18} />
            <span>Upload Audio</span>
          </button>
        )}
      </div>

      {/* Tracks Display */}
      {viewMode === 'list' ? (
        <div className="bg-card rounded-xl overflow-hidden">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm text-gray-400">
            <div className="col-span-6">TRACK NAME</div>
            <div className="col-span-3 text-center">CATEGORY</div>
            <div className="col-span-3 text-center">ACTIONS</div>
          </div>

          {/* Track List */}
          <div className="divide-y divide-gray-800">
            {filteredTracks.map(track => (
              <div 
                key={track.id} 
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-800/50 transition-colors ${
                  currentTrack?.id === track.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="col-span-6 flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(track.category)}`}>
                    <Music size={20} className={isPlaying && currentTrack?.id === track.id ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    {editingTrack?.id === track.id ? (
                      <input
                        type="text"
                        value={editingTrack.title}
                        onChange={(e) => setEditingTrack({...editingTrack, title: e.target.value})}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white w-full mb-2"
                      />
                    ) : (
                      <h3 className="font-medium">{track.name || track.title}</h3>
                    )}
                  </div>
                </div>
                <div className="col-span-3 text-center">
                  {editingTrack?.id === track.id ? (
                    <select
                      value={editingTrack.category}
                      onChange={(e) => setEditingTrack({...editingTrack, category: e.target.value})}
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white w-full"
                    >
                      <option value="">Select Category</option>
                      <option value="nature">Nature</option>
                      <option value="music">Music</option>
                      <option value="voice">Voice</option>
                      <option value="beats">Beats</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(track.category)}`}>
                      {track.category || "Uncategorized"}
                    </span>
                  )}
                </div>
                <div className="col-span-3 flex items-center justify-center space-x-2">
                  {editingTrack?.id === track.id ? (
                    <>
                      <button 
                        className="p-2 rounded-full bg-green-900/20 text-green-400 hover:bg-green-900/30"
                        onClick={() => handleEdit(track)}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        className="p-2 rounded-full bg-red-900/20 text-red-400 hover:bg-red-900/30"
                        onClick={cancelEditing}
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className={`p-2 rounded-full transition-colors ${
                          isPlaying && currentTrack?.id === track.id
                            ? 'bg-primary text-white'
                            : 'bg-primary/20 text-primary hover:bg-primary/30'
                        }`}
                        onClick={() => onTrackSelect(track)}
                      >
                        {isPlaying && currentTrack?.id === track.id ? <Pause size={16} /> : <Play size={16} />}
                      </button>

                      {(isAdmin || track.user_id === user?.id) && (
                        <>
                          <button 
                            className="p-2 rounded-full bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
                            onClick={() => {
                              setEditingTrack({
                                id: track.id,
                                title: track.title || track.name,
                                category: track.category || ""
                              });
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="p-2 rounded-full bg-red-900/20 text-red-400 hover:bg-red-900/30"
                            onClick={() => handleDelete(track)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTracks.map(track => (
            <div 
              key={track.id}
              className="bg-card rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className={`h-40 flex items-center justify-center ${getCategoryColor(track.category)}`}>
                <Music size={40} className={isPlaying && currentTrack?.id === track.id ? 'animate-pulse' : ''} />
              </div>
              <div className="p-4">
                {editingTrack?.id === track.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTrack.title}
                      onChange={(e) => setEditingTrack({...editingTrack, title: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white mb-2"
                      placeholder="Track title"
                    />
                    <select
                      value={editingTrack.category}
                      onChange={(e) => setEditingTrack({...editingTrack, category: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white mb-2"
                    >
                      <option value="">Select Category</option>
                      <option value="nature">Nature</option>
                      <option value="music">Music</option>
                      <option value="voice">Voice</option>
                      <option value="beats">Beats</option>
                    </select>
                    <div className="flex justify-between mt-2">
                      <button 
                        className="p-2 rounded-full bg-green-900/20 text-green-400 hover:bg-green-900/30"
                        onClick={() => handleEdit(track)}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        className="p-2 rounded-full bg-red-900/20 text-red-400 hover:bg-red-900/30"
                        onClick={cancelEditing}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-medium mb-2">{track.name || track.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(track.category)}`}>
                        {track.category || "Uncategorized"}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          className={`p-2 rounded-full transition-colors ${
                            isPlaying && currentTrack?.id === track.id
                              ? 'bg-primary text-white'
                              : 'bg-primary/20 text-primary hover:bg-primary/30'
                          }`}
                          onClick={() => onTrackSelect(track)}
                        >
                          {isPlaying && currentTrack?.id === track.id ? <Pause size={16} /> : <Play size={16} />}
                        </button>

                        {(isAdmin || track.user_id === user?.id) && (
                          <>
                            <button 
                              className="p-2 rounded-full bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
                              onClick={() => {
                                setEditingTrack({
                                  id: track.id,
                                  title: track.title || track.name,
                                  category: track.category || ""
                                });
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="p-2 rounded-full bg-red-900/20 text-red-400 hover:bg-red-900/30"
                              onClick={() => handleDelete(track)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function for category colors
const getCategoryColor = (category) => {
  switch (category) {
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

// Helper function to format duration
const formatDuration = (duration) => {
  if (!duration) return '0:00';
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default AudioLibrary;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Play, Edit2, Trash2, Check, X, MoreVertical, Grid, List } from 'lucide-react';
import MixPlayer from './MixPlayer';

const MyMixes = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tracks: availableTracks, getTrackById } = useAudioTracks();
  
  const [mixes, setMixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMix, setSelectedMix] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [editingMix, setEditingMix] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Fetch user's mixes
  useEffect(() => {
    fetchMixes();
  }, [user, supabase]);
  
  const fetchMixes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('mixes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setMixes(data || []);
    } catch (err) {
      console.error('Error fetching mixes:', err);
      setError('Failed to load your mixes');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle mix selection
  const handleMixSelect = (mix) => {
    // Stop current playback if any
    if (showPlayer) {
      setShowPlayer(false);
      setSelectedMix(null);
    }
    
    // Add complete track information to the mix
    const completeTrackInfo = mix.tracks
      .map(track => {
        // Get track info with fallback
        const fullTrack = getTrackById(track.id);
        
        return {
          ...fullTrack,
          volume: track.volume || 0.7,
          duration: track.duration || 30,
          startTime: track.start_time || 0
        };
      })
      // Filter out tracks with missing URLs to prevent errors
      .filter(track => track.url && track.url.trim() !== '');
    
    // Only proceed if there are valid tracks
    if (completeTrackInfo.length === 0) {
      alert('This mix contains tracks that are no longer available. Please create a new mix with available tracks.');
      return;
    }
    
    // Set the selected mix with complete track information
    setSelectedMix({
      ...mix,
      tracks: completeTrackInfo
    });
    
    // Show player after a brief delay to allow cleanup
    setTimeout(() => {
      setShowPlayer(true);
    }, 100);
  };

  // Handle edit mix
  const handleEditClick = (mix) => {
    setEditingMix({
      id: mix.id,
      name: mix.name,
      category: mix.category || '',
    });
    setActiveDropdown(null);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('mixes')
        .update({ 
          name: editingMix.name,
          category: editingMix.category || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingMix.id);
        
      if (error) throw error;
      
      // Refresh mixes
      fetchMixes();
      setEditingMix(null);
      
    } catch (err) {
      console.error('Error updating mix:', err);
      alert('Failed to update mix');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingMix(null);
  };

  // Handle delete mix
  const handleDeleteClick = (mix) => {
    if (window.confirm(`Are you sure you want to delete "${mix.name}"?`)) {
      deleteMix(mix.id);
    }
    setActiveDropdown(null);
  };

  // Delete mix
  const deleteMix = async (mixId) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('mixes')
        .delete()
        .eq('id', mixId);
        
      if (error) throw error;
      
      // Refresh mixes
      fetchMixes();
      
    } catch (err) {
      console.error('Error deleting mix:', err);
      alert('Failed to delete mix');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = (mixId) => {
    setActiveDropdown(activeDropdown === mixId ? null : mixId);
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
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (mixes.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-400 mb-1">No Mixes Yet</h3>
        <p className="text-gray-500 mb-4">Create your first mix in the audio mixer</p>
        <button 
          onClick={() => navigate('/mixer')}
          className="gradient-button"
        >
          Create a Mix
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Mixes</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mixes.map(mix => (
            <div 
              key={mix.id}
              className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {editingMix && editingMix.id === mix.id ? (
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Mix Name
                    </label>
                    <input
                      type="text"
                      value={editingMix.name}
                      onChange={(e) => setEditingMix({...editingMix, name: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={editingMix.category || ''}
                      onChange={(e) => setEditingMix({...editingMix, category: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="meditation">Meditation</option>
                      <option value="sleep">Sleep</option>
                      <option value="focus">Focus</option>
                      <option value="relax">Relaxation</option>
                      <option value="nature">Nature</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-primary hover:bg-primary/80 text-white py-2 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div 
                    className="h-32 bg-gradient-to-r from-primary/30 to-purple-900/30 flex items-center justify-center cursor-pointer"
                    onClick={() => handleMixSelect(mix)}
                  >
                    <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{mix.name}</h3>
                        <p className="text-sm text-gray-400">
                          {mix.tracks?.length || 0} tracks • {mix.duration || 15} min
                        </p>
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(mix.id)}
                          className="p-1 rounded-full hover:bg-gray-800"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        
                        {activeDropdown === mix.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditClick(mix)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(mix.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {mixes.map(mix => (
            <div 
              key={mix.id}
              className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {editingMix && editingMix.id === mix.id ? (
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Mix Name
                    </label>
                    <input
                      type="text"
                      value={editingMix.name}
                      onChange={(e) => setEditingMix({...editingMix, name: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={editingMix.category || ''}
                      onChange={(e) => setEditingMix({...editingMix, category: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="meditation">Meditation</option>
                      <option value="sleep">Sleep</option>
                      <option value="focus">Focus</option>
                      <option value="relax">Relaxation</option>
                      <option value="nature">Nature</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-primary hover:bg-primary/80 text-white py-2 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center p-4">
                  <button
                    onClick={() => handleMixSelect(mix)}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4"
                  >
                    <Play className="w-5 h-5 text-primary ml-0.5" />
                  </button>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{mix.name}</h3>
                    <p className="text-sm text-gray-400">
                      {mix.tracks?.length || 0} tracks • {mix.duration || 15} min
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(mix)}
                      className="p-2 rounded-full hover:bg-gray-800"
                      title="Edit Mix"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(mix.id)}
                      className="p-2 rounded-full hover:bg-gray-800"
                      title="Delete Mix"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showPlayer && selectedMix && (
        <MixPlayer 
          mix={selectedMix} 
          onClose={() => {
            setShowPlayer(false);
            setSelectedMix(null);
          }} 
        />
      )}
    </div>
  );
};

export default MyMixes;
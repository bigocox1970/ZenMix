import React, { useState, useEffect, useRef } from 'react';
import useUserAudioTracks from '../hooks/useUserAudioTracks';
import { Play, Upload, Loader2, X, Check, Music, MoreVertical, Edit, Trash2, Globe, Lock } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { v4 as uuidv4 } from 'uuid';

const UserAudioLibrary = ({ onTrackSelect }) => {
  const { tracks, loading, error, fetchUserTracks } = useUserAudioTracks();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackCategory, setTrackCategory] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isBuiltIn, setIsBuiltIn] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newTrackId, setNewTrackId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTrack, setEditTrack] = useState(null);
  const [editTrackName, setEditTrackName] = useState('');
  const [editTrackIsBuiltIn, setEditTrackIsBuiltIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUploadClick = () => {
    // Reset all upload-related states first
    setUploadSuccess(false);
    setSelectedFile(null);
    setTrackTitle('');
    setTrackCategory('');
    setIsPublic(false);
    setIsBuiltIn(false);
    setUploadProgress(0);
    
    // Then trigger the file input
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    // Reset success state to ensure we show the upload form
    setUploadSuccess(false);
    
    // Set the file and default title (filename without extension)
    setSelectedFile(file);
    setTrackTitle(file.name.split('.')[0]);
    setShowUploadModal(true);
  };

  const handleUploadCancel = () => {
    setSelectedFile(null);
    setTrackTitle('');
    setTrackCategory('');
    setShowUploadModal(false);
    setUploadSuccess(false);
    setIsPublic(false);
    setIsBuiltIn(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile || !trackTitle.trim()) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Generate a unique file name and ID
      const trackId = uuidv4();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${trackId}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('audio-files')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);
      
      // Create a record in the audio_tracks table
      // Include the ID field to satisfy the not-null constraint
      const { error: dbError, data: trackData } = await supabase
        .from('audio_tracks')
        .insert([
          { 
            id: trackId,
            name: trackTitle,
            url: publicUrl,
            user_id: user.id,
            is_public: isPublic,
            category: trackCategory || null
          }
        ])
        .select();
      
      if (dbError) throw dbError;
      
      // Set success state and track ID for scrolling
      setUploadSuccess(true);
      setNewTrackId(trackData[0].id);
      
      // Refresh the tracks list
      fetchUserTracks();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const scrollToNewTrack = () => {
    if (newTrackId) {
      const trackElement = document.getElementById(`track-${newTrackId}`);
      if (trackElement) {
        trackElement.scrollIntoView({ behavior: 'smooth' });
        trackElement.classList.add('bg-primary/20');
        setTimeout(() => {
          trackElement.classList.remove('bg-primary/20');
        }, 2000);
      }
      setNewTrackId(null);
    }
    setShowUploadModal(false);
  };

  // Toggle dropdown menu for a track
  const toggleDropdown = (e, trackId) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDropdown(activeDropdown === trackId ? null : trackId);
  };

  // Open edit modal for a track
  const handleEditClick = (e, track) => {
    e.stopPropagation();
    setEditTrack(track);
    setEditTrackName(track.name || track.title || '');
    setEditTrackIsBuiltIn(track.is_built_in || false);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  // Handle edit confirmation
  const handleEditConfirm = async () => {
    if (!editTrack) return;
    
    try {
      setIsUpdating(true);
      
      // Update track name
      const { error } = await supabase
        .from('audio_tracks')
        .update({ name: editTrackName.trim() })
        .eq('id', editTrack.id);
      
      if (error) throw error;
      
      // If user is admin, try to update built-in status separately
      // This is done separately to handle the case where the column doesn't exist yet
      if (isAdmin && editTrackIsBuiltIn) {
        try {
          await supabase
            .from('audio_tracks')
            .update({ is_built_in: editTrackIsBuiltIn })
            .eq('id', editTrack.id);
        } catch (builtInError) {
          console.log('Built-in status update failed, column may not exist yet:', builtInError);
          // Don't throw error, just log it
        }
      }
      
      // Refresh tracks list
      await fetchUserTracks();
      
      // Close modal
      setShowEditModal(false);
      setEditTrack(null);
      setEditTrackName('');
      setEditTrackIsBuiltIn(false);
    } catch (err) {
      console.error('Error updating track:', err);
      alert('Error updating track. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete a track
  const handleDeleteClick = async (e, track) => {
    e.stopPropagation();
    setActiveDropdown(null);

    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${track.name || track.title}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);

      // Check if user is allowed to delete this track
      if (!isAdmin && track.user_id !== user.id) {
        alert('You do not have permission to delete this track.');
        return;
      }

      // Delete from storage if storage_path exists
      if (track.storage_path || track.file_path) {
        const { error: storageError } = await supabase.storage
          .from('audio-files')
          .remove([track.storage_path || track.file_path]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue anyway to delete the database record
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', track.id);

      if (error) throw error;

      // Refresh tracks list
      await fetchUserTracks();
      
      // If the deleted track was selected, clear selection
      if (selectedTrack?.id === track.id) {
        setSelectedTrack(null);
      }
    } catch (err) {
      console.error('Error deleting track:', err);
      alert('Error deleting track. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle public status of a track
  const togglePublicStatus = async (e, track) => {
    e.stopPropagation();
    setActiveDropdown(null);
    
    try {
      setIsUpdating(true);
      
      const newStatus = !(track.is_public || false);
      
      const { error } = await supabase
        .from('audio_tracks')
        .update({ is_public: newStatus })
        .eq('id', track.id);
        
      if (error) throw error;
      
      // Refresh tracks list
      await fetchUserTracks();
      
    } catch (err) {
      console.error('Error updating track visibility:', err);
      alert('Error updating track visibility. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle built-in status of a track
  const toggleBuiltInStatus = async (e, track) => {
    e.stopPropagation();
    setActiveDropdown(null);
    
    try {
      setIsUpdating(true);
      
      // Try to update the built-in status
      const newStatus = !(track.is_built_in || false);
      
      const { error } = await supabase
        .from('audio_tracks')
        .update({ is_built_in: newStatus })
        .eq('id', track.id);
        
      if (error) {
        // Check if the error is related to the column not existing
        if (error.message && (
            error.message.includes("column") || 
            error.message.includes("does not exist") ||
            error.message.includes("is_built_in")
          )) {
          console.error('Column is_built_in does not exist yet:', error);
          alert('This feature is coming soon! The database is being updated to support built-in tracks.');
        } else {
          // For other errors, show the generic error message
          throw error;
        }
      } else {
        // If successful, refresh tracks list
        await fetchUserTracks();
      }
      
    } catch (err) {
      console.error('Error updating track built-in status:', err);
      alert('Error updating track built-in status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if track is in the bottom part of the list
  const isBottomItem = (trackId) => {
    if (!tracks.length) return false;
    
    const trackIndex = tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return false;
    
    // Consider it a bottom item if it's in the last 2 items of the list
    return trackIndex >= tracks.length - 2;
  };

  // Check if track is in the top part of the list
  const isTopItem = (trackId) => {
    if (!tracks.length) return false;
    
    const trackIndex = tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return false;
    
    // Consider it a top item if it's in the first 2 items of the list
    return trackIndex < 2;
  };

  // Add a function to handle viewing the newly uploaded track
  const handleViewTrack = () => {
    // Reset upload states
    setUploadSuccess(false);
    setSelectedFile(null);
    setTrackTitle('');
    setTrackCategory('');
    setIsPublic(false);
    setIsBuiltIn(false);
    setShowUploadModal(false);
    
    // Scroll to the new track
    scrollToNewTrack();
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        <p className="text-red-400">Error loading audio tracks. Please try again later.</p>
      </div>
    );
  }

    return (
    <div>
      {/* Upload Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Audio Tracks</h2>
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Uploading... {uploadProgress}%</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>Upload Audio</span>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          className="hidden"
        />
      </div>

      {tracks.length === 0 ? (
      <div className="text-center py-12 bg-card rounded-xl">
        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <h3 className="text-xl font-medium text-gray-400 mb-1">Your library is empty</h3>
        <p className="text-gray-500">Upload your first audio track to get started</p>
      </div>
      ) : (
    <div className="bg-card rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-700 text-sm font-medium text-gray-300">
        <div className="col-span-6">TRACK NAME</div>
        <div className="col-span-3 text-center">CATEGORY</div>
            <div className="col-span-3 text-center">ACTIONS</div>
      </div>

      {/* Track list */}
      <div className="divide-y divide-gray-800">
        {tracks.map(track => (
          <div 
            key={track.id} 
                id={`track-${track.id}`}
            className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-800/50 transition-colors cursor-pointer ${
              selectedTrack?.id === track.id ? 'bg-primary/10' : ''
            }`}
            onClick={() => setSelectedTrack(track)}
          >
                <div className="col-span-6 font-medium flex items-center">
                  <div className="flex items-center">
                    <span className="mr-2">{track.title || track.name}</span>
                    {track.is_public && (
                      <div className="flex items-center bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                        <Globe size={12} className="mr-1" />
                        <span>Public</span>
                      </div>
                    )}
                  </div>
                </div>
            <div className="col-span-3 text-center">
              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(track.category)}`}>
                {track.category}
              </span>
            </div>
                <div className="col-span-3 flex items-center justify-center space-x-2">
              <button 
                className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackSelect(track);
                }}
                    title="Play"
                  >
                    <Play size={16} />
                  </button>
                  
                  {/* Only show edit/delete for user's own tracks or if admin */}
                  {(isAdmin || track.user_id === user.id) && (
                    <div className="relative">
                      <button 
                        className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        onClick={(e) => toggleDropdown(e, track.id)}
                        title="More options"
                        id={`more-options-${track.id}`}
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {/* Dropdown menu with dynamic positioning */}
                      {activeDropdown === track.id && (
                        <div 
                          className="fixed bg-gray-800 rounded-md shadow-lg z-50 py-1 w-48"
                          style={{
                            left: (() => {
                              // Get the position of the button
                              const button = document.getElementById(`more-options-${track.id}`);
                              if (!button) return 0;
                              const rect = button.getBoundingClientRect();
                              return rect.right - 192; // 192px = width of dropdown (w-48)
                            })(),
                            top: (() => {
                              // Get the position of the button
                              const button = document.getElementById(`more-options-${track.id}`);
                              if (!button) return 0;
                              const rect = button.getBoundingClientRect();
                              
                              // Check if there's enough space below
                              const spaceBelow = window.innerHeight - rect.bottom;
                              if (spaceBelow >= 150) { // Enough space below
                                return rect.bottom + 5;
                              } else { // Not enough space below, position above
                                return Math.max(rect.top - 150, 10); // 150px = approximate height of dropdown
                              }
                            })(),
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            onClick={(e) => handleEditClick(e, track)}
                          >
                            <Edit size={16} className="mr-2" />
                            Rename
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            onClick={(e) => togglePublicStatus(e, track)}
                            disabled={isUpdating}
                          >
                            {track.is_public ? (
                              <>
                                <Lock size={16} className="mr-2" />
                                Make Private
                              </>
                            ) : (
                              <>
                                <Globe size={16} className="mr-2" />
                                Make Public
                              </>
                            )}
                          </button>
                          
                          {isAdmin && (
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                              onClick={(e) => toggleBuiltInStatus(e, track)}
                              disabled={isUpdating}
                            >
                              {track.is_built_in ? (
                                <>
                                  <Music size={16} className="mr-2" />
                                  Remove from Built-in
                                </>
                              ) : (
                                <>
                                  <Music size={16} className="mr-2" />
                                  Include in Built-in
                                </>
                              )}
                            </button>
                          )}
                          
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            onClick={(e) => handleDeleteClick(e, track)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-xl">
            {uploadSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Upload Successful!</h3>
                <p className="text-gray-300 mb-6">Your audio track has been added to your library.</p>
                <button
                  onClick={handleViewTrack}
                  className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-lg transition-colors"
                >
                  View in Library
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-white">Upload Audio Track</h3>
                  <button 
                    onClick={handleUploadCancel}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Music size={24} className="text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-medium truncate">{selectedFile?.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Track Title
                  </label>
                  <input
                    type="text"
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                    placeholder="Enter a title for your track"
                  />
                  
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={trackCategory}
                    onChange={(e) => setTrackCategory(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                  >
                    <option value="">Select Category</option>
                    <option value="nature">Nature</option>
                    <option value="music">Music</option>
                    <option value="voice">Voice</option>
                    <option value="beats">Beats</option>
                  </select>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="is-public"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="is-public" className="ml-2 text-sm text-gray-300 flex items-center">
                      <Globe size={16} className="mr-1" />
                      Make this track public in the community library
                    </label>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="is-built-in"
                        checked={isBuiltIn}
                        onChange={(e) => setIsBuiltIn(e.target.checked)}
                        className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
                      />
                      <label htmlFor="is-built-in" className="ml-2 text-sm text-gray-300 flex items-center">
                        <Music size={16} className="mr-1" />
                        Include in built-in sounds (Admin only)
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleUploadCancel}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadConfirm}
                    disabled={uploading || !trackTitle.trim()}
                    className="flex-1 bg-primary hover:bg-primary/80 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        <span>{uploadProgress}%</span>
                      </>
                    ) : (
                      <span>Upload</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Track Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-medium text-white mb-4">Rename Track</h3>
            
            <div className="mb-4">
              <label htmlFor="track-name" className="block text-sm font-medium text-gray-300 mb-2">
                Track Name
              </label>
              <input
                type="text"
                id="track-name"
                value={editTrackName}
                onChange={(e) => setEditTrackName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Enter track name"
              />
            </div>
            
            {isAdmin && (
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="is-built-in-edit"
                  checked={editTrackIsBuiltIn}
                  onChange={(e) => setEditTrackIsBuiltIn(e.target.checked)}
                  className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="is-built-in-edit" className="ml-2 text-sm text-gray-300 flex items-center">
                  <Music size={16} className="mr-1" />
                  Include in built-in sounds (Admin only)
                </label>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditTrack(null);
                  setEditTrackName('');
                  setEditTrackIsBuiltIn(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditConfirm}
                className="gradient-button"
                disabled={!editTrackName.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

// Helper function for category colors
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
      return 'bg-primary/50 text-primary-light';
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

export default UserAudioLibrary;
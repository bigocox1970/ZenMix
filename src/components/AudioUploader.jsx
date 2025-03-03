import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';

const AudioUploader = ({ onUploadComplete }) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('nature');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid audio file (MP3, WAV, OGG, or M4A)');
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(null);

    // Auto-fill title from filename
    if (!title) {
      const fileName = selectedFile.name.split('.')[0];
      setTitle(fileName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your track');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);

      // Create a unique file path
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get the signed URL with a long expiration
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('audio-files')
        .createSignedUrl(filePath, 365 * 24 * 60 * 60); // 1 year expiration

      if (signedUrlError) throw signedUrlError;

      // Add track to database with signed URL and expiration
      const { data: trackData, error: trackError } = await supabase
        .from('audio_tracks')
        .insert([{
          title,
          category,
          url: signedUrlData.signedUrl,
          file_path: filePath,
          user_id: user.id,
          url_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        }])
        .select()
        .single();

      if (trackError) throw trackError;

      // Show success message
      setSuccess('File uploaded successfully!');

      // Play success sound
      const successSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAZIAAGBgYGDQ0NDQ0UFBQUGxsbGxsiIiIiKSkpKSkwMDAwNzc3Nzc+Pj4+RUVFRU5OTk5OVVVVVVxcXFxcY2NjY2pqampqcXFxcXh4eHh4f39/f4aGhoaNjY2NjZSUlJSbm5ubm6KioqKpqampqbCwsLC3t7e3t76+vr7FxcXFzMzMzMzT09PT2tra2tra4eHh4ejo6Ojo7+/v7/b29vb2/f39/f7+/v7+//8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAGSCFYzeuAAAAAAAAAAAAAAAAAAAA//tQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
      successSound.play().catch(console.error);

      // Reset form
      setFile(null);
      setTitle('');
      setCategory('nature');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(trackData);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload audio file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-900/30 rounded-lg text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="audio-file" className="block text-gray-300 mb-2">
            Audio File (MP3, WAV, OGG, M4A)
          </label>
          <input
            type="file"
            id="audio-file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/x-m4a"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            disabled={isUploading}
          />
          {file && (
            <p className="mt-1 text-sm text-gray-400">
              Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            placeholder="Enter track title"
            disabled={isUploading}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            disabled={isUploading}
          >
            <option value="nature">Nature</option>
            <option value="music">Music</option>
            <option value="voice">Voice</option>
            <option value="beats">Beats</option>
            <option value="other">Other</option>
          </select>
        </div>

        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full gradient-button"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Track'}
        </button>
      </form>
    </div>
  );
};

export default AudioUploader;
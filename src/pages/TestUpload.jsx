import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import Header from '../components/Header';

const TestUpload = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid audio file (MP3, WAV, or OGG)');
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create a unique file path in the user's folder
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      console.log('Uploading to path:', filePath);

      // Upload file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      console.log('Upload successful:', data);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      setUploadedUrl(publicUrl);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header isLoggedIn={!!user} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Test File Upload</h1>

            <div className="bg-card rounded-xl p-6">
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Select Audio File</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  disabled={uploading}
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-400">
                    Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="gradient-button w-full"
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>

              {uploadedUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Upload Successful!</h3>
                  <p className="text-sm text-gray-400 break-all">{uploadedUrl}</p>
                  <audio 
                    controls 
                    src={uploadedUrl}
                    className="mt-4 w-full"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TestUpload;
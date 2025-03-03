/*
  # Storage Bucket Policies

  1. New Policies
    - Public read access for audio files
    - Authenticated users can upload to their own folder
    - Users can update/delete their own files
    - Folder-based access control using user ID

  2. Changes
    - Creates audio-files bucket if it doesn't exist
    - Adds policies for CRUD operations
    - Organizes files by user ID folders
*/

-- Create the audio-files bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true)
ON CONFLICT (id) DO NOTHING;

-- Remove any existing policies for the bucket
DROP POLICY IF EXISTS "Public can read audio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;

-- Create new storage policies

-- 1. Public read access
CREATE POLICY "Public can read audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-files');

-- 2. Authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Users can update their own files
CREATE POLICY "Users can update their own audio files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audio-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Users can delete their own files
CREATE POLICY "Users can delete their own audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
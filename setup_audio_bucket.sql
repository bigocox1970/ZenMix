-- Create audio-files bucket if it doesn't exist
DO $$
BEGIN
  -- First check if bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'audio-files'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('audio-files', 'audio-files', true);
    
    RAISE NOTICE 'Created audio-files bucket';
  END IF;
END $$;

-- Remove any existing policies for the audio-files bucket
DROP POLICY IF EXISTS "Public can view audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;

-- Create storage policies for audio-files bucket

-- 1. Public read access for audio files
CREATE POLICY "Public can view audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-files');

-- 2. Authenticated users can upload audio files
CREATE POLICY "Users can upload audio files"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Users can update their own audio files
CREATE POLICY "Users can update their own audio files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audio-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Users can delete their own audio files
CREATE POLICY "Users can delete their own audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Verify bucket exists and has correct settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets 
    WHERE id = 'audio-files' AND public = true
  ) THEN
    RAISE EXCEPTION 'Audio-files bucket is not properly configured';
  END IF;
END $$; 
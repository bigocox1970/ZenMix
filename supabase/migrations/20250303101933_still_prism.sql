-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
  -- First check if bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
    
    RAISE NOTICE 'Created avatars bucket';
  END IF;
END $$;

-- Remove any existing policies for the avatars bucket
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create storage policies for avatars bucket

-- 1. Public read access for avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 2. Authenticated users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Verify bucket exists and has correct settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets 
    WHERE id = 'avatars' AND public = true
  ) THEN
    RAISE EXCEPTION 'Avatars bucket is not properly configured';
  END IF;
END $$;
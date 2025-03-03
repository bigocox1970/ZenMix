-- Script to add user_id column to audio_tracks table

-- Check if the column exists before adding it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'audio_tracks'
        AND column_name = 'user_id'
    ) THEN
        -- Add the user_id column with a foreign key reference to profiles
        ALTER TABLE audio_tracks 
        ADD COLUMN user_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
        
        -- Create an index on the user_id column for better performance
        CREATE INDEX idx_audio_tracks_user_id ON audio_tracks(user_id);
        
        -- Update existing records to have NULL user_id (or you could set a default)
        -- This is optional and depends on your application logic
        
        RAISE NOTICE 'Added user_id column to audio_tracks table';
    ELSE
        RAISE NOTICE 'user_id column already exists in audio_tracks table';
    END IF;
END $$;

-- Create or update policies to handle user_id access
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own audio tracks" ON audio_tracks;

-- Create policy for users to view their own audio tracks
CREATE POLICY "Users can view their own audio tracks"
ON audio_tracks
FOR SELECT
TO authenticated
USING (
    user_id IS NULL  -- Public tracks
    OR user_id = auth.uid()  -- User's own tracks
);

-- Policy for users to insert their own audio tracks
DROP POLICY IF EXISTS "Users can insert their own audio tracks" ON audio_tracks;
CREATE POLICY "Users can insert their own audio tracks"
ON audio_tracks
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own audio tracks
DROP POLICY IF EXISTS "Users can update their own audio tracks" ON audio_tracks;
CREATE POLICY "Users can update their own audio tracks"
ON audio_tracks
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Policy for users to delete their own audio tracks
DROP POLICY IF EXISTS "Users can delete their own audio tracks" ON audio_tracks;
CREATE POLICY "Users can delete their own audio tracks"
ON audio_tracks
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'audio_tracks'
    AND column_name = 'user_id'; 
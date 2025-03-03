-- First drop the existing policy
DROP POLICY IF EXISTS "Admins can update built-in status" ON audio_tracks;

-- Drop the existing index
DROP INDEX IF EXISTS idx_audio_tracks_is_built_in;

-- Drop the existing column
ALTER TABLE audio_tracks DROP COLUMN IF EXISTS is_built_in;

-- Recreate the column with proper default
ALTER TABLE audio_tracks ADD COLUMN is_built_in BOOLEAN DEFAULT FALSE;

-- Update all existing records to have FALSE instead of NULL
UPDATE audio_tracks SET is_built_in = FALSE WHERE is_built_in IS NULL;

-- Create index for better performance
CREATE INDEX idx_audio_tracks_is_built_in ON audio_tracks(is_built_in);

-- Recreate the policy for admins using the profiles table
CREATE POLICY "Admins can update built-in status"
  ON audio_tracks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE));

-- Grant permissions to update the column
GRANT UPDATE (is_built_in) ON audio_tracks TO authenticated;

-- Verify the column exists and has proper permissions
COMMENT ON COLUMN audio_tracks.is_built_in IS 'Boolean flag indicating if a track is built-in. Only admins can modify this.';

-- Verify the column was created properly
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'audio_tracks' AND column_name = 'is_built_in';

-- Show a sample of records to verify the default value is applied
SELECT id, name, is_built_in FROM audio_tracks LIMIT 10; 
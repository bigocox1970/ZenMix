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
-- Add is_built_in column to audio_tracks table
ALTER TABLE audio_tracks ADD COLUMN IF NOT EXISTS is_built_in BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_audio_tracks_is_built_in ON audio_tracks(is_built_in);

-- Update RLS policies to allow admins to manage built-in tracks
CREATE POLICY "Admins can update built-in status"
  ON audio_tracks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)); 
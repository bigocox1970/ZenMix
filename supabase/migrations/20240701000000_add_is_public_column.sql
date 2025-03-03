-- Add is_public column to audio_tracks table
ALTER TABLE audio_tracks ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Add is_built_in column to audio_tracks table
ALTER TABLE audio_tracks ADD COLUMN IF NOT EXISTS is_built_in BOOLEAN DEFAULT FALSE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audio_tracks_is_public ON audio_tracks(is_public);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_is_built_in ON audio_tracks(is_built_in);

-- Update RLS policies to allow public tracks to be viewed by all authenticated users
DROP POLICY IF EXISTS "Users can view public tracks" ON audio_tracks;

CREATE POLICY "Users can view public tracks"
  ON audio_tracks
  FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = user_id); 
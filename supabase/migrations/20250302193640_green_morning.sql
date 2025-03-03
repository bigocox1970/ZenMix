-- Add url_expires_at column to audio_tracks table
ALTER TABLE audio_tracks
ADD COLUMN IF NOT EXISTS url_expires_at timestamptz;

-- Create index for url expiration queries
CREATE INDEX IF NOT EXISTS idx_audio_tracks_url_expires_at 
ON audio_tracks(url_expires_at);

-- Update existing tracks to have a default expiration of 1 year from now
UPDATE audio_tracks 
SET url_expires_at = NOW() + interval '1 year'
WHERE url_expires_at IS NULL;
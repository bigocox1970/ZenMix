/*
  # Fix cron functionality

  1. Changes
    - Enable pg_cron extension
    - Create refresh_expired_signed_urls function without cron dependency
    - Add manual refresh trigger
  
  2. Security
    - Function runs with security definer to access storage
    - Limited to authenticated users
*/

-- Enable the pg_cron extension if available
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
EXCEPTION
  WHEN undefined_file OR insufficient_privilege THEN
    RAISE NOTICE 'pg_cron extension is not available or could not be created. Skipping cron setup.';
END $$;

-- Create function to refresh signed URLs without cron dependency
CREATE OR REPLACE FUNCTION refresh_expired_signed_urls()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  track RECORD;
  new_signed_url TEXT;
BEGIN
  -- Only process tracks that need URL refresh
  FOR track IN 
    SELECT * FROM audio_tracks 
    WHERE url_expires_at < now() + interval '7 days'
    OR url_expires_at IS NULL
  LOOP
    BEGIN
      -- Get new signed URL from storage
      SELECT storage.create_signed_url(
        'audio-files',
        track.file_path,
        365 * 24 * 60 * 60 -- 1 year in seconds
      ) INTO new_signed_url;
      
      -- Update track with new URL and expiration
      UPDATE audio_tracks SET
        url = new_signed_url,
        url_expires_at = now() + interval '1 year',
        updated_at = now()
      WHERE id = track.id;
      
      RAISE NOTICE 'Updated signed URL for track %', track.id;
    EXCEPTION WHEN OTHERS THEN
      -- Log error but continue processing other tracks
      RAISE NOTICE 'Error updating track %: %', track.id, SQLERRM;
    END;
  END LOOP;
END;
$$;

-- Create a function to manually trigger URL refresh for a specific track
CREATE OR REPLACE FUNCTION refresh_track_signed_url(track_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  track_exists boolean;
  new_signed_url TEXT;
BEGIN
  -- Check if track exists and belongs to calling user
  SELECT EXISTS (
    SELECT 1 FROM audio_tracks
    WHERE id = track_id
    AND user_id = auth.uid()
  ) INTO track_exists;
  
  IF NOT track_exists THEN
    RETURN false;
  END IF;
  
  -- Get new signed URL
  SELECT storage.create_signed_url(
    'audio-files',
    (SELECT file_path FROM audio_tracks WHERE id = track_id),
    365 * 24 * 60 * 60 -- 1 year in seconds
  ) INTO new_signed_url;
  
  -- Update track
  UPDATE audio_tracks SET
    url = new_signed_url,
    url_expires_at = now() + interval '1 year',
    updated_at = now()
  WHERE id = track_id;
  
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION refresh_track_signed_url(uuid) TO authenticated;

-- Attempt to schedule cron job if extension is available
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    -- Drop existing job if it exists
    PERFORM cron.unschedule('refresh_audio_urls');
    
    -- Schedule new job
    PERFORM cron.schedule(
      'refresh_audio_urls',
      '0 0 * * 0', -- Run at midnight every Sunday
      $$SELECT refresh_expired_signed_urls()$$
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not schedule cron job: %', SQLERRM;
END $$;
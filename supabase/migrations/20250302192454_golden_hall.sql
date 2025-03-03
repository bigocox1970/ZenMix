/*
  # Fix cron job syntax

  1. Changes
    - Fix SQL syntax for cron job scheduling
    - Add proper quoting and escaping
    - Add error handling
  
  2. Security
    - Maintain security definer settings
    - Keep existing permissions
*/

-- Attempt to schedule cron job if extension is available
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    -- Drop existing job if it exists
    PERFORM cron.unschedule('refresh_audio_urls');
    
    -- Schedule new job with proper syntax
    PERFORM cron.schedule(
      'refresh_audio_urls',                    -- job name
      '0 0 * * 0',                            -- schedule (midnight every Sunday)
      'SELECT refresh_expired_signed_urls();'  -- SQL command with proper termination
    );
    
    RAISE NOTICE 'Cron job scheduled successfully';
  ELSE
    RAISE NOTICE 'pg_cron extension not available, skipping cron job setup';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error scheduling cron job: %', SQLERRM;
END $$;
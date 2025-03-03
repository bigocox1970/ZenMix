/*
  # Add test audio data

  1. Changes
    - Add test data to audio_tracks table
    - Add error handling for duplicates
    - Add logging for successful inserts
  
  2. Security
    - Maintain existing RLS policies
    - Keep existing permissions
*/

-- Insert test data with error handling
DO $$
DECLARE
  inserted_count integer := 0;
  error_count integer := 0;
BEGIN
  -- Try to insert each track individually to handle errors gracefully
  BEGIN
    INSERT INTO audio_tracks (title, category, url) VALUES
    ('Rain Sounds', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3')
    ON CONFLICT DO NOTHING;
    IF FOUND THEN inserted_count := inserted_count + 1; END IF;
  EXCEPTION WHEN OTHERS THEN
    error_count := error_count + 1;
    RAISE NOTICE 'Error inserting Rain Sounds: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO audio_tracks (title, category, url) VALUES
    ('Forest Birds', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3')
    ON CONFLICT DO NOTHING;
    IF FOUND THEN inserted_count := inserted_count + 1; END IF;
  EXCEPTION WHEN OTHERS THEN
    error_count := error_count + 1;
    RAISE NOTICE 'Error inserting Forest Birds: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO audio_tracks (title, category, url) VALUES
    ('Ocean Waves', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3')
    ON CONFLICT DO NOTHING;
    IF FOUND THEN inserted_count := inserted_count + 1; END IF;
  EXCEPTION WHEN OTHERS THEN
    error_count := error_count + 1;
    RAISE NOTICE 'Error inserting Ocean Waves: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO audio_tracks (title, category, url) VALUES
    ('Gentle Piano', 'music', 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3')
    ON CONFLICT DO NOTHING;
    IF FOUND THEN inserted_count := inserted_count + 1; END IF;
  EXCEPTION WHEN OTHERS THEN
    error_count := error_count + 1;
    RAISE NOTICE 'Error inserting Gentle Piano: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO audio_tracks (title, category, url) VALUES
    ('Meditation Guide', 'voice', 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3')
    ON CONFLICT DO NOTHING;
    IF FOUND THEN inserted_count := inserted_count + 1; END IF;
  EXCEPTION WHEN OTHERS THEN
    error_count := error_count + 1;
    RAISE NOTICE 'Error inserting Meditation Guide: %', SQLERRM;
  END;

  -- Log results
  RAISE NOTICE 'Audio tracks insertion complete. Inserted: %, Errors: %', inserted_count, error_count;

  -- Verify data
  RAISE NOTICE 'Current audio_tracks contents:';
  FOR track IN SELECT * FROM audio_tracks LOOP
    RAISE NOTICE 'Track: % (%) - %', track.title, track.category, track.url;
  END LOOP;
END $$;
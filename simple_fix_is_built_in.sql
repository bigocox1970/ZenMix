-- Update all existing records to have FALSE instead of NULL
UPDATE audio_tracks SET is_built_in = FALSE WHERE is_built_in IS NULL;

-- Verify the update worked
SELECT COUNT(*) AS null_count FROM audio_tracks WHERE is_built_in IS NULL;
SELECT COUNT(*) AS false_count FROM audio_tracks WHERE is_built_in = FALSE;

-- Show a sample of records to verify
SELECT id, name, is_built_in FROM audio_tracks LIMIT 10; 
-- Add default_duration column to profiles if it doesn't exist
DO $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'default_duration'
  ) THEN
    -- Adding default_duration column with integer type and default value of 10 (minutes)
    RAISE NOTICE 'Adding default_duration column...';
    ALTER TABLE profiles ADD COLUMN default_duration INTEGER DEFAULT 10;
    RAISE NOTICE 'Added default_duration column to profiles table';
    
    -- Create index for better performance
    CREATE INDEX IF NOT EXISTS idx_profiles_default_duration ON profiles(default_duration);
    RAISE NOTICE 'Created index on default_duration column';
    
    -- Update existing profiles with default value
    UPDATE profiles SET default_duration = 10 WHERE default_duration IS NULL;
    RAISE NOTICE 'Updated existing profiles with default duration value';
  ELSE
    RAISE NOTICE 'default_duration column already exists in profiles table';
  END IF;
END $$;

-- Verify the column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'default_duration'
  ) THEN
    RAISE EXCEPTION 'Failed to add default_duration column to profiles table';
  ELSE
    RAISE NOTICE 'Verification successful: default_duration column exists in profiles table';
  END IF;
END $$;

-- Verify the column exists
SELECT 
  column_name, 
  data_type,
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public'
  AND table_name = 'profiles' 
  AND column_name = 'default_duration'; 
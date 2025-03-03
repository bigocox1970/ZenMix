-- Check if profiles table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    -- Create profiles table if it doesn't exist
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- Add is_admin column if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'is_admin'
    ) THEN
      ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
  END IF;
END
$$;

-- Create index on is_admin column
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Verify the column exists
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public'
  AND table_name = 'profiles' 
  AND column_name = 'is_admin'; 
-- Fix all missing columns in the profiles table
DO $$
BEGIN
  -- Check if profiles table exists
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
      nickname TEXT,
      avatar_url TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      is_suspended BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    RAISE NOTICE 'Created profiles table with all required columns';
  ELSE
    -- Add missing columns if they don't exist
    
    -- Check for is_admin column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'is_admin'
    ) THEN
      ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
      RAISE NOTICE 'Added is_admin column to profiles table';
    END IF;
    
    -- Check for is_suspended column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'is_suspended'
    ) THEN
      ALTER TABLE profiles ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE;
      RAISE NOTICE 'Added is_suspended column to profiles table';
    END IF;
    
    -- Check for avatar_url column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'avatar_url'
    ) THEN
      ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
      RAISE NOTICE 'Added avatar_url column to profiles table';
    END IF;
    
    -- Check for nickname column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'nickname'
    ) THEN
      ALTER TABLE profiles ADD COLUMN nickname TEXT;
      RAISE NOTICE 'Added nickname column to profiles table';
    END IF;
    
    -- Check for full_name column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'full_name'
    ) THEN
      ALTER TABLE profiles ADD COLUMN full_name TEXT;
      RAISE NOTICE 'Added full_name column to profiles table';
    END IF;
  END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Verify all columns exist
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public'
  AND table_name = 'profiles' 
ORDER BY column_name; 
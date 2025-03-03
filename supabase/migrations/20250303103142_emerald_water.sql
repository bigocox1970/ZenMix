-- Add nickname and avatar_url columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS nickname text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);

-- Update any existing profiles to have a default nickname from their email
UPDATE profiles 
SET nickname = SPLIT_PART(email, '@', 1)
WHERE nickname IS NULL;

-- Verify the columns were added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name IN ('nickname', 'avatar_url')
  ) THEN
    RAISE EXCEPTION 'Columns were not added successfully';
  END IF;
END $$;
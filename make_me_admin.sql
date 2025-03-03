-- First, make sure the is_admin column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
  END IF;
END
$$;

-- Make the current user an admin
UPDATE profiles 
SET is_admin = true 
WHERE id = auth.uid();

-- Verify the change
SELECT id, email, is_admin FROM profiles WHERE id = auth.uid(); 
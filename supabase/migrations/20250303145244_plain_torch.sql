/*
  # Add is_admin column to profiles table

  1. Changes
    - Adds is_admin column to profiles table
    - Sets default value to false
    - Updates RLS policies to handle admin access

  2. Security
    - Only admins can modify admin status
    - Regular users can't escalate privileges
    - Maintains existing access controls

  3. Notes
    - Safe to run multiple times
    - Preserves existing data
*/

-- Add is_admin column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() 
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() 
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    CASE 
      -- Admins can do anything
      WHEN (SELECT is_admin FROM profiles WHERE id = auth.uid()) THEN true
      -- Regular users updating their own profile
      WHEN id = auth.uid() THEN 
        -- Check if they're trying to change admin status
        is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
      -- Everyone else is denied
      ELSE false
    END
  );

-- Verify the column and policies were created
DO $$
BEGIN
  -- Check if column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    RAISE EXCEPTION 'is_admin column was not created';
  END IF;

  -- Check if policies exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname IN (
      'Users can view their own profile',
      'Users can update their own profile'
    )
  ) THEN
    RAISE EXCEPTION 'Policies were not created successfully';
  END IF;
END $$;
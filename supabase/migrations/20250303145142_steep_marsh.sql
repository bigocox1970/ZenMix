/*
  # Fix RLS Policy for Profile Updates

  1. Changes
    - Fixes the RLS policy for profile updates
    - Removes reference to OLD in WITH CHECK clause
    - Maintains admin role security

  2. Security
    - Preserves admin role protection
    - Ensures users can't escalate their own privileges
    - Maintains existing access controls

  3. Notes
    - Uses subquery instead of OLD reference
    - More robust policy implementation
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new update policy without OLD reference
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

-- Verify the policy was created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    RAISE EXCEPTION 'Policy was not created successfully';
  END IF;
END $$;
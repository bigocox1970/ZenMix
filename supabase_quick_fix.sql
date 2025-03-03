-- Quick fix for admin functionality

-- Add is_admin column to profiles if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create a simple policy that allows all authenticated users to view all profiles
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Make the current user an admin (useful for testing)
UPDATE profiles
SET is_admin = true
WHERE id = auth.uid(); 
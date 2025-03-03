/*
  # Fix Admin Role Setup

  1. Changes
    - Adds admin role to profiles table instead of auth.users
    - Adds proper functions for admin checks
    - Fixes role management

  2. Security
    - Uses profiles table for role management
    - Adds proper RLS policies
    - Ensures secure role checks

  3. Notes
    - Moves away from modifying auth.users table
    - Uses profiles table which we control
*/

-- Add is_admin column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create function to check if current user is admin
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

-- Create function to make user admin (requires existing admin)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- Check if calling user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can make other users admin';
  END IF;

  -- Update user's admin status
  UPDATE profiles
  SET 
    is_admin = true,
    updated_at = now()
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create first admin function (only works if no admins exist)
CREATE OR REPLACE FUNCTION public.create_first_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- Only allow if no admins exist
  IF EXISTS (SELECT 1 FROM profiles WHERE is_admin = true) THEN
    RAISE EXCEPTION 'Admin users already exist';
  END IF;

  -- Make the specified user admin
  UPDATE profiles
  SET 
    is_admin = true,
    updated_at = now()
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for profiles to handle admin column
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

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
      WHEN (SELECT is_admin FROM profiles WHERE id = auth.uid()) THEN true
      WHEN id = auth.uid() THEN 
        -- Regular users can't modify their admin status
        is_admin IS NOT DISTINCT FROM OLD.is_admin
      ELSE false
    END
  );

-- Create view for admin users
CREATE OR REPLACE VIEW admin_users AS
SELECT p.*, u.email as auth_email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.is_admin = true;

-- Grant appropriate permissions
GRANT SELECT ON admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.make_user_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_first_admin TO authenticated;
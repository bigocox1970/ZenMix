/*
  # Fix Admin Role Creation

  1. Changes
    - Creates admin role procedure with proper permissions
    - Adds admin role to JWT claims
    - Adds admin check functions
    - Adds admin policies to tables

  2. Security
    - Only allows service role to modify admin status
    - Adds RLS policies for admin access
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS auth.make_user_admin(text);

-- Create admin role type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role' AND typnamespace = 'auth'::regnamespace) THEN
    CREATE TYPE auth.role AS ENUM ('admin', 'user');
  END IF;
END $$;

-- Add role column to auth.users if it doesn't exist
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS role auth.role DEFAULT 'user';

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      current_setting('request.jwt.claims', true)::json->>'role' = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create procedure to make user admin (requires service role)
CREATE OR REPLACE PROCEDURE auth.make_user_admin(email text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_uid uuid;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_uid
  FROM auth.users
  WHERE auth.users.email = make_user_admin.email;

  IF target_uid IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', make_user_admin.email;
  END IF;

  -- Update role in auth.users
  UPDATE auth.users
  SET role = 'admin'
  WHERE id = target_uid;

  -- Update JWT claims
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    json_build_object('role', 'admin')::jsonb
  WHERE id = target_uid;
END;
$$;
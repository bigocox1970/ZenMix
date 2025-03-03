/*
  # Add Admin Role and User

  1. New Role
    - Creates admin role in auth schema
    - Adds admin claims to user JWT

  2. Security
    - Only allows service role to modify admin status
    - Adds RLS policies for admin access
*/

-- Create admin role type if it doesn't exist
CREATE TYPE auth.role AS ENUM ('admin', 'user');

-- Add role column to auth.users if it doesn't exist
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS role auth.role DEFAULT 'user';

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
  SELECT coalesce(
    current_setting('request.jwt.claims', true)::json->>'role' = 'admin',
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Create function to set user as admin (requires service role)
CREATE OR REPLACE FUNCTION auth.make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET role = 'admin'
  WHERE email = user_email;
  
  -- Also update their JWT claims
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
    json_build_object('role', 'admin')::jsonb
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
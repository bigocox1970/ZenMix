/*
  # Fix Auth and Profiles Setup

  1. Changes
    - Removes admin role dependency
    - Fixes profiles table RLS policies
    - Adds proper indexes and constraints
    - Updates profile creation trigger

  2. Security
    - Enables RLS on profiles table
    - Adds proper policies for authenticated users
    - Ensures data integrity with constraints

  3. Notes
    - Removes previous admin role setup that was causing errors
    - Simplifies auth model to just use authenticated users
*/

-- Drop any existing admin role functions/types
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS auth.make_user_admin(text) CASCADE;
DROP PROCEDURE IF EXISTS auth.make_user_admin(text) CASCADE;
DROP VIEW IF EXISTS auth.user_roles CASCADE;
DROP TYPE IF EXISTS auth.role CASCADE;

-- Recreate profiles table with proper structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  nickname text,
  avatar_url text,
  default_duration integer DEFAULT 10,
  preferred_voice text DEFAULT 'female',
  preferred_background text DEFAULT 'nature',
  notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT profiles_email_check CHECK (email ~* '^.+@.+\..+$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert profiles for existing users
INSERT INTO profiles (id, email)
SELECT id, email 
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    updated_at = now();

-- Verify setup
DO $$
BEGIN
  -- Check if profiles table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION 'Profiles table does not exist';
  END IF;

  -- Check if RLS is enabled
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) THEN
    RAISE EXCEPTION 'RLS not enabled on profiles table';
  END IF;

  -- Check if policies exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles') THEN
    RAISE EXCEPTION 'No policies found for profiles table';
  END IF;

  -- Check if trigger exists
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    RAISE EXCEPTION 'New user trigger not found';
  END IF;

  RAISE NOTICE 'All checks passed - profiles setup is complete';
END $$;
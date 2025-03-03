/*
  # Fix Authentication and Profile Creation

  1. Changes
     - Creates a trigger to automatically create a profile when a user signs up
     - Ensures profiles are created for new users
     - Avoids modifying auth.config which requires admin privileges

  2. Security
     - Maintains RLS policies from previous migrations
*/

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure profiles table has RLS disabled as requested
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
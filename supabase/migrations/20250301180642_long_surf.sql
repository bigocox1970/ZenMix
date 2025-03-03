-- This SQL file will fix authentication issues by:
-- 1. Creating the profiles table if it doesn't exist
-- 2. Disabling RLS on the profiles table
-- 3. Creating a function to automatically create profiles for new users
-- 4. Creating a trigger to call that function when users sign up
-- 5. Adding any existing users to the profiles table

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Disable Row Level Security on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into the profiles table
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Try to create the trigger (this might fail if you don't have permissions)
DO $$
BEGIN
  BEGIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'Insufficient privileges to create trigger on auth.users. Manual profile creation will be needed.';
  END;
END $$;

-- Insert any existing users into profiles table
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Verify the profiles table has been created and populated
SELECT COUNT(*) FROM profiles;
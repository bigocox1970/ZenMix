-- This SQL file can be executed directly in your database
-- It creates the necessary profiles table and handles user creation

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

-- Create the trigger (this might fail if you don't have permissions)
-- If this fails, you'll need to create the trigger manually in the Supabase dashboard
DO $$
BEGIN
  BEGIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'Insufficient privileges to create trigger on auth.users. Please create this trigger manually in the Supabase dashboard.';
  END;
END $$;

-- Insert any existing users into profiles table
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
/*
  # User profile management

  1. New Functions
    - Create a function to handle new user registration
    - Set up automatic profile creation for new users

  2. Security
    - Disable row level security on profiles table
*/

-- Create a function to handle new user registration
-- This will be triggered when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into the profiles table
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure profiles table has RLS disabled as requested
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Note: We cannot directly modify auth schema settings like email confirmation
-- as it requires elevated privileges. These settings should be configured
-- through the Supabase dashboard instead.
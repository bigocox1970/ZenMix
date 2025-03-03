/*
  # Fix Auth Settings

  1. Changes
    - Disable email confirmations for easier signup
    - Ensure profiles are created automatically
  
  2. Purpose
    - Simplify the authentication flow
    - Make signup process work without email confirmation
*/

-- Disable email confirmations for easier signup
UPDATE auth.config
SET confirm_email_identity_verification = false,
    enable_signup = true;

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
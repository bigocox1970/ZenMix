-- Drop any existing admin functions to start fresh
DROP FUNCTION IF EXISTS auth.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Create function to make user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Grant execute permissions to all users
GRANT EXECUTE ON FUNCTION public.is_admin TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.make_user_admin TO PUBLIC;

-- Make sure first user is admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE is_admin = true) THEN
    UPDATE profiles
    SET is_admin = true
    WHERE id = (
      SELECT id 
      FROM profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
END $$;
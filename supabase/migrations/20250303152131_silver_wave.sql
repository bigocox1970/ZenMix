-- Drop any existing admin-related functions
DROP FUNCTION IF EXISTS auth.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;

-- Create function to make user admin (requires service role)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.make_user_admin TO authenticated;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  is_user_admin boolean;
BEGIN
  SELECT is_admin INTO is_user_admin
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_user_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Create first admin if none exists
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
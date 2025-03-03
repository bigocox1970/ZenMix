-- Add is_admin column to profiles if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Update RLS policies to allow admin access
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() 
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() 
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    CASE 
      -- Admins can do anything
      WHEN (SELECT is_admin FROM profiles WHERE id = auth.uid()) THEN true
      -- Regular users updating their own profile
      WHEN id = auth.uid() THEN 
        -- Check if they're trying to change admin status
        is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
      -- Everyone else is denied
      ELSE false
    END
  );

-- Create function to check if current user is admin
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to make user admin (requires existing admin)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- Check if calling user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can make other users admin';
  END IF;

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
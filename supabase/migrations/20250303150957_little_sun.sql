-- Add admin and suspension columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_suspended ON profiles(is_suspended);

-- Update RLS policies to handle admin and suspension
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- View policy
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own profile
    id = auth.uid() 
    -- Admins can view all profiles
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid())
    -- Non-suspended users can view public profiles
    OR (NOT (SELECT is_suspended FROM profiles WHERE id = auth.uid()))
  );

-- Update policy
CREATE POLICY "Users can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    -- Users can update their own profile if not suspended
    (id = auth.uid() AND NOT (SELECT is_suspended FROM profiles WHERE id = auth.uid()))
    -- Admins can update any profile
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    CASE 
      -- Admins can do anything
      WHEN (SELECT is_admin FROM profiles WHERE id = auth.uid()) THEN true
      -- Regular users updating their own profile
      WHEN id = auth.uid() THEN 
        -- Can't modify admin or suspension status
        is_admin IS NOT DISTINCT FROM (SELECT is_admin FROM profiles WHERE id = auth.uid())
        AND is_suspended IS NOT DISTINCT FROM (SELECT is_suspended FROM profiles WHERE id = auth.uid())
      -- Everyone else is denied
      ELSE false
    END
  );

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
    AND NOT is_suspended
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to toggle user admin status
CREATE OR REPLACE FUNCTION public.toggle_user_admin(user_id uuid, make_admin boolean)
RETURNS void AS $$
BEGIN
  -- Check if calling user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can modify admin status';
  END IF;

  -- Update user's admin status
  UPDATE profiles
  SET 
    is_admin = make_admin,
    updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to toggle user suspension
CREATE OR REPLACE FUNCTION public.toggle_user_suspension(user_id uuid, suspend boolean)
RETURNS void AS $$
BEGIN
  -- Check if calling user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can modify suspension status';
  END IF;

  -- Update user's suspension status
  UPDATE profiles
  SET 
    is_suspended = suspend,
    updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_user_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_user_suspension TO authenticated;

-- Create admin view
CREATE OR REPLACE VIEW admin_users AS
SELECT p.*, u.email as auth_email, u.confirmed_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.is_admin = true;

-- Grant select permission on admin view
GRANT SELECT ON admin_users TO authenticated;
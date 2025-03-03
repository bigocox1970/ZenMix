-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;

-- Create simpler policies that allow users to view and update their own profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Drop admin-related functions that might be causing issues
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.toggle_user_admin(uuid, boolean);
DROP FUNCTION IF EXISTS public.toggle_user_suspension(uuid, boolean);
DROP VIEW IF EXISTS admin_users; 
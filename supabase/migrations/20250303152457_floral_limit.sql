-- Drop all admin-related functions
DROP FUNCTION IF EXISTS auth.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.toggle_user_admin(uuid, boolean) CASCADE;
DROP FUNCTION IF EXISTS public.toggle_user_suspension(uuid, boolean) CASCADE;

-- Remove admin column from profiles
ALTER TABLE profiles 
DROP COLUMN IF EXISTS is_admin,
DROP COLUMN IF EXISTS is_suspended;

-- Drop admin-related indexes
DROP INDEX IF EXISTS idx_profiles_is_admin;
DROP INDEX IF EXISTS idx_profiles_is_suspended;

-- Update RLS policies to remove admin checks
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;

-- Create simple RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());
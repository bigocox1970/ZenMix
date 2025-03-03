-- Drop all admin-related functions and types
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS auth.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.toggle_user_admin(uuid, boolean) CASCADE;
DROP FUNCTION IF EXISTS public.toggle_user_suspension(uuid, boolean) CASCADE;
DROP TYPE IF EXISTS auth.role CASCADE;

-- Simplify profiles table
ALTER TABLE profiles
DROP COLUMN IF EXISTS is_admin,
DROP COLUMN IF EXISTS is_suspended;

-- Drop admin-related indexes
DROP INDEX IF EXISTS idx_profiles_is_admin;
DROP INDEX IF EXISTS idx_profiles_is_suspended;

-- Recreate basic profile structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  nickname text,
  avatar_url text,
  default_duration integer DEFAULT 10,
  preferred_voice text DEFAULT 'female',
  preferred_background text DEFAULT 'nature',
  notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

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

-- Create trigger for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert any missing profiles
INSERT INTO profiles (id, email)
SELECT id, email
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;
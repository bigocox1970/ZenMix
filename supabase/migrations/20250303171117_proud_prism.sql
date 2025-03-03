-- Drop all admin-related functions and types
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS auth.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.toggle_user_admin(uuid, boolean) CASCADE;
DROP FUNCTION IF EXISTS public.toggle_user_suspension(uuid, boolean) CASCADE;
DROP TYPE IF EXISTS auth.role CASCADE;

-- Remove admin columns from profiles
ALTER TABLE profiles 
DROP COLUMN IF EXISTS is_admin,
DROP COLUMN IF EXISTS is_suspended;

-- Drop admin-related indexes
DROP INDEX IF EXISTS idx_profiles_is_admin;
DROP INDEX IF EXISTS idx_profiles_is_suspended;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Disable RLS temporarily to fix any data issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

-- Update RLS policies for other tables
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Users can insert their own tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Users can update their own tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Users can delete their own tracks" ON audio_tracks;

-- Audio tracks policies
CREATE POLICY "Anyone can view tracks"
  ON audio_tracks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own tracks"
  ON audio_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tracks"
  ON audio_tracks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own tracks"
  ON audio_tracks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON meditation_sessions;

-- Meditation sessions policies
CREATE POLICY "Users can view their own sessions"
  ON meditation_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own sessions"
  ON meditation_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions"
  ON meditation_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own sessions"
  ON meditation_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
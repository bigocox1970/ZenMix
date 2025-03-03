-- Drop any existing admin-related objects
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS auth.make_user_admin(text) CASCADE;
DROP PROCEDURE IF EXISTS auth.make_user_admin(text) CASCADE;
DROP VIEW IF EXISTS auth.user_roles CASCADE;
DROP TYPE IF EXISTS auth.role CASCADE;

-- Add is_admin column to profiles if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new RLS policies
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.toggle_user_admin TO authenticated;

-- Update RLS policies for other tables
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Audio tracks policies
CREATE POLICY "Users can view all tracks"
  ON audio_tracks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own tracks"
  ON audio_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update their own tracks"
  ON audio_tracks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can delete their own tracks"
  ON audio_tracks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Meditation sessions policies
CREATE POLICY "Users can view their own sessions"
  ON meditation_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create their own sessions"
  ON meditation_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions"
  ON meditation_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can delete their own sessions"
  ON meditation_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Create first admin if none exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE is_admin = true) THEN
    -- Update the first user to be an admin
    UPDATE profiles
    SET is_admin = true
    WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);
  END IF;
END $$;
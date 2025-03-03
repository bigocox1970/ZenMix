/*
  # Complete Database Recreation Script
  
  This script recreates all necessary database tables, columns, indexes, functions, 
  triggers, and storage buckets for the meditation app.
  
  Tables:
  - profiles
  - meditation_sessions
  - audio_tracks
  
  Storage Buckets:
  - avatars
  - audio-files
*/

-- ==========================================
-- TABLES
-- ==========================================

-- Create profiles table with all required columns
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  nickname text,
  avatar_url text,
  is_admin boolean DEFAULT false,
  default_duration integer DEFAULT 10,
  preferred_voice text DEFAULT 'female',
  preferred_background text DEFAULT 'nature',
  notifications boolean DEFAULT true
);

-- Create meditation_sessions table
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration text,
  sounds jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create audio_tracks table
CREATE TABLE IF NOT EXISTS audio_tracks (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Create indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_default_duration ON profiles(default_duration);
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_voice ON profiles(preferred_voice);
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_background ON profiles(preferred_background);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Create policies for meditation_sessions
CREATE POLICY "Users can view their own meditation sessions"
  ON meditation_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meditation sessions"
  ON meditation_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation sessions"
  ON meditation_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meditation sessions"
  ON meditation_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for audio_tracks
CREATE POLICY "Anyone can view audio tracks"
  ON audio_tracks
  FOR SELECT
  TO authenticated
  USING (true);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into the profiles table
  INSERT INTO public.profiles (
    id, 
    email, 
    nickname,
    default_duration,
    preferred_voice,
    preferred_background,
    notifications
  )
  VALUES (
    new.id, 
    new.email, 
    SPLIT_PART(new.email, '@', 1),
    10,
    'female',
    'nature',
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Try to create the trigger
DO $$
BEGIN
  BEGIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'Insufficient privileges to create trigger on auth.users. Manual profile creation will be needed.';
  END;
END $$;

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

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

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================

-- Create avatars bucket
DO $$
BEGIN
  -- First check if bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
    
    RAISE NOTICE 'Created avatars bucket';
  END IF;
END $$;

-- Create audio-files bucket
DO $$
BEGIN
  -- First check if bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'audio-files'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('audio-files', 'audio-files', true);
    
    RAISE NOTICE 'Created audio-files bucket';
  END IF;
END $$;

-- Remove any existing policies for the avatars bucket
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create storage policies for avatars bucket
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Remove any existing policies for the audio-files bucket
DROP POLICY IF EXISTS "Public can view audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;

-- Create storage policies for audio-files bucket
CREATE POLICY "Public can view audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-files');

CREATE POLICY "Users can upload their own audio files"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own audio files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audio-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ==========================================
-- SAMPLE DATA
-- ==========================================

-- Insert sample audio tracks if the table is empty
INSERT INTO audio_tracks (id, name, category, url)
SELECT * FROM (
  VALUES
    ('rain', 'Rain', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3'),
    ('forest', 'Forest', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3'),
    ('waves', 'Ocean Waves', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3'),
    ('fire', 'Crackling Fire', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3'),
    ('piano', 'Gentle Piano', 'music', 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3'),
    ('meditation', 'Guided Meditation', 'voice', 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3'),
    ('binaural', 'Binaural Beats', 'beats', 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3')
) AS t(id, name, category, url)
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks LIMIT 1);

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

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify the tables have been created
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'meditation_sessions' as table_name, COUNT(*) as row_count FROM meditation_sessions
UNION ALL
SELECT 'audio_tracks' as table_name, COUNT(*) as row_count FROM audio_tracks;

-- Verify storage buckets exist
SELECT id, name, public FROM storage.buckets WHERE id IN ('avatars', 'audio-files'); 
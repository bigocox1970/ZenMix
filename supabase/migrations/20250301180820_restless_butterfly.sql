/*
  # Authentication Fix SQL

  1. Tables
    - Creates the profiles table if it doesn't exist
    - Creates meditation_sessions table if it doesn't exist
    - Creates audio_tracks table if it doesn't exist
  
  2. Security
    - Disables RLS on profiles table to ensure access
    - Sets up appropriate RLS on other tables
  
  3. Triggers
    - Creates a trigger to automatically create profiles for new users
    - Adds existing users to profiles table
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meditation_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration text,
  sounds jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create audio_tracks table if it doesn't exist
CREATE TABLE IF NOT EXISTS audio_tracks (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Disable Row Level Security on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on other tables
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies for meditation_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'meditation_sessions' AND policyname = 'Users can view their own meditation sessions'
  ) THEN
    CREATE POLICY "Users can view their own meditation sessions"
      ON meditation_sessions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'meditation_sessions' AND policyname = 'Users can create their own meditation sessions'
  ) THEN
    CREATE POLICY "Users can create their own meditation sessions"
      ON meditation_sessions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'meditation_sessions' AND policyname = 'Users can update their own meditation sessions'
  ) THEN
    CREATE POLICY "Users can update their own meditation sessions"
      ON meditation_sessions
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'meditation_sessions' AND policyname = 'Users can delete their own meditation sessions'
  ) THEN
    CREATE POLICY "Users can delete their own meditation sessions"
      ON meditation_sessions
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for audio_tracks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audio_tracks' AND policyname = 'Anyone can view audio tracks'
  ) THEN
    CREATE POLICY "Anyone can view audio tracks"
      ON audio_tracks
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into the profiles table
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Try to create the trigger (this might fail if you don't have permissions)
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

-- Insert any existing users into profiles table
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

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

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column for profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- Verify the tables have been created
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'meditation_sessions' as table_name, COUNT(*) as row_count FROM meditation_sessions
UNION ALL
SELECT 'audio_tracks' as table_name, COUNT(*) as row_count FROM audio_tracks;
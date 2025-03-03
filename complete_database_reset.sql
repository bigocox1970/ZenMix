/*
  # Complete Database Reset and Recreation Script
  
  This script:
  1. Drops all existing tables, functions, triggers, and policies
  2. Recreates all necessary database tables, columns, indexes, functions, 
     triggers, and storage buckets for the meditation app
  
  Tables:
  - profiles
  - meditation_sessions
  - audio_tracks
  - meditation_mixes
  - sound_categories
  - mix_categories
  - favorites_sounds
  - favorites_mixes
  - mix_comments
  - mix_likes
  
  Storage Buckets:
  - avatars
  - audio-files
*/

-- ==========================================
-- DROP EXISTING OBJECTS
-- ==========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own meditation sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can create their own meditation sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can update their own meditation sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can delete their own meditation sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Anyone can view audio tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Users can view their own mixes and public mixes" ON meditation_mixes;
DROP POLICY IF EXISTS "Users can create their own mixes" ON meditation_mixes;
DROP POLICY IF EXISTS "Users can update their own mixes" ON meditation_mixes;
DROP POLICY IF EXISTS "Users can delete their own mixes" ON meditation_mixes;
DROP POLICY IF EXISTS "Anyone can view sound categories" ON sound_categories;
DROP POLICY IF EXISTS "Anyone can view mix categories" ON mix_categories;
DROP POLICY IF EXISTS "Users can view their own favorite sounds" ON favorites_sounds;
DROP POLICY IF EXISTS "Users can add their own favorite sounds" ON favorites_sounds;
DROP POLICY IF EXISTS "Users can remove their own favorite sounds" ON favorites_sounds;
DROP POLICY IF EXISTS "Users can view their own favorite mixes" ON favorites_mixes;
DROP POLICY IF EXISTS "Users can add their own favorite mixes" ON favorites_mixes;
DROP POLICY IF EXISTS "Users can remove their own favorite mixes" ON favorites_mixes;
DROP POLICY IF EXISTS "Users can view comments on public mixes" ON mix_comments;
DROP POLICY IF EXISTS "Users can add comments to public mixes" ON mix_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON mix_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON mix_comments;
DROP POLICY IF EXISTS "Users can view likes on public mixes" ON mix_likes;
DROP POLICY IF EXISTS "Users can like public mixes" ON mix_likes;
DROP POLICY IF EXISTS "Users can unlike their own likes" ON mix_likes;

-- Drop storage policies
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_meditation_mixes_updated_at ON meditation_mixes;
DROP TRIGGER IF EXISTS update_mix_likes_count_trigger ON mix_likes;
DROP TRIGGER IF EXISTS update_mix_comments_count_trigger ON mix_comments;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at();
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.toggle_user_admin(uuid, boolean);
DROP FUNCTION IF EXISTS public.update_meditation_mixes_updated_at();
DROP FUNCTION IF EXISTS public.update_mix_likes_count();
DROP FUNCTION IF EXISTS public.update_mix_comments_count();

-- Drop tables (in correct order to respect foreign keys)
DROP TABLE IF EXISTS mix_likes CASCADE;
DROP TABLE IF EXISTS mix_comments CASCADE;
DROP TABLE IF EXISTS favorites_mixes CASCADE;
DROP TABLE IF EXISTS favorites_sounds CASCADE;
DROP TABLE IF EXISTS meditation_sessions CASCADE;
DROP TABLE IF EXISTS meditation_mixes CASCADE;
DROP TABLE IF EXISTS audio_tracks CASCADE;
DROP TABLE IF EXISTS sound_categories CASCADE;
DROP TABLE IF EXISTS mix_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==========================================
-- RECREATE TABLES - FIRST LEVEL (NO FOREIGN KEYS)
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

-- Create sound_categories table
CREATE TABLE IF NOT EXISTS sound_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mix_categories table
CREATE TABLE IF NOT EXISTS mix_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==========================================
-- RECREATE TABLES - SECOND LEVEL (FOREIGN KEYS TO FIRST LEVEL)
-- ==========================================

-- Create audio_tracks table
CREATE TABLE IF NOT EXISTS audio_tracks (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES sound_categories(id)
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

-- Create meditation_mixes table
CREATE TABLE IF NOT EXISTS meditation_mixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration integer NOT NULL,
  is_public boolean DEFAULT false,
  tracks jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  description text,
  tags text[],
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  category_id uuid REFERENCES mix_categories(id)
);

-- ==========================================
-- RECREATE TABLES - THIRD LEVEL (FOREIGN KEYS TO SECOND LEVEL)
-- ==========================================

-- Create favorites_sounds table
CREATE TABLE IF NOT EXISTS favorites_sounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  sound_id text REFERENCES audio_tracks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, sound_id)
);

-- Create favorites_mixes table
CREATE TABLE IF NOT EXISTS favorites_mixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mix_id)
);

-- Create mix_comments table
CREATE TABLE IF NOT EXISTS mix_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mix_likes table
CREATE TABLE IF NOT EXISTS mix_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mix_id)
);

-- ==========================================
-- CREATE INDEXES
-- ==========================================

-- Create indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_default_duration ON profiles(default_duration);
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_voice ON profiles(preferred_voice);
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_background ON profiles(preferred_background);

-- Create indexes for meditation_mixes table
CREATE INDEX IF NOT EXISTS idx_meditation_mixes_user_id ON meditation_mixes(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_mixes_is_public ON meditation_mixes(is_public);

-- Create indexes for favorites and community tables
CREATE INDEX IF NOT EXISTS idx_favorites_sounds_user ON favorites_sounds(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_sounds_sound ON favorites_sounds(sound_id);
CREATE INDEX IF NOT EXISTS idx_favorites_mixes_user ON favorites_mixes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_mixes_mix ON favorites_mixes(mix_id);
CREATE INDEX IF NOT EXISTS idx_mix_comments_mix ON mix_comments(mix_id);
CREATE INDEX IF NOT EXISTS idx_mix_comments_user ON mix_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_mix_likes_mix ON mix_likes(mix_id);
CREATE INDEX IF NOT EXISTS idx_mix_likes_user ON mix_likes(user_id);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mix_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mix_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mix_likes ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- CREATE POLICIES
-- ==========================================

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

-- Create policies for meditation_mixes
CREATE POLICY "Users can view their own mixes and public mixes"
  ON meditation_mixes
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR is_public = true
  );

CREATE POLICY "Users can create their own mixes"
  ON meditation_mixes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own mixes"
  ON meditation_mixes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own mixes"
  ON meditation_mixes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for categories
CREATE POLICY "Anyone can view sound categories"
  ON sound_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view mix categories"
  ON mix_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for favorites_sounds
CREATE POLICY "Users can view their own favorite sounds"
  ON favorites_sounds
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add their own favorite sounds"
  ON favorites_sounds
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own favorite sounds"
  ON favorites_sounds
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for favorites_mixes
CREATE POLICY "Users can view their own favorite mixes"
  ON favorites_mixes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add their own favorite mixes"
  ON favorites_mixes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own favorite mixes"
  ON favorites_mixes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for mix_comments
CREATE POLICY "Users can view comments on public mixes"
  ON mix_comments
  FOR SELECT
  TO authenticated
  USING (
    mix_id IN (
      SELECT id FROM meditation_mixes WHERE is_public = true
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can add comments to public mixes"
  ON mix_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    mix_id IN (
      SELECT id FROM meditation_mixes WHERE is_public = true
    )
  );

CREATE POLICY "Users can update their own comments"
  ON mix_comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON mix_comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for mix_likes
CREATE POLICY "Users can view likes on public mixes"
  ON mix_likes
  FOR SELECT
  TO authenticated
  USING (
    mix_id IN (
      SELECT id FROM meditation_mixes WHERE is_public = true
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can like public mixes"
  ON mix_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    mix_id IN (
      SELECT id FROM meditation_mixes WHERE is_public = true
    )
  );

CREATE POLICY "Users can unlike their own likes"
  ON mix_likes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

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

-- Create function to update meditation mixes updated_at
CREATE OR REPLACE FUNCTION update_meditation_mixes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for meditation_mixes updated_at
CREATE TRIGGER update_meditation_mixes_updated_at
BEFORE UPDATE ON meditation_mixes
FOR EACH ROW
EXECUTE FUNCTION update_meditation_mixes_updated_at();

-- Create function to update mix likes count
CREATE OR REPLACE FUNCTION update_mix_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE meditation_mixes
    SET likes_count = likes_count + 1
    WHERE id = NEW.mix_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE meditation_mixes
    SET likes_count = likes_count - 1
    WHERE id = OLD.mix_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update mix comments count
CREATE OR REPLACE FUNCTION update_mix_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE meditation_mixes
    SET comments_count = comments_count + 1
    WHERE id = NEW.mix_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE meditation_mixes
    SET comments_count = comments_count - 1
    WHERE id = OLD.mix_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for mix likes and comments
CREATE TRIGGER update_mix_likes_count_trigger
AFTER INSERT OR DELETE ON mix_likes
FOR EACH ROW
EXECUTE FUNCTION update_mix_likes_count();

CREATE TRIGGER update_mix_comments_count_trigger
AFTER INSERT OR DELETE ON mix_comments
FOR EACH ROW
EXECUTE FUNCTION update_mix_comments_count();

-- ==========================================
-- SETUP STORAGE BUCKETS
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
-- INSERT SAMPLE DATA
-- ==========================================

-- Insert default sound categories
INSERT INTO sound_categories (name, slug, description) VALUES
  ('Nature', 'nature', 'Natural ambient sounds like rain, waves, and forest'),
  ('Music', 'music', 'Calming instrumental music and melodies'),
  ('Voice', 'voice', 'Guided meditations and vocal tracks'),
  ('Beats', 'beats', 'Binaural beats and ambient tones'),
  ('Uploads', 'uploads', 'Your uploaded audio tracks')
ON CONFLICT (slug) DO NOTHING;

-- Insert default mix categories
INSERT INTO mix_categories (name, slug, description) VALUES
  ('Sleep', 'sleep', 'Mixes designed to help you fall asleep'),
  ('Focus', 'focus', 'Mixes for concentration and productivity'),
  ('Relax', 'relax', 'Calming mixes for relaxation'),
  ('Meditate', 'meditate', 'Mixes for meditation practice'),
  ('My Mixes', 'my-mixes', 'Your custom meditation mixes')
ON CONFLICT (slug) DO NOTHING;

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

-- Update audio tracks with category IDs
UPDATE audio_tracks
SET category_id = (
  SELECT id FROM sound_categories 
  WHERE slug = LOWER(audio_tracks.category)
)
WHERE category_id IS NULL;

-- ==========================================
-- MAKE FIRST USER ADMIN
-- ==========================================

-- Insert any existing users into profiles table
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Create first admin if none exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE is_admin = true) THEN
    -- Update the first user to be an admin
    UPDATE profiles
    SET is_admin = true
    WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);
    
    RAISE NOTICE 'Made the first user an admin';
  END IF;
END $$;

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify the tables have been created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profiles', 
  'meditation_sessions', 
  'audio_tracks',
  'meditation_mixes',
  'sound_categories',
  'mix_categories',
  'favorites_sounds',
  'favorites_mixes',
  'mix_comments',
  'mix_likes'
)
ORDER BY table_name;

-- Verify storage buckets exist
SELECT id, name, public FROM storage.buckets WHERE id IN ('avatars', 'audio-files');

-- Verify policies exist
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Verify storage policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
ORDER BY policyname;

-- Verify functions exist
SELECT proname FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace 
AND proname IN (
  'handle_new_user', 
  'update_updated_at', 
  'is_admin', 
  'toggle_user_admin',
  'update_meditation_mixes_updated_at',
  'update_mix_likes_count',
  'update_mix_comments_count'
);

-- Verify triggers exist
SELECT tgname, tgrelid::regclass FROM pg_trigger 
WHERE tgname IN (
  'on_auth_user_created', 
  'update_profiles_updated_at',
  'update_meditation_mixes_updated_at',
  'update_mix_likes_count_trigger',
  'update_mix_comments_count_trigger'
); 
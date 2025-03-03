/*
  # Complete One-Hit Database Reset and Recreation Script
  
  This script will:
  1. Drop all existing tables, functions, triggers, and policies
  2. Recreate all necessary database tables, columns, indexes, functions, 
     triggers, and storage buckets for the meditation app
  
  IMPORTANT: This script is designed to be run in a single execution and
  will handle all dependencies correctly.
*/

-- Start a transaction to ensure all-or-nothing execution
BEGIN;

-- ==========================================
-- DISABLE TRIGGERS TEMPORARILY
-- ==========================================
SET session_replication_role = 'replica';

-- ==========================================
-- DROP EVERYTHING SAFELY
-- ==========================================

-- Drop all policies first (to avoid dependency issues)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename, schemaname
        FROM pg_policies
        WHERE schemaname IN ('public', 'storage')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I CASCADE', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END$$;

-- Drop all user-defined triggers (not constraint triggers)
DO $$
DECLARE
    trg record;
BEGIN
    FOR trg IN 
        SELECT tgname, relname, nspname
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE nspname = 'public'
        AND NOT tgname LIKE 'RI_ConstraintTrigger_%'  -- Skip constraint triggers
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I CASCADE', 
                      trg.tgname, trg.nspname, trg.relname);
    END LOOP;
END$$;

-- Try to drop the auth trigger separately (might fail due to permissions, which is OK)
DO $$
BEGIN
    BEGIN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    EXCEPTION WHEN OTHERS THEN
        -- Ignore errors for this specific trigger
        RAISE NOTICE 'Could not drop trigger on auth.users (this is normal if you don''t have admin rights)';
    END;
END$$;

-- Drop all functions
DO $$
DECLARE
    func record;
BEGIN
    FOR func IN 
        SELECT proname, oidvectortypes(proargtypes) as argtypes
        FROM pg_proc
        WHERE pronamespace = 'public'::regnamespace
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE', 
                      func.proname, func.argtypes);
    END LOOP;
END$$;

-- Drop all tables in the correct order (respecting foreign key dependencies)
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
CREATE TABLE profiles (
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
  notifications boolean DEFAULT true,
  suspended boolean DEFAULT false,
  subscription_type text DEFAULT 'free'
);

-- Create sound_categories table
CREATE TABLE sound_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mix_categories table
CREATE TABLE mix_categories (
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
CREATE TABLE audio_tracks (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES sound_categories(id),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create meditation_sessions table
CREATE TABLE meditation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration text,
  sounds jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create meditation_mixes table
CREATE TABLE meditation_mixes (
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
CREATE TABLE favorites_sounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  sound_id text REFERENCES audio_tracks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, sound_id)
);

-- Create favorites_mixes table
CREATE TABLE favorites_mixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mix_id)
);

-- Create mix_comments table
CREATE TABLE mix_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mix_likes table
CREATE TABLE mix_likes (
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
CREATE INDEX idx_profiles_nickname ON profiles(nickname);
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX idx_profiles_default_duration ON profiles(default_duration);
CREATE INDEX idx_profiles_preferred_voice ON profiles(preferred_voice);
CREATE INDEX idx_profiles_preferred_background ON profiles(preferred_background);

-- Create indexes for meditation_mixes table
CREATE INDEX idx_meditation_mixes_user_id ON meditation_mixes(user_id);
CREATE INDEX idx_meditation_mixes_is_public ON meditation_mixes(is_public);

-- Create indexes for favorites and community tables
CREATE INDEX idx_favorites_sounds_user ON favorites_sounds(user_id);
CREATE INDEX idx_favorites_sounds_sound ON favorites_sounds(sound_id);
CREATE INDEX idx_favorites_mixes_user ON favorites_mixes(user_id);
CREATE INDEX idx_favorites_mixes_mix ON favorites_mixes(mix_id);
CREATE INDEX idx_mix_comments_mix ON mix_comments(mix_id);
CREATE INDEX idx_mix_comments_user ON mix_comments(user_id);
CREATE INDEX idx_mix_likes_mix ON mix_likes(mix_id);
CREATE INDEX idx_mix_likes_user ON mix_likes(user_id);

-- Create indexes for audio_tracks table
CREATE INDEX idx_audio_tracks_user_id ON audio_tracks(user_id);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Create a function to update the updated_at column
CREATE FUNCTION update_updated_at()
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
CREATE FUNCTION is_admin()
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

-- Create function to toggle user admin status
CREATE FUNCTION toggle_user_admin(user_id uuid, make_admin boolean)
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

-- Function to add the suspended column to profiles table if it doesn't exist
CREATE FUNCTION add_suspended_column_if_not_exists()
RETURNS void AS $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'suspended'
    ) THEN
        -- Add the suspended column
        ALTER TABLE profiles 
        ADD COLUMN suspended BOOLEAN DEFAULT false;
        
        RAISE NOTICE 'Added suspended column to profiles table';
    ELSE
        RAISE NOTICE 'suspended column already exists in profiles table';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to add the subscription_type column to profiles table if it doesn't exist
CREATE FUNCTION add_subscription_column_if_not_exists()
RETURNS void AS $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'subscription_type'
    ) THEN
        -- Add the subscription_type column
        ALTER TABLE profiles 
        ADD COLUMN subscription_type TEXT DEFAULT 'free';
        
        RAISE NOTICE 'Added subscription_type column to profiles table';
    ELSE
        RAISE NOTICE 'subscription_type column already exists in profiles table';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to delete a user (requires admin privileges)
CREATE FUNCTION delete_user(user_id UUID)
RETURNS void AS $$
BEGIN
    -- Check if calling user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can delete users';
    END IF;

    -- Delete the user from profiles (this will cascade to other tables)
    DELETE FROM profiles WHERE id = user_id;
    
    -- Note: Deleting from auth.users requires Supabase service role
    -- This function will only delete from profiles and related tables
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update meditation mixes updated_at
CREATE FUNCTION update_meditation_mixes_updated_at()
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
CREATE FUNCTION update_mix_likes_count()
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
CREATE FUNCTION update_mix_comments_count()
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

-- Create a function to handle new user registration
CREATE FUNCTION handle_new_user()
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

-- Try to create the trigger on auth.users (might fail due to permissions, which is OK)
DO $$
BEGIN
  BEGIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create trigger on auth.users (this is normal if you don''t have admin rights)';
  END;
END$$;

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
  USING (
    user_id IS NULL  -- Public tracks
    OR user_id = auth.uid()  -- User's own tracks
  );

CREATE POLICY "Users can insert their own audio tracks"
  ON audio_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own audio tracks"
  ON audio_tracks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own audio tracks"
  ON audio_tracks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

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
-- GRANT PERMISSIONS
-- ==========================================

-- Grant execute permissions to functions
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_user_admin TO authenticated;

-- ==========================================
-- RESTORE NORMAL TRIGGER BEHAVIOR
-- ==========================================
SET session_replication_role = 'origin';

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

-- Commit the transaction
COMMIT; 
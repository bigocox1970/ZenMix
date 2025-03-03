/*
  # Add Favorites and Community Features

  1. New Tables
    - favorites_sounds: Track user's favorite sounds
    - favorites_mixes: Track user's favorite mixes
    - mix_comments: Allow users to comment on public mixes
    - mix_likes: Track likes on public mixes

  2. Changes
    - Add community features to meditation_mixes table
    - Add RLS policies for all new tables
    - Add indexes for better performance

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add community features to meditation_mixes
ALTER TABLE meditation_mixes
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0;

-- Create favorites_sounds table
CREATE TABLE IF NOT EXISTS favorites_sounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sound_id uuid REFERENCES audio_tracks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, sound_id)
);

-- Create favorites_mixes table
CREATE TABLE IF NOT EXISTS favorites_mixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mix_id)
);

-- Create mix_comments table
CREATE TABLE IF NOT EXISTS mix_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mix_likes table
CREATE TABLE IF NOT EXISTS mix_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id uuid REFERENCES meditation_mixes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mix_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_sounds_user ON favorites_sounds(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_sounds_sound ON favorites_sounds(sound_id);
CREATE INDEX IF NOT EXISTS idx_favorites_mixes_user ON favorites_mixes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_mixes_mix ON favorites_mixes(mix_id);
CREATE INDEX IF NOT EXISTS idx_mix_comments_mix ON mix_comments(mix_id);
CREATE INDEX IF NOT EXISTS idx_mix_comments_user ON mix_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_mix_likes_mix ON mix_likes(mix_id);
CREATE INDEX IF NOT EXISTS idx_mix_likes_user ON mix_likes(user_id);

-- Enable RLS
ALTER TABLE favorites_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mix_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mix_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for favorites_sounds
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

-- Create RLS policies for favorites_mixes
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

-- Create RLS policies for mix_comments
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

-- Create RLS policies for mix_likes
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

-- Create triggers
CREATE TRIGGER update_mix_likes_count_trigger
AFTER INSERT OR DELETE ON mix_likes
FOR EACH ROW
EXECUTE FUNCTION update_mix_likes_count();

CREATE TRIGGER update_mix_comments_count_trigger
AFTER INSERT OR DELETE ON mix_comments
FOR EACH ROW
EXECUTE FUNCTION update_mix_comments_count();
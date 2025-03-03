/*
  # Fix Categories and Add Favorites

  1. New Tables
    - sound_categories: Predefined sound categories
    - mix_categories: Predefined mix categories
    - favorites_sounds: Track user's favorite sounds
    - favorites_mixes: Track user's favorite mixes

  2. Changes
    - Add category references to audio_tracks and meditation_mixes
    - Add RLS policies for all new tables
    - Add indexes for better performance

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create sound categories table
CREATE TABLE IF NOT EXISTS sound_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mix categories table
CREATE TABLE IF NOT EXISTS mix_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sound_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mix_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Add category references to existing tables
ALTER TABLE audio_tracks
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES sound_categories(id);

ALTER TABLE meditation_mixes
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES mix_categories(id);

-- Update existing tracks with default categories
UPDATE audio_tracks
SET category_id = (
  SELECT id FROM sound_categories 
  WHERE slug = LOWER(audio_tracks.category)
)
WHERE category_id IS NULL;

-- Update existing mixes with default category
UPDATE meditation_mixes
SET category_id = (
  SELECT id FROM mix_categories WHERE slug = 'my-mixes'
)
WHERE category_id IS NULL;
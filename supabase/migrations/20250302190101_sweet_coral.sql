/*
  # Fix audio tracks schema

  1. Changes
    - Drop and recreate audio_tracks table with correct schema
    - Add proper indexes and constraints
    - Update RLS policies
    - Add sample tracks

  2. Schema
    - id: uuid primary key
    - user_id: uuid foreign key to auth.users
    - title: text (required)
    - category: text (required)
    - url: text (required)
    - file_path: text (for storage reference)
    - duration: integer (in seconds)
    - created_at: timestamp with timezone
    - updated_at: timestamp with timezone

  3. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Drop existing audio_tracks table if it exists
DROP TABLE IF EXISTS audio_tracks CASCADE;

-- Create new audio_tracks table with correct schema
CREATE TABLE audio_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  url text NOT NULL,
  file_path text,
  duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX audio_tracks_user_id_idx ON audio_tracks(user_id);
CREATE INDEX audio_tracks_category_idx ON audio_tracks(category);

-- Enable Row Level Security
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all tracks"
  ON audio_tracks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own tracks"
  ON audio_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks"
  ON audio_tracks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracks"
  ON audio_tracks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_audio_tracks_updated_at
  BEFORE UPDATE
  ON audio_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tracks
INSERT INTO audio_tracks (id, title, category, url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Rain Sounds', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3'),
  ('00000000-0000-0000-0000-000000000002', 'Forest Birds', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3'),
  ('00000000-0000-0000-0000-000000000003', 'Ocean Waves', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3'),
  ('00000000-0000-0000-0000-000000000004', 'Crackling Fire', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3'),
  ('00000000-0000-0000-0000-000000000005', 'Gentle Piano', 'music', 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3'),
  ('00000000-0000-0000-0000-000000000006', 'Guided Meditation', 'voice', 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3'),
  ('00000000-0000-0000-0000-000000000007', 'Binaural Beats', 'beats', 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3')
ON CONFLICT (id) DO NOTHING;
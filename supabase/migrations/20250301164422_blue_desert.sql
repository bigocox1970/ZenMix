/*
  # Initial Schema Setup for ZenMix

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `meditation_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `name` (text)
      - `duration` (text)
      - `sounds` (jsonb)
      - `created_at` (timestamp)
    - `audio_tracks`
      - `id` (text, primary key)
      - `name` (text)
      - `category` (text)
      - `url` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meditation_sessions table
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

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

-- Insert sample audio tracks
INSERT INTO audio_tracks (id, name, category, url)
VALUES
  ('rain', 'Rain', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3'),
  ('forest', 'Forest', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3'),
  ('waves', 'Ocean Waves', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3'),
  ('fire', 'Crackling Fire', 'nature', 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3'),
  ('piano', 'Gentle Piano', 'music', 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3'),
  ('meditation', 'Guided Meditation', 'voice', 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3'),
  ('binaural', 'Binaural Beats', 'beats', 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3')
ON CONFLICT (id) DO NOTHING;

-- Create a trigger to update the updated_at column for profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
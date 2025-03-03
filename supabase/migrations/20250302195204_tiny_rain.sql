/*
  # Fix mix saving functionality

  1. New Tables
    - `meditation_mixes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `duration` (integer)
      - `is_public` (boolean)
      - `tracks` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `meditation_mixes` table
    - Add policies for authenticated users to manage their mixes
    - Allow viewing of public mixes
*/

-- Create meditation_mixes table if it doesn't exist
CREATE TABLE IF NOT EXISTS meditation_mixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration integer NOT NULL,
  is_public boolean DEFAULT false,
  tracks jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meditation_mixes_user_id ON meditation_mixes(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_mixes_is_public ON meditation_mixes(is_public);

-- Enable Row Level Security
ALTER TABLE meditation_mixes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_meditation_mixes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meditation_mixes_updated_at
  BEFORE UPDATE
  ON meditation_mixes
  FOR EACH ROW
  EXECUTE FUNCTION update_meditation_mixes_updated_at();
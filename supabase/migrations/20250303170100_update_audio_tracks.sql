-- Add missing columns to audio_tracks table

-- Check if the table exists, if not create it
CREATE TABLE IF NOT EXISTS audio_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  is_built_in BOOLEAN DEFAULT FALSE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add duration column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audio_tracks' AND column_name = 'duration'
  ) THEN
    ALTER TABLE audio_tracks ADD COLUMN duration INTEGER DEFAULT 0;
  END IF;
END
$$;

-- Add name column if it doesn't exist (for backward compatibility)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audio_tracks' AND column_name = 'name'
  ) THEN
    ALTER TABLE audio_tracks ADD COLUMN name TEXT;
  END IF;
END
$$;

-- Add category column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audio_tracks' AND column_name = 'category'
  ) THEN
    ALTER TABLE audio_tracks ADD COLUMN category TEXT;
  END IF;
END
$$;

-- Update RLS policies
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Users can insert their own tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Users can update their own tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Users can delete their own tracks" ON audio_tracks;
DROP POLICY IF EXISTS "Public tracks are viewable by everyone" ON audio_tracks;

-- Create policies
CREATE POLICY "Users can view their own tracks" 
ON audio_tracks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracks" 
ON audio_tracks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks" 
ON audio_tracks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracks" 
ON audio_tracks FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Public tracks are viewable by everyone" 
ON audio_tracks FOR SELECT 
USING (is_public = true); 
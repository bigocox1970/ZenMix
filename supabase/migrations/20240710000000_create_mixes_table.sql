i have had to restore from an ealier point be cause you messed this right up-- Create mixes table if it doesn't exist
CREATE TABLE IF NOT EXISTS mixes (
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
CREATE INDEX IF NOT EXISTS idx_mixes_user_id ON mixes(user_id);
CREATE INDEX IF NOT EXISTS idx_mixes_is_public ON mixes(is_public);

-- Enable Row Level Security
ALTER TABLE mixes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own mixes and public mixes" ON mixes;
DROP POLICY IF EXISTS "Users can create their own mixes" ON mixes;
DROP POLICY IF EXISTS "Users can update their own mixes" ON mixes;
DROP POLICY IF EXISTS "Users can delete their own mixes" ON mixes;

-- Create RLS policies
CREATE POLICY "Users can view their own mixes and public mixes"
ON mixes
FOR SELECT
USING (
  auth.uid() = user_id OR
  is_public = true
);

CREATE POLICY "Users can create their own mixes"
ON mixes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mixes"
ON mixes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mixes"
ON mixes
FOR DELETE
USING (auth.uid() = user_id); 
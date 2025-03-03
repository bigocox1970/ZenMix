-- Add meditation preferences columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS default_duration integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS preferred_voice text DEFAULT 'female',
ADD COLUMN IF NOT EXISTS preferred_background text DEFAULT 'nature',
ADD COLUMN IF NOT EXISTS notifications boolean DEFAULT true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_default_duration ON profiles(default_duration);
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_voice ON profiles(preferred_voice);
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_background ON profiles(preferred_background);

-- Update existing profiles with default values
UPDATE profiles 
SET 
  default_duration = 10,
  preferred_voice = 'female',
  preferred_background = 'nature',
  notifications = true
WHERE default_duration IS NULL;
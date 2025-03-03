-- Complete database restoration script

-- Check if profiles table exists and create it if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    -- Create profiles table with admin support
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      is_suspended BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- Make sure required columns exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'is_admin'
    ) THEN
      ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'is_suspended'
    ) THEN
      ALTER TABLE profiles ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE;
    END IF;
  END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create RLS policies
CREATE POLICY "Anyone can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

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

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create trigger
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create auth trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, new.created_at, new.updated_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create first admin if none exists (alternative approach)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE is_admin = true) THEN
    -- Update the first user to be an admin
    UPDATE profiles
    SET is_admin = true
    WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);
  END IF;
END $$;

-- Check if audio_tracks table exists and create it if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'audio_tracks'
  ) THEN
    -- Create audio_tracks table with proper schema
    CREATE TABLE audio_tracks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      title text NOT NULL,
      category text NOT NULL,
      url text NOT NULL,
      file_path text,
      url_expires_at timestamptz,
      duration integer DEFAULT 0,
      is_public BOOLEAN DEFAULT FALSE,
      is_built_in BOOLEAN DEFAULT FALSE,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    
    -- Create indexes for better performance
    CREATE INDEX audio_tracks_user_id_idx ON audio_tracks(user_id);
    CREATE INDEX audio_tracks_category_idx ON audio_tracks(category);
    CREATE INDEX audio_tracks_url_expires_at_idx ON audio_tracks(url_expires_at);
    CREATE INDEX idx_audio_tracks_is_public ON audio_tracks(is_public);
    
    -- Enable Row Level Security
    ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    CREATE POLICY "Users can view public tracks"
      ON audio_tracks
      FOR SELECT
      TO authenticated
      USING (is_public = true OR auth.uid() = user_id);
    
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
  ELSE
    -- Make sure required columns exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'audio_tracks' 
      AND column_name = 'is_public'
    ) THEN
      ALTER TABLE audio_tracks ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
      
      -- Create index for the new column
      CREATE INDEX IF NOT EXISTS idx_audio_tracks_is_public ON audio_tracks(is_public);
      
      -- Update RLS policies to allow public tracks to be viewed by all authenticated users
      DROP POLICY IF EXISTS "Users can view all tracks" ON audio_tracks;
      
      -- Create new policy for public tracks
      CREATE POLICY "Users can view public tracks"
        ON audio_tracks
        FOR SELECT
        TO authenticated
        USING (is_public = true OR auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'audio_tracks' 
      AND column_name = 'is_built_in'
    ) THEN
      ALTER TABLE audio_tracks ADD COLUMN is_built_in BOOLEAN DEFAULT FALSE;
      
      -- Create index for the new column
      CREATE INDEX IF NOT EXISTS idx_audio_tracks_is_built_in ON audio_tracks(is_built_in);
    END IF;
  END IF;
END
$$; 
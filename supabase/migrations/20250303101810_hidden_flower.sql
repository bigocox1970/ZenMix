-- Safely create policies for meditation_mixes table
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own mixes and public mixes" ON meditation_mixes;
  DROP POLICY IF EXISTS "Users can create their own mixes" ON meditation_mixes;
  DROP POLICY IF EXISTS "Users can update their own mixes" ON meditation_mixes;
  DROP POLICY IF EXISTS "Users can delete their own mixes" ON meditation_mixes;

  -- Create new policies
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

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating policies: %', SQLERRM;
END $$;
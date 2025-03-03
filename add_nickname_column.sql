-- Add nickname column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'nickname'
  ) THEN
    ALTER TABLE profiles ADD COLUMN nickname text;
    RAISE NOTICE 'Added nickname column to profiles table';
  ELSE
    RAISE NOTICE 'nickname column already exists in profiles table';
  END IF;
END
$$;

-- Verify the column exists
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public'
  AND table_name = 'profiles' 
  AND column_name = 'nickname'; 
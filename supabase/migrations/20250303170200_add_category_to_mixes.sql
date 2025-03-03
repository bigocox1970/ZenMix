-- Add category column to mixes table

-- Add category column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mixes' AND column_name = 'category'
  ) THEN
    ALTER TABLE mixes ADD COLUMN category TEXT;
  END IF;
END
$$; 
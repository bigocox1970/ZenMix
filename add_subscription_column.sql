-- Function to add the subscription_type column to profiles table if it doesn't exist
CREATE OR REPLACE FUNCTION add_subscription_column_if_not_exists()
RETURNS void AS $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'subscription_type'
    ) THEN
        -- Add the subscription_type column
        ALTER TABLE profiles 
        ADD COLUMN subscription_type TEXT DEFAULT 'free';
        
        RAISE NOTICE 'Added subscription_type column to profiles table';
    ELSE
        RAISE NOTICE 'subscription_type column already exists in profiles table';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to ensure the subscription_type column exists
SELECT add_subscription_column_if_not_exists();

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'subscription_type'; 
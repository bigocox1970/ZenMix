-- Function to add the suspended column to profiles table if it doesn't exist
CREATE OR REPLACE FUNCTION add_suspended_column_if_not_exists()
RETURNS void AS $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'suspended'
    ) THEN
        -- Add the suspended column
        ALTER TABLE profiles 
        ADD COLUMN suspended BOOLEAN DEFAULT false;
        
        RAISE NOTICE 'Added suspended column to profiles table';
    ELSE
        RAISE NOTICE 'suspended column already exists in profiles table';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to delete a user (requires admin privileges)
CREATE OR REPLACE FUNCTION delete_user(user_id UUID)
RETURNS void AS $$
BEGIN
    -- Check if calling user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can delete users';
    END IF;

    -- Delete the user from profiles (this will cascade to other tables)
    DELETE FROM profiles WHERE id = user_id;
    
    -- Note: Deleting from auth.users requires Supabase service role
    -- This function will only delete from profiles and related tables
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to ensure the suspended column exists
SELECT add_suspended_column_if_not_exists();

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
    AND column_name = 'suspended'; 
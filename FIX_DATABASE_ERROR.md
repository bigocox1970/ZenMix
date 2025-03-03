# Fix for "column 'is_admin' does not exist" Error

This guide provides a step-by-step solution to fix the error "42703: column 'is_admin' does not exist" in your Supabase database.

## Step 1: Run the Fix Script

1. Go to your Supabase project dashboard at https://app.supabase.com/
2. Navigate to the SQL Editor (left sidebar)
3. Create a new query
4. Copy and paste the following SQL code:

```sql
-- Check if profiles table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    -- Create profiles table if it doesn't exist
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- Add is_admin column if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'is_admin'
    ) THEN
      ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
  END IF;
END
$$;

-- Create index on is_admin column
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Verify the column exists
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public'
  AND table_name = 'profiles' 
  AND column_name = 'is_admin';
```

5. Click "Run" to execute the script
6. Verify that the query results show the `is_admin` column exists

## Step 2: Run the Complete Database Setup

1. In the SQL Editor, create a new query
2. Copy and paste the contents of the `restore_database.sql` file
3. Click "Run" to execute the script
4. This will set up all the necessary tables, functions, and policies

## Step 3: Make Yourself an Admin

1. Sign in to your application
2. Go back to the Supabase SQL Editor
3. Create a new query
4. Copy and paste the following SQL code:

```sql
-- Make the current user an admin
UPDATE profiles 
SET is_admin = true 
WHERE id = auth.uid();

-- Verify the change
SELECT id, email, is_admin FROM profiles WHERE id = auth.uid();
```

5. Click "Run" to execute the script
6. Verify that the query results show your user with `is_admin` set to `true`

## Step 4: Verify Everything Works

1. In the SQL Editor, create a new query
2. Copy and paste the contents of the `verify_db_setup.sql` file
3. Click "Run" to execute the script
4. Verify that all tables, columns, functions, and policies are correctly set up

## Troubleshooting

If you still encounter issues:

1. Check the Supabase logs for any errors
2. Make sure your environment variables are correctly set
3. Try running the individual SQL commands one by one to identify where the error occurs
4. If you're still having issues, try creating a new Supabase project and starting fresh

## Additional Notes

- The `is_admin` column is crucial for the admin functionality in your application
- Make sure to sign in to your application before running the admin scripts
- If you need to make multiple users admins, you can modify the SQL to target specific users by email 
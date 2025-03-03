/*
  # Fix Admin Role Creation

  1. Changes
    - Drops and recreates admin role function with proper permissions
    - Adds admin role to JWT claims
    - Adds admin check functions
    - Adds admin policies to tables

  2. Security
    - Only allows service role to modify admin status
    - Adds RLS policies for admin access
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS auth.make_user_admin(text);

-- Create admin role type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role' AND typnamespace = 'auth'::regnamespace) THEN
    CREATE TYPE auth.role AS ENUM ('admin', 'user');
  END IF;
END $$;

-- Add role co
/*
  # Add test users

  1. New Data
    - Add test users to the auth.users table
    - Create corresponding profiles for test users
  
  2. Purpose
    - Provide test accounts for development and testing
    - Enable immediate login without requiring signup
*/

-- Add test users to auth.users
-- Note: In a real production environment, never add users this way
-- This is only for development/testing purposes
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
VALUES
  (
    gen_random_uuid(),
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}'
  ),
  (
    gen_random_uuid(),
    'demo@example.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}'
  )
ON CONFLICT (email) DO NOTHING;

-- Create corresponding profiles for the test users
INSERT INTO profiles (id, email, created_at, updated_at)
SELECT id, email, created_at, updated_at
FROM auth.users
WHERE email IN ('test@example.com', 'demo@example.com')
ON CONFLICT (id) DO NOTHING;
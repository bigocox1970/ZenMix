-- Make the first user an admin
UPDATE profiles
SET is_admin = true
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Or make a specific user an admin by email
-- UPDATE profiles
-- SET is_admin = true
-- WHERE email = 'your_email@example.com';

-- Verify the change
SELECT id, email, is_admin FROM profiles WHERE is_admin = true; 
-- Make sure the is_admin column exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Make the current user an admin
UPDATE profiles 
SET is_admin = true 
WHERE id = auth.uid();

-- Verify the change
SELECT id, email, is_admin FROM profiles WHERE id = auth.uid(); 
-- Check if the is_admin column exists in profiles
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_name = 'profiles' 
  AND column_name = 'is_admin';

-- Check RLS policies on profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'profiles';

-- Check if is_admin function exists
SELECT 
  routine_name, 
  routine_type 
FROM 
  information_schema.routines 
WHERE 
  routine_name = 'is_admin' 
  AND routine_schema = 'public';

-- Check if toggle_user_admin function exists
SELECT 
  routine_name, 
  routine_type 
FROM 
  information_schema.routines 
WHERE 
  routine_name = 'toggle_user_admin' 
  AND routine_schema = 'public'; 
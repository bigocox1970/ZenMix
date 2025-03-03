/*
  # Check User Role Status

  1. Changes
    - Creates function to check user role status
    - Adds view for easier role checking
*/

-- Create view to check user roles
CREATE OR REPLACE VIEW auth.user_roles AS
SELECT 
  id,
  email,
  role,
  raw_app_meta_data->>'role' as jwt_role
FROM auth.users;

-- Create function to check user role
CREATE OR REPLACE FUNCTION auth.get_user_role(user_email text)
RETURNS TABLE (
  email text,
  db_role auth.role,
  jwt_role text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.email,
    u.role as db_role,
    u.raw_app_meta_data->>'role' as jwt_role
  FROM auth.users u
  WHERE u.email = user_email;
END;
$$;
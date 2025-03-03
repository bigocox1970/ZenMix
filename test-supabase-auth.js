import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with the same credentials from .env
const supabaseUrl = 'https://avrtzsptvuknahqkzqie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnR6c3B0dnVrbmFocWt6cWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDg0NzYsImV4cCI6MjA1NjQyNDQ3Nn0.K6XCgkIqbPn1txPaPdPU6U4OkQ7j0u63RXTNJYNLD-0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function to sign up a user
async function testSignUp() {
  console.log('Testing Supabase sign up...');
  
  // Generate a unique test email
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  console.log(`Attempting to sign up with email: ${testEmail}`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      console.error('Sign up error:', error);
      return;
    }
    
    console.log('Sign up successful!');
    console.log('User data:', data.user);
    
    // If successful, try to create a profile
    if (data?.user) {
      console.log('Creating profile for user ID:', data.user.id);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, email: testEmail }]);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        console.log('Profile created successfully!');
      }
    }
  } catch (err) {
    console.error('Exception during sign up test:', err);
  }
}

// Run the test
testSignUp();

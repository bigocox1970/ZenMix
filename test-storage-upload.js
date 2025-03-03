import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Supabase client
// Use the same values from the .env file
const supabaseUrl = 'https://avrtzsptvuknahqkzqie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnR6c3B0dnVrbmFocWt6cWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDg0NzYsImV4cCI6MjA1NjQyNDQ3Nn0.K6XCgkIqbPn1txPaPdPU6U4OkQ7j0u63RXTNJYNLD-0';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to sign up a test user
async function signUpTestUser() {
  console.log('Signing up a test user...');
  
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
      return null;
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
      
      return data.user;
    }
    
    return null;
  } catch (err) {
    console.error('Exception during sign up test:', err);
    return null;
  }
}

// Function to sign in with email and password
async function signIn(email, password) {
  console.log(`Signing in with email: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      return null;
    }
    
    console.log('Sign in successful!');
    console.log('User data:', data.user);
    
    return data.user;
  } catch (err) {
    console.error('Exception during sign in:', err);
    return null;
  }
}

// Function to test storage bucket permissions
async function testStorageBucket(user) {
  console.log('User authenticated:', user ? 'Yes' : 'No');
  console.log('Testing Supabase storage bucket permissions...');
  
  try {
    // List all storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('Available buckets:', buckets.map(b => b.name));
    
    // Check if audio-files bucket exists
    const audioFilesBucket = buckets.find(b => b.name === 'audio-files');
    
    if (!audioFilesBucket) {
      console.log('The audio-files bucket does not exist. Please create it manually in the Supabase dashboard.');
      console.log('1. Go to https://supabase.com/dashboard/project/avrtzsptvuknahqkzqie/storage/buckets');
      console.log('2. Click "New Bucket"');
      console.log('3. Enter "audio-files" as the name');
      console.log('4. Enable "Public bucket" option');
      console.log('5. Click "Create bucket"');
      return;
    } else {
      console.log('audio-files bucket found:', audioFilesBucket);
    }
    
    // List files in the audio-files bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('audio-files')
      .list();
    
    if (filesError) {
      console.error('Error listing files in audio-files bucket:', filesError);
      return;
    }
    
    console.log('Files in audio-files bucket:', files);
    
    // Create a simple test file (a small text file)
    const testFileContent = Buffer.from('This is a test file');
    
    // Try to upload the test file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload('test/test.txt', testFileContent, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading test file:', uploadError);
      return;
    }
    
    console.log('Test file uploaded successfully:', uploadData);
    
    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl('test/test.txt');
    
    console.log('Public URL of test file:', publicUrl);
    
    // Clean up - delete the test file
    const { error: deleteError } = await supabase.storage
      .from('audio-files')
      .remove(['test/test.txt']);
    
    if (deleteError) {
      console.error('Error deleting test file:', deleteError);
      return;
    }
    
    console.log('Test file deleted successfully');
    
  } catch (err) {
    console.error('Unexpected error during storage bucket test:', err);
  }
}

// Main function to run the tests
async function runTests() {
  // First sign up a test user
  const user = await signUpTestUser();
  
  if (!user) {
    console.error('Failed to create test user. Cannot proceed with storage tests.');
    return;
  }
  
  // Then test storage with the authenticated user
  await testStorageBucket(user);
}

// Run the tests
runTests();

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://avrtzsptvuknahqkzqie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnR6c3B0dnVrbmFocWt6cWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDg0NzYsImV4cCI6MjA1NjQyNDQ3Nn0.K6XCgkIqbPn1txPaPdPU6U4OkQ7j0u63RXTNJYNLD-0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test email and password - you can replace these with your actual test credentials
const testEmail = 'test@example.com';
const testPassword = 'password123';

async function testAuthenticatedUpload() {
  console.log('Starting authenticated upload test...');
  
  try {
    // Step 1: Sign in with email and password
    console.log(`Signing in with email: ${testEmail}`);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (authError) {
      console.error('Authentication error:', authError);
      console.log('\nPlease check your credentials or create a test user:');
      console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/avrtzsptvuknahqkzqie/auth/users');
      console.log('2. Click "Add User"');
      console.log('3. Enter test email and password');
      console.log('4. Update this script with those credentials');
      return;
    }
    
    console.log('Authentication successful!');
    console.log('User:', authData.user);
    
    // Step 2: Check if the audio-files bucket exists
    console.log('\nChecking for audio-files bucket...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('Available buckets:', buckets.map(b => b.name));
    
    const audioFilesBucket = buckets.find(b => b.name === 'audio-files');
    
    if (!audioFilesBucket) {
      console.error('The audio-files bucket does not exist. Please follow the setup guide to create it.');
      return;
    }
    
    console.log('audio-files bucket found:', audioFilesBucket);
    
    // Step 3: Try to upload a test file
    console.log('\nAttempting to upload test file...');
    
    // Create a simple test file (a small text file)
    const testFileContent = Buffer.from('This is a test file');
    const filePath = `${authData.user.id}/test-${Date.now()}.txt`;
    
    console.log('Upload path:', filePath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filePath, testFileContent, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading test file:', uploadError);
      console.log('\nThis is likely due to missing or incorrect RLS policies. Please follow the setup guide to configure the correct policies.');
      return;
    }
    
    console.log('Test file uploaded successfully:', uploadData);
    
    // Step 4: Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath);
    
    console.log('Public URL of test file:', publicUrl);
    
    // Step 5: Clean up - delete the test file
    console.log('\nCleaning up - deleting test file...');
    const { error: deleteError } = await supabase.storage
      .from('audio-files')
      .remove([filePath]);
    
    if (deleteError) {
      console.error('Error deleting test file:', deleteError);
      return;
    }
    
    console.log('Test file deleted successfully');
    console.log('\nALL TESTS PASSED! Your Supabase storage is correctly configured.');
    
  } catch (err) {
    console.error('Unexpected error during test:', err);
  } finally {
    // Sign out
    await supabase.auth.signOut();
    console.log('Test completed and signed out.');
  }
}

// Run the test
testAuthenticatedUpload();

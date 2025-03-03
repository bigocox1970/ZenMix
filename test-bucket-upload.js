import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://avrtzsptvuknahqkzqie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnR6c3B0dnVrbmFocWt6cWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDg0NzYsImV4cCI6MjA1NjQyNDQ3Nn0.Uj-Jx9xGwfx8hO8K1pTUjt0jEPgqc9vQXvwvXSXP4Qw';

// Initialize Supabase client with anon key (public key)
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBucketUpload() {
  try {
    console.log('Testing bucket upload...');
    
    // Create a simple text file
    const testContent = 'This is a test file for upload';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    // Set file name and path
    const fileName = 'test-upload.txt';
    const filePath = `test/${Date.now()}-${fileName}`;
    
    console.log(`Attempting to upload to path: ${filePath}`);
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Upload error:', error);
      return;
    }
    
    console.log('File uploaded successfully:', data);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath);
    
    console.log('Public URL:', publicUrl);
    
    // Test complete
    console.log('Test completed successfully!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the test
testBucketUpload();

import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and key from the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase key:', supabaseAnonKey ? 'Key is present (not showing for security)' : 'Key is missing');

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBucket() {
  try {
    console.log('Checking if audio-files bucket exists...');
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('Available buckets:', buckets.map(b => b.name).join(', '));
    
    const audioFilesBucket = buckets.find(b => b.name === 'audio-files');
    
    if (!audioFilesBucket) {
      console.error('The audio-files bucket does not exist.');
      
      // Try to create the bucket
      console.log('Attempting to create audio-files bucket...');
      const { data: createData, error: createError } = await supabase.storage.createBucket('audio-files', {
        public: true
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
      } else {
        console.log('Bucket created successfully:', createData);
      }
      
      return;
    }
    
    console.log('The audio-files bucket exists:', audioFilesBucket);
    
    // Try to list files in the bucket
    console.log('Listing files in audio-files bucket...');
    const { data: files, error: filesError } = await supabase.storage
      .from('audio-files')
      .list();
    
    if (filesError) {
      console.error('Error listing files:', filesError);
    } else {
      console.log('Files in bucket:', files);
    }
    
    // Try to upload a test file
    console.log('Attempting to upload a test file...');
    const testContent = 'This is a test file';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    const testPath = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(testPath, testFile);
    
    if (uploadError) {
      console.error('Error uploading test file:', uploadError);
    } else {
      console.log('Test file uploaded successfully:', uploadData);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(testPath);
      
      console.log('Public URL:', publicUrl);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the test
checkBucket();

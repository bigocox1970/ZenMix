import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://avrtzsptvuknahqkzqie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnR6c3B0dnVrbmFocWt6cWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDg0ODQ3NiwiZXhwIjoyMDU2NDI0NDc2fQ.Uj-Jx9xGwfx8hO8K1pTUjt0jEPgqc9vQXvwvXSXP4Qw';

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Script started...');

async function createBucket() {
  try {
    console.log('Checking if audio-files bucket exists...');
    
    // Check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    const audioFilesBucket = buckets.find(b => b.name === 'audio-files');
    
    if (audioFilesBucket) {
      console.log('The audio-files bucket already exists.');
      return;
    }
    
    console.log('Creating audio-files bucket...');
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('audio-files', {
      public: true // Make the bucket public
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      return;
    }
    
    console.log('Bucket created successfully:', data);
    
    // Create storage policies
    console.log('Setting up storage policies...');
    
    // Public read access
    const { error: policyError1 } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'audio-files',
      policy_name: 'Public can read audio files',
      definition: 'bucket_id = \'audio-files\'',
      operation: 'SELECT'
    });
    
    if (policyError1) {
      console.error('Error creating read policy:', policyError1);
    }
    
    // Authenticated users can upload
    const { error: policyError2 } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'audio-files',
      policy_name: 'Authenticated users can upload audio files',
      definition: 'bucket_id = \'audio-files\' AND auth.role() = \'authenticated\'',
      operation: 'INSERT'
    });
    
    if (policyError2) {
      console.error('Error creating upload policy:', policyError2);
    }
    
    // Users can update their own files
    const { error: policyError3 } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'audio-files',
      policy_name: 'Users can update their own audio files',
      definition: 'bucket_id = \'audio-files\' AND auth.role() = \'authenticated\' AND (storage.foldername(name))[1] = auth.uid()::text',
      operation: 'UPDATE'
    });
    
    if (policyError3) {
      console.error('Error creating update policy:', policyError3);
    }
    
    // Users can delete their own files
    const { error: policyError4 } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'audio-files',
      policy_name: 'Users can delete their own audio files',
      definition: 'bucket_id = \'audio-files\' AND auth.role() = \'authenticated\' AND (storage.foldername(name))[1] = auth.uid()::text',
      operation: 'DELETE'
    });
    
    if (policyError4) {
      console.error('Error creating delete policy:', policyError4);
    }
    
    console.log('Storage bucket setup complete!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createBucket();

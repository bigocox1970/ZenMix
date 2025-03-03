# Supabase Storage Setup Guide

To fix the storage upload issues, you need to create a storage bucket in your Supabase project. Follow these steps:

## Creating the Audio Files Bucket

1. Go to the Supabase dashboard: https://supabase.com/dashboard/project/avrtzsptvuknahqkzqie/storage/buckets

2. Click the "New Bucket" button

3. Enter the following details:
   - Bucket Name: `audio-files`
   - Make sure to check "Public bucket" to allow public access to files
   - Click "Create bucket"

## Setting Up Storage Policies

After creating the bucket, you need to set up access policies:

1. In the Supabase dashboard, navigate to the "Policies" tab for your new bucket

2. Create the following policies:

### Policy 1: Public Read Access
- Policy Name: "Public can read audio files"
- Allowed Operation: SELECT
- Policy Definition: `bucket_id = 'audio-files'`

### Policy 2: Authenticated Upload
- Policy Name: "Authenticated users can upload audio files"
- Allowed Operation: INSERT
- Policy Definition: `bucket_id = 'audio-files' AND auth.role() = 'authenticated'`

### Policy 3: User Update Own Files
- Policy Name: "Users can update their own audio files"
- Allowed Operation: UPDATE
- Policy Definition: `bucket_id = 'audio-files' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text`

### Policy 4: User Delete Own Files
- Policy Name: "Users can delete their own audio files"
- Allowed Operation: DELETE
- Policy Definition: `bucket_id = 'audio-files' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text`

## Testing the Setup

After completing these steps, return to the application and try uploading an audio file. The upload should now work correctly.

If you encounter any issues, check the browser console for error messages and ensure that:
1. The bucket name is exactly `audio-files`
2. The bucket is set to public
3. All the policies are correctly configured

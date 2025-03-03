# Amazon S3 Integration Guide for ZenMix

This guide will help you integrate Amazon S3 for file storage in your ZenMix application, which can be a more reliable alternative to Supabase storage.

## 1. Install Required Packages

First, install the necessary AWS SDK packages:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## 2. Create an S3 Hook

Create a new hook file at `src/hooks/useS3Storage.js`:

```javascript
import { useState } from 'react';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for managing file uploads to Amazon S3
 */
export const useS3Storage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize S3 client
  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    }
  });
  
  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET;
  
  /**
   * Upload a file to S3
   * @param {File} file - The file to upload
   * @param {string} fileName - Optional custom file name
   * @returns {Promise<{path: string, url: string}>} - The file path and URL
   */
  const uploadFile = async (file, fileName = null) => {
    if (!user) {
      throw new Error('User must be logged in to upload files');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create a unique file name if not provided
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = fileName ? `${fileName}.${fileExt}` : file.name;
      
      // Create a path that includes the user ID for organization
      const filePath = `${user.id}/${Date.now()}-${uniqueFileName}`;
      
      // Set up the upload parameters
      const params = {
        Bucket: bucketName,
        Key: filePath,
        Body: file,
        ContentType: file.type
      };
      
      // Upload the file
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      
      // Generate a signed URL for accessing the file
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: filePath
      });
      
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 * 24 * 7 }); // URL expires in 7 days
      
      return {
        path: filePath,
        url: url
      };
    } catch (err) {
      console.error('Error uploading file to S3:', err);
      setError(`Failed to upload file: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete a file from S3
   * @param {string} filePath - The S3 key of the file to delete
   * @returns {Promise<boolean>} - Whether the deletion was successful
   */
  const deleteFile = async (filePath) => {
    if (!user) {
      throw new Error('User must be logged in to delete files');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        Bucket: bucketName,
        Key: filePath
      };
      
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
      
      return true;
    } catch (err) {
      console.error('Error deleting file from S3:', err);
      setError(`Failed to delete file: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get a signed URL for a file
   * @param {string} filePath - The S3 key of the file
   * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns {Promise<string>} - The signed URL
   */
  const getFileUrl = async (filePath, expiresIn = 3600) => {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: filePath
      });
      
      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (err) {
      console.error('Error generating signed URL:', err);
      setError(`Failed to generate URL: ${err.message}`);
      throw err;
    }
  };
  
  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    loading,
    error
  };
};

export default useS3Storage;
```

## 3. Update Environment Variables

Add the following variables to your `.env` file:

```
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_id
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
VITE_AWS_S3_BUCKET=your_bucket_name
```

## 4. Update the useUserAudioTracks Hook

Modify `src/hooks/useUserAudioTracks.js` to use S3 instead of Supabase storage:

```javascript
import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';
import { useS3Storage } from './useS3Storage';

export const useUserAudioTracks = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { uploadFile, deleteFile } = useS3Storage();
  
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Rest of the existing code...
  
  // Replace the uploadAudioFile function with this:
  const uploadAudioFile = async (file, fileName) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User must be logged in to upload files');
      }
      
      // Upload to S3 instead of Supabase storage
      const fileData = await uploadFile(file, fileName);
      
      return fileData;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Failed to upload audio file: ${err.message || 'Unknown error'}`);
      return null;
    }
  };
  
  // Replace the deleteAudioFile function with this:
  const deleteAudioFile = async (filePath) => {
    try {
      setError(null);
      
      // Delete from S3 instead of Supabase storage
      await deleteFile(filePath);
      
      return true;
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete audio file. Please try again.');
      return false;
    }
  };
  
  // Return the same interface
  return {
    tracks,
    loading,
    error,
    fetchUserTracks,
    addTrack,
    updateTrack,
    deleteTrack,
    uploadAudioFile,
    deleteAudioFile
  };
};

export default useUserAudioTracks;
```

## 5. Test the Integration

1. Create an S3 bucket in your AWS account
2. Set up the appropriate CORS configuration for your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Update your environment variables with your AWS credentials
4. Run the test script to verify the S3 connection:

```bash
node test-s3-upload.js
```

5. Test the application to ensure file uploads are working correctly

## 6. Security Considerations

- Use IAM roles with limited permissions for your application
- Consider using AWS Cognito for user authentication and temporary credentials
- Set up proper bucket policies to restrict access
- For production, restrict CORS to only your application domain
- Consider server-side signed URL generation for better security

## 7. Benefits of Using S3

- More reliable and scalable storage solution
- Better performance for large files
- More control over access policies
- Potentially lower costs for high storage needs
- Direct integration with other AWS services

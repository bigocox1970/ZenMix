import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';

// Supabase S3 Configuration
const config = {
  region: 'us-east-1', // Default region for Supabase S3
  endpoint: 'https://avrtzsptvuknahqkzqie.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: '84e42a0879b465f1c04487cccb2d83e0',
    secretAccessKey: 'b3e5f0a803a9152708c66262ad439db9077614b01aa2a1c21a5b47cc45b5d5ed'
  },
  bucketName: 'audio-files' // Use the bucket name you created in Supabase
};

// Initialize S3 client
const s3Client = new S3Client({
  region: config.region,
  credentials: config.credentials,
  endpoint: config.endpoint,
  forcePathStyle: true // Required for S3-compatible APIs
});

/**
 * Upload a file to S3
 * @param {Buffer|Blob|string} fileContent - The file content to upload
 * @param {string} fileName - The name to give the file in S3
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<{key: string, url: string}>} - The S3 key and URL of the uploaded file
 */
async function uploadToS3(fileContent, fileName, contentType = 'application/octet-stream') {
  try {
    console.log(`Uploading file: ${fileName}`);
    
    // Create a unique key for the file
    const key = `uploads/${Date.now()}-${fileName}`;
    
    // Set up the upload parameters
    const params = {
      Bucket: config.bucketName,
      Key: key,
      Body: fileContent,
      ContentType: contentType
    };
    
    // Upload the file
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    
    console.log('Upload successful:', response);
    
    // Generate a signed URL for accessing the file
    const getCommand = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key
    });
    
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }); // URL expires in 1 hour
    
    return {
      key,
      url
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

/**
 * Delete a file from S3
 * @param {string} key - The S3 key of the file to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
async function deleteFromS3(key) {
  try {
    console.log(`Deleting file with key: ${key}`);
    
    const params = {
      Bucket: config.bucketName,
      Key: key
    };
    
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);
    
    console.log('Delete successful:', response);
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
}

/**
 * Test S3 upload and delete functionality
 */
async function testS3() {
  try {
    console.log('Starting S3 upload test...');
    
    // Create a test file
    const testContent = Buffer.from('This is a test file for S3 upload');
    const fileName = 'test-file.txt';
    const contentType = 'text/plain';
    
    // Upload the file
    const uploadResult = await uploadToS3(testContent, fileName, contentType);
    console.log('File uploaded successfully');
    console.log('File key:', uploadResult.key);
    console.log('File URL:', uploadResult.url);
    
    // Delete the file
    console.log('\nCleaning up - deleting test file...');
    await deleteFromS3(uploadResult.key);
    console.log('File deleted successfully');
    
    console.log('\nALL TESTS PASSED! Your S3 connection is working correctly.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testS3();

# Netlify Deployment Guide for ZenMix

This guide will help you fix the issues with your Netlify deployment at https://zenmixapp.netlify.app/

## Files Added to Fix Routing Issues

1. `public/_redirects` - This file tells Netlify to redirect all routes to index.html, which is necessary for single-page applications with client-side routing.

2. `netlify.toml` - This configuration file sets up the build settings and adds CORS headers to allow cross-origin requests.

## Supabase Configuration for Netlify

To fix the authentication and storage issues, you need to configure your Supabase project to allow requests from your Netlify domain:

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/avrtzsptvuknahqkzqie/settings/api

2. Under "API Settings", find the "API URL" and "API Key" sections

3. Scroll down to the "CORS" (Cross-Origin Resource Sharing) section

4. Add your Netlify domain to the allowed origins:
   - Add `https://zenmixapp.netlify.app` to the list
   - Make sure to include the protocol (https://) and don't include a trailing slash

5. Click "Save" to apply the changes

## Authentication URL Configuration

For authentication to work properly, you need to add your Netlify domain to the authorized redirect URLs:

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/avrtzsptvuknahqkzqie/auth/url-configuration

2. Under "URL Configuration", find the "Redirect URLs" section

3. Add your Netlify domain with the auth callback path:
   - Add `https://zenmixapp.netlify.app/auth.html` to the list
   - Add `https://zenmixapp.netlify.app/` to the list

4. Click "Save" to apply the changes

## Storage Configuration

For storage to work properly, you need to update the storage bucket CORS configuration:

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/avrtzsptvuknahqkzqie/storage/buckets

2. Click on the "audio-files" bucket

3. Go to the "Settings" tab

4. Under "CORS Configuration", add your Netlify domain:
   - Add `https://zenmixapp.netlify.app` to the allowed origins

5. Click "Save" to apply the changes

## Redeploy Your Site

After making these changes, redeploy your site on Netlify:

1. Go to your Netlify dashboard
2. Navigate to your site
3. Go to the "Deploys" tab
4. Click "Trigger deploy" and select "Clear cache and deploy site"

This will rebuild your site with the new configuration files and should resolve the issues with authentication and storage.

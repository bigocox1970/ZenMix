# SQL Scripts Overview

This document provides an overview of all SQL scripts used for database setup, restoration, and maintenance for the meditation app.

## Core Database Scripts

| Script Name | Purpose |
|-------------|---------|
| `recreate_database.sql` | Comprehensive script that creates all tables, columns, indexes, functions, triggers, and storage buckets in one go. Use this for a complete database setup. |
| `restore_database.sql` | Creates the basic database structure including tables, RLS policies, and functions. |
| `make_me_admin.sql` | Sets up admin privileges for your account by updating the is_admin flag. |
| `verify_db_setup.sql` | Verifies that all tables, columns, functions, and policies are correctly set up. |

## Column Fix Scripts

| Script Name | Purpose |
|-------------|---------|
| `fix_is_admin_column.sql` | Adds the `is_admin` column to the profiles table if it doesn't exist. |
| `add_nickname_column.sql` | Adds the `nickname` column to the profiles table if it doesn't exist. |
| `add_default_duration_column.sql` | Adds the `default_duration` column to the profiles table if it doesn't exist. |
| `fix_profiles_table.sql` | Comprehensive script to fix all missing columns in the profiles table. |

## Storage Bucket Scripts

| Script Name | Purpose |
|-------------|---------|
| `setup_avatar_bucket.sql` | Creates and configures the avatars storage bucket with appropriate policies. |
| `setup_audio_bucket.sql` | Creates and configures the audio-files storage bucket with appropriate policies. |

## Usage Guidelines

### For New Database Setup

If you're setting up a new database from scratch, use the following approach:

1. Run `recreate_database.sql` to set up the entire database structure
2. Run `make_me_admin.sql` to make your account an admin
3. Run `verify_db_setup.sql` to ensure everything is set up correctly

### For Fixing Specific Issues

If you're encountering specific errors, use the targeted scripts:

- Missing "is_admin" column: Run `fix_is_admin_column.sql`
- Missing "nickname" column: Run `add_nickname_column.sql`
- Missing "default_duration" column: Run `add_default_duration_column.sql`
- Multiple missing columns: Run `fix_profiles_table.sql`
- Storage bucket issues: Run `setup_avatar_bucket.sql` and/or `setup_audio_bucket.sql`

### For Database Verification

After making changes to the database, always run `verify_db_setup.sql` to ensure everything is working correctly.

## Database Structure

The database consists of the following main tables:

1. **profiles**
   - Stores user profile information
   - Contains columns: id, email, created_at, updated_at, nickname, avatar_url, is_admin, default_duration, preferred_voice, preferred_background, notifications

2. **meditation_sessions**
   - Stores user meditation sessions
   - Contains columns: id, user_id, name, duration, sounds, created_at

3. **audio_tracks**
   - Stores information about available audio tracks
   - Contains columns: id, name, category, url, created_at

## Storage Buckets

The application uses two storage buckets:

1. **avatars**
   - Stores user profile pictures
   - Public read access, authenticated user write access

2. **audio-files**
   - Stores user-uploaded audio files
   - Public read access, authenticated user write access

## Security Model

The database uses Row Level Security (RLS) to ensure that:

- Users can only view and update their own profiles
- Users can only view, create, update, and delete their own meditation sessions
- All users can view audio tracks
- Users can only upload, update, and delete their own files in the storage buckets

## Additional Information

For more detailed instructions on database restoration, please refer to the `DATABASE_RESTORE.md` file.

For information specifically about setting up storage buckets, refer to the `STORAGE_SETUP.md` file. 
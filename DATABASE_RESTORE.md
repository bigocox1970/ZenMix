# Database Restoration Guide

This guide provides step-by-step instructions for restoring your Supabase database for the meditation app.

## Prerequisites

- Access to Supabase dashboard
- SQL client (e.g., Supabase SQL Editor, pgAdmin, or similar)
- Database credentials

## Restoration Options

You have two main options for restoring your database:

### Option 1: Complete Database Reset (Recommended)

This option completely drops and recreates all database objects, giving you a clean slate:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `complete_database_reset.sql` and paste it into the SQL Editor
4. Run the script

This script:
- Drops all existing tables, functions, triggers, and policies
- Recreates all necessary database tables with all required columns
- Sets up proper indexes for performance
- Configures Row Level Security (RLS) policies
- Creates functions and triggers for database automation
- Sets up storage buckets for avatars and audio files
- Inserts sample audio track data
- Makes the first user an admin
- Verifies the setup was successful

### Option 2: Incremental Restoration

If you prefer a more incremental approach, follow these steps:

#### 1. Basic Database Setup

Run the following SQL scripts in order:

1. `restore_database.sql` - Creates the basic database structure
2. `make_me_admin.sql` - Sets up admin privileges for your account

#### 2. Fix Missing Columns

If you encounter errors related to missing columns, run these scripts:

1. `fix_is_admin_column.sql` - Adds the `is_admin` column if missing
2. `add_nickname_column.sql` - Adds the `nickname` column if missing
3. `add_default_duration_column.sql` - Adds the `default_duration` column if missing

#### 3. Set Up Storage Buckets

Run these scripts to set up the necessary storage buckets:

1. `setup_avatar_bucket.sql` - Creates and configures the avatars bucket
2. `setup_audio_bucket.sql` - Creates and configures the audio-files bucket

## Troubleshooting

### Missing "is_admin" Column Error

If you encounter an error related to the missing "is_admin" column:

```
ERROR: column "is_admin" of relation "profiles" does not exist
```

Run the `fix_is_admin_column.sql` script to add this column.

### Missing "nickname" Column Error

If you encounter an error like:

```
400 (Bad Request): column "nickname" of relation "profiles" does not exist
```

Run the `add_nickname_column.sql` script to add this column.

### Missing "default_duration" Column Error

If you encounter an error like:

```
400 (Bad Request): column "default_duration" of relation "profiles" does not exist
```

Run the `add_default_duration_column.sql` script to add this column.

### Storage Bucket Issues

If you encounter issues with avatar uploads or audio file access, ensure you've run the storage bucket setup scripts:
- `setup_avatar_bucket.sql`
- `setup_audio_bucket.sql`

### Policy Already Exists Error

If you encounter an error like:

```
ERROR: 42710: policy "Users can update their own profile" for table "profiles" already exists
```

This means you're trying to create a policy that already exists. Use the `complete_database_reset.sql` script instead, which properly drops existing policies before recreating them.

## Verification

After running the scripts, verify your setup by:

1. Checking if you can log in and access your profile
2. Confirming admin functionality works (if applicable)
3. Testing avatar uploads
4. Testing audio file playback
5. Creating and managing meditation sessions

## Additional Notes

- The `complete_database_reset.sql` script is the most comprehensive option and should be used if you're setting up a fresh database or need to completely rebuild your existing one.
- If you only need to fix specific issues, use the targeted scripts instead.
- Always back up your data before running major database changes. 
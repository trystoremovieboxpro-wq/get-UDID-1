# iOS Device UDID Retriever

A modern web application for retrieving iOS device UDID information using configuration profiles.

## Features

- Clean, modern UI built with React and TypeScript
- Secure data storage with Supabase
- Serverless edge functions for profile generation and data processing
- Mobile-responsive design
- Easy device information retrieval and sharing

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (Database + Edge Functions)
- **Styling**: Custom CSS with gradient themes
- **Routing**: React Router

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. The database schema and edge functions are already deployed.

## How It Works

1. User visits the home page and downloads the configuration profile
2. User installs the profile on their iOS device
3. iOS automatically sends device information to the edge function
4. Data is stored in Supabase and user is redirected to the details page
5. User can view, copy, and share their device information

## Database Schema

The app uses a single `devices` table with the following fields:
- UDID (unique identifier)
- Device name
- Product model
- iOS version
- MAC address
- IMEI
- ICCID

## Edge Functions

- `get-mobileconfig`: Generates and serves the iOS configuration profile
- `process-device-data`: Processes device data from iOS and stores it in the database

## Security

- Row Level Security (RLS) enabled on all tables
- Public access for profile installation (required by iOS)
- No authentication required for basic device lookup

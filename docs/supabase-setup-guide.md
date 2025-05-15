# Supabase Setup Guide for PoundTrades

This guide will walk you through setting up your Supabase project for the PoundTrades mobile app.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Click "New Project" and fill in the details:
   - Name: PoundTrades
   - Database Password: Create a strong password
   - Region: Choose a region close to your users (e.g., London for UK users)
3. Click "Create New Project" and wait for it to be created (this may take a few minutes)

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to Project Settings > API
2. You'll need two keys:
   - **URL**: Your project URL (e.g., https://otwslrepaneebmlttkwu.supabase.co)
   - **anon public**: Your public API key

3. Add these to your `.env` file:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

## 3. Set Up Database Tables

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query and paste the contents of `supabase/schema.sql`
3. Run the query to create all the necessary tables and policies

Alternatively, you can run each table creation statement separately:

### Listings Table

```sql
CREATE TABLE IF NOT EXISTS public.listings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  seller_type TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  boosted BOOLEAN DEFAULT FALSE,
  location JSONB,
  location_name TEXT
);

-- Add RLS policies for listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all listings
CREATE POLICY "Anyone can view listings" 
ON public.listings 
FOR SELECT 
USING (true);

-- Policy: Users can insert their own listings
CREATE POLICY "Users can insert their own listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own listings
CREATE POLICY "Users can update their own listings" 
ON public.listings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own listings
CREATE POLICY "Users can delete their own listings" 
ON public.listings 
FOR DELETE 
USING (auth.uid() = user_id);
```

### Favorites Table

```sql
CREATE TABLE IF NOT EXISTS public.favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id INTEGER REFERENCES public.listings(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Add RLS policies for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" 
ON public.favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
ON public.favorites 
FOR DELETE 
USING (auth.uid() = user_id);
```

### Unlocks Table

```sql
CREATE TABLE IF NOT EXISTS public.unlocks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id INTEGER REFERENCES public.listings(id) NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Add RLS policies for unlocks
ALTER TABLE public.unlocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own unlocks
CREATE POLICY "Users can view their own unlocks" 
ON public.unlocks 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own unlocks
CREATE POLICY "Users can insert their own unlocks" 
ON public.unlocks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

## 4. Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `listings`
3. Set the bucket's privacy to "Public"
4. Add the following RLS policies:

### For Listings Bucket

#### Select Policy (Allow public read access)
- Name: "Anyone can view listing images"
- Policy: `true`

#### Insert Policy (Allow authenticated users to upload)
- Name: "Authenticated users can upload images"
- Policy: `auth.role() = 'authenticated'`

#### Update Policy (Allow users to update their own uploads)
- Name: "Users can update their own images"
- Policy: `auth.uid() = owner`

#### Delete Policy (Allow users to delete their own uploads)
- Name: "Users can delete their own images"
- Policy: `auth.uid() = owner`

## 5. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Site URL", enter your app's URL or localhost for development
3. Enable the providers you want to use:
   - Email (enabled by default)
   - Google (requires Google OAuth credentials)

### Setting Up Google Auth (Optional)

1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/)
2. Add the redirect URI from your Supabase dashboard
3. Copy the Client ID and Client Secret to Supabase

## 6. Set Up Stripe (For £1 Unlock Feature)

1. Create a [Stripe account](https://stripe.com/) if you don't have one
2. Get your publishable key from the Stripe dashboard
3. Add it to your `.env` file:
   ```
   STRIPE_PUBLIC_KEY=your_stripe_publishable_key
   ```

4. For production, you'll need to set up a server-side component (like Supabase Edge Functions) to create payment intents securely

## 7. Testing Your Setup

1. Use the Supabase dashboard to:
   - Create a test user in Authentication
   - Insert a test listing in the Database
   - Upload a test image to Storage

2. Run the app and verify that:
   - You can log in with the test user
   - You can see the test listing
   - You can create a new listing
   - You can favorite a listing
   - The £1 unlock mechanism works (if Stripe is set up)

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check that your Site URL is correctly set in Authentication settings
   - Ensure you're using the correct Supabase URL and anon key

2. **Database Issues**
   - Verify that all tables are created with the correct schema
   - Check that RLS policies are properly configured

3. **Storage Issues**
   - Ensure the bucket is set to public
   - Verify that RLS policies allow the operations you're trying to perform

4. **Stripe Issues**
   - Make sure you're using the correct publishable key
   - Check that your payment intent creation endpoint is working

### Getting Help

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase GitHub: [https://github.com/supabase/supabase](https://github.com/supabase/supabase)
- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
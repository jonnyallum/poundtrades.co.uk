# PoundTrades Mobile App Overview

## Introduction

PoundTrades is a mobile marketplace app built for UK builders, DIYers, and tradespeople to buy and sell surplus building materials. The app follows a "Grindr meets Gumtree" concept - a grid-based interface for browsing building materials with a £1 unlock mechanism to connect buyers with sellers.

## Key Features

### 1. User Authentication
- Email/Password login
- Google OAuth integration
- Anonymous guest mode
- Secure session management

### 2. Listing Marketplace
- Grid-based UI for browsing listings
- Pull-to-refresh for latest listings
- Seller type indicators (Public, Tradesman, Business)
- Image-focused design

### 3. Listing Management
- Create listings with photo upload
- Set price and description
- Choose seller type
- Add location information
- Edit and delete listings

### 4. £1 Unlock Mechanism
- Pay £1 to reveal seller contact information
- Stripe integration for secure payments
- One-time payment per listing
- Payment records stored in database

### 5. User Dashboard
- View and manage your listings
- Access favorite listings
- Track unlocked listings

### 6. Location Features
- Map view of nearby listings
- Location-based search
- Automatic location detection

## Technical Architecture

### Frontend
- **Framework**: React Native (Expo SDK)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation (Stack and Tab navigators)
- **State Management**: React hooks and context

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Supabase client library

### Payments
- **Payment Processing**: Stripe SDK
- **Server Functions**: Supabase Edge Functions

## Data Model

### Users
- Managed by Supabase Auth
- Extended with user profiles

### Listings
```sql
CREATE TABLE listings (
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
```

### Favorites
```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id INTEGER REFERENCES listings(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);
```

### Unlocks
```sql
CREATE TABLE unlocks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id INTEGER REFERENCES listings(id) NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);
```

## Security Features

### Row-Level Security
Supabase RLS policies ensure:
- Users can only view their own favorites
- Users can only edit/delete their own listings
- Contact information is only visible after payment

### Secure Payments
- Payment intents created server-side
- Stripe handles sensitive payment information
- Payment records stored securely

### Authentication
- JWT-based authentication
- Secure password hashing
- OAuth integration for Google login

## App Flow

1. **User Registration/Login**
   - User creates account or logs in
   - Authentication state persisted locally

2. **Browsing Listings**
   - Home screen displays grid of listings
   - User can filter or search listings
   - Pull to refresh for latest listings

3. **Viewing Listing Details**
   - Tap on listing to view details
   - See images, description, price
   - Option to unlock contact info

4. **Unlocking Contact Info**
   - User taps "Unlock for £1" button
   - Stripe payment sheet appears
   - After payment, contact info revealed

5. **Creating Listings**
   - User fills out listing form
   - Uploads photos from camera or gallery
   - Sets price, description, seller type
   - Submits listing to marketplace

6. **Managing Listings**
   - User views their listings in dashboard
   - Can edit or delete listings
   - Can see listing statistics

## Performance Optimizations

- Image compression before upload
- Lazy loading of listing images
- Pagination for listing queries
- Memoization of list items
- Optimistic UI updates

## Future Enhancements

1. **Chat System**
   - In-app messaging between buyers and sellers
   - Notification system for new messages

2. **Advanced Filtering**
   - Filter by material type, condition, price range
   - Sort by distance, price, or recency

3. **Reviews and Ratings**
   - Rate sellers after transactions
   - Build reputation system

4. **Boosted Listings**
   - Pay to promote listings to top of search
   - Featured listings section

5. **Analytics Dashboard**
   - View listing performance
   - Track views and unlocks
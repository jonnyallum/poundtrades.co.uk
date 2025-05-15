# PoundTrades Mobile App

**PoundTrades** is a mobile marketplace app built for UK builders, DIYers, and tradespeople to buy and sell surplus building materials. Think *Grindr meets Gumtree* — but for bricks, not hookups.

Built with **React Native + Supabase + Stripe**, it supports listings, location, secure logins, and £1 unlocks to connect with sellers.

![PoundTrades App](./assets/app-preview.png)

## Features

- Grid-based marketplace UI (Grindr-style)
- Create, view, edit, and delete listings
- Photo uploads via camera or gallery
- Google, Email/Password, and Guest login
- Live map with tappable pins
- Seller types with colour codes (Public, Tradesman, Business)
- £1 Stripe unlock to reveal contact info
- £1 boost option for featured visibility
- Favourites + full user dashboard
- Supabase backend with Auth, Database, and Storage
- Clean, scalable structure + OTA ready

## Tech Stack

- **Frontend:** React Native (Expo SDK)
- **Backend:** Supabase (Auth, Database, Storage)
- **Payments:** Stripe SDK
- **Mapping:** Mapbox or Google Maps SDK
- **Styling:** NativeWind (Tailwind for React Native)
- **Auth:** Email/Password, Google OAuth, Anonymous Guest Mode

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Supabase account
- Stripe account (for payments)
- Mapbox account (optional, for maps)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/jonnyallum/poundtrades.co.uk.git
   cd poundtrades.co.uk
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your environment variables (see `.env.example` for required variables)

4. Start the development server
   ```bash
   npx expo start
   ```

## Supabase Setup

1. Create a new Supabase project
2. Set up the database schema using the SQL files in the `supabase` directory:
   ```bash
   # Run schema.sql to create tables and policies
   # Run seed.sql to populate with sample data
   ```

### Database Schema

The database schema is defined in `supabase/schema.sql` and includes:

#### Listings Table
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

#### Favorites Table
```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id INTEGER REFERENCES listings(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);
```

#### Unlocks Table
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

### Storage Buckets

Create a storage bucket named `listings` for storing listing images.

## Admin Accounts and Sample Data

The app comes with scripts to set up admin accounts and populate the database with sample data.

### Admin Accounts

Two admin accounts are pre-configured:

1. **Roger Holman**
   - Email: roger@poundtrades.co.uk
   - Password: Theonlywayisup69!

2. **Jonny Allum**
   - Email: jonny@kliqtmedia.co.uk
   - Password: Aprilia1

To set up these admin accounts:

1. Get your Supabase service role key from the Supabase dashboard
2. Add it to your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`
3. Run the admin setup script:
   ```bash
   node scripts/setup-admin-accounts.js
   ```

### Sample Data

The app includes sample data for:
- Example listings of building materials
- User profiles
- Favorites
- Unlocks

To populate the database with sample data:

1. Go to the SQL Editor in your Supabase dashboard
2. Run the `supabase/seed.sql` script

## Stripe Integration

1. Create a Stripe account and get your publishable key
2. Add the key to your `.env` file
3. For production, set up a server to handle payment intents securely

## App Preview

You can view a preview of the app's UI by opening:
```
preview/index.html
```

This shows mockups of all the key screens in the app.

## Documentation

Additional documentation is available in the `docs` directory:

- `app-overview.md` - High-level overview of the app
- `stripe-unlock-flow.md` - Detailed explanation of the £1 unlock mechanism
- `supabase-setup-guide.md` - Instructions for setting up Supabase
- `deployment-guide.md` - Guide for building and deploying the app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [NativeWind](https://www.nativewind.dev/)
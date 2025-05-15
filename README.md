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
   git clone https://github.com/your-username/poundtrades-app.git
   cd poundtrades-app
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
2. Set up the following tables:
   - `listings`: For storing listing information
   - `favorites`: For storing user favorites
   - `unlocks`: For tracking £1 unlocks

### Database Schema

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

## Stripe Integration

1. Create a Stripe account and get your publishable key
2. Add the key to your `.env` file
3. For production, set up a server to handle payment intents securely

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
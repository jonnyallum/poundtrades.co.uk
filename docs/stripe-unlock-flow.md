# £1 Unlock Mechanism with Stripe

The PoundTrades app implements a £1 unlock mechanism that allows users to pay to reveal seller contact information. Here's how it works:

## Overview

1. When a user views a listing and wants to contact the seller, they must pay £1
2. The payment is processed through Stripe
3. Once payment is successful, the contact information is revealed
4. The payment is recorded in the database to prevent charging the user again

## Technical Implementation

### 1. Frontend Components

In the `ListingDetails.js` screen, we have:

```jsx
{!unlocked ? (
  <TouchableOpacity
    onPress={handleUnlock}
    disabled={paymentLoading}
    className="mt-6 bg-yellow-500 py-3 rounded-xl"
  >
    {paymentLoading ? (
      <ActivityIndicator color="#000" />
    ) : (
      <Text className="text-black text-center font-bold">
        Unlock Seller Info – £1
      </Text>
    )}
  </TouchableOpacity>
) : (
  <View className="mt-6 bg-green-600 p-4 rounded-xl">
    <Text className="text-white font-bold text-center">Seller Contact Info:</Text>
    <Text className="text-white mt-2 text-center">{listing.contact_info}</Text>
  </View>
)}
```

### 2. Stripe Integration

The payment flow is handled by the Stripe React Native SDK:

```javascript
// Import Stripe hooks
import { useStripe } from '@stripe/stripe-react-native';

// In the component
const { initPaymentSheet, presentPaymentSheet } = useStripe();

// Payment handler function
const handleUnlock = async () => {
  if (!user) {
    return Alert.alert(
      'Login Required',
      'Please login to unlock seller contact information',
      [
        { text: 'Cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]
    );
  }

  try {
    setPaymentLoading(true);
    
    // 1. Create a payment intent on the server
    const response = await axios.post(
      'https://your-server-url/create-payment-intent',
      { 
        amount: 100, // £1 in pence
        listingId, 
        userId: user.id 
      }
    );
    
    const { paymentIntent, ephemeralKey, customer } = response.data;
    
    // 2. Initialize the payment sheet
    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: 'PoundTrades',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: false,
    });

    if (initError) {
      throw new Error(initError.message);
    }

    // 3. Present the payment sheet to the user
    const { error: paymentError } = await presentPaymentSheet();
    
    if (paymentError) {
      if (paymentError.code === 'Canceled') {
        // User canceled, not an error
        setPaymentLoading(false);
        return;
      }
      throw new Error(paymentError.message);
    }

    // 4. Payment successful - record the unlock
    const { error: unlockError } = await supabase
      .from('unlocks')
      .insert([{ 
        user_id: user.id, 
        listing_id: listingId,
        amount: 100, // £1 in pence
        created_at: new Date().toISOString()
      }]);
      
    if (unlockError) throw new Error(unlockError.message);
    
    // 5. Update UI to show contact info
    setUnlocked(true);
    setPaymentLoading(false);
    
    Alert.alert('Success', 'Seller contact information unlocked!');
  } catch (error) {
    setPaymentLoading(false);
    Alert.alert('Payment Failed', error.message);
  }
};
```

### 3. Backend Implementation

In a production environment, you would need a server-side component to create Stripe payment intents securely. This could be implemented as a Supabase Edge Function:

```javascript
// Example Supabase Edge Function
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { Stripe } from 'https://esm.sh/stripe@10.13.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'))
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const { amount, listingId, userId } = await req.json()
    
    // Create a customer
    const customer = await stripe.customers.create()
    
    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    )
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata: {
        listingId,
        userId,
        type: 'unlock',
      },
    })
    
    // Return the payment details
    return new Response(
      JSON.stringify({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

### 4. Database Structure

The `unlocks` table in Supabase stores records of all successful unlocks:

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

The `UNIQUE` constraint ensures a user only pays once per listing.

### 5. Checking Unlock Status

When a user views a listing, we check if they've already unlocked it:

```javascript
// Check if this listing is already unlocked by this user
if (user) {
  const { data: unlockData } = await supabase
    .from('unlocks')
    .select('*')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single();
    
  setUnlocked(!!unlockData);
}
```

## Security Considerations

1. Payment intents should always be created on the server, never on the client
2. The server should validate the amount (£1) to prevent manipulation
3. The unlock record should be created only after successful payment
4. Row-level security policies in Supabase ensure users can only see their own unlock records

## User Experience

1. Users see a clear "Unlock Seller Info – £1" button
2. The Stripe payment sheet provides a familiar, secure payment experience
3. After payment, contact information is immediately displayed
4. If a user returns to a previously unlocked listing, they don't need to pay again
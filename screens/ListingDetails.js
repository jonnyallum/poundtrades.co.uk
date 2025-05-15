// screens/ListingDetails.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../lib/auth';
import { getListingById, isFavorite, addToFavorites, removeFromFavorites } from '../lib/database';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const ListingDetails = ({ route, navigation }) => {
  const { listingId } = route.params;
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch listing data
  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getListingById(listingId);
      setListing(data);
      
      // Check if this listing is already unlocked by this user
      if (user) {
        const { data: unlockData } = await supabase
          .from('unlocks')
          .select('*')
          .eq('user_id', user.id)
          .eq('listing_id', listingId)
          .single();
          
        setUnlocked(!!unlockData);
        
        // Check if listing is favorited
        const isFav = await isFavorite(user.id, listingId);
        setFavorited(isFav);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      Alert.alert('Error', 'Failed to load listing details');
    } finally {
      setLoading(false);
    }
  }, [listingId, user]);

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchListing();
    }, [fetchListing])
  );

  // Handle payment for unlocking contact info
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
      
      // In a real app, this would be a call to your backend
      // For now, we'll simulate the payment intent creation
      // Replace with actual API call in production
      
      // Simulated API response
      const paymentIntent = 'pi_simulated_intent_' + Date.now();
      const ephemeralKey = 'ek_simulated_key_' + Date.now();
      const customer = 'cus_simulated_' + Date.now();
      
      // Initialize the payment sheet
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

      // Present the payment sheet
      const { error: paymentError } = await presentPaymentSheet();
      
      if (paymentError) {
        if (paymentError.code === 'Canceled') {
          // User canceled, not an error
          setPaymentLoading(false);
          return;
        }
        throw new Error(paymentError.message);
      }

      // Payment successful - record the unlock
      const { error: unlockError } = await supabase
        .from('unlocks')
        .insert([{ 
          user_id: user.id, 
          listing_id: listingId,
          amount: 100, // £1 in pence
          created_at: new Date().toISOString()
        }]);
        
      if (unlockError) throw new Error(unlockError.message);
      
      setUnlocked(true);
      setPaymentLoading(false);
      
      Alert.alert('Success', 'Seller contact information unlocked!');
    } catch (error) {
      setPaymentLoading(false);
      Alert.alert('Payment Failed', error.message);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!user) {
      return Alert.alert(
        'Login Required',
        'Please login to save favorites',
        [
          { text: 'Cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
    }

    try {
      if (favorited) {
        await removeFromFavorites(user.id, listingId);
      } else {
        await addToFavorites(user.id, listingId);
      }
      setFavorited(!favorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  // Share listing
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this listing on PoundTrades: ${listing.title} for £${listing.price}`,
        // In a real app, you'd include a deep link URL here
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#facc15" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View className="flex-1 bg-black justify-center items-center p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#facc15" />
        <Text className="text-white text-lg text-center mt-4">
          Listing not found or has been removed.
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          className="bg-yellow-500 py-3 px-6 rounded-xl mt-6"
        >
          <Text className="text-black font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Map seller types to background colors
  const sellerColour = {
    public: 'bg-blue-600',
    tradesman: 'bg-red-600',
    business: 'bg-green-600',
  }[listing.seller_type] || 'bg-gray-500';

  return (
    <ScrollView className="flex-1 bg-black">
      {/* Header with back button and actions */}
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#facc15" />
        </TouchableOpacity>
        
        <View className="flex-row">
          <TouchableOpacity onPress={toggleFavorite} className="p-2 mr-2">
            <Ionicons 
              name={favorited ? "heart" : "heart-outline"} 
              size={24} 
              color={favorited ? "#f43f5e" : "#facc15"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleShare} className="p-2">
            <Ionicons name="share-outline" size={24} color="#facc15" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View className="px-4">
        <Image
          source={{ uri: listing.image_url }}
          className="w-full h-64 rounded-xl"
          resizeMode="cover"
          style={styles.imageShadow}
        />

        <View className="mt-4">
          <Text className="text-yellow-400 font-bold text-2xl">{listing.title}</Text>
          <Text className="text-white text-xl mt-1">£{listing.price}</Text>

          <View className={`mt-2 px-3 py-1 rounded-full self-start ${sellerColour}`}>
            <Text className="text-white text-sm capitalize">{listing.seller_type}</Text>
          </View>

          <Text className="text-white mt-4 text-base leading-6">{listing.description}</Text>

          {/* Location info if available */}
          {listing.location && (
            <View className="mt-4 flex-row items-center">
              <Ionicons name="location-outline" size={20} color="#facc15" />
              <Text className="text-white ml-2">
                {listing.location_name || 'Location available'}
              </Text>
            </View>
          )}

          {/* Contact info section */}
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
              
              {/* Call/message buttons if phone number */}
              {listing.contact_info && listing.contact_info.match(/\d{10,}/) && (
                <View className="flex-row justify-center mt-3">
                  <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg mr-3">
                    <Text className="text-white">Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg">
                    <Text className="text-white">Message</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
          {/* Posted date */}
          <Text className="text-gray-400 text-sm mt-6 text-center">
            Posted {new Date(listing.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      {/* Bottom padding */}
      <View className="h-24" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageShadow: {
    shadowColor: '#facc15',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default ListingDetails;
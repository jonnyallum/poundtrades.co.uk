// screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ListingCard from '../components/ListingCard';
import { getAllListings } from '../lib/database';
import { useAuth } from '../lib/auth';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await getAllListings();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  }, []);

  // Fetch listings on initial load
  useEffect(() => {
    fetchListings();
  }, []);

  // Refresh listings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  // Render each listing card
  const renderItem = ({ item }) => (
    <ListingCard
      image={item.image_url}
      title={item.title}
      price={item.price}
      sellerType={item.seller_type}
      onPress={() => navigation.navigate('ListingDetails', { listingId: item.id })}
    />
  );

  // Empty state component
  const EmptyListComponent = () => (
    <View className="flex-1 justify-center items-center p-8">
      <Ionicons name="cube-outline" size={64} color="#facc15" />
      <Text className="text-white text-lg text-center mt-4">
        No listings found. Be the first to sell your leftover building materials!
      </Text>
      <TouchableOpacity
        className="bg-yellow-500 py-3 px-6 rounded-xl mt-6"
        onPress={() => navigation.navigate('Create')}
      >
        <Text className="text-black font-bold">Create Listing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
        <Text className="text-yellow-400 text-2xl font-bold">
          PoundTrades
        </Text>
        {user && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Dashboard')}
            className="p-2"
          >
            <Ionicons name="person-circle" size={30} color="#facc15" />
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#facc15" />
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ 
            paddingBottom: 100,
            flexGrow: 1, // Important for EmptyListComponent to center properly
          }}
          columnWrapperStyle={{ 
            justifyContent: 'space-between', 
            paddingHorizontal: 12, 
            marginVertical: 8 
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#facc15"
              colors={["#facc15"]}
            />
          }
          ListEmptyComponent={EmptyListComponent}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
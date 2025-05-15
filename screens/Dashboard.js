// screens/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../lib/auth';
import { getListingsByUser, getFavoriteListings, deleteListing } from '../lib/database';
import ListingCard from '../components/ListingCard';

const Dashboard = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [userListings, setUserListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user's listings
      const listings = await getListingsByUser(user.id);
      setUserListings(listings);
      
      // Fetch user's favorites
      const favs = await getFavoriteListings(user.id);
      setFavorites(favs);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load your data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  // Handle edit listing
  const handleEditListing = (listing) => {
    navigation.navigate('UpdateListing', { listing });
  };

  // Handle delete listing
  const handleDeleteListing = (listingId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { success, error } = await deleteListing(listingId);
              
              if (!success) {
                throw new Error(error || 'Failed to delete listing');
              }
              
              // Update listings after deletion
              setUserListings(userListings.filter(item => item.id !== listingId));
              Alert.alert('Success', 'Listing deleted successfully');
            } catch (error) {
              console.error('Error deleting listing:', error);
              Alert.alert('Error', error.message || 'Failed to delete listing');
            }
          }
        },
      ]
    );
  };

  // Render listing item with options
  const renderListingItem = ({ item }) => (
    <View className="w-[48%] m-[1%]">
      <ListingCard
        image={item.image_url}
        title={item.title}
        price={item.price}
        sellerType={item.seller_type}
        onPress={() => navigation.navigate('ListingDetails', { listingId: item.id })}
      />
      
      {activeTab === 'listings' && (
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={() => handleEditListing(item)}
            className="bg-blue-600 rounded-lg py-1 px-2 flex-1 mr-1"
          >
            <Text className="text-white text-center text-xs">Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleDeleteListing(item.id)}
            className="bg-red-600 rounded-lg py-1 px-2 flex-1 ml-1"
          >
            <Text className="text-white text-center text-xs">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Empty state component
  const EmptyListComponent = () => (
    <View className="flex-1 justify-center items-center p-8">
      <Ionicons 
        name={activeTab === 'listings' ? "cube-outline" : "heart-outline"} 
        size={64} 
        color="#facc15" 
      />
      <Text className="text-white text-lg text-center mt-4">
        {activeTab === 'listings' 
          ? "You haven't created any listings yet." 
          : "You haven't saved any favorites yet."}
      </Text>
      {activeTab === 'listings' && (
        <TouchableOpacity
          className="bg-yellow-500 py-3 px-6 rounded-xl mt-6"
          onPress={() => navigation.navigate('Create')}
        >
          <Text className="text-black font-bold">Create Listing</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Get user display name or email
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-yellow-400 text-2xl font-bold">
              Dashboard
            </Text>
            <Text className="text-white text-base">
              Welcome, {getUserDisplayName()}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-gray-800 p-2 rounded-full"
          >
            <Ionicons name="log-out-outline" size={24} color="#facc15" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tab Selector */}
      <View className="flex-row border-b border-gray-800 mx-4 mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab('listings')}
          className={`py-3 px-4 ${activeTab === 'listings' ? 'border-b-2 border-yellow-500' : ''}`}
        >
          <Text className={`${activeTab === 'listings' ? 'text-yellow-400' : 'text-white'} font-medium`}>
            My Listings
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('favorites')}
          className={`py-3 px-4 ${activeTab === 'favorites' ? 'border-b-2 border-yellow-500' : ''}`}
        >
          <Text className={`${activeTab === 'favorites' ? 'text-yellow-400' : 'text-white'} font-medium`}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#facc15" />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'listings' ? userListings : favorites}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingBottom: 100,
          }}
          columnWrapperStyle={{ 
            justifyContent: 'flex-start',
            paddingHorizontal: 12,
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
      
      {/* Create Listing Button */}
      {activeTab === 'listings' && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Create')}
          className="absolute bottom-6 right-6 bg-yellow-500 w-14 h-14 rounded-full justify-center items-center"
          style={styles.shadow}
        >
          <Ionicons name="add" size={30} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
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

export default Dashboard;
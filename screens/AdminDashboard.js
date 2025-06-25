// screens/AdminDashboard.js
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import ListingCard from '../components/ListingCard';

const AdminDashboard = ({ navigation }) => {
  const { user, userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
  });
  const [recentListings, setRecentListings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch admin data
  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const [usersResponse, listingsResponse, activeListingsResponse, pendingListingsResponse] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('listings').select('id', { count: 'exact' }),
        supabase.from('listings').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('listings').select('id', { count: 'exact' }).eq('status', 'pending'),
      ]);

      setStats({
        totalUsers: usersResponse.count || 0,
        totalListings: listingsResponse.count || 0,
        activeListings: activeListingsResponse.count || 0,
        pendingListings: pendingListingsResponse.count || 0,
      });

      // Fetch recent listings
      const { data: listings } = await supabase
        .from('listings')
        .select('*, users(name, email)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      setRecentListings(listings || []);

      // Fetch all users for user management
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      setAllUsers(users || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      Alert.alert('Error', 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAdminData();
    setRefreshing(false);
  }, [fetchAdminData]);

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAdminData();
    }, [fetchAdminData])
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

  // Toggle listing status
  const toggleListingStatus = async (listingId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'pending' : 'active';
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setRecentListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: newStatus }
            : listing
        )
      );

      Alert.alert('Success', `Listing ${newStatus === 'active' ? 'approved' : 'suspended'}`);
    } catch (error) {
      console.error('Error updating listing status:', error);
      Alert.alert('Error', 'Failed to update listing status');
    }
  };

  // Toggle user verification
  const toggleUserVerification = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_verified: newStatus })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setAllUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, is_verified: newStatus }
            : user
        )
      );

      Alert.alert('Success', `User ${newStatus ? 'verified' : 'unverified'}`);
    } catch (error) {
      console.error('Error updating user verification:', error);
      Alert.alert('Error', 'Failed to update user verification');
    }
  };

  // Render overview tab
  const renderOverview = () => (
    <ScrollView className="flex-1 p-4">
      {/* Stats Cards */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <View className="bg-gray-800 p-4 rounded-xl w-[48%] mb-4">
          <Text className="text-yellow-400 text-2xl font-bold">{stats.totalUsers}</Text>
          <Text className="text-white text-sm">Total Users</Text>
        </View>
        
        <View className="bg-gray-800 p-4 rounded-xl w-[48%] mb-4">
          <Text className="text-yellow-400 text-2xl font-bold">{stats.totalListings}</Text>
          <Text className="text-white text-sm">Total Listings</Text>
        </View>
        
        <View className="bg-gray-800 p-4 rounded-xl w-[48%] mb-4">
          <Text className="text-green-400 text-2xl font-bold">{stats.activeListings}</Text>
          <Text className="text-white text-sm">Active Listings</Text>
        </View>
        
        <View className="bg-gray-800 p-4 rounded-xl w-[48%] mb-4">
          <Text className="text-orange-400 text-2xl font-bold">{stats.pendingListings}</Text>
          <Text className="text-white text-sm">Pending Review</Text>
        </View>
      </View>

      {/* Recent Listings */}
      <Text className="text-white text-lg font-bold mb-4">Recent Listings</Text>
      {recentListings.slice(0, 5).map((listing) => (
        <View key={listing.id} className="bg-gray-800 p-4 rounded-xl mb-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white font-medium">{listing.title}</Text>
              <Text className="text-gray-400 text-sm">by {listing.users?.name || 'Unknown'}</Text>
              <Text className="text-yellow-400 font-bold">£{listing.price}</Text>
            </View>
            
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => toggleListingStatus(listing.id, listing.status)}
                className={`px-3 py-1 rounded-lg mr-2 ${
                  listing.status === 'active' ? 'bg-green-600' : 'bg-orange-600'
                }`}
              >
                <Text className="text-white text-xs">
                  {listing.status === 'active' ? 'Active' : 'Pending'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => navigation.navigate('ListingDetails', { listingId: listing.id })}
                className="bg-blue-600 px-3 py-1 rounded-lg"
              >
                <Text className="text-white text-xs">View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  // Render users tab
  const renderUsers = () => (
    <ScrollView className="flex-1 p-4">
      <Text className="text-white text-lg font-bold mb-4">User Management</Text>
      {allUsers.map((user) => (
        <View key={user.id} className="bg-gray-800 p-4 rounded-xl mb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white font-medium">{user.name}</Text>
              <Text className="text-gray-400 text-sm">{user.email}</Text>
              <Text className="text-gray-400 text-xs">
                {user.user_type === 'admin' ? 'Admin' : 'User'} • 
                {user.is_verified ? ' Verified' : ' Unverified'}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => toggleUserVerification(user.id, user.is_verified)}
              className={`px-3 py-1 rounded-lg ${
                user.is_verified ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <Text className="text-white text-xs">
                {user.is_verified ? 'Verified' : 'Verify'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  // Render listings tab
  const renderListings = () => (
    <ScrollView className="flex-1 p-4">
      <Text className="text-white text-lg font-bold mb-4">Listing Management</Text>
      {recentListings.map((listing) => (
        <View key={listing.id} className="bg-gray-800 p-4 rounded-xl mb-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white font-medium">{listing.title}</Text>
              <Text className="text-gray-400 text-sm">by {listing.users?.name || 'Unknown'}</Text>
              <Text className="text-yellow-400 font-bold">£{listing.price}</Text>
              <Text className="text-gray-400 text-xs">Status: {listing.status}</Text>
            </View>
            
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => toggleListingStatus(listing.id, listing.status)}
                className={`px-3 py-1 rounded-lg mr-2 ${
                  listing.status === 'active' ? 'bg-red-600' : 'bg-green-600'
                }`}
              >
                <Text className="text-white text-xs">
                  {listing.status === 'active' ? 'Suspend' : 'Approve'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => navigation.navigate('ListingDetails', { listingId: listing.id })}
                className="bg-blue-600 px-3 py-1 rounded-lg"
              >
                <Text className="text-white text-xs">View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-yellow-400 text-2xl font-bold">
              Admin Dashboard
            </Text>
            <Text className="text-white text-base">
              Welcome, {userProfile?.name || 'Admin'}
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
          onPress={() => setActiveTab('overview')}
          className={`py-3 px-4 ${activeTab === 'overview' ? 'border-b-2 border-yellow-500' : ''}`}
        >
          <Text className={`${activeTab === 'overview' ? 'text-yellow-400' : 'text-white'} font-medium`}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('users')}
          className={`py-3 px-4 ${activeTab === 'users' ? 'border-b-2 border-yellow-500' : ''}`}
        >
          <Text className={`${activeTab === 'users' ? 'text-yellow-400' : 'text-white'} font-medium`}>
            Users
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('listings')}
          className={`py-3 px-4 ${activeTab === 'listings' ? 'border-b-2 border-yellow-500' : ''}`}
        >
          <Text className={`${activeTab === 'listings' ? 'text-yellow-400' : 'text-white'} font-medium`}>
            Listings
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#facc15" />
        </View>
      ) : (
        <View className="flex-1">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'listings' && renderListings()}
        </View>
      )}
    </View>
  );
};

export default AdminDashboard;


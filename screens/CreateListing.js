// screens/CreateListing.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth';
import { createListing } from '../lib/database';
import { uploadImage } from '../lib/storage';

const CreateListing = ({ navigation }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sellerType, setSellerType] = useState('public');
  const [image, setImage] = useState(null);
  const [contactInfo, setContactInfo] = useState('');
  const [boost, setBoost] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Request camera/gallery permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and gallery permissions to upload photos'
      );
      return false;
    }
    return true;
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Get current location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Get location name from coordinates
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode) {
        const locationString = [
          geocode.city,
          geocode.region,
          geocode.postalCode
        ].filter(Boolean).join(', ');
        
        setLocationName(locationString);
      }

      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      return Alert.alert('Missing Title', 'Please enter a title for your listing');
    }
    if (!description.trim()) {
      return Alert.alert('Missing Description', 'Please describe your listing');
    }
    if (!price.trim() || isNaN(parseFloat(price))) {
      return Alert.alert('Invalid Price', 'Please enter a valid price');
    }
    if (!image) {
      return Alert.alert('Missing Image', 'Please add at least one photo');
    }
    if (!contactInfo.trim()) {
      return Alert.alert('Missing Contact Info', 'Please provide contact information');
    }

    try {
      setUploading(true);

      // Get current location if not already set
      const currentLocation = location || await getLocation();

      // Upload image to Supabase Storage
      const timestamp = Date.now();
      const filename = `${user.id}_${timestamp}.jpg`;
      const { success, url, error: uploadError } = await uploadImage(
        image,
        'listings',
        filename
      );

      if (!success || !url) {
        throw new Error(uploadError || 'Failed to upload image');
      }

      // Create listing in Supabase
      const listingData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image_url: url,
        seller_type: sellerType,
        contact_info: contactInfo.trim(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        boosted: boost,
        location: currentLocation,
        location_name: locationName,
      };

      const { success: createSuccess, error: createError } = await createListing(listingData);

      if (!createSuccess) {
        throw new Error(createError || 'Failed to create listing');
      }

      setUploading(false);
      Alert.alert('Success', 'Your listing has been posted!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      setUploading(false);
      console.error('Error creating listing:', error);
      Alert.alert('Error', error.message || 'Failed to create listing');
    }
  };

  // Show image picker options
  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose a method to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black"
    >
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-yellow-400 font-bold text-2xl mb-4">Create Listing</Text>

        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-white mb-1">Title</Text>
          <TextInput
            placeholder="What are you selling?"
            placeholderTextColor="#aaa"
            className="bg-gray-800 text-white rounded-xl p-3"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-white mb-1">Description</Text>
          <TextInput
            placeholder="Describe your item, condition, quantity, etc."
            placeholderTextColor="#aaa"
            multiline
            className="bg-gray-800 text-white rounded-xl p-3 h-24"
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        {/* Price Input */}
        <View className="mb-4">
          <Text className="text-white mb-1">Price (£)</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            className="bg-gray-800 text-white rounded-xl p-3"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Contact Info */}
        <View className="mb-4">
          <Text className="text-white mb-1">Contact Information</Text>
          <TextInput
            placeholder="Phone number or email"
            placeholderTextColor="#aaa"
            className="bg-gray-800 text-white rounded-xl p-3"
            value={contactInfo}
            onChangeText={setContactInfo}
          />
        </View>

        {/* Seller Type */}
        <View className="mb-4">
          <Text className="text-white mb-1">Seller Type</Text>
          <View className="flex-row justify-between">
            {['public', 'tradesman', 'business'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSellerType(type)}
                className={`px-3 py-2 rounded-xl ${
                  sellerType === type ? 'bg-yellow-500' : 'bg-gray-700'
                }`}
              >
                <Text className={`capitalize ${sellerType === type ? 'text-black font-bold' : 'text-white'}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Upload */}
        <View className="mb-4">
          <Text className="text-white mb-1">Photo</Text>
          <TouchableOpacity
            onPress={showImageOptions}
            className="bg-yellow-500 rounded-xl py-3 mb-3"
          >
            <Text className="text-black text-center font-bold">
              {image ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image 
              source={{ uri: image }} 
              className="w-full h-48 rounded-xl mb-2" 
              resizeMode="cover" 
            />
          )}
        </View>

        {/* Location */}
        <View className="mb-4">
          <Text className="text-white mb-1">Location</Text>
          <TouchableOpacity
            onPress={async () => {
              const loc = await getLocation();
              if (loc) setLocation(loc);
            }}
            className="bg-gray-700 rounded-xl py-3 mb-1 flex-row justify-center items-center"
          >
            <Ionicons name="location-outline" size={18} color="#facc15" style={{ marginRight: 8 }} />
            <Text className="text-white text-center">
              {locationName || 'Use Current Location'}
            </Text>
          </TouchableOpacity>
          {locationName && (
            <Text className="text-gray-400 text-sm text-center">{locationName}</Text>
          )}
        </View>

        {/* Boost Option */}
        <TouchableOpacity
          onPress={() => setBoost(!boost)}
          className={`p-3 mb-6 rounded-xl ${
            boost ? 'bg-green-600' : 'bg-gray-800'
          }`}
        >
          <Text className="text-white text-center font-bold">
            {boost ? 'Boost Selected (£1)' : 'Boost Listing for £1'}
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-1">
            Boosted listings appear at the top of search results
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          disabled={uploading}
          onPress={handleSubmit}
          className="bg-yellow-500 py-4 rounded-xl mb-8"
        >
          {uploading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-black text-center font-bold">Post Listing</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateListing;
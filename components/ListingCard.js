// components/ListingCard.js
import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ListingCard component for displaying listing previews in a grid
 * 
 * @param {Object} props
 * @param {string} props.image - Image URL
 * @param {string} props.title - Listing title
 * @param {number} props.price - Listing price
 * @param {string} props.sellerType - Seller type (public, tradesman, business)
 * @param {boolean} props.isFavorite - Whether listing is favorited
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Function} props.onFavoritePress - Function to call when favorite button is pressed
 * @returns {JSX.Element}
 */
const ListingCard = ({ 
  image, 
  title, 
  price, 
  sellerType = 'public',
  isFavorite = false,
  onPress,
  onFavoritePress
}) => {
  // Map seller types to background colors
  const sellerColour = {
    public: 'bg-blue-600',
    tradesman: 'bg-red-600',
    business: 'bg-green-600',
  }[sellerType] || 'bg-gray-500';

  // Handle missing image
  const imageSource = image 
    ? { uri: image } 
    : require('../assets/placeholder.png'); // Make sure to add a placeholder image

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[48%] m-[1%] bg-black rounded-2xl overflow-hidden border-2 border-yellow-500"
      style={styles.shadow}
    >
      <View className="relative">
        <Image
          source={imageSource}
          className="w-full h-32"
          resizeMode="cover"
        />
        
        {/* Favorite button */}
        {onFavoritePress && (
          <TouchableOpacity 
            onPress={onFavoritePress}
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? "#f43f5e" : "#ffffff"} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View className="p-2">
        <Text 
          className="text-yellow-400 font-bold text-base" 
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text className="text-white text-sm">£{price}</Text>
        <View className={`mt-2 px-2 py-1 rounded-full ${sellerColour}`}>
          <Text className="text-white text-xs capitalize">{sellerType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Add shadow styles (not possible with just className)
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#facc15',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// Use memo to prevent unnecessary re-renders in grid lists
export default memo(ListingCard);
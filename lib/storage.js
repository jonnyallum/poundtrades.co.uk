// lib/storage.js
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Upload an image to Supabase Storage
 * @param {string} uri - Local image URI
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Storage path/filename
 * @returns {Promise<Object>} Result object with URL if successful
 */
export const uploadImage = async (uri, bucket = 'listings', path) => {
  try {
    // Compress the image first to reduce size
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }], // Resize to max width of 1000px
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    // Use the compressed image URI
    const fileUri = compressedImage.uri;
    
    // Generate a unique filename if not provided
    const filename = path || `${Date.now()}.jpg`;
    
    let base64;
    
    // Handle different platforms
    if (Platform.OS === 'web') {
      // For web, fetch the image and convert to base64
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      // Convert blob to base64 using a promise
      base64 = await new Promise((resolve) => {
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });
    } else {
      // For native, read as base64 directly
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
    
    // Convert base64 to ArrayBuffer for Supabase
    const arrayBuffer = decode(base64);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });
      
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);
      
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} path - Storage path/filename
 * @param {string} bucket - Storage bucket name
 * @returns {Promise<Object>} Result object with success status
 */
export const deleteImage = async (path, bucket = 'listings') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Extract filename from a Supabase Storage URL
 * @param {string} url - Supabase Storage URL
 * @returns {string} Filename
 */
export const getFilenameFromUrl = (url) => {
  if (!url) return null;
  // Extract the filename from the URL
  const parts = url.split('/');
  return parts[parts.length - 1];
};
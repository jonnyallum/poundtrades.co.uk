// lib/database.js
import { supabase } from './supabase';

/**
 * Fetch all listings from Supabase, sorted by creation time
 * @returns {Promise<Array>} Array of listing objects
 */
export const getAllListings = async () => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    return [];
  }
};

/**
 * Fetch a single listing by ID
 * @param {string} id - The listing ID
 * @returns {Promise<Object|null>} Listing object or null
 */
export const getListingById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching listing:', error.message);
    return null;
  }
};

/**
 * Create a new listing
 * @param {Object} listing - Listing data
 * @returns {Promise<Object>} Result object with success status
 */
export const createListing = async (listing) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating listing:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Update an existing listing
 * @param {string} id - Listing ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Result object with success status
 */
export const updateListing = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating listing:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a listing
 * @param {string} id - Listing ID
 * @returns {Promise<Object>} Result object with success status
 */
export const deleteListing = async (id) => {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting listing:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get listings by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of listing objects
 */
export const getListingsByUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user listings:', error.message);
    return [];
  }
};

/**
 * Get favorite listings for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of listing objects
 */
export const getFavoriteListings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('listing_id, listings(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Extract the listings from the joined query
    return data?.map(item => item.listings) || [];
  } catch (error) {
    console.error('Error fetching favorite listings:', error.message);
    return [];
  }
};

/**
 * Add a listing to favorites
 * @param {string} userId - User ID
 * @param {string} listingId - Listing ID
 * @returns {Promise<Object>} Result object with success status
 */
export const addToFavorites = async (userId, listingId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, listing_id: listingId }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error adding to favorites:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a listing from favorites
 * @param {string} userId - User ID
 * @param {string} listingId - Listing ID
 * @returns {Promise<Object>} Result object with success status
 */
export const removeFromFavorites = async (userId, listingId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Check if a listing is in user's favorites
 * @param {string} userId - User ID
 * @param {string} listingId - Listing ID
 * @returns {Promise<boolean>} True if favorited
 */
export const isFavorite = async (userId, listingId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return !!data;
  } catch (error) {
    console.error('Error checking favorite status:', error.message);
    return false;
  }
};
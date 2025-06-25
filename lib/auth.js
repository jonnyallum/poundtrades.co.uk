// lib/auth.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabase';

// Create auth context
const AuthContext = createContext({
  user: null,
  userProfile: null,
  session: null,
  loading: true,
  isAdmin: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  loginWithGoogle: async () => {},
  loginAsGuest: async () => {},
  updateUser: async () => {},
  refreshUserProfile: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user profile from database
  const fetchUserProfile = async (userId) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update user state and profile
  const updateUserState = async (user) => {
    setUser(user);
    
    if (user) {
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
      setIsAdmin(profile?.user_type === 'admin');
    } else {
      setUserProfile(null);
      setIsAdmin(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      await updateUserState(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        await updateUserState(session?.user ?? null);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login as guest (anonymous)
  const loginAsGuest = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateUser = async (updates) => {
    try {
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!user) return;
    
    const profile = await fetchUserProfile(user.id);
    setUserProfile(profile);
    setIsAdmin(profile?.user_type === 'admin');
  };

  // Context value
  const value = {
    user,
    userProfile,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    loginWithGoogle,
    loginAsGuest,
    updateUser,
    refreshUserProfile,
  };

  // Return provider with value
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
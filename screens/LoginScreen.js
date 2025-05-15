// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../lib/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp, loginWithGoogle, loginAsGuest } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigation.replace('MainTabs');
    }
  }, [user, navigation]);

  // Handle email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Missing Fields', 'Please fill in all fields');
    }

    setIsLoading(true);
    const { success, error } = await signIn(email, password);
    setIsLoading(false);

    if (!success) {
      Alert.alert('Login Failed', error);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert('Missing Fields', 'Please fill in all fields');
    }

    setIsLoading(true);
    const { success, error } = await signUp(email, password);
    setIsLoading(false);

    if (!success) {
      Alert.alert('Registration Failed', error);
    } else {
      Alert.alert(
        'Registration Successful',
        'Please check your email for verification'
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { success, error } = await loginWithGoogle();
    setIsLoading(false);

    if (!success) {
      Alert.alert('Google Login Failed', error);
    }
  };

  // Handle guest login
  const handleGuestLogin = async () => {
    setIsLoading(true);
    const { success, error } = await loginAsGuest();
    setIsLoading(false);

    if (!success) {
      Alert.alert('Guest Login Failed', error);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center px-6">
      <StatusBar style="light" />
      <Text className="text-yellow-400 text-3xl font-bold mb-6 text-center">
        PoundTrades Login
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        className="bg-gray-800 text-white rounded-xl p-4 mb-3"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        className="bg-gray-800 text-white rounded-xl p-4 mb-6"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        className="bg-yellow-500 py-4 rounded-xl mb-3"
      >
        {isLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-black text-center font-bold">Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={isLoading}
        className="bg-gray-700 py-4 rounded-xl mb-3"
      >
        <Text className="text-white text-center">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        disabled={isLoading}
        className="bg-blue-600 py-4 rounded-xl mb-3"
      >
        <Text className="text-white text-center">Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGuestLogin}
        disabled={isLoading}
        className="border border-yellow-500 py-4 rounded-xl"
      >
        <Text className="text-yellow-400 text-center">Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
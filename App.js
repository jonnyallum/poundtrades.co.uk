// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ListingDetails from './screens/ListingDetails';
import CreateListing from './screens/CreateListing';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';

// Import auth provider
import { AuthProvider, useAuth } from './lib/auth';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Ignore specific warnings
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native',
  'Setting a timer for a long period of time',
]);

// Main tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#000',
          borderTopColor: '#333',
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#facc15',
        tabBarInactiveTintColor: '#fff',
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Home: focused ? 'grid' : 'grid-outline',
            Create: focused ? 'add-circle' : 'add-circle-outline',
            Dashboard: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateListing} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
    </Tab.Navigator>
  );
};

// Auth navigator
const AuthNavigator = () => {
  const { user, loading } = useAuth();

  // If still loading auth state, return null
  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="ListingDetails" 
            component={ListingDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main app component
const App = () => {
  // Get Stripe key from constants
  const stripeKey = Constants.expoConfig?.extra?.stripePublicKey || '';

  return (
    <AuthProvider>
      <StripeProvider publishableKey={stripeKey}>
        <NavigationContainer>
          <StatusBar style="light" />
          <AuthNavigator />
        </NavigationContainer>
      </StripeProvider>
    </AuthProvider>
  );
};

export default App;
// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: 'PoundTrades',
    slug: 'poundtrades',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'poundtrades',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#000000',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.yourcompany.poundtrades',
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.yourcompany.poundtrades',
      versionCode: 1,
      permissions: ['ACCESS_FINE_LOCATION', 'CAMERA', 'MEDIA_LIBRARY'],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'YOUR_EAS_PROJECT_ID',
      },
      supabaseUrl: 'https://otwslrepaneebmlttkwu.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5OTM0OTgsImV4cCI6MjA2MjU2OTQ5OH0.kANMGs3PXdDxO7SgJUjrQfKXLB6PE2-6WtXknjHW9UE',
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
    plugins: ['expo-location', 'expo-image-picker'],
  },
};
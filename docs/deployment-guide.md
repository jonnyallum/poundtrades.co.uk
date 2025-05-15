# PoundTrades Mobile App Deployment Guide

This guide will walk you through the process of building and deploying the PoundTrades mobile app to the Google Play Store and Apple App Store.

## Prerequisites

- Expo account (sign up at [expo.dev](https://expo.dev))
- Google Play Developer account (for Android deployment)
- Apple Developer account (for iOS deployment)
- EAS CLI installed globally: `npm install -g eas-cli`

## 1. Configure app.json

Ensure your `app.json` file is properly configured with the correct app information:

```json
{
  "expo": {
    "name": "PoundTrades",
    "slug": "poundtrades",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#000000"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourcompany.poundtrades"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.yourcompany.poundtrades",
      "permissions": ["ACCESS_FINE_LOCATION", "CAMERA", "MEDIA_LIBRARY"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

## 2. Configure EAS Build

1. Log in to your Expo account:
   ```bash
   eas login
   ```

2. Configure EAS Build:
   ```bash
   eas build:configure
   ```

3. This will create an `eas.json` file. Make sure it includes configurations for development, preview, and production builds:

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 3. Set Up App Signing

### Android

For Android, you need a keystore to sign your app. EAS can generate and manage this for you:

1. Let EAS handle the keystore (recommended for most users):
   ```bash
   eas build:configure
   ```
   When asked about the Android keystore, choose "Let EAS handle this for me".

2. Or, if you have an existing keystore:
   - Add your keystore details to `eas.json`:
   ```json
   "production": {
     "android": {
       "buildType": "app-bundle",
       "credentialsSource": "local",
       "gradleCommand": ":app:bundleRelease"
     }
   }
   ```
   - Set up local credentials:
   ```bash
   eas credentials
   ```

### iOS

For iOS, you need various certificates and provisioning profiles:

1. Let EAS handle iOS credentials (recommended):
   ```bash
   eas build:configure
   ```
   When asked about iOS credentials, choose "Let EAS handle this for me".

2. Or, if you want to use your existing credentials:
   - Add to `eas.json`:
   ```json
   "production": {
     "ios": {
       "credentialsSource": "local"
     }
   }
   ```
   - Set up local credentials:
   ```bash
   eas credentials
   ```

## 4. Build the App

### Development Build

For testing on your device with development features:

```bash
eas build --profile development --platform all
```

### Preview Build

For internal testing or beta testing:

```bash
eas build --profile preview --platform all
```

### Production Build

For app store submission:

```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

## 5. Test the Build

1. Once the build is complete, you'll receive a URL to download the app
2. Install it on your device and thoroughly test all features
3. Pay special attention to:
   - Authentication flows
   - Image uploads
   - Stripe payments
   - Location features
   - Deep linking

## 6. Submit to App Stores

### Google Play Store

1. Prepare store listing assets:
   - App icon (512x512px)
   - Feature graphic (1024x500px)
   - Screenshots (various sizes)
   - Privacy policy URL
   - App description

2. Submit using EAS Submit:
   ```bash
   eas submit -p android --latest
   ```

3. Or manually:
   - Download the AAB file from EAS
   - Go to Google Play Console
   - Create a new app or new release
   - Upload the AAB file
   - Fill in store listing details
   - Set up pricing and distribution
   - Submit for review

### Apple App Store

1. Prepare App Store Connect:
   - Create a new app in App Store Connect
   - Set up app information
   - Prepare screenshots and app description
   - Set up pricing and availability

2. Submit using EAS Submit:
   ```bash
   eas submit -p ios --latest
   ```

3. Or manually:
   - Download the IPA file from EAS
   - Use Application Loader or Transporter to upload
   - Complete the submission in App Store Connect
   - Submit for review

## 7. App Store Optimization

1. **Keywords**: Include relevant keywords in your app title and description
2. **Screenshots**: Show the most compelling features
3. **Description**: Clearly explain the value proposition
4. **Icon**: Make it stand out and reflect your brand

## 8. Post-Launch

1. **Monitor Analytics**: Track user engagement and conversion rates
2. **Gather Feedback**: Respond to user reviews and fix issues
3. **Regular Updates**: Plan for regular feature updates and bug fixes
4. **Marketing**: Promote your app through social media and other channels

## 9. Over-the-Air Updates

With Expo, you can push updates without going through the app store review process:

1. Make changes to your app
2. Test thoroughly
3. Push an update:
   ```bash
   eas update --branch production --message "Update message"
   ```

## 10. Troubleshooting

### Common Build Issues

1. **Missing Assets**: Ensure all required assets are in the correct locations
2. **Environment Variables**: Check that all environment variables are properly set
3. **Dependencies**: Make sure all dependencies are compatible with Expo
4. **Permissions**: Verify that all required permissions are properly configured

### Common Submission Issues

1. **Metadata Rejection**: Ensure your app description and screenshots comply with store guidelines
2. **Privacy Policy**: Make sure your privacy policy covers all required areas
3. **Functionality Issues**: Test thoroughly before submission to avoid functional rejections
4. **Performance**: Optimize your app to avoid performance-related rejections

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
- [Stripe Documentation](https://stripe.com/docs/mobile)
- [Supabase Documentation](https://supabase.com/docs)
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CouPle',
  slug: 'couple-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FF6B9D',
  },
  assetBundlePatterns: [
    '**/*',
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.couple.app',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'Cette application utilise la caméra pour prendre des photos de vos souvenirs.',
      NSPhotoLibraryUsageDescription: 'Cette application accède à votre galerie pour sauvegarder vos photos.',
      NSLocationWhenInUseUsageDescription: 'Cette application utilise votre localisation pour partager votre position avec votre partenaire.',
      NSMicrophoneUsageDescription: 'Cette application utilise le microphone pour les messages vocaux.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FF6B9D',
    },
    package: 'com.couple.app',
    versionCode: 1,
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
      'android.permission.WAKE_LOCK',
      'android.permission.VIBRATE',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#FF6B9D',
        sounds: ['./assets/notification-sound.wav'],
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Cette application utilise la caméra pour prendre des photos de vos souvenirs.',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Cette application utilise votre localisation pour partager votre position avec votre partenaire.',
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'Cette application accède à votre galerie pour sauvegarder vos photos.',
        savePhotosPermission: 'Cette application sauvegarde vos photos dans votre galerie.',
        isAccessMediaLocationEnabled: true,
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.couple-app.com',
    wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.couple-app.com',
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
  },
  owner: 'your-expo-username',
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id',
    fallbackToCacheTimeout: 0,
  },
  experiments: {
    tsconfigPaths: true,
  },
}); 
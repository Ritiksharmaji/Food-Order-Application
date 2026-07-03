import Constants from 'expo-constants'
import { Platform } from 'react-native'

// Central API configuration.
//
// Override the backend URL without touching code by adding a .env file with:
//   EXPO_PUBLIC_API_URL=http://your-backend-host:4000
//
// When no override is set, we derive the dev machine's LAN IP from the Expo
// dev server so the backend is reachable from a real device / emulator
// (plain `localhost` would point at the phone itself).
const devHost = Constants.expoConfig?.hostUri?.split(':')[0]

const fallback = devHost
  ? `http://${devHost}:4000`
  : Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000'

export const API_URL = process.env.EXPO_PUBLIC_API_URL || fallback

// Build an absolute URL for an uploaded image filename returned by the backend.
export const imageUrl = (filename) => `${API_URL}/images/${filename}`

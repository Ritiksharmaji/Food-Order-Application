import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit'
import * as SplashScreen from 'expo-splash-screen'
import StoreContextProvider, { useStore } from '../context/StoreContext'
import { getColors } from '../theme/theme'

SplashScreen.preventAutoHideAsync()

const RootStack = () => {
  const { theme } = useStore()
  const colors = getColors(theme)
  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="auth/register" options={{ animation: 'fade_from_bottom' }} />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  })

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <StoreContextProvider>
      <RootStack />
    </StoreContextProvider>
  )
}

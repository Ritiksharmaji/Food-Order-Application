import React from 'react'
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { assets } from '../assets/assets'
import { useStore } from '../context/StoreContext'
import { FONT, getColors } from '../theme/theme'

const { height } = Dimensions.get('window')

// Shared shell for the Login / Register screens: full-bleed food hero with a
// brand gradient, floating logo, and a curved sheet holding the form.
const AuthScaffold = ({ title, subtitle, children }) => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme } = useStore()
  const colors = getColors(theme)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <ImageBackground source={assets.header_img} style={styles.hero} resizeMode="cover">
            <LinearGradient
              colors={['#00000055', '#00000000', '#FF4C24cc']}
              style={StyleSheet.absoluteFill}
            />
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
              style={[styles.back, { top: insets.top + 10 }]}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
            </View>
          </ImageBackground>

          {/* Curved form sheet */}
          <View style={[styles.sheet, { backgroundColor: colors.bg }]}>
            <View style={[styles.grabber, { backgroundColor: colors.border }]} />
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  hero: {
    height: height * 0.34,
    justifyContent: 'flex-end',
  },
  back: {
    position: 'absolute',
    left: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000055',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  brandRow: { alignItems: 'center', marginBottom: 42 },
  logo: {
    width: 150,
    height: 46,
    backgroundColor: '#ffffffee',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sheet: {
    flex: 1,
    marginTop: -26,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 30,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontFamily: FONT.bold },
  subtitle: { fontSize: 14, fontFamily: FONT.regular, marginTop: 6, marginBottom: 22, lineHeight: 20 },
})

export default AuthScaffold

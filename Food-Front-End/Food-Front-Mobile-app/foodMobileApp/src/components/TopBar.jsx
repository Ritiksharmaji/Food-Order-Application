import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { assets } from '../assets/assets'
import { useStore } from '../context/StoreContext'
import { BRAND, FONT, getColors } from '../theme/theme'

// App bar mirroring the web navbar: logo, theme toggle, basket, sign in / avatar.
const TopBar = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme, toggleTheme, token, user, getCartCount } = useStore()
  const colors = getColors(theme)
  const cartCount = getCartCount()

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8, backgroundColor: colors.bg }]}>
      <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.right}>
        <TouchableOpacity onPress={toggleTheme} hitSlop={8} style={styles.iconBtn}>
          <Ionicons
            name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={21}
            color={colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="basket-outline" size={23} color={colors.text} />
          {cartCount > 0 && <View style={styles.dot} />}
        </TouchableOpacity>
        {token ? (
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} hitSlop={8}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            style={[styles.signIn, { borderColor: BRAND }]}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  logo: { width: 110, height: 34 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { position: 'relative' },
  dot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: BRAND,
  },
  signIn: {
    borderWidth: 1.4,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  signInText: { color: BRAND, fontSize: 13, fontFamily: FONT.medium },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 15, fontFamily: FONT.semibold },
})

export default TopBar

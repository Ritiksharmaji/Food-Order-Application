import React, { useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import AuthScaffold from '../../components/AuthScaffold'
import AppInput from '../../components/AppInput'
import { assets } from '../../assets/assets'
import { authApi } from '../../api'
import { useStore } from '../../context/StoreContext'
import { BRAND, BRAND_DARK, FONT, getColors } from '../../theme/theme'

const Login = () => {
  const router = useRouter()
  const { setToken, saveUser, loadCartData, toast, theme } = useStore()
  const colors = getColors(theme)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onLogin = async () => {
    if (!email.trim() || !password) {
      toast('Please enter your email and password', 'error')
      return
    }
    setLoading(true)
    try {
      const response = await authApi.login({ email: email.trim(), password })
      if (response.success) {
        await setToken(response.token)
        // Backend only returns a token — keep a basic profile for the Profile tab.
        await saveUser({ name: email.split('@')[0], email: email.trim() })
        loadCartData()
        toast('Welcome back! 🍅')
        router.replace('/(tabs)')
      } else {
        toast(response.message || 'Login failed', 'error')
      }
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScaffold
      title="Welcome back 👋"
      subtitle="Sign in to your Tomato account and get your favourite food delivered hot & fresh."
    >
      <View style={styles.form}>
        <AppInput
          icon="mail-outline"
          placeholder="Your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          icon="lock-closed-outline"
          placeholder="Password"
          secure
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgot} onPress={() => toast('Password reset is coming soon')}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9} onPress={onLogin} disabled={loading}>
          <LinearGradient
            colors={[BRAND, BRAND_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.muted }]}>or continue with</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialRow}>
          {[assets.facebook_icon, assets.twitter_icon, assets.linkedin_icon].map((icon, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.social, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => toast('Social login is coming soon')}
            >
              <Image source={icon} style={styles.socialIcon} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.muted }]}>Create a new account? </Text>
          <TouchableOpacity onPress={() => router.replace('/auth/register')}>
            <Text style={styles.switchLink}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  form: { gap: 14 },
  forgot: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { color: BRAND, fontSize: 13, fontFamily: FONT.medium },
  button: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: BRAND,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonText: { color: '#fff', fontSize: 17, fontFamily: FONT.semibold, letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: FONT.regular },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  social: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: { width: 26, height: 26, resizeMode: 'contain' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  switchText: { fontSize: 14, fontFamily: FONT.regular },
  switchLink: { fontSize: 14, fontFamily: FONT.semibold, color: BRAND },
})

export default Login

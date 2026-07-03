import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AuthScaffold from '../../components/AuthScaffold'
import AppInput from '../../components/AppInput'
import { authApi } from '../../api'
import { useStore } from '../../context/StoreContext'
import { BRAND, BRAND_DARK, FONT, getColors } from '../../theme/theme'

const Register = () => {
  const router = useRouter()
  const { setToken, saveUser, loadCartData, toast, theme } = useStore()
  const colors = getColors(theme)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)

  const onRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      toast('Please fill in all the fields', 'error')
      return
    }
    if (!agree) {
      toast('Please accept the terms of use & privacy policy', 'error')
      return
    }
    setLoading(true)
    try {
      const response = await authApi.register({ name: name.trim(), email: email.trim(), password })
      if (response.success) {
        await setToken(response.token)
        await saveUser({ name: name.trim(), email: email.trim() })
        loadCartData()
        toast(`Welcome to Tomato, ${name.trim()}! 🍅`)
        router.replace('/(tabs)')
      } else {
        toast(response.message || 'Registration failed', 'error')
      }
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScaffold
      title="Create account 🍅"
      subtitle="Join Tomato today — hundreds of delicious dishes are waiting for you."
    >
      <View style={styles.form}>
        <AppInput
          icon="person-outline"
          placeholder="Your name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
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

        <TouchableOpacity style={styles.terms} onPress={() => setAgree((a) => !a)} activeOpacity={0.8}>
          <Ionicons
            name={agree ? 'checkbox' : 'square-outline'}
            size={20}
            color={agree ? BRAND : colors.muted}
          />
          <Text style={[styles.termsText, { color: colors.muted }]}>
            By continuing, I agree to the terms of use & privacy policy.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9} onPress={onRegister} disabled={loading}>
          <LinearGradient
            colors={[BRAND, BRAND_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.perks}>
          {['🚀 30-min delivery', '🎁 Launch offers', '⭐ Rate & review dishes'].map((p) => (
            <View key={p} style={[styles.perk, { backgroundColor: colors.tint }]}>
              <Text style={[styles.perkText, { color: colors.text }]}>{p}</Text>
            </View>
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.muted }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/auth/login')}>
            <Text style={styles.switchLink}>Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  form: { gap: 14 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -2 },
  termsText: { flex: 1, fontSize: 12.5, fontFamily: FONT.regular, lineHeight: 17 },
  button: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: BRAND,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonText: { color: '#fff', fontSize: 17, fontFamily: FONT.semibold, letterSpacing: 0.3 },
  perks: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 4 },
  perk: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  perkText: { fontSize: 12, fontFamily: FONT.medium },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  switchText: { fontSize: 14, fontFamily: FONT.regular },
  switchLink: { fontSize: 14, fontFamily: FONT.semibold, color: BRAND },
})

export default Register

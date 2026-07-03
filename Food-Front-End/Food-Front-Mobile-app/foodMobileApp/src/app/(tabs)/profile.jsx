import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect, useRouter } from 'expo-router'
import TopBar from '../../components/TopBar'
import { orderApi } from '../../api'
import { useStore } from '../../context/StoreContext'
import { BRAND, BRAND_DARK, FONT, getColors } from '../../theme/theme'

const Profile = () => {
  const router = useRouter()
  const { token, user, currency, logout, cartItems, theme, toggleTheme, toast } = useStore()
  const colors = getColors(theme)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!token) { setLoading(false); return }
        try {
          const res = await orderApi.userOrders()
          setOrders(res.data || [])
        } catch {
          setOrders([])
        } finally {
          setLoading(false)
        }
      }
      load()
    }, [token])
  )

  const onLogout = async () => {
    await logout()
    toast('Logged out. See you soon! 👋')
    router.replace('/(tabs)')
  }

  const totalSpent = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const cartCount = Object.values(cartItems || {}).reduce((s, n) => s + (n > 0 ? n : 0), 0)

  // ------- Guest state -------
  if (!token) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <TopBar />
        <View style={styles.guest}>
          <View style={[styles.guestIcon, { backgroundColor: colors.tint }]}>
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
          <Text style={[styles.guestTitle, { color: colors.text }]}>You're not signed in</Text>
          <Text style={[styles.guestSub, { color: colors.muted }]}>
            Sign in to view your profile, track orders and more.
          </Text>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/auth/login')} style={{ alignSelf: 'stretch' }}>
            <LinearGradient
              colors={[BRAND, BRAND_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.guestBtn}
            >
              <Text style={styles.guestBtnText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            style={[styles.guestBtnAlt, { borderColor: BRAND }]}
          >
            <Text style={styles.guestBtnAltText}>Create account</Text>
          </TouchableOpacity>

          <View style={[styles.themeRow, { backgroundColor: colors.surface }]}>
            <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={18} color={colors.text} />
            <Text style={[styles.themeText, { color: colors.text }]}>Dark mode</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ true: BRAND, false: '#c9c9c9' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>
    )
  }

  const name = user?.name || 'Food Lover'
  const email = user?.email || ''

  const actions = [
    { icon: 'receipt-outline', label: 'My Orders', to: '/(tabs)/orders' },
    { icon: 'fast-food-outline', label: 'Explore Menu', to: '/(tabs)/menu' },
    { icon: 'cart-outline', label: 'View Cart', to: '/(tabs)/cart' },
    { icon: 'chatbubble-ellipses-outline', label: 'Contact Support', to: '/contact' },
    { icon: 'information-circle-outline', label: 'About Tomato', to: '/about' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header card */}
        <LinearGradient
          colors={theme === 'dark' ? ['#241a17', '#2a1d18'] : ['#fff4f2', '#ffe9e2']}
          style={styles.header}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
            {!!email && <Text style={[styles.email, { color: colors.muted }]}>{email}</Text>}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🍅 Tomato Member</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logout}>
            <Ionicons name="log-out-outline" size={17} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.stats}>
          {[
            { num: String(orders.length), label: 'Orders placed' },
            { num: `${currency}${totalSpent}`, label: 'Total spent' },
            { num: String(cartCount), label: 'Items in cart' },
          ].map((s) => (
            <View
              key={s.label}
              style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={styles.statNum}>{s.num}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent orders */}
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent orders</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
            <Text style={styles.sectionLink}>View all →</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={[styles.muted, { color: colors.muted }]}>Loading your orders…</Text>
        ) : orders.length === 0 ? (
          <View style={[styles.emptyOrders, { backgroundColor: colors.surface }]}>
            <Text style={[styles.muted, { color: colors.muted, paddingHorizontal: 0 }]}>No orders yet.</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.sectionLink}>Browse the menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.slice(0, 4).map((o, i) => (
            <View
              key={i}
              style={[styles.order, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 22 }}>🧾</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.orderItems, { color: colors.text }]} numberOfLines={1}>
                  {o.items.map((it) => `${it.name} x ${it.quantity}`).join(', ')}
                </Text>
                <Text style={[styles.orderStatus, { color: colors.muted }]}>● {o.status}</Text>
              </View>
              <Text style={styles.orderAmount}>
                {currency}
                {o.amount}
              </Text>
            </View>
          ))
        )}

        {/* Quick actions */}
        <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 18, marginTop: 22 }]}>
          Quick actions
        </Text>
        <View style={styles.actions}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.action, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(a.to)}
            >
              <Ionicons name={a.icon} size={20} color={BRAND} />
              <Text style={[styles.actionText, { color: colors.text }]}>{a.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
          <View style={[styles.action, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name={theme === 'dark' ? 'moon' : 'sunny-outline'} size={20} color={BRAND} />
            <Text style={[styles.actionText, { color: colors.text }]}>Dark mode</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ true: BRAND, false: '#c9c9c9' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  guest: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 30, gap: 8 },
  guestIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  guestTitle: { fontSize: 20, fontFamily: FONT.semibold },
  guestSub: { fontSize: 13.5, fontFamily: FONT.regular, textAlign: 'center', marginBottom: 14 },
  guestBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  guestBtnText: { color: '#fff', fontSize: 16, fontFamily: FONT.semibold },
  guestBtnAlt: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  guestBtnAltText: { color: BRAND, fontSize: 16, fontFamily: FONT.semibold },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 24,
    alignSelf: 'stretch',
  },
  themeText: { flex: 1, fontSize: 14, fontFamily: FONT.medium },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 18,
    marginTop: 4,
    borderRadius: 20,
    padding: 18,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 26, fontFamily: FONT.bold },
  name: { fontSize: 19, fontFamily: FONT.bold },
  email: { fontSize: 12.5, fontFamily: FONT.regular, marginTop: 1 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffffcc',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  badgeText: { fontSize: 11, fontFamily: FONT.medium, color: '#262626' },
  logout: {
    backgroundColor: BRAND,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  logoutText: { color: '#fff', fontSize: 12.5, fontFamily: FONT.semibold },
  stats: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, marginTop: 14 },
  stat: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statNum: { fontSize: 17, fontFamily: FONT.bold, color: BRAND },
  statLabel: { fontSize: 11, fontFamily: FONT.regular, marginTop: 3, textAlign: 'center' },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontFamily: FONT.semibold },
  sectionLink: { color: BRAND, fontSize: 13, fontFamily: FONT.semibold },
  muted: { paddingHorizontal: 18, fontSize: 13, fontFamily: FONT.regular },
  emptyOrders: {
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  order: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 18,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  orderItems: { fontSize: 13.5, fontFamily: FONT.medium },
  orderStatus: { fontSize: 12, fontFamily: FONT.regular, marginTop: 2 },
  orderAmount: { fontSize: 14.5, fontFamily: FONT.bold, color: BRAND },
  actions: { paddingHorizontal: 18, marginTop: 12, gap: 10 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  actionText: { flex: 1, fontSize: 14.5, fontFamily: FONT.medium },
})

export default Profile

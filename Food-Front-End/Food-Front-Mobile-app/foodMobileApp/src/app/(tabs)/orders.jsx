import React, { useCallback, useState } from 'react'
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import TopBar from '../../components/TopBar'
import { assets } from '../../assets/assets'
import { orderApi } from '../../api'
import { useStore } from '../../context/StoreContext'
import { BRAND, FONT, getColors } from '../../theme/theme'

const statusColor = (status) => {
  if (/deliver/i.test(status)) return '#2e7d32'
  if (/out for/i.test(status)) return '#f59e0b'
  return BRAND
}

const MyOrders = () => {
  const router = useRouter()
  const { token, currency, theme, toast } = useStore()
  const colors = getColors(theme)
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrders = async (silent) => {
    if (!token) return
    if (!silent) setRefreshing(true)
    try {
      const response = await orderApi.userOrders()
      setData(response.data || [])
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchOrders(true)
    }, [token])
  )

  if (!token) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <TopBar />
        <View style={styles.guest}>
          <Text style={{ fontSize: 52 }}>📦</Text>
          <Text style={[styles.guestTitle, { color: colors.text }]}>Track your orders</Text>
          <Text style={[styles.guestSub, { color: colors.muted }]}>
            Sign in to see your order history and live status.
          </Text>
          <TouchableOpacity style={styles.guestBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.guestBtnText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar />
      <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
      <FlatList
        data={data}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchOrders()} tintColor={BRAND} />
        }
        ListEmptyComponent={
          <View style={styles.guest}>
            <Text style={{ fontSize: 44 }}>🧾</Text>
            <Text style={[styles.guestSub, { color: colors.muted }]}>
              No orders yet — your next meal is a few taps away.
            </Text>
            <TouchableOpacity style={styles.guestBtn} onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.guestBtnText}>Browse the menu</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: order }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardTop}>
              <Image source={assets.parcel_icon} style={styles.parcel} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.items, { color: colors.text }]} numberOfLines={2}>
                  {order.items.map((it) => `${it.name} x ${it.quantity}`).join(', ')}
                </Text>
                <Text style={[styles.meta, { color: colors.muted }]}>
                  Items: {order.items.length}
                </Text>
              </View>
              <Text style={styles.amount}>
                {currency}
                {order.amount}.00
              </Text>
            </View>
            <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
              <View style={styles.statusRow}>
                <View style={[styles.dot, { backgroundColor: statusColor(order.status) }]} />
                <Text style={[styles.status, { color: colors.text }]}>{order.status}</Text>
              </View>
              <TouchableOpacity
                style={[styles.track, { backgroundColor: colors.tint }]}
                onPress={() => fetchOrders()}
              >
                <Text style={styles.trackText}>Track Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontFamily: FONT.bold, paddingHorizontal: 18, marginBottom: 14, marginTop: 4 },
  guest: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30, gap: 8 },
  guestTitle: { fontSize: 19, fontFamily: FONT.semibold },
  guestSub: { fontSize: 13.5, fontFamily: FONT.regular, textAlign: 'center' },
  guestBtn: {
    backgroundColor: BRAND,
    borderRadius: 30,
    paddingHorizontal: 26,
    paddingVertical: 12,
    marginTop: 12,
  },
  guestBtnText: { color: '#fff', fontSize: 14, fontFamily: FONT.semibold },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  parcel: { width: 42, height: 42, resizeMode: 'contain' },
  items: { fontSize: 13.5, fontFamily: FONT.medium, lineHeight: 19 },
  meta: { fontSize: 12, fontFamily: FONT.regular, marginTop: 3 },
  amount: { fontSize: 15, fontFamily: FONT.bold, color: BRAND },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 10,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  status: { fontSize: 13, fontFamily: FONT.semibold },
  track: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  trackText: { color: BRAND, fontSize: 12.5, fontFamily: FONT.semibold },
})

export default MyOrders

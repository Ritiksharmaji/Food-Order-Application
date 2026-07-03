import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useStore } from '../context/StoreContext'
import { BRAND, FONT, getColors } from '../theme/theme'

// Restaurant card mirroring the web .restaurant-card.
const RestaurantCard = ({ restaurant, style }) => {
  const router = useRouter()
  const { currency, theme } = useStore()
  const colors = getColors(theme)

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }, style]}
    >
      <View>
        <Image source={restaurant.image} style={styles.image} />
        {restaurant.promoted && (
          <View style={styles.promo}>
            <Text style={styles.promoText}>Promoted</Text>
          </View>
        )}
        <View style={styles.time}>
          <Text style={styles.timeText}>{restaurant.deliveryTime}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{restaurant.rating} ★</Text>
          </View>
        </View>
        <Text style={[styles.cuisines, { color: colors.muted }]} numberOfLines={1}>
          {restaurant.cuisines}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.muted }]}>
            {currency}
            {restaurant.priceForTwo} for two
          </Text>
          <Text style={[styles.meta, { color: colors.muted }]}>{restaurant.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  image: { width: '100%', aspectRatio: 1.5 },
  promo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: BRAND,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  promoText: { color: '#fff', fontSize: 11, fontFamily: FONT.medium },
  time: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#000000b3',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timeText: { color: '#fff', fontSize: 11, fontFamily: FONT.medium },
  body: { padding: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontFamily: FONT.semibold, flex: 1, marginRight: 8 },
  rating: { backgroundColor: '#2e7d32', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  ratingText: { color: '#fff', fontSize: 12, fontFamily: FONT.semibold },
  cuisines: { fontSize: 12, fontFamily: FONT.regular, marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  meta: { fontSize: 12, fontFamily: FONT.medium },
})

export default RestaurantCard

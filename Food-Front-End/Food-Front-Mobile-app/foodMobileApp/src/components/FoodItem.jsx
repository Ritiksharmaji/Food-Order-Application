import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { assets } from '../assets/assets'
import { useStore } from '../context/StoreContext'
import { foodImageSource } from '../utils/img'
import { BRAND, FONT, getColors } from '../theme/theme'

// Food card mirroring the web .food-item (rounded card, image with floating
// add button / counter pill, name + stars, description, tomato price).
const FoodItem = ({ id, name, price, desc, image, style }) => {
  const { cartItems, addToCart, removeFromCart, currency, theme } = useStore()
  const colors = getColors(theme)
  const router = useRouter()
  const goToDetails = () => router.push(`/food/${id}`)

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }, style]}>
      <View>
        <TouchableOpacity activeOpacity={0.85} onPress={goToDetails}>
          <Image source={foodImageSource(image)} style={styles.image} />
        </TouchableOpacity>
        {!cartItems[id] ? (
          <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(id)} hitSlop={6}>
            <Image source={assets.add_icon_white} style={styles.addIcon} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.counter, { backgroundColor: colors.card }]}>
            <TouchableOpacity onPress={() => removeFromCart(id)} hitSlop={6}>
              <Image source={assets.remove_icon_red} style={styles.counterIcon} />
            </TouchableOpacity>
            <Text style={[styles.counterText, { color: colors.text }]}>{cartItems[id]}</Text>
            <TouchableOpacity onPress={() => addToCart(id)} hitSlop={6}>
              <Image source={assets.add_icon_green} style={styles.counterIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1} onPress={goToDetails}>
            {name}
          </Text>
          <Image source={assets.rating_starts} style={styles.stars} />
        </View>
        <Text style={[styles.desc, { color: colors.muted }]} numberOfLines={2}>
          {desc}
        </Text>
        <Text style={styles.price}>
          {currency}
          {price}
        </Text>
      </View>
    </View>
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
  image: {
    width: '100%',
    aspectRatio: 1.35,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  addBtn: { position: 'absolute', bottom: 12, right: 12 },
  addIcon: { width: 34, height: 34, borderRadius: 17 },
  counter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 50,
  },
  counterIcon: { width: 26, height: 26 },
  counterText: { fontSize: 14, fontFamily: FONT.medium, minWidth: 14, textAlign: 'center' },
  info: { padding: 12 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 16, fontFamily: FONT.medium, flex: 1, marginRight: 6 },
  stars: { width: 58, height: 11, resizeMode: 'contain' },
  desc: { fontSize: 12, fontFamily: FONT.regular, lineHeight: 16 },
  price: { color: BRAND, fontSize: 18, fontFamily: FONT.semibold, marginTop: 8 },
})

export default FoodItem

import React, { useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import TopBar from '../../components/TopBar'
import CartTotals from '../../components/CartTotals'
import { useStore } from '../../context/StoreContext'
import { foodImageSource } from '../../utils/img'
import { BRAND, FONT, getColors } from '../../theme/theme'

const Cart = () => {
  const router = useRouter()
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    currency,
    token,
    toast,
    theme,
  } = useStore()
  const colors = getColors(theme)
  const [promo, setPromo] = useState('')

  const itemsInCart = food_list.filter((item) => cartItems[item._id] > 0)

  const checkout = () => {
    if (!token) {
      toast('To place an order sign in first', 'error')
      router.push('/auth/login')
      return
    }
    if (getTotalCartAmount() === 0) {
      toast('Your cart is empty', 'error')
      return
    }
    router.push('/place-order')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={[styles.title, { color: colors.text }]}>My Cart</Text>

        {itemsInCart.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 52 }}>🛒</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptySub, { color: colors.muted }]}>
              Hungry? Browse the menu and add something delicious.
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.emptyBtnText}>Explore Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {itemsInCart.map((item) => (
              <View
                key={item._id}
                style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Image source={foodImageSource(item.image)} style={styles.rowImg} />
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.rowPrice, { color: colors.muted }]}>
                    {currency}
                    {item.price}
                  </Text>
                  <Text style={styles.rowTotal}>
                    {currency}
                    {item.price * cartItems[item._id]}
                  </Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    onPress={() => removeFromCart(item._id)}
                    style={[styles.stepBtn, { backgroundColor: colors.tint }]}
                    hitSlop={4}
                  >
                    <Ionicons name="remove" size={16} color={BRAND} />
                  </TouchableOpacity>
                  <Text style={[styles.stepQty, { color: colors.text }]}>{cartItems[item._id]}</Text>
                  <TouchableOpacity
                    onPress={() => addToCart(item._id)}
                    style={[styles.stepBtn, { backgroundColor: BRAND }]}
                    hitSlop={4}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Promo code (visual parity with the web cart) */}
            <View style={[styles.promoBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.promoLabel, { color: colors.muted }]}>
                If you have a promo code, enter it here
              </Text>
              <View style={styles.promoRow}>
                <TextInput
                  placeholder="promo code"
                  placeholderTextColor={colors.muted}
                  value={promo}
                  onChangeText={setPromo}
                  style={[styles.promoInput, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                />
                <TouchableOpacity
                  style={styles.promoBtn}
                  onPress={() => toast(promo ? 'Invalid promo code' : 'Enter a promo code first', 'error')}
                >
                  <Text style={styles.promoBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingHorizontal: 18, marginTop: 16 }}>
              <CartTotals />
              <TouchableOpacity style={styles.checkout} onPress={checkout} activeOpacity={0.9}>
                <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontFamily: FONT.bold, paddingHorizontal: 18, marginBottom: 14, marginTop: 4 },
  emptyBox: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30, gap: 8 },
  emptyTitle: { fontSize: 19, fontFamily: FONT.semibold },
  emptySub: { fontSize: 13.5, fontFamily: FONT.regular, textAlign: 'center' },
  emptyBtn: {
    backgroundColor: BRAND,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 12,
  },
  emptyBtnText: { color: '#fff', fontSize: 14, fontFamily: FONT.semibold },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    gap: 12,
  },
  rowImg: { width: 70, height: 70, borderRadius: 12 },
  rowInfo: { flex: 1, gap: 2 },
  rowName: { fontSize: 15.5, fontFamily: FONT.semibold },
  rowPrice: { fontSize: 12.5, fontFamily: FONT.regular },
  rowTotal: { fontSize: 15, fontFamily: FONT.semibold, color: BRAND },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepQty: { fontSize: 15, fontFamily: FONT.semibold, minWidth: 18, textAlign: 'center' },
  promoBox: { marginHorizontal: 18, marginTop: 8, borderRadius: 16, padding: 14 },
  promoLabel: { fontSize: 13, fontFamily: FONT.regular, marginBottom: 10 },
  promoRow: { flexDirection: 'row', gap: 10 },
  promoInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontFamily: FONT.regular,
  },
  promoBtn: {
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  promoBtnText: { color: '#fff', fontSize: 13, fontFamily: FONT.medium },
  checkout: {
    backgroundColor: BRAND,
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  checkoutText: { color: '#fff', fontSize: 15, fontFamily: FONT.semibold, letterSpacing: 0.5 },
})

export default Cart

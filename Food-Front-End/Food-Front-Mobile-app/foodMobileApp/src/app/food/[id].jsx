import React, { useEffect, useMemo, useState } from 'react'
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FoodItem from '../../components/FoodItem'
import Stars from '../../components/Stars'
import { useStore } from '../../context/StoreContext'
import { restaurantForFood } from '../../data/restaurants'
import { foodImageSource } from '../../utils/img'
import { BRAND, FONT, getColors } from '../../theme/theme'

const REVIEW_KEY = (id) => `fd_reviews_${id}`

const FoodDetails = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { food_list, currency, addToCart, cartItems, user, toast, theme } = useStore()
  const colors = getColors(theme)

  const food = useMemo(() => food_list.find((f) => f._id === id), [food_list, id])

  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })

  // Load device-local reviews for this dish (backend has no reviews API).
  useEffect(() => {
    AsyncStorage.getItem(REVIEW_KEY(id))
      .then((saved) => {
        const parsed = JSON.parse(saved || '[]')
        setReviews(Array.isArray(parsed) ? parsed : [])
      })
      .catch(() => setReviews([]))
    setQty(1)
  }, [id])

  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, name: f.name || user.name }))
  }, [user])

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
    : 4.6

  const similar = useMemo(
    () => food_list.filter((f) => food && f.category === food.category && f._id !== food._id).slice(0, 4),
    [food_list, food]
  )

  if (!food) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.muted, fontFamily: FONT.regular }}>Loading dish…</Text>
        <TouchableOpacity style={styles.loadingBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.loadingBtnText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const restaurant = restaurantForFood(food._id)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(food._id)
    toast(`${qty} × ${food.name} added to cart`)
  }

  const submitReview = async () => {
    if (!form.name.trim() || !form.comment.trim()) {
      toast('Please add your name and a comment', 'error')
      return
    }
    const next = [
      { name: form.name.trim(), rating: Number(form.rating), comment: form.comment.trim(), date: new Date().toISOString() },
      ...reviews,
    ]
    setReviews(next)
    await AsyncStorage.setItem(REVIEW_KEY(id), JSON.stringify(next))
    setForm({ name: user?.name || '', rating: 5, comment: '' })
    toast('Thanks for your feedback!')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Image hero */}
        <View>
          <Image source={foodImageSource(food.image)} style={styles.hero} />
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
            style={[styles.back, { top: insets.top + 10 }]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={[styles.categoryChip, { backgroundColor: colors.tint }]}>
            <Text style={styles.categoryText}>{food.category}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{food.name}</Text>

          <View style={styles.ratingRow}>
            <Stars value={avgRating} />
            <Text style={[styles.ratingNum, { color: colors.text }]}>{avgRating.toFixed(1)}</Text>
            <Text style={[styles.ratingCount, { color: colors.muted }]}>
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </Text>
          </View>

          <Text style={styles.price}>
            {currency}
            {food.price}
          </Text>
          <Text style={[styles.desc, { color: colors.muted }]}>{food.description}</Text>

          <View style={styles.highlights}>
            {[
              '🍽️ Freshly prepared to order',
              '⏱️ 30–40 min delivery',
              `🔥 Chef's special from ${food.category}`,
              '✅ 100% quality guarantee',
            ].map((h) => (
              <Text key={h} style={[styles.highlight, { color: colors.muted }]}>
                {h}
              </Text>
            ))}
          </View>

          {/* Restaurant */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Restaurant</Text>
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.restaurant, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/restaurant/${restaurant.id}`)}
          >
            <Image source={restaurant.image} style={styles.restaurantImg} />
            <View style={{ flex: 1 }}>
              <View style={styles.restaurantTop}>
                <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <View style={styles.restaurantRating}>
                  <Text style={styles.restaurantRatingText}>{restaurant.rating} ★</Text>
                </View>
              </View>
              <Text style={[styles.restaurantCuisines, { color: colors.muted }]} numberOfLines={1}>
                {restaurant.cuisines}
              </Text>
              <Text style={[styles.restaurantMeta, { color: colors.muted }]}>
                🕒 {restaurant.deliveryTime}   💰 {currency}
                {restaurant.priceForTwo} for two
              </Text>
              <Text style={[styles.restaurantMeta, { color: colors.muted }]}>
                📍 {restaurant.address}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </TouchableOpacity>

          {/* Reviews */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ratings & Feedback</Text>
          <View style={[styles.avgBox, { backgroundColor: colors.tint }]}>
            <Text style={styles.avgNum}>{avgRating.toFixed(1)}</Text>
            <Stars value={avgRating} size={18} />
            <Text style={[styles.avgCount, { color: colors.muted }]}>{reviews.length} reviews</Text>
          </View>

          <View style={[styles.reviewForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.reviewFormTitle, { color: colors.text }]}>Leave a review</Text>
            <TextInput
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
              style={[styles.reviewInput, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
            />
            <View style={styles.ratingPick}>
              <Text style={{ color: colors.muted, fontFamily: FONT.regular, fontSize: 13 }}>Rating:</Text>
              <Stars value={form.rating} size={22} onSelect={(n) => setForm({ ...form, rating: n })} />
            </View>
            <TextInput
              placeholder="Share your experience with this dish…"
              placeholderTextColor={colors.muted}
              value={form.comment}
              onChangeText={(t) => setForm({ ...form, comment: t })}
              multiline
              style={[
                styles.reviewInput,
                styles.reviewTextarea,
                { color: colors.text, backgroundColor: colors.input, borderColor: colors.border },
              ]}
            />
            <TouchableOpacity style={styles.reviewSubmit} onPress={submitReview}>
              <Text style={styles.reviewSubmitText}>Submit feedback</Text>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <Text style={[styles.emptyReviews, { color: colors.muted }]}>
              No reviews yet — be the first to share your experience!
            </Text>
          ) : (
            reviews.map((r, i) => (
              <View
                key={i}
                style={[styles.review, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.reviewHead}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {(r.name || '?').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reviewName, { color: colors.text }]}>{r.name}</Text>
                    <Stars value={r.rating} size={12} />
                  </View>
                  <Text style={[styles.reviewDate, { color: colors.muted }]}>
                    {new Date(r.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.reviewComment, { color: colors.muted }]}>{r.comment}</Text>
              </View>
            ))
          )}

          {/* Similar dishes */}
          {similar.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>You might also like</Text>
              <FlatList
                horizontal
                data={similar}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 14 }}
                renderItem={({ item }) => (
                  <FoodItem
                    id={item._id}
                    name={item.name}
                    desc={item.description}
                    price={item.price}
                    image={item.image}
                    style={{ width: 195 }}
                  />
                )}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View
        style={[
          styles.actionBar,
          { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 10 },
        ]}
      >
        <View style={[styles.qty, { borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} hitSlop={6}>
            <Ionicons name="remove" size={18} color={BRAND} />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: colors.text }]}>{qty}</Text>
          <TouchableOpacity onPress={() => setQty((q) => q + 1)} hitSlop={6}>
            <Ionicons name="add" size={18} color={BRAND} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.9}>
          <Text style={styles.addBtnText}>
            Add to Cart · {currency}
            {food.price * qty}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cartBtn, { borderColor: BRAND }]}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Ionicons name="cart-outline" size={20} color={BRAND} />
          {!!cartItems[food._id] && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems[food._id]}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingBtn: { backgroundColor: BRAND, borderRadius: 30, paddingHorizontal: 22, paddingVertical: 10 },
  loadingBtnText: { color: '#fff', fontFamily: FONT.semibold },
  hero: { width: '100%', aspectRatio: 1.3 },
  back: {
    position: 'absolute',
    left: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 18 },
  categoryChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  categoryText: { color: BRAND, fontSize: 12, fontFamily: FONT.semibold },
  name: { fontSize: 26, fontFamily: FONT.bold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ratingNum: { fontSize: 14, fontFamily: FONT.bold },
  ratingCount: { fontSize: 12.5, fontFamily: FONT.regular },
  price: { color: BRAND, fontSize: 26, fontFamily: FONT.bold, marginTop: 10 },
  desc: { fontSize: 14, fontFamily: FONT.regular, lineHeight: 21, marginTop: 8 },
  highlights: { marginTop: 14, gap: 7 },
  highlight: { fontSize: 13.5, fontFamily: FONT.regular },
  sectionTitle: { fontSize: 19, fontFamily: FONT.semibold, marginTop: 26, marginBottom: 12 },
  restaurant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  restaurantImg: { width: 68, height: 68, borderRadius: 12 },
  restaurantTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  restaurantName: { fontSize: 15.5, fontFamily: FONT.semibold, flexShrink: 1 },
  restaurantRating: { backgroundColor: '#2e7d32', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 },
  restaurantRatingText: { color: '#fff', fontSize: 11, fontFamily: FONT.semibold },
  restaurantCuisines: { fontSize: 12, fontFamily: FONT.regular, marginTop: 2 },
  restaurantMeta: { fontSize: 11.5, fontFamily: FONT.regular, marginTop: 3 },
  avgBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  avgNum: { fontSize: 30, fontFamily: FONT.bold, color: BRAND },
  avgCount: { fontSize: 12.5, fontFamily: FONT.regular },
  reviewForm: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  reviewFormTitle: { fontSize: 16, fontFamily: FONT.semibold },
  reviewInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONT.regular,
  },
  reviewTextarea: { minHeight: 84, textAlignVertical: 'top' },
  ratingPick: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewSubmit: {
    backgroundColor: BRAND,
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSubmitText: { color: '#fff', fontSize: 14, fontFamily: FONT.semibold },
  emptyReviews: { fontSize: 13, fontFamily: FONT.regular, marginTop: 12, textAlign: 'center' },
  review: { borderRadius: 14, borderWidth: 1, padding: 12, marginTop: 10 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: { color: '#fff', fontSize: 15, fontFamily: FONT.semibold },
  reviewName: { fontSize: 14, fontFamily: FONT.semibold },
  reviewDate: { fontSize: 11, fontFamily: FONT.regular },
  reviewComment: { fontSize: 13, fontFamily: FONT.regular, lineHeight: 19, marginTop: 8 },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.4,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  qtyText: { fontSize: 15, fontFamily: FONT.semibold, minWidth: 16, textAlign: 'center' },
  addBtn: {
    flex: 1,
    backgroundColor: BRAND,
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 14.5, fontFamily: FONT.semibold },
  cartBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: BRAND,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontFamily: FONT.semibold },
})

export default FoodDetails

import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { assets } from '../assets/assets'
import { useStore } from '../context/StoreContext'
import { BRAND, FONT, getColors } from '../theme/theme'

const stats = [
  { num: '50K+', label: 'Happy customers' },
  { num: '200+', label: 'Dishes on menu' },
  { num: '15', label: 'Cities served' },
  { num: '4.8★', label: 'Average rating' },
]

const values = [
  { icon: '🌿', title: 'Fresh Ingredients', text: 'We source produce daily from trusted local farms for peak freshness.' },
  { icon: '⚡', title: 'Lightning Delivery', text: 'Hot, fresh food at your door in 30 minutes — every single time.' },
  { icon: '👨‍🍳', title: 'Expert Chefs', text: 'Our dishes are crafted by experienced chefs who love what they do.' },
  { icon: '💛', title: 'Made with Love', text: 'Every meal is prepared with care, because you deserve the best.' },
]

const About = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme } = useStore()
  const colors = getColors(theme)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        {/* Hero */}
        <View style={[styles.tag, { backgroundColor: colors.tint }]}>
          <Text style={styles.tagText}>About Tomato</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          Delicious food, delivered with <Text style={{ color: BRAND }}>love</Text>.
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          Tomato started with a simple idea — great food should be easy to get and always feel
          special. Today we connect thousands of hungry people with their favourite dishes from the
          best kitchens in town, all in a few taps.
        </Text>
        <Image source={assets.header_img} style={styles.heroImg} />

        {/* Stats */}
        <View style={[styles.stats, { backgroundColor: colors.tint }]}>
          {stats.map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statNum}>{s.num}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Story */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Story</Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          What began as a small neighbourhood kitchen has grown into a food-delivery platform loved
          across the country. We believe in honest ingredients, fair prices, and putting a smile on
          your face with every order. From comforting classics to bold new flavours, our menu is a
          celebration of everything we love about food.
        </Text>

        {/* Values */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Why choose us</Text>
        <View style={styles.values}>
          {values.map((v) => (
            <View
              key={v.title}
              style={[styles.value, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 28 }}>{v.icon}</Text>
              <Text style={[styles.valueTitle, { color: colors.text }]}>{v.title}</Text>
              <Text style={[styles.valueText, { color: colors.muted }]}>{v.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Hungry yet?</Text>
          <Text style={styles.ctaText}>Discover hundreds of dishes waiting to be devoured.</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.ctaBtnText}>Order now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: FONT.semibold },
  tag: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  tagText: { color: BRAND, fontSize: 12.5, fontFamily: FONT.semibold },
  title: { fontSize: 28, fontFamily: FONT.bold, marginTop: 12, lineHeight: 36 },
  body: { fontSize: 14, fontFamily: FONT.regular, lineHeight: 22, marginTop: 10 },
  heroImg: { width: '100%', height: 170, borderRadius: 18, marginTop: 16 },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },
  stat: { width: '50%', alignItems: 'center', paddingVertical: 10 },
  statNum: { fontSize: 22, fontFamily: FONT.bold, color: BRAND },
  statLabel: { fontSize: 12, fontFamily: FONT.regular, marginTop: 2 },
  sectionTitle: { fontSize: 20, fontFamily: FONT.bold, marginTop: 26 },
  values: { gap: 12, marginTop: 14 },
  value: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 6 },
  valueTitle: { fontSize: 16, fontFamily: FONT.semibold },
  valueText: { fontSize: 13, fontFamily: FONT.regular, lineHeight: 19 },
  cta: {
    backgroundColor: BRAND,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 28,
  },
  ctaTitle: { color: '#fff', fontSize: 22, fontFamily: FONT.bold },
  ctaText: { color: '#ffffffdd', fontSize: 13, fontFamily: FONT.regular, marginTop: 6, textAlign: 'center' },
  ctaBtn: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 26,
    paddingVertical: 11,
    marginTop: 14,
  },
  ctaBtnText: { color: BRAND, fontSize: 14, fontFamily: FONT.semibold },
})

export default About

import React, { useMemo } from 'react'
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FoodItem from '../../components/FoodItem'
import { useStore } from '../../context/StoreContext'
import { restaurantById, restaurantMenu } from '../../data/restaurants'
import { BRAND, FONT, getColors } from '../../theme/theme'

const Restaurant = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { food_list, currency, theme } = useStore()
  const colors = getColors(theme)
  const restaurant = restaurantById(id)

  const topFive = useMemo(() => restaurantMenu(id, food_list, 5), [id, food_list])
  const more = useMemo(() => {
    const topIds = new Set(topFive.map((f) => f._id))
    return food_list.filter((f) => !topIds.has(f._id)).slice(0, 8)
  }, [food_list, topFive])

  if (!restaurant) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.muted, fontFamily: FONT.regular }}>Restaurant not found.</Text>
        <TouchableOpacity style={styles.notFoundBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.notFoundBtnText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const infoItems = [
    { num: `${restaurant.rating} ★`, label: 'Rating' },
    { num: restaurant.deliveryTime, label: 'Delivery' },
    { num: `${currency}${restaurant.priceForTwo}`, label: 'For two' },
    { num: restaurant.distance, label: 'Away' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Banner */}
        <ImageBackground source={restaurant.image} style={styles.banner}>
          <LinearGradient colors={['#00000022', '#000000cc']} style={StyleSheet.absoluteFill} />
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
            style={[styles.back, { top: insets.top + 10 }]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.bannerContent}>
            {restaurant.promoted && (
              <View style={styles.promoTag}>
                <Text style={styles.promoTagText}>Promoted</Text>
              </View>
            )}
            <Text style={styles.bannerName}>{restaurant.name}</Text>
            <Text style={styles.bannerCuisines}>{restaurant.cuisines}</Text>
          </View>
        </ImageBackground>

        {/* Info bar */}
        <View style={[styles.infoBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {infoItems.map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />}
              <View style={styles.infoItem}>
                <Text style={[styles.infoNum, { color: colors.text }]}>{item.num}</Text>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>{item.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <Text style={[styles.address, { color: colors.muted }]}>📍 {restaurant.address}</Text>

        {/* Top 5 dishes */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top 5 dishes</Text>
        {topFive.length === 0 ? (
          <Text style={[styles.empty, { color: colors.muted }]}>
            Menu is being updated. Check back soon!
          </Text>
        ) : (
          <FlatList
            horizontal
            data={topFive}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <FoodItem
                id={item._id}
                name={item.name}
                desc={item.description}
                price={item.price}
                image={item.image}
                style={styles.hCard}
              />
            )}
          />
        )}

        {/* Explore more food */}
        {more.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 0, marginBottom: 0, paddingHorizontal: 0 }]}>
                Explore more food
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
                <Text style={styles.sectionLink}>See full menu →</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={more}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              renderItem={({ item }) => (
                <FoodItem
                  id={item._id}
                  name={item.name}
                  desc={item.description}
                  price={item.price}
                  image={item.image}
                  style={styles.hCard}
                />
              )}
            />
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundBtn: { backgroundColor: BRAND, borderRadius: 30, paddingHorizontal: 22, paddingVertical: 10 },
  notFoundBtnText: { color: '#fff', fontFamily: FONT.semibold },
  banner: { height: 240, justifyContent: 'flex-end' },
  back: {
    position: 'absolute',
    left: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerContent: { padding: 18, gap: 4 },
  promoTag: {
    alignSelf: 'flex-start',
    backgroundColor: BRAND,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  promoTagText: { color: '#fff', fontSize: 11, fontFamily: FONT.medium },
  bannerName: { color: '#fff', fontSize: 27, fontFamily: FONT.bold },
  bannerCuisines: { color: '#ffffffcc', fontSize: 13, fontFamily: FONT.regular },
  infoBar: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: -22,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    shadowColor: '#00000033',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  infoItem: { flex: 1, alignItems: 'center', gap: 2 },
  infoDivider: { width: 1, marginVertical: 4 },
  infoNum: { fontSize: 14.5, fontFamily: FONT.bold },
  infoLabel: { fontSize: 11, fontFamily: FONT.regular },
  address: { paddingHorizontal: 18, marginTop: 14, fontSize: 13, fontFamily: FONT.regular },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONT.bold,
    paddingHorizontal: 18,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionLink: { color: BRAND, fontSize: 13, fontFamily: FONT.semibold },
  hList: { paddingHorizontal: 18, gap: 14, paddingBottom: 6 },
  hCard: { width: 205 },
  empty: { paddingHorizontal: 18, fontSize: 13, fontFamily: FONT.regular },
})

export default Restaurant

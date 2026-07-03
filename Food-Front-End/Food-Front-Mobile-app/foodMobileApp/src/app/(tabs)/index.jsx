import React from 'react'
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import TopBar from '../../components/TopBar'
import FoodItem from '../../components/FoodItem'
import RestaurantCard from '../../components/RestaurantCard'
import { assets } from '../../assets/assets'
import { restaurants } from '../../data/restaurants'
import { useStore } from '../../context/StoreContext'
import { BRAND, FONT, getColors } from '../../theme/theme'

const SectionHead = ({ title, subtitle, action, onAction, colors }) => (
  <View style={styles.sectionHead}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.sectionSub, { color: colors.muted }]}>{subtitle}</Text>
    </View>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
)

const Home = () => {
  const router = useRouter()
  const { food_list, theme } = useStore()
  const colors = getColors(theme)

  const topDishes = food_list.slice(0, 10)
  const topRestaurants = restaurants.slice(0, 10)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Hero — same artwork and copy as the web header */}
        <View style={styles.heroWrap}>
          <ImageBackground source={assets.header_img} style={styles.hero} imageStyle={styles.heroImg}>
            <LinearGradient
              colors={['#00000000', '#000000a8']}
              style={[StyleSheet.absoluteFill, styles.heroImg]}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Order your favourite food here</Text>
              <Text style={styles.heroText} numberOfLines={2}>
                Choose from a diverse menu featuring a delectable array of dishes crafted with the
                finest ingredients.
              </Text>
              <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/(tabs)/menu')}>
                <Text style={styles.heroBtnText}>View Menu</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Top 10 dishes */}
        <SectionHead
          title="Top 10 Dishes Near You"
          subtitle="Handpicked favourites loved by foodies around you"
          action="Explore more →"
          onAction={() => router.push('/(tabs)/menu')}
          colors={colors}
        />
        {topDishes.length === 0 ? (
          <Text style={[styles.empty, { color: colors.muted }]}>Loading delicious dishes…</Text>
        ) : (
          <FlatList
            horizontal
            data={topDishes}
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

        {/* Top 10 restaurants */}
        <SectionHead
          title="Top 10 Restaurants Near You"
          subtitle="Order from the best-rated kitchens in town"
          colors={colors}
        />
        <FlatList
          horizontal
          data={topRestaurants}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => <RestaurantCard restaurant={item} style={styles.hCard} />}
        />

        {/* App download CTA (mirrors the web AppDownload section) */}
        <View style={[styles.download, { backgroundColor: colors.tint }]}>
          <Text style={[styles.downloadTitle, { color: colors.text }]}>
            For Better Experience{'\n'}
            <Text style={{ color: BRAND }}>Tomato App</Text> is here 🎉
          </Text>
          <View style={styles.storeRow}>
            <Image source={assets.play_store} style={styles.storeImg} resizeMode="contain" />
            <Image source={assets.app_store} style={styles.storeImg} resizeMode="contain" />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  heroWrap: { paddingHorizontal: 18, marginTop: 4 },
  hero: { height: 210, justifyContent: 'flex-end' },
  heroImg: { borderRadius: 20 },
  heroContent: { padding: 18, gap: 8 },
  heroTitle: { color: '#fff', fontSize: 26, fontFamily: FONT.semibold, lineHeight: 32, maxWidth: '80%' },
  heroText: { color: '#ffffffdd', fontSize: 12.5, fontFamily: FONT.regular, maxWidth: '85%' },
  heroBtn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginTop: 4,
  },
  heroBtnText: { color: '#747474', fontSize: 13, fontFamily: FONT.medium },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    marginTop: 26,
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: { fontSize: 20, fontFamily: FONT.bold },
  sectionSub: { fontSize: 12.5, fontFamily: FONT.regular, marginTop: 3 },
  sectionAction: { color: BRAND, fontSize: 13, fontFamily: FONT.semibold, paddingBottom: 2 },
  hList: { paddingHorizontal: 18, gap: 14, paddingBottom: 6 },
  hCard: { width: 205 },
  empty: { paddingHorizontal: 18, fontFamily: FONT.regular },
  download: {
    marginHorizontal: 18,
    marginTop: 30,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
  },
  downloadTitle: { fontSize: 20, fontFamily: FONT.semibold, textAlign: 'center', lineHeight: 28 },
  storeRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  storeImg: { width: 120, height: 40 },
})

export default Home

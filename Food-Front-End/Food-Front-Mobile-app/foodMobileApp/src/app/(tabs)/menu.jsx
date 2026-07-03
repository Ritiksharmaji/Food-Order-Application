import React, { useMemo, useState } from 'react'
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
import { Ionicons } from '@expo/vector-icons'
import TopBar from '../../components/TopBar'
import FoodItem from '../../components/FoodItem'
import { useStore } from '../../context/StoreContext'
import { BRAND, FONT, getColors } from '../../theme/theme'

// "Our Menu" — hero with search, explore-menu category strip, dish grid.
const Menu = () => {
  const { food_list, menu_list, theme } = useStore()
  const colors = getColors(theme)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return food_list.filter((f) => {
      const matchCat = category === 'All' || f.category === category
      const matchQ =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [food_list, category, query])

  const Header = (
    <View>
      {/* Hero */}
      <View style={[styles.heroCard, { backgroundColor: colors.tint }]}>
        <Text style={[styles.heroTitle, { color: colors.text }]}>Our Menu</Text>
        <Text style={[styles.heroSub, { color: colors.muted }]}>
          Explore {food_list.length}+ dishes across every craving imaginable.
        </Text>
        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            placeholder="Search for dishes, e.g. salad, pasta…"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category strip (web ExploreMenu look — round images) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
      >
        <TouchableOpacity style={styles.catItem} onPress={() => setCategory('All')}>
          <View
            style={[
              styles.catAll,
              { backgroundColor: colors.tint },
              category === 'All' && styles.catImgActive,
            ]}
          >
            <Text style={{ fontSize: 24 }}>🍽️</Text>
          </View>
          <Text
            style={[
              styles.catName,
              { color: category === 'All' ? BRAND : colors.muted },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {menu_list.map((item) => {
          const on = category === item.menu_name
          return (
            <TouchableOpacity
              key={item.menu_name}
              style={styles.catItem}
              onPress={() => setCategory((c) => (c === item.menu_name ? 'All' : item.menu_name))}
            >
              <Image
                source={item.menu_image}
                style={[styles.catImg, on && styles.catImgActive]}
              />
              <Text style={[styles.catName, { color: on ? BRAND : colors.muted }]}>
                {item.menu_name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <Text style={[styles.count, { color: colors.muted }]}>
        {filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} found
      </Text>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 44 }}>🍽️</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No dishes match your search.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <FoodItem
            id={item._id}
            name={item.name}
            desc={item.description}
            price={item.price}
            image={item.image}
            style={styles.gridCard}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  heroCard: {
    marginHorizontal: 18,
    marginTop: 4,
    borderRadius: 20,
    padding: 20,
  },
  heroTitle: { fontSize: 26, fontFamily: FONT.bold },
  heroSub: { fontSize: 13, fontFamily: FONT.regular, marginTop: 4, marginBottom: 14 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: FONT.regular, paddingVertical: 0 },
  catList: { paddingHorizontal: 18, gap: 16, paddingVertical: 18 },
  catItem: { alignItems: 'center', gap: 6, width: 72 },
  catImg: { width: 64, height: 64, borderRadius: 32 },
  catAll: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catImgActive: { borderWidth: 3, borderColor: BRAND },
  catName: { fontSize: 13, fontFamily: FONT.medium },
  count: { paddingHorizontal: 18, marginBottom: 12, fontSize: 12.5, fontFamily: FONT.regular },
  grid: { paddingBottom: 30 },
  gridRow: { gap: 14, paddingHorizontal: 18 },
  gridCard: { flex: 1, marginBottom: 14 },
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: FONT.regular },
})

export default Menu

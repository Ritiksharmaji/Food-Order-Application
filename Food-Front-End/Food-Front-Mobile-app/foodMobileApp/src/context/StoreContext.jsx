import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { menu_list } from '../assets/assets'
import { local_food_list } from '../data/localFood'
import { API_URL, foodApi, cartApi } from '../api'
import { BRAND, FONT } from '../theme/theme'

export const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

const StoreContextProvider = (props) => {
  const url = API_URL
  const [food_list, setFoodList] = useState([])
  const [cartItems, setCartItems] = useState({})
  const [token, setTokenState] = useState('')
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  const [ready, setReady] = useState(false)
  const currency = '₹'
  const deliveryCharge = 50

  // ---------- Toast (replaces react-toastify on mobile) ----------
  const [toastMsg, setToastMsg] = useState(null)
  const toastOpacity = useRef(new Animated.Value(0)).current
  const toastTimer = useRef(null)
  const toast = useCallback((message, type = 'success') => {
    setToastMsg({ message, type })
    Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(
        () => setToastMsg(null)
      )
    }, 2200)
  }, [toastOpacity])

  // ---------- Theme (persisted, like body.dark on the web) ----------
  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      AsyncStorage.setItem('theme', next)
      return next
    })
  }

  // ---------- Auth ----------
  const setToken = async (value) => {
    setTokenState(value)
    if (value) await AsyncStorage.setItem('token', value)
    else await AsyncStorage.removeItem('token')
  }

  // The backend login/register only returns a token, so we persist the basic
  // profile (name/email) the user typed, to power the Profile screen.
  const saveUser = async (u) => {
    setUser(u)
    if (u) await AsyncStorage.setItem('user', JSON.stringify(u))
    else await AsyncStorage.removeItem('user')
  }

  const logout = async () => {
    await setToken('')
    await saveUser(null)
    setCartItems({})
  }

  // ---------- Cart ----------
  const persistGuestCart = (items) => {
    AsyncStorage.setItem('guestCart', JSON.stringify(items)).catch(() => {})
  }

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const next = { ...prev, [itemId]: (prev[itemId] || 0) + 1 }
      if (!token) persistGuestCart(next)
      return next
    })
    if (token) {
      try { await cartApi.add(itemId) } catch { /* keep optimistic state */ }
    }
  }

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const next = { ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }
      if (!token) persistGuestCart(next)
      return next
    })
    if (token) {
      try { await cartApi.remove(itemId) } catch { /* keep optimistic state */ }
    }
  }

  const clearCart = () => {
    setCartItems({})
    persistGuestCart({})
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          const itemInfo = food_list.find((product) => product._id === item)
          totalAmount += itemInfo.price * cartItems[item]
        }
      } catch { /* item not in list yet */ }
    }
    return totalAmount
  }

  const getCartCount = () =>
    Object.values(cartItems).reduce((s, n) => s + (n > 0 ? n : 0), 0)

  // ---------- Data loading ----------
  const fetchFoodList = async () => {
    try {
      const response = await foodApi.list()
      if (response?.data?.length) {
        setFoodList(response.data)
        return
      }
      setFoodList(local_food_list)
    } catch {
      // Backend unreachable — fall back to the bundled catalogue.
      setFoodList(local_food_list)
    }
  }

  const loadCartData = async () => {
    try {
      const response = await cartApi.get()
      setCartItems(response.cartData || {})
    } catch { /* keep current cart */ }
  }

  useEffect(() => {
    async function loadData() {
      const [savedTheme, savedToken, savedUser, guestCart] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('guestCart'),
      ])
      if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme)
      await fetchFoodList()
      if (savedToken) {
        setTokenState(savedToken)
        await loadCartData()
      } else if (guestCart) {
        try { setCartItems(JSON.parse(guestCart)) } catch { /* ignore */ }
      }
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)) } catch { /* ignore */ }
      }
      setReady(true)
    }
    loadData()
  }, [])

  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getCartCount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
    user,
    saveUser,
    logout,
    theme,
    toggleTheme,
    toast,
    ready,
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
      {toastMsg && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            { opacity: toastOpacity, backgroundColor: toastMsg.type === 'error' ? '#d43518' : '#1f1f1f' },
          ]}
        >
          <Text style={styles.toastText}>
            {toastMsg.type === 'error' ? '✕  ' : '✓  '}
            {toastMsg.message}
          </Text>
        </Animated.View>
      )}
    </StoreContext.Provider>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    maxWidth: '86%',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: BRAND,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONT.medium,
  },
})

export default StoreContextProvider

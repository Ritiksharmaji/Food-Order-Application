import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AppInput from '../components/AppInput'
import CartTotals from '../components/CartTotals'
import { assets } from '../assets/assets'
import { orderApi } from '../api'
import { useStore } from '../context/StoreContext'
import { BRAND, FONT, getColors } from '../theme/theme'

const PlaceOrder = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    clearCart,
    deliveryCharge,
    toast,
    theme,
    user,
  } = useStore()
  const colors = getColors(theme)

  const [payment, setPayment] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const set = (name) => (value) => setData((d) => ({ ...d, [name]: value }))

  useEffect(() => {
    if (!token) {
      toast('To place an order sign in first', 'error')
      router.replace('/auth/login')
    } else if (getTotalCartAmount() === 0) {
      router.replace('/(tabs)/cart')
    }
  }, [token])

  const placeOrder = async () => {
    const required = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone']
    if (required.some((f) => !String(data[f]).trim())) {
      toast('Please fill in all delivery fields', 'error')
      return
    }

    const orderItems = []
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] })
      }
    })
    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryCharge,
    }

    setLoading(true)
    try {
      if (payment === 'stripe') {
        const response = await orderApi.place(orderData)
        if (response.success) {
          // Complete the Stripe checkout in the browser, then check orders.
          await WebBrowser.openBrowserAsync(response.session_url)
          clearCart()
          router.replace('/(tabs)/orders')
        } else {
          toast('Something went wrong', 'error')
        }
      } else {
        const response = await orderApi.placeCod(orderData)
        if (response.success) {
          clearCart()
          toast(response.message || 'Order placed!')
          router.replace('/(tabs)/orders')
        } else {
          toast('Something went wrong', 'error')
        }
      }
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/cart'))}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Information</Text>
          <View style={styles.form}>
            <View style={styles.row}>
              <AppInput placeholder="First name" value={data.firstName} onChangeText={set('firstName')} style={styles.half} />
              <AppInput placeholder="Last name" value={data.lastName} onChangeText={set('lastName')} style={styles.half} />
            </View>
            <AppInput
              icon="mail-outline"
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={data.email}
              onChangeText={set('email')}
            />
            <AppInput icon="home-outline" placeholder="Street" value={data.street} onChangeText={set('street')} />
            <View style={styles.row}>
              <AppInput placeholder="City" value={data.city} onChangeText={set('city')} style={styles.half} />
              <AppInput placeholder="State" value={data.state} onChangeText={set('state')} style={styles.half} />
            </View>
            <View style={styles.row}>
              <AppInput placeholder="Zip code" keyboardType="number-pad" value={data.zipcode} onChangeText={set('zipcode')} style={styles.half} />
              <AppInput placeholder="Country" value={data.country} onChangeText={set('country')} style={styles.half} />
            </View>
            <AppInput icon="call-outline" placeholder="Phone" keyboardType="phone-pad" value={data.phone} onChangeText={set('phone')} />
          </View>

          <View style={{ marginTop: 22 }}>
            <CartTotals />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 22 }]}>Payment Method</Text>
          {[
            { key: 'cod', label: 'COD ( Cash on delivery )' },
            { key: 'stripe', label: 'Stripe ( Credit / Debit )' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.payOption,
                {
                  backgroundColor: colors.card,
                  borderColor: payment === opt.key ? BRAND : colors.border,
                },
              ]}
              onPress={() => setPayment(opt.key)}
              activeOpacity={0.85}
            >
              <Image
                source={payment === opt.key ? assets.checked : assets.un_checked}
                style={styles.payCheck}
              />
              <Text style={[styles.payLabel, { color: colors.text }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.submit} onPress={placeOrder} disabled={loading} activeOpacity={0.9}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>
                {payment === 'cod' ? 'Place Order' : 'Proceed To Payment'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  sectionTitle: { fontSize: 20, fontFamily: FONT.bold, marginBottom: 14 },
  form: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.4,
    padding: 14,
    marginBottom: 10,
  },
  payCheck: { width: 22, height: 22, resizeMode: 'contain' },
  payLabel: { fontSize: 14.5, fontFamily: FONT.medium },
  submit: {
    backgroundColor: BRAND,
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  submitText: { color: '#fff', fontSize: 16, fontFamily: FONT.semibold },
})

export default PlaceOrder

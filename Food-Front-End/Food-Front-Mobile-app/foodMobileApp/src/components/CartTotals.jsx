import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useStore } from '../context/StoreContext'
import { FONT, getColors } from '../theme/theme'

// "Cart Totals" card shared by the Cart tab and Place Order screen,
// mirroring the web .cart-total block.
const CartTotals = () => {
  const { getTotalCartAmount, currency, deliveryCharge, theme } = useStore()
  const colors = getColors(theme)
  const subtotal = getTotalCartAmount()
  const delivery = subtotal === 0 ? 0 : deliveryCharge

  const Row = ({ label, value, bold }) => (
    <View style={styles.row}>
      <Text style={[bold ? styles.bold : styles.label, { color: bold ? colors.text : colors.muted }]}>
        {label}
      </Text>
      <Text style={[bold ? styles.bold : styles.label, { color: bold ? colors.text : colors.muted }]}>
        {currency}
        {value}
      </Text>
    </View>
  )

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Cart Totals</Text>
      <Row label="Subtotal" value={subtotal} />
      <View style={[styles.hr, { backgroundColor: colors.border }]} />
      <Row label="Delivery Fee" value={delivery} />
      <View style={[styles.hr, { backgroundColor: colors.border }]} />
      <Row label="Total" value={subtotal === 0 ? 0 : subtotal + deliveryCharge} bold />
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 15, borderWidth: 1, padding: 16 },
  title: { fontSize: 18, fontFamily: FONT.semibold, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontSize: 14, fontFamily: FONT.regular },
  bold: { fontSize: 15, fontFamily: FONT.bold },
  hr: { height: 1 },
})

export default CartTotals

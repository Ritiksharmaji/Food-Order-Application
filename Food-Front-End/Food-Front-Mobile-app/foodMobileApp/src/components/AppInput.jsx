import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '../context/StoreContext'
import { BRAND, FONT, getColors } from '../theme/theme'

// Rounded input with a leading icon and optional password eye — the building
// block of the auth and checkout forms.
const AppInput = ({ icon, secure, style, ...rest }) => {
  const { theme } = useStore()
  const colors = getColors(theme)
  const [hidden, setHidden] = useState(!!secure)
  const [focused, setFocused] = useState(false)

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.input,
          borderColor: focused ? BRAND : colors.border,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons name={icon} size={19} color={focused ? BRAND : colors.muted} style={styles.icon} />
      )}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text }]}
        secureTextEntry={hidden}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {secure && (
        <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={8}>
          <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.muted} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.4,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: FONT.regular, paddingVertical: 0 },
})

export default AppInput

import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

// Star rating row (display + optional picker), same as the web FoodDetails Stars.
const Stars = ({ value = 0, size = 16, onSelect }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <Text
            key={n}
            style={{
              fontSize: size,
              color: n <= Math.round(value) ? '#ffb100' : '#cfcfcf',
              marginRight: 1,
            }}
          >
            ★
          </Text>
        )
        if (!onSelect) return star
        return (
          <TouchableOpacity key={n} onPress={() => onSelect(n)} hitSlop={6}>
            {star}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default Stars

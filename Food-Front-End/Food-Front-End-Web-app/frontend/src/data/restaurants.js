// Restaurant data lives on the frontend (the backend has no restaurants API).
// Foods coming from the backend are deterministically mapped to a restaurant so the
// same food always shows the same restaurant, and each restaurant has a stable menu.
import r1 from '../assets/food_4.png'
import r2 from '../assets/food_8.png'
import r3 from '../assets/food_12.png'
import r4 from '../assets/food_16.png'
import r5 from '../assets/food_20.png'
import r6 from '../assets/food_24.png'
import r7 from '../assets/food_28.png'
import r8 from '../assets/food_32.png'
import r9 from '../assets/food_6.png'
import r10 from '../assets/food_18.png'

export const restaurants = [
  { id: 'r1', name: 'The Green Bowl', image: r1, cuisines: 'Salads · Healthy · Continental', rating: 4.6, deliveryTime: '25-30 min', priceForTwo: 350, distance: '1.2 km', address: '12 Garden Lane, Foodie Town', promoted: true },
  { id: 'r2', name: 'Roll & Co.', image: r2, cuisines: 'Rolls · Wraps · Street Food', rating: 4.4, deliveryTime: '20-25 min', priceForTwo: 300, distance: '0.8 km', address: '5 Market Road, Foodie Town', promoted: false },
  { id: 'r3', name: 'Sweet Symphony', image: r3, cuisines: 'Desserts · Bakery · Ice Cream', rating: 4.8, deliveryTime: '30-35 min', priceForTwo: 250, distance: '2.1 km', address: '88 Sugar Street, Foodie Town', promoted: true },
  { id: 'r4', name: 'Deli Delight', image: r4, cuisines: 'Sandwiches · Fast Food · Cafe', rating: 4.2, deliveryTime: '20-30 min', priceForTwo: 400, distance: '1.6 km', address: '23 Corner Ave, Foodie Town', promoted: false },
  { id: 'r5', name: 'Cake Affair', image: r5, cuisines: 'Cakes · Bakery · Desserts', rating: 4.7, deliveryTime: '35-40 min', priceForTwo: 500, distance: '2.4 km', address: '9 Frosting Blvd, Foodie Town', promoted: false },
  { id: 'r6', name: 'Pure Veg Kitchen', image: r6, cuisines: 'Pure Veg · Thali · Home Style', rating: 4.5, deliveryTime: '25-35 min', priceForTwo: 350, distance: '1.1 km', address: '41 Green Park, Foodie Town', promoted: true },
  { id: 'r7', name: 'Pasta La Vista', image: r7, cuisines: 'Italian · Pasta · Pizza', rating: 4.6, deliveryTime: '30-40 min', priceForTwo: 650, distance: '3.0 km', address: '77 Roma Street, Foodie Town', promoted: false },
  { id: 'r8', name: 'Noodle Nation', image: r8, cuisines: 'Chinese · Noodles · Asian', rating: 4.3, deliveryTime: '25-30 min', priceForTwo: 450, distance: '1.9 km', address: '30 Wok Way, Foodie Town', promoted: false },
  { id: 'r9', name: 'Urban Tandoor', image: r9, cuisines: 'North Indian · Grill · Biryani', rating: 4.5, deliveryTime: '30-40 min', priceForTwo: 600, distance: '2.7 km', address: '14 Spice Market, Foodie Town', promoted: true },
  { id: 'r10', name: 'Ocean Bites', image: r10, cuisines: 'Seafood · Continental · Grill', rating: 4.4, deliveryTime: '35-45 min', priceForTwo: 700, distance: '3.5 km', address: '2 Harbour View, Foodie Town', promoted: false },
]

const hashId = (s = '') => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export const restaurantById = (id) => restaurants.find((r) => r.id === id)

// Which restaurant serves a given food (stable per food id).
export const restaurantForFood = (foodId) => restaurants[hashId(String(foodId)) % restaurants.length]

// A restaurant's menu: its own foods first, padded with a rotated slice so the page
// stays populated even when the backend has only a few dishes.
export const restaurantMenu = (restId, foodList, limit = 5) => {
  if (!foodList || foodList.length === 0) return []
  const own = foodList.filter((f) => restaurantForFood(f._id).id === restId)
  if (own.length >= limit) return own.slice(0, limit)
  const idx = Math.max(0, restaurants.findIndex((r) => r.id === restId))
  const result = [...own]
  for (let i = 0; i < foodList.length && result.length < limit; i++) {
    const f = foodList[(i + idx) % foodList.length]
    if (!result.includes(f)) result.push(f)
  }
  return result.slice(0, limit)
}

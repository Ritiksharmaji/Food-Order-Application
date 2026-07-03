// Bundled fallback catalogue (same data as the web app's assets.js food_list).
// Used only when the backend is unreachable, so the app still demos beautifully.
import { food_images } from '../assets/assets'

const DESC = 'Food provides essential nutrients for overall health and well-being'

const raw = [
  ['1', 'Greek salad', 'food_1', 12, 'Salad'],
  ['2', 'Veg salad', 'food_2', 18, 'Salad'],
  ['3', 'Clover Salad', 'food_3', 16, 'Salad'],
  ['4', 'Chicken Salad', 'food_4', 24, 'Salad'],
  ['5', 'Lasagna Rolls', 'food_5', 14, 'Rolls'],
  ['6', 'Peri Peri Rolls', 'food_6', 12, 'Rolls'],
  ['7', 'Chicken Rolls', 'food_7', 20, 'Rolls'],
  ['8', 'Veg Rolls', 'food_8', 15, 'Rolls'],
  ['9', 'Ripple Ice Cream', 'food_9', 14, 'Deserts'],
  ['10', 'Fruit Ice Cream', 'food_10', 22, 'Deserts'],
  ['11', 'Jar Ice Cream', 'food_11', 10, 'Deserts'],
  ['12', 'Vanilla Ice Cream', 'food_12', 12, 'Deserts'],
  ['13', 'Chicken Sandwich', 'food_13', 12, 'Sandwich'],
  ['14', 'Vegan Sandwich', 'food_14', 18, 'Sandwich'],
  ['15', 'Grilled Sandwich', 'food_15', 16, 'Sandwich'],
  ['16', 'Bread Sandwich', 'food_16', 24, 'Sandwich'],
  ['17', 'Cup Cake', 'food_17', 14, 'Cake'],
  ['18', 'Vegan Cake', 'food_18', 12, 'Cake'],
  ['19', 'Butterscotch Cake', 'food_19', 20, 'Cake'],
  ['20', 'Sliced Cake', 'food_20', 15, 'Cake'],
  ['21', 'Garlic Mushroom', 'food_21', 14, 'Pure Veg'],
  ['22', 'Fried Cauliflower', 'food_22', 22, 'Pure Veg'],
  ['23', 'Mix Veg Pulao', 'food_23', 10, 'Pure Veg'],
  ['24', 'Rice Zucchini', 'food_24', 12, 'Pure Veg'],
  ['25', 'Cheese Pasta', 'food_25', 12, 'Pasta'],
  ['26', 'Tomato Pasta', 'food_26', 18, 'Pasta'],
  ['27', 'Creamy Pasta', 'food_27', 16, 'Pasta'],
  ['28', 'Chicken Pasta', 'food_28', 24, 'Pasta'],
  ['29', 'Butter Noodles', 'food_29', 14, 'Noodles'],
  ['30', 'Veg Noodles', 'food_30', 12, 'Noodles'],
  ['31', 'Somen Noodles', 'food_31', 20, 'Noodles'],
  ['32', 'Cooked Noodles', 'food_32', 15, 'Noodles'],
]

export const local_food_list = raw.map(([id, name, img, price, category]) => ({
  _id: id,
  name,
  image: food_images[img],
  price,
  description: DESC,
  category,
}))

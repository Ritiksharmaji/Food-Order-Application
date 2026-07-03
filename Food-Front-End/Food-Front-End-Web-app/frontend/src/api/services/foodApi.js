import client from '../client'

// Food catalogue endpoints.
export const foodApi = {
  // -> { success, data: [food] }
  list: () => client.get('/api/food/list'),
  // FormData(name, description, price, category, image) -> { success, message }
  add: (formData) => client.post('/api/food/add', formData),
  // id -> { success, message }
  remove: (id) => client.post('/api/food/remove', { id }),
}

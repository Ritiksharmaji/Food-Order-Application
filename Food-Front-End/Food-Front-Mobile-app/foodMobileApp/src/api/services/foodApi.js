import client from '../client'

// Food catalogue endpoints.
export const foodApi = {
  // -> { success, data: [food] }
  list: () => client.get('/api/food/list'),
}

import client from '../client'

// Cart endpoints (token is attached automatically by the client interceptor).
export const cartApi = {
  // -> { success, cartData: { [foodId]: qty } }
  get: () => client.post('/api/cart/get', {}),
  // itemId -> { success, message }
  add: (itemId) => client.post('/api/cart/add', { itemId }),
  // itemId -> { success, message }
  remove: (itemId) => client.post('/api/cart/remove', { itemId }),
}

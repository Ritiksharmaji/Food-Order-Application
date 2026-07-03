import client from '../client'

// Order endpoints (token attached automatically where the backend requires it).
export const orderApi = {
  // orderData { items, amount, address } -> { success, session_url }  (Stripe)
  place: (orderData) => client.post('/api/order/place', orderData),
  // orderData { items, amount, address } -> { success, message }  (Cash on delivery)
  placeCod: (orderData) => client.post('/api/order/placecod', orderData),
  // -> { success, data: [order] } for the logged-in user
  userOrders: () => client.post('/api/order/userorders', {}),
  // (success, orderId) -> { success }
  verify: (success, orderId) => client.post('/api/order/verify', { success, orderId }),
}

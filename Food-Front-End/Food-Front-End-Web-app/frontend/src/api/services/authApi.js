import client from '../client'

// User authentication endpoints.
export const authApi = {
  // { name, email, password } -> { success, token }
  register: (payload) => client.post('/api/user/register', payload),
  // { email, password } -> { success, token }
  login: (payload) => client.post('/api/user/login', payload),
}

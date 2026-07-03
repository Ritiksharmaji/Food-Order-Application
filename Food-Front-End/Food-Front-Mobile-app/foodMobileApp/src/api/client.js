import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from './config'

// Single axios instance used by every service.
const client = axios.create({ baseURL: API_URL, timeout: 15000 })

// Attach the auth token (raw `token` header, as the backend expects) on every
// request automatically, so callers never have to pass headers themselves.
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token')
  if (token) config.headers.token = token
  return config
})

// Return the response body directly and surface a helpful error message.
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default client

// Central API configuration.
// Override the backend URL without touching code by adding a .env file with:
//   VITE_API_URL=http://your-backend-host:4000
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Build an absolute URL for an uploaded image filename returned by the backend.
export const imageUrl = (filename) => `${API_URL}/images/${filename}`

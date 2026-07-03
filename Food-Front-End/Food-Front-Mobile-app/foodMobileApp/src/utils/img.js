import { imageUrl } from '../api'

// Foods from the backend carry a filename string; the bundled fallback
// catalogue carries a require() module. Resolve either into an Image source.
export const foodImageSource = (image) =>
  typeof image === 'string' ? { uri: imageUrl(image) } : image

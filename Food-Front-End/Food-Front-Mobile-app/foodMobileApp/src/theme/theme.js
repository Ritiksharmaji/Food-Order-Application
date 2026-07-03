// Brand palette mirrored from the web app (theme.css + component CSS).
export const BRAND = '#FF4C24'
export const BRAND_DARK = '#e63e18'
export const BRAND_SOFT = '#fff4f2'
export const NAVY = '#49557E'

export const lightColors = {
  bg: '#ffffff',
  text: '#262626',
  muted: '#676767',
  card: '#ffffff',
  surface: '#f7f7f7',
  border: '#ececec',
  input: '#f7f7f7',
  tint: '#fff4f2',
  shadow: '#00000022',
}

export const darkColors = {
  bg: '#141414',
  text: '#ededed',
  muted: '#b3b3b3',
  card: '#1f1f1f',
  surface: '#1a1a1a',
  border: '#2f2f2f',
  input: '#262626',
  tint: '#2a1f1c',
  shadow: '#00000066',
}

export const getColors = (theme) => (theme === 'dark' ? darkColors : lightColors)

// Font family names registered in the root layout (Outfit, same as the web app).
export const FONT = {
  light: 'Outfit_300Light',
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
}

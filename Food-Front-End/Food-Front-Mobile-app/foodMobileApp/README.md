# 🍅 Tomato — Food Delivery Mobile App (foodMobileApp)

React Native (Expo) mobile app for the Tomato food-delivery platform — the mobile
counterpart of `Food-Front-End-Web-app/frontend`, sharing the same backend, brand
styling (Outfit font, `#FF4C24` tomato orange) and features, with mobile-first
login / register screens.

## Features

- **Home** — hero banner, Top 10 dishes, Top 10 restaurants, app-download CTA
- **Menu** — search, category strip (Salad, Rolls, Deserts, …), dish grid
- **Food details** — gallery, ratings & device-local reviews, quantity picker, similar dishes, restaurant card
- **Restaurant** — banner, rating/delivery/price info bar, top 5 dishes, explore more
- **Cart** — quantity steppers, promo code, cart totals, checkout guard
- **Checkout** — delivery form, COD or Stripe (opens browser for payment)
- **Orders** — history with live status, pull-to-refresh, Track Order
- **Profile** — stats, recent orders, quick actions, logout
- **Auth** — stylish mobile login & register screens (hero image, curved sheet, gradient buttons)
- **Dark / light theme** — persisted, toggle in the top bar and profile
- **Offline-friendly** — bundled catalogue is shown if the backend is unreachable

## Getting started

```bash
npm install
npx expo start
```

Scan the QR with Expo Go (or press `a` for Android emulator / `i` for iOS simulator / `w` for web).

## Backend

The app talks to the same backend as the web frontend (default port `4000`).
When running through the Expo dev server, the backend host is derived
automatically from your dev machine's LAN IP. To override it, create a `.env`:

```
EXPO_PUBLIC_API_URL=http://192.168.1.10:4000
```

## Project structure

```
src/
  app/               # expo-router screens
    (tabs)/          # Home, Menu, Cart, Orders, Profile
    auth/            # login, register
    food/[id]        # food details
    restaurant/[id]  # restaurant page
    place-order      # checkout
    about, contact
  api/               # axios client + auth/food/cart/order services
  components/        # FoodItem, RestaurantCard, TopBar, AppInput, ...
  context/           # StoreContext (cart, auth, theme, toasts)
  data/              # restaurants + bundled fallback catalogue
  assets/            # images copied from the web app
  theme/             # brand colors & fonts
```

# API layer

A small, reusable wrapper around the backend so components never build URLs or
attach headers by hand.

```
src/api/
├── config.js            # API_URL (+ VITE_API_URL override) and imageUrl(filename)
├── client.js            # one axios instance: auto-attaches token, unwraps res.data, normalizes errors
├── index.js             # barrel — import everything from '../api'
└── services/
    ├── authApi.js       # register, login
    ├── foodApi.js       # list, add, remove
    ├── cartApi.js       # get, add, remove
    └── orderApi.js      # place, placeCod, userOrders, list, updateStatus, verify
```

## Usage

```js
import { foodApi, cartApi, orderApi, imageUrl } from '../api'

const res = await foodApi.list()          // -> { success, data: [...] }
if (res.success) setFoods(res.data)

await cartApi.add(itemId)                  // token attached automatically
const orders = await orderApi.userOrders() // -> { success, data: [...] }

<img src={imageUrl(food.image)} />         // absolute image URL
```

- The `client` interceptor reads the JWT from `localStorage.token` and sends it as a
  raw `token` header (what this backend expects) — you never pass headers manually.
- Responses are already unwrapped to the JSON body, so read `res.success`, `res.data`,
  `res.token`, etc. directly.
- Errors reject with a real `Error` whose message is the backend message — wrap calls
  in `try/catch` and show `err.message`.

## Adding a new API

1. Pick the matching service in `services/` (or create a new `xxxApi.js`).
2. Add a method that calls `client`:
   ```js
   // services/reviewApi.js
   import client from '../client'
   export const reviewApi = {
     listForFood: (foodId) => client.get(`/api/review/${foodId}`),
     add: (payload) => client.post('/api/review/add', payload),
   }
   ```
3. Export it from `index.js`:
   ```js
   export { reviewApi } from './services/reviewApi'
   ```
4. Use it: `import { reviewApi } from '../api'`.

That's it — no base URL, no headers, no boilerplate per call.

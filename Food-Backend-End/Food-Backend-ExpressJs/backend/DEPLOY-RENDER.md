# Deploying the Food-Del backend to Render

Node + Express + MongoDB backend. It reads `PORT` from the environment (Render sets it),
so it runs on Render as-is once the env vars are set.

You can deploy **either** way:

---

## Option A — Manual Web Service (what you asked for: set the Root Directory)

1. **MongoDB Atlas** (free): create a cluster, add a DB user, and under **Network Access**
   allow `0.0.0.0/0` (Render's IPs are dynamic). Copy the connection string
   (`mongodb+srv://user:pass@cluster.../fooddel`). Note: don't use `@` inside the password.
2. Push this repo to GitHub.
3. Render Dashboard → **New + → Web Service** → connect the repo.
4. Set these fields:
   - **Root Directory:** `Food-Backend-End/Food-Backend-ExpressJs/backend`
   - **Runtime / Language:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. **Environment** → add the variables from the table below.
6. **Create Web Service**.

## Option B — Blueprint (zero manual config)

Render Dashboard → **New + → Blueprint** → pick this repo. It reads `render.yaml` at the
repo root (which already points `rootDir` at this backend) and prompts for the env vars.

---

## Environment variables (both options)

| Key | Value |
|---|---|
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | any long random string |
| `STRIPE_SECRET_KEY` | your Stripe secret key (a test key `sk_test_...` is fine) |

> `PORT` is provided by Render automatically — **do not** add it. The server already uses
> `process.env.PORT`.

---

## Verify

- Logs show `Server started ...` and `DB Connected`.
- `GET https://<your-service>.onrender.com/` returns **"API Working"**.
- `GET /api/food/list` returns `{ success: true, data: [...] }`.

Then point the frontend at it: set `VITE_API_URL=https://<your-service>.onrender.com` in the
frontend `.env` (the new API layer reads it) and redeploy the frontend.

---

## Important notes

- **Free tier sleeps** after ~15 min idle; the first request then takes ~50s (cold start).
- **Uploaded images are NOT persistent.** This backend saves images to a local `uploads/`
  folder (multer disk storage), and Render's filesystem is **ephemeral** — images added via
  the admin panel are lost on every redeploy/restart. Existing seeded images in the repo also
  won't be there unless committed. For production, switch image storage to a cloud provider
  (e.g. Cloudinary or S3). Text data (foods/users/orders) lives in MongoDB and persists fine.
- **Stripe** redirects use a hardcoded `frontend_URL = 'http://localhost:5173'` in
  `controllers/orderController.js` — update that to your deployed frontend URL before using
  the Stripe (card) checkout in production. COD works without it.

# Deploying WonderMap

One Vercel project serves everything: the Vite build is the static site, and
`api/index.ts` runs the Express API as a single function. `vercel.json` rewrites
`/api/*` to it and everything else to `index.html` for the SPA router.

Both halves share one domain. That is deliberate — the session's refresh token
is an `httpOnly` cookie, and on one origin it is a first-party cookie that
survives the browsers now blocking third-party cookies. Splitting the client and
the API across two domains would break sign-in in Safari and, increasingly, in
Chrome.

You need a database before any of this works. Roughly 15 minutes end to end.

---

## 1 · A database (MongoDB Atlas, free)

1. Sign up at <https://www.mongodb.com/cloud/atlas/register>.
2. Create a **free M0 cluster**. Any provider and region; pick one near you.
3. **Database Access** → *Add New Database User*. Username and password, role
   *Read and write to any database*. Use a generated password and copy it —
   if it contains `@ : / ? # [ ] %`, percent-encode those in the URI below.
4. **Network Access** → *Add IP Address* → **Allow access from anywhere**
   (`0.0.0.0/0`).

   Vercel's functions do not have fixed outbound IPs, so there is no narrower
   range to allow. The database user's password is what protects the cluster —
   which is why it should be long and random. (Vercel's paid plans offer static
   IPs if you later want to lock this down.)
5. **Connect** → *Drivers* → copy the connection string. Add the database name
   before the `?`:

   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/wondermap?retryWrites=true&w=majority
   ```

## 2 · Fill it with the world

The app has no content until it is seeded — worlds, lessons, and the two
accounts below. Run this once, from the repository root, pointed at Atlas.

PowerShell:

```powershell
$env:MONGO_URI="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/wondermap"; npm run seed
```

bash:

```bash
MONGO_URI="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/wondermap" npm run seed
```

It creates:

| account | password | |
|---|---|---|
| `demo@wondermap.dev` | `demo1234` | the one to share |
| `admin@wondermap.dev` | `admin1234` | admin tools |

**Change the admin password before you share the link** — the pair above is in
this file, and this file is in the repository.

## 3 · Two secrets

Run twice and keep both values:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## 4 · Import into Vercel

1. <https://vercel.com/new> → sign in **with GitHub** → import
   `fatihthefreelancer-netizen/WonderMap`.
2. Leave every build setting alone. `vercel.json` already sets the install
   command, the build command and the output directory; Vercel will use them.
3. Before the first deploy, open **Environment Variables** and add these to
   *Production*, *Preview* and *Development*:

   | name | value |
   |---|---|
   | `MONGO_URI` | the Atlas string from step 1 |
   | `JWT_ACCESS_SECRET` | first secret from step 3 |
   | `JWT_REFRESH_SECRET` | second secret from step 3 |

4. **Deploy.** You get a URL like `wondermap-xxxx.vercel.app`.
5. Add one more variable now that you know the URL, then redeploy:

   | name | value |
   |---|---|
   | `CLIENT_ORIGIN` | `https://your-url.vercel.app` (no trailing slash) |

   Only CORS reads it, and the app is same-origin, so this is belt and braces
   rather than strictly required.

That URL is the link to share. Anyone can open it and sign in as
`demo@wondermap.dev` / `demo1234`, or register their own account.

---

## If something goes wrong

**503, "Database unavailable"** — `MONGO_URI` is wrong, or Atlas Network Access
is not open to `0.0.0.0/0`. Vercel → Deployments → the deployment → *Functions*
shows the real error.

**Build fails on a missing environment variable** — deliberate. `MONGO_URI`,
`JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` have no production fallback,
because the old fallback signed every session with a secret written in the
source. Add them and redeploy.

**Sign-in works, then you are signed out on refresh** — the refresh cookie is
not coming back. Check the deployment is HTTPS (Vercel always is) and that you
have not set `COOKIE_SAMESITE`. Leave it unset; `lax` is correct here.

**A page 404s on reload** — the SPA rewrite in `vercel.json` is not being
applied. Confirm `vercel.json` is at the repository root and the project's Root
Directory setting is empty.

**Nothing on the map / empty world** — the database was never seeded. Step 2.

## Running it locally

Unchanged. `server/src/index.ts` is still a normal long-lived Express server;
nothing in the Vercel setup affects it.

```bash
npm install
npm run seed     # needs a local mongod, or point MONGO_URI at Atlas
npm run dev      # client on :5173, API on :4000
```

# StreamNest BD

Digital services shop for Bangladesh — streaming plans, AI tools, gift cards, and software keys.

The repository is split into three apps:

| App          | Path        | Stack                                    | Port |
| ------------ | ----------- | ---------------------------------------- | ---- |
| Storefront   | `frontend/` | Next.js 16.3.8, React 19, Tailwind 4     | 3000 |
| Packages API | `backend/`  | NestJS 12, Prisma 7, PostgreSQL, Swagger | 4000 |
| Admin panel  | `admin/`    | Next.js 16.3.8                           | 3001 |

## Quick start

```bash
# 1. PostgreSQL (docker, exposed on host port 15432 to avoid local conflicts)
docker compose up -d

# 2. Backend — install, generate, migrate, seed, run
cd backend
npm install
npm run prisma:generate     # regenerate the Prisma client (src/generated is gitignored)
npm run prisma:migrate      # applies the committed init migration
npm run prisma:seed         # seeds the full packages catalog + a demo customer
npm run start:dev           # API on http://localhost:4000/api

# 3. Admin panel
cd ../admin
npm install
npm run dev                # admin on http://localhost:3001

# 4. Storefront
cd ../frontend
npm install
npm run dev                # shop on http://localhost:3000
```

Root-level shortcuts also exist: `npm run docker:up`, `npm run backend:dev`,
`npm run backend:seed`, `npm run admin:dev`, `npm run frontend:dev`.

## Backend (packages API)

NestJS + Prisma + PostgreSQL. The domain is the packages catalog:

- **Category** — e.g. OTT & Entertainment, AI & Productivity
- **Product** — e.g. Netflix Premium, ChatGPT Plus
- **Package** — a purchasable plan, e.g. `Shared Profile · 1 Month → ৳350`

REST API (global prefix `/api`):

| Method            | Route                     | Description                                            |
| ----------------- | ------------------------- | ------------------------------------------------------ |
| GET               | `/api/categories`         | Categories with product counts                         |
| POST/PATCH/DELETE | `/api/categories/:id`     | Manage categories                                      |
| GET               | `/api/products`           | List products (`?search=&category=&active=&featured=`) |
| GET               | `/api/products/:idOrSlug` | Product with its packages                              |
| POST/PATCH/DELETE | `/api/products/:id`       | Manage products                                        |
| GET               | `/api/packages`           | List packages (`?productId=&available=`)               |
| POST/PATCH/DELETE | `/api/packages/:id`       | Manage packages                                        |
| POST              | `/api/auth/register`      | Customer sign-up (name, email, phone, password) → JWT  |
| POST              | `/api/auth/login`         | Customer login (email + password) → JWT                |
| GET               | `/api/auth/me`            | Signed-in customer (customer token)                    |
| POST              | `/api/auth/admin/login`   | Admin login with the static credentials → JWT          |
| GET               | `/api/auth/admin/me`      | Signed-in admin (admin token)                          |
| GET/PATCH/DELETE  | `/api/users[/:id]`        | Customer accounts (`?search=`), admin only             |

Every catalog POST/PATCH/DELETE and every `/api/users` route needs the admin
token (`Authorization: Bearer <token>`). Catalog GET routes stay public. In
Swagger, call `POST /api/auth/admin/login`, then paste the token into **Authorize**.

## Logins

| Who              | Where                         | Email                    | Password      |
| ---------------- | ----------------------------- | ------------------------ | ------------- |
| Admin (static)   | http://localhost:3001/login   | `admin@streamnestbd.com` | `Admin@12345` |
| Demo customer    | http://localhost:3000/login   | `demo@streamnestbd.com`  | `demo1234`    |

The admin account is not stored in the database: it comes from `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in `backend/.env`. Change both, and `JWT_SECRET`, before
deploying. Customer passwords are stored as bcrypt hashes in the `users` table.

Swagger UI: **http://localhost:4000/api-docs**
OpenAPI JSON: `http://localhost:4000/api-docs-json`

Configuration: copy `backend/.env.example` to `backend/.env` and adjust
`DATABASE_URL`, `PORT`, `CORS_ORIGINS`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. The default `DATABASE_URL` points at
`localhost:15432` — the host port mapped by `docker-compose.yml`.

Prisma commands (run inside `backend/`):

```bash
npm run prisma:generate   # regenerate the client after schema changes
npm run prisma:migrate    # create/apply a migration (dev)
npm run prisma:deploy     # apply migrations in production
npm run prisma:seed       # re-seed the catalog (wipes catalog tables first)
npm run prisma:studio     # browse the database
```

## Admin panel

Next.js 16.3.8 app that controls the whole packages catalog over the API.
Every page sits behind the admin login (`/login`); the token is kept in
localStorage and an expired token sends you back to the login screen.

- Dashboard — product/package counts, price range, customers, newest sign-ups
- Products — search, filter by category, activate/deactivate, delete
- Product editor — full product fields plus inline package management
  (add, edit price/stock/availability, delete packages)
- Categories — add, rename, re-order, activate, delete
- Customers — search, view details, disable/enable login, delete

Configuration: copy `admin/.env.example` to `admin/.env` and set
`NEXT_PUBLIC_API_URL` (default `http://localhost:4000`).

## Storefront

Next.js shop on port 3000. The whole catalog — products, packages, prices,
stock, search, home shelves, collections, and the sitemap — is served live
from the packages API at request time (`force-dynamic`, `cache: "no-store"`),
so admin edits appear in the shop without a rebuild. Cart lines are stored as
`{slug, packageId, qty}` in localStorage and resolved against a live client-side
copy of the catalog, so prices and availability in the cart and checkout are
always current. Static products.ts is gone.

Login and registration (`/login`, `/register`, `/account`) use the API: email +
password, with the customer JWT kept in localStorage and re-checked against
`/api/auth/me` on each visit. Orders are still stored only in the browser.

Content that stays local: FAQ, blog, policies, spotlight copy, and collection
ledes (`frontend/src/data/content.ts`, `collections.ts`, `spotlights.ts`).

Configuration: copy `frontend/.env.example` to `frontend/.env` and set
`NEXT_PUBLIC_API_URL` (default `http://localhost:4000`). The storefront needs
the backend running.

## Notes

- The interface, copy, and artwork are original. Brand names on products belong
  to their owners.
- Checkout in the storefront does not charge a wallet or card. Connect a
  gateway (SSLCommerz, bKash) before taking real payments.

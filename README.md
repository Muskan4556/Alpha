# Alpha - Product Dashboard

**Live demo:** [alpha-one-kappa.vercel.app](https://alpha-one-kappa.vercel.app/)

Next.js dashboard for browsing a product catalog ([DummyJSON](https://dummyjson.com/products)), with role-based access and admin publish controls.

## Features

- **Auth & RBAC** - Admin and user roles; route protection via `proxy.ts`
- **Products** - Search, category filter, sort, pagination (URL-driven)
- **Admin publish** - Hide/show products (stored in-memory on the server, not on DummyJSON)
- **Analytics** - Catalog stats, charts, and insight tabs 
- **Live-ish sync for users** - Refetch when returning to the products tab after admin changes

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Server Actions (`app/actions/`)
- Tailwind CSS, shadcn/ui, TanStack Table

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # production server
npm run lint
```

## Demo accounts

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | `admin@alpha.com` | `admin123` |
| User  | `user@alpha.com`  | `user123`  |

**Admin:** `/analytics`, `/products`, `/profile`  
**User:** `/products`, `/profile`

## Project layout (main files)

```
app/actions/products.ts   # DummyJSON fetch, filters, pagination
app/actions/publish.ts    # Admin visibility toggle
lib/mock-db.ts            # Hidden product IDs (in-memory)
lib/session-server.ts     # Session cookies
proxy.ts                  # Auth route guard
components/products/      # Catalog UI
components/analytics/     # Dashboard & insights
```


## API

- Base: `https://dummyjson.com/products`

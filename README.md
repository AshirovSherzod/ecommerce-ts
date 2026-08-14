# E-Commerce (React + TypeScript + Vite)

An SPA for a furniture store: product catalog, filters, cart and wishlist.
It talks to a REST API backend, and the contact form delivers messages through
a Telegram bot.

## Tech stack

| Area | Tool |
| --- | --- |
| Build | Vite 8, TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4 (`@tailwindcss/vite`), react-icons |
| Routing | react-router-dom 7 |
| Server state | TanStack Query 5 (+ Devtools) |
| Client state | Zustand 5 (`persist` → localStorage) |
| HTTP | axios (instance with interceptors) |
| Forms | react-hook-form + zod (`@hookform/resolvers`) |
| Notifications | react-toastify |

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 8 requirement).

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The dev server usually starts at http://localhost:5173.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | `tsc -b` type-check + production build (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Environment variables

`.env` is not committed (see `.gitignore`). Required variables:

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API (used by `axiosInstance`) |
| `VITE_BOT_TOKEN` | Telegram bot token — the contact form sends messages through this bot |
| `VITE_CHAT_ID` | Telegram chat ID that receives the messages |
| `VITE_DEMO_REVIEWS` | Optional. `true`/`false` to force the placeholder reviews on or off. Unset means on in development, off in production |
| `VITE_SALE_ENDS_AT` | Optional. ISO date for the site-wide sale countdown. Unset means no countdown in production |

> Anything prefixed with `VITE_` is inlined into the bundle and visible in the
> browser, so the bot token is not a secret here. In a public deployment it
> should be proxied through the backend instead.

## Project structure

```
src/
├── api/          axios instance, endpoint list, error message normalization
├── assets/       images and icons
├── components/
│   ├── layout/   Header, Footer, Layout (Outlet)
│   └── ui/       Button, Select, ProductCard, Counter, Rating, Sidebar, Spinner ...
├── hooks/        useProducts, useCategories, useTelegramMessage
├── pages/        Home, Shop, Blog, Contact, Cart, Wishlist, NotFound
├── provider/     QueryProvider (QueryClient configuration)
├── sections/     page sections (Hero, ShopFilters, ContactForm ...)
├── services/     API calls (productsService, categoryService)
├── store/        Zustand stores (cart, wishlist)
├── types/        API and domain types
└── utils/        cn (clsx + tailwind-merge), formatPrice, constants
```

The `@` alias points at `src/`, configured in [vite.config.ts](vite.config.ts)
and [tsconfig.app.json](tsconfig.app.json):

```ts
import { Button } from "@/components/ui/Button";
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — slider, categories, services, articles |
| `/shop` | Catalog: category/brand/price filters, sorting, "Show more" |
| `/blog` | Articles |
| `/contact` | Contact form (sent to Telegram) |
| `/cart` | Cart |
| `/wishlist` | Wishlist |
| `*` | 404 |

## Architecture notes

**Server state lives in TanStack Query.** Requests sit in `services/` and the
hooks that wrap them in `hooks/`. Query keys are collected in one place (e.g.
`PRODUCT_KEYS`) and invalidated after mutations. Global defaults: `staleTime`
5 min, `retry` 2, `refetchOnWindowFocus` disabled. Devtools are only loaded
when `import.meta.env.DEV` is true.

**The Shop page** uses `useInfiniteQuery` — `getNextPageParam` derives the next
page from `pagination.totalPages`.

**Client state lives in Zustand.** `cart` and `wishlist` are persisted to
localStorage via the `persist` middleware (`cart-storage` and
`wishlist-storage`), so they survive a page reload.

**axios interceptors.** Requests get a `Bearer` token from
`localStorage.accessToken`. On a 401 response the token is cleared — there is
no `/login` page in the app yet, so no redirect happens; 403 and 5xx are logged
to the console. The error is still rejected upward so callers can surface it
through `handleError`.

## Build

```bash
npm run build     # outputs to dist/
npm run preview
```

`dist/` is plain static output and can be served from any static host (Vercel,
Netlify, nginx). Since this is an SPA, configure a fallback so every route
serves `index.html`.

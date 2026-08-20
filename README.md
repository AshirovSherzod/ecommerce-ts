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
| `npm test` | Run the unit tests once (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Browser tests (Playwright) |
| `npm run test:e2e:ui` | Playwright UI mode |

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
├── schemas/      zod validation schemas (auth, contact, review ...)
├── sections/     page sections (Hero, ShopFilters, ContactForm ...)
├── services/     API calls (productsService, categoryService)
├── store/        Zustand stores (cart, wishlist, reviews, auth)
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
| `/shop/:id` | Product detail — gallery, countdown, tabs, reviews |
| `/blog` | Articles |
| `/contact` | Contact form (sent to Telegram) |
| `/cart` | Cart |
| `/wishlist` | Wishlist |
| `/signin`, `/signup` | Auth pages (outside the main layout) |
| `*` | 404 |

## Architecture notes

**Server state lives in TanStack Query.** Requests sit in `services/` and the
hooks that wrap them in `hooks/`. Query keys are collected in one place (e.g.
`PRODUCT_KEYS`) and invalidated after mutations. Global defaults: `staleTime`
5 min, `retry` 2, `refetchOnWindowFocus` disabled. Devtools are only loaded
when `import.meta.env.DEV` is true.

**The Shop page** uses `useInfiniteQuery` — `getNextPageParam` derives the next
page from `pagination.totalPages`.

**Client state lives in Zustand.** `cart`, `wishlist`, `reviews` and `auth` are
persisted to localStorage via the `persist` middleware, so they survive a page
reload. The cart is kept to a single currency — there is no exchange-rate
source, so adding a product in another currency is refused rather than adding
up numbers that do not belong together.

**Reviews are stored in the browser.** The API has no reviews endpoint yet;
`useProductReviews` is the single place to swap once it does.

**axios interceptors.** Requests carry a `Bearer` token read through
`authStorage`, which checks both localStorage and sessionStorage ("Remember
me" decides which one). A 401 clears the token and emits `auth:unauthorized`,
which closes the session in the auth store — otherwise the header would keep
showing a signed-in user whose every action fails. Responses that are not JSON
are rejected too: a proxy or SPA fallback returning HTML with status 200 used
to crash the page instead of showing an error state.

**Error boundaries.** One around the router outlet keeps the header and footer
alive when a page throws, and one at the root catches the rest. Stack traces
are shown in development only.

## Tests

```bash
npm test          # runs once
npm run test:watch
```

Vitest with a jsdom environment, covering the logic where a silent mistake
would be expensive:

| Area | Why it is covered |
| --- | --- |
| `cart.store` | Money. Totals, quantities, and the guard that keeps a cart in a single currency |
| `handleError` | The API nests messages under `data.error.message`; reading the wrong key hides every server error |
| `auth.schema` | Phone format, email, password length — and that values arrive trimmed |
| `authStorage` | "Remember me" decides local vs session storage; a stale token in the other one would survive sign out |
| `formatPrice` | Must not throw on an unknown currency |

Tests live next to the code they cover (`src/**/*.test.ts`) and are excluded
from the production bundle.

### Browser tests

```bash
npm run test:e2e
```

Playwright starts the dev server itself, so nothing needs to be running first.
Specs are in `e2e/`, grouped by flow: `smoke` (every route renders), `shop`,
`product`, `reviews`, `auth`, `forms`, plus `gallery.mobile` which runs on a
phone viewport.

By default it drives the Edge installed on the machine, so no 150 MB browser
download is needed. On CI or a machine without Edge:

```bash
PW_CHANNEL=bundled npx playwright install chromium
PW_CHANNEL=bundled npm run test:e2e
```

**Two outbound calls are blocked at the fixture level** (`e2e/fixtures.ts`), so
a new test cannot trigger them by accident:

| Blocked | Why |
| --- | --- |
| `api.telegram.org` | The contact form would send a real message to the bot |
| `POST /auth/register` | A valid payload would create a real account on the backend that cannot be deleted |

Tests assert on the block counters, so a leak fails the suite rather than
going unnoticed. Everything else runs against the real API.

## Build

```bash
npm run build     # outputs to dist/
npm run preview
```

`dist/` is plain static output and can be served from any static host (Vercel,
Netlify, nginx). Since this is an SPA, configure a fallback so every route
serves `index.html`.

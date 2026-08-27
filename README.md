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
| i18n | i18next + react-i18next (uz / ru / en) |

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
| `VITE_SENTRY_DSN` | Optional. Sentry DSN. Unset means monitoring is off and the Sentry bundle is never downloaded |
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
├── i18n/         i18next setup, language list, bundled resources
├── monitoring/   Sentry wiring — lazy loaded, off without a DSN
├── hooks/        useProducts, useCategories, useTelegramMessage
├── locales/      uz/, ru/, en/ — one JSON per namespace
├── data/         articles and their bodies (not fetched from the API)
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
| `/shop` | Catalog: search, category/brand/price filters, sorting, "Show more" |
| `/shop/:id` | Product detail — gallery, countdown, tabs, reviews |
| `/blog` | Articles |
| `/contact` | Contact form (sent to Telegram) |
| `/cart` | Cart |
| `/checkout` | Checkout — customer details, order summary, confirmation |
| `/blog/:id` | A single article |
| `/about` | Who the shop is and what it stands for |
| `/account` | Profile and the orders placed on this device |
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

**Search runs on the server**, through the API's `search` parameter (`?q=` in
the URL). It matches title and brand, not description. Doing it client-side
would have searched only the pages already loaded, so a product on page 3
would look missing. The query is submitted rather than debounced: fewer
requests, and no drift between the input, the URL and the running query.

**Client state lives in Zustand.** `cart`, `wishlist`, `reviews` and `auth` are
persisted to localStorage via the `persist` middleware, so they survive a page
reload. The cart is kept to a single currency — there is no exchange-rate
source, so adding a product in another currency is refused rather than adding
up numbers that do not belong together.

**Orders go to Telegram.** There is no `/orders` endpoint, so a placed order
is delivered to the shop operator through the same bot the contact form uses.
The rules that matter: totals are recomputed from the cart at submit time, the
cart is only cleared after a confirmed send, the order id stays the same across
retries so a duplicate message is recognisable, and a cart too long for one
Telegram message is split with the customer and totals kept in the first part.

**Three languages, Uzbek by default.** `src/locales/<lang>/<namespace>.json`
holds the text; the namespaces (`common`, `layout`, `shop`, `cart`, `auth`,
`pages`, `validation`) keep one file from growing without bound. The browser
language is deliberately *not* detected: most customers expect Uzbek while
their browser is often set to ru or en. The choice is kept in localStorage and
mirrored onto `<html lang>`.

Translations are bundled rather than fetched on demand — all three together are
small, and a network round-trip would show a visible flash on every switch.

zod schemas store translation *keys* (`"validation:emailRequired"`), not
sentences, because a schema is a module-level constant and cannot call a hook;
the component renders `t(errors.x.message)`. The shipping label sent to the
shop operator over Telegram stays in a fixed language on purpose — it should
not change with the customer's UI language.

**Article text is not in the locale files.** Titles and excerpts are, because
the blog list and the home page always show them. The bodies live in
`src/data/articleBodies.ts`, which only the article route imports — a few
kilobytes of prose per language has no business in a bundle that every visitor
downloads to look at the shop. A unit test keeps the languages in step, since
the locale key test cannot see this file.

Both the article bodies and the About page carry a visible line saying the
text is a sample. It is placeholder copy about decorating a home, not a claim
about this business, and the note stays until the shop writes its own.

**Checkout starts filled in.** Name, phone and email come from the signed-in
profile; the address comes from the most recent order, since no profile field
holds one. Profile wins over the old order — a customer who updated their
details should not have them overwritten by last month's delivery. The note is
never carried over: "leave it by the door" belongs to one delivery, and
repeating it on the next order would be a wrong instruction rather than a
convenience. `checkoutDefaults` is a pure function so this priority is pinned
by tests.

The confirmation screen shows only while the cart is empty. `lastOrder` lives
in `sessionStorage` for the whole visit, so checking it unconditionally
trapped a customer who added more items on the same visit: they reached
checkout and saw the previous confirmation instead of a form, with no way to
place a second order.

**Order history lives on the device.** There is no orders endpoint, so a
placed order is kept in `localStorage` alongside the cart and wishlist. That
makes the history per-device rather than per-account, and `/account` says so
in as many words — a customer who finds an empty list on their phone should
know why rather than assume the order was lost. The list is capped, because a
full `localStorage` quota makes `persist` fail silently and new orders would
vanish without a trace.

The confirmation screen and the history deliberately use different storage:
the screen is a single visit (`sessionStorage`, so it survives a refresh but
not a return trip), the history is the device (`localStorage`). One `persist`
cannot write to both, hence two stores in `order.store.ts`.

An order records the shipping method's `id` as well as its `label`. The label
is what the shop operator reads in Telegram and stays in one language on
purpose; the `id` is what the account page translates for the customer.

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

**Crashes are reported to Sentry** when `VITE_SENTRY_DSN` is set, and the
integration is built to cost nothing when it is not: the SDK sits behind a
dynamic `import()`, so a deployment without a DSN never downloads it. Errors
raised before the SDK finishes loading are queued (bounded, so a blocked
request cannot grow the queue) and flushed on arrival.

`Sentry.init()` is deliberately not used. It references every default
integration — tracing, session replay, user feedback — and all of them end up
in the bundle whether or not they run. Building the client by hand from the
integrations we actually want takes the chunk from 140 KB gzipped to 25 KB.

**Reports are scrubbed before they leave the browser.** Sentry records XHR
calls as breadcrumbs, and the Telegram endpoint carries the bot token in its
URL — every placed order would have shipped that token to a third party.
`beforeSend` strips it (`src/monitoring/scrub.ts`). `sendDefaultPii` is off,
so the name, phone and address from checkout stay out of reports.

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
| Sentry ingest | Test-run errors would land in the live project and drown the real ones |

Tests assert on the block counters, so a leak fails the suite rather than
going unnoticed. Everything else runs against the real API.

**`e2e/monitoring.spec.ts` is skipped unless a DSN is configured**, since
monitoring is compiled in at build time. It is the only check that proves the
scrubber works on a real Sentry payload rather than a hand-written one — it
places an order so the Telegram call is recorded as a breadcrumb, throws, and
reads the outgoing envelope. Run it deliberately:

```bash
VITE_SENTRY_DSN="https://key@o4507.ingest.sentry.io/4507" VITE_BOT_TOKEN="7123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw" VITE_CHAT_ID=1 npx playwright test e2e/monitoring.spec.ts
```

Both values are throwaway: nothing reaches Sentry or Telegram, the fixtures
intercept both.

## Continuous integration

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every push to
`master` and on every pull request: lint, unit tests, and `npm run build` —
which starts with `tsc -b`, so types are covered without a separate step.

**The browser tests are deliberately not in CI.** They talk to the real API,
which would mean putting the API address into repository secrets and paying
fifteen minutes of runner time per pull request for a suite whose failures are
usually about the backend being slow rather than the change under review. Run
them locally instead:

```bash
npm run test:e2e
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview
```

`dist/` is plain static output and can be served from any static host (Vercel,
Netlify, nginx). Since this is an SPA, configure a fallback so every route
serves `index.html`.

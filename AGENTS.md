# Elysium Project — Agent Rules

## Stack

This is a **pure Node.js / Express** project. There is NO Next.js, NO React, NO TypeScript.

- **Server**: `server.js` — 1,936-line Express.js app serving all pages as server-rendered HTML strings
- **Static Assets**: `public/css/`, `public/js/`, `public/images/`
- **Deployment**: Vercel via `api/index.js` + `vercel.json` (uses `@vercel/node`)
- **Dev**: `npm run dev` → `node --watch server.js`
- **No build step** — changes to `server.js` or `public/` are live immediately on reload

## Key Architecture Decisions

- All page HTML is generated in `server.js` via template literal functions (`renderPage`, `renderBaroqueBox`, `renderProductImage`)
- All data (products, materials, craft steps, brand info) lives in `server.js` as plain JS constants
- GSAP, ScrollTrigger, SplitType, and Lenis are loaded as vendor scripts from `public/js/vendor/`
- Tailwind CSS is a pre-built static file at `public/css/tailwind.min.css` — do NOT run Tailwind CLI
- Custom styles live in `public/css/elysium.css`
- Page-specific animations live in `public/js/homeAnimations.js`, `public/js/heroCanvas.js`, `public/js/main.js`

## Routes

| Route | Handler in server.js |
|---|---|
| `GET /` | Home page with 6 sections |
| `GET /philosophy` | Philosophy page |
| `GET /artisan-pieces` | Product catalogue |
| `GET /artisan-pieces/:slug` | Product detail |
| `GET /materiality` | Materiality lab |
| `GET /our-story` | Story & provenance |
| `GET /contact` | Contact & enquiry form |
| `GET /privacy-policy` | Privacy policy |
| `GET /terms` | Terms of service |
| `GET /sitemap.xml` | XML sitemap |
| `GET /robots.txt` | Robots file |

## Rules

1. **Never** introduce React, Next.js, TypeScript, or JSX into this project
2. **Never** run Tailwind CLI — the CSS is pre-built static
3. All new pages go in `server.js` as `app.get('/route', ...)` handlers
4. All new styles go in `public/css/elysium.css`
5. All new client-side JS goes in `public/js/` as plain ES6 scripts
6. Data mutations (new products, brand changes) go in the constants section of `server.js`

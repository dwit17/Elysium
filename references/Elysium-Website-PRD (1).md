# Product Requirements Document
## Elysium Home Decor — Website Redesign

| | |
|---|---|
| **Domain** | https://elysiumhomedecor.in/ |
| **Status** | v0.1 Draft — pending client confirmation on items flagged 🔶 |
| **Stack** | Next.js (App Router) + TypeScript, React |
| **Business Model** | Enquiry-based (no online checkout) — WhatsApp / contact form |
| **Prepared** | Sept 2026 |

---

## 1. Overview

Elysium is being rebuilt from scratch as a clean, animation-forward, minimalist showcase for artisan home decor, targeting buyers in **India and internationally**. The current site (elysiumhomedecor.in) renders almost entirely client-side with no server-rendered content — meaning search engines currently see close to a blank page. This is treated as the single biggest problem the rebuild must solve, and is the main reason Next.js (with SSR/SSG) is the right choice.

The new site is not a transactional store. It's a **digital showroom**: every piece is presented with editorial-quality photography and copy, and the conversion action throughout is **"Enquire"** — via WhatsApp or a contact form — rather than "Add to Cart."

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Fix crawlability | 100% of pages server-rendered and indexed in Google Search Console within 30 days of launch |
| Grow organic visibility (India + international) | Ranking movement on target keyword clusters (see §11.2), tracked monthly |
| Convert visitors into enquiries | Enquiry form / WhatsApp click-through rate per session |
| Fast, smooth experience on all devices | Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms (mobile) |
| Build topical authority | Referring domains / backlinks growth quarter-over-quarter |
| Clean brand perception | Qualitative: bounce rate on entry pages, average scroll depth |

---

## 3. Target Audience

🔶 *Personas below are a reasonable starting point based on your brief — confirm or adjust.*

1. **Urban Indian home-owner/renter (28–45)** — furnishing or refreshing a home, values handmade/heritage craft over mass-market decor, discovers via Instagram/Pinterest/search.
2. **International buyer (NRI or global design-conscious shopper)** — searching for authentic Indian artisan pieces, cares about story/provenance and sustainable sourcing, converts via email/WhatsApp rather than local marketplaces.
3. **Interior designers / stylists (secondary, India + abroad)** — sourcing distinctive pieces for client projects, likely to reach out for bulk/trade enquiries.

Competing/reference brands in this space (Baaya Design, Gaatha, Studio Coppre, Rangsutra, Fabindia) all lean heavily on **artisan story, material/craft heritage, and sustainability** as their content pillars — which lines up well with your Philosophy / Artisan Pieces / Materiality / Our Story structure.

---

## 4. Scope

**In scope**
- Marketing/showcase website, 6–7 pages (see §5)
- Enquiry flows: WhatsApp deep-link + contact form (no payments)
- Full SEO foundation: technical, on-page/content, structured data, llms.txt
- Animation system for scroll-based reveals and full-screen sections
- Fully responsive, no overlap/cut-off on any breakpoint

**Out of scope (this phase)**
- Cart, checkout, payment gateway, user accounts
- Multi-currency / multi-language content
- Inventory management

---

## 5. Sitemap & Information Architecture

| Page | URL | Status |
|---|---|---|
| Home | `/` | Confirmed |
| Philosophy | `/philosophy` | Confirmed |
| Artisan Pieces | `/artisan-pieces` (+ `/artisan-pieces/[slug]` detail pages) | Confirmed page; 🔶 individual piece pages recommended for SEO — see §7.3 |
| Materiality | `/materiality` | Confirmed |
| Our Story | `/our-story` | Confirmed |
| Contact | `/contact` | 🔶 Recommended addition — not in your original 4, but needed as a clear enquiry destination |
| Journal (blog) | `/journal/[slug]` | 🔶 Recommended addition — primary engine for content SEO & backlinks (see §11.3). Can be phase 2 if you want to launch lean first. |
| Legal | `/privacy-policy`, `/terms` | 🔶 Recommended, footer-only, minimal design (doesn't need the 100vh treatment) |

Global elements: sticky/minimal nav (logo + page links + "Enquire" button), footer (see §7.7).

---

## 6. Design System

### 6.1 Color

Using your palette exactly as given — three tones, no added accent color, keeping it strictly monochrome per brief:

| Token | Hex | Usage |
|---|---|---|
| `--color-ink` | `#000000` | Primary text, headlines, nav on light backgrounds |
| `--color-mist` | `#ececec` | Alternate section backgrounds, card surfaces, dividers |
| `--color-paper` | `#ffffff` | Base background, text/icons on dark sections |

🔶 No hex was given for "black" itself, so this uses true `#000000`. If your logo actually uses a softer black (e.g. `#0A0A0A`), send the exact value — it's a one-line token change everywhere.

Sections alternate `--color-paper` and `--color-mist` backgrounds to create rhythm without introducing new colors, with ink-on-paper or paper-on-ink text depending on the section.

### 6.2 Typography

- **Family:** Neue Haas Grotesk (Adobe Fonts / Typekit — confirmed licensed)
- **Headings:** Medium (500)
- **Body:** Regular (400)
- Only these two weights are used anywhere, in line with the minimalist brief — hierarchy comes from size, spacing, and color, not extra weights.
- Responsive type scale using `clamp()` so headline size scales smoothly between mobile and desktop instead of jumping at breakpoints.
- Generous line-height on body copy (1.5–1.6) and tight, confident tracking on large display headings (common in premium minimalist sites).

### 6.3 Spacing & Layout

- Max content width: 1440px, with fluid side margins (6–8vw) so content never touches the viewport edge on any device.
- Consistent vertical clearance (~8–10vh) from the top/bottom of each full-screen section, so headline and CTA never crowd the viewport edge.
- 12-column responsive grid for desktop, collapsing to single/two-column stacks on tablet and mobile.

### 6.4 Motion

- Library: Framer Motion (pairs natively with Next.js/React).
- Scroll-triggered reveals (fade + slight upward slide) for headings, images, and CTAs as each section enters view.
- Subtle image parallax/scale-on-scroll for hero and gallery imagery.
- Page transitions between routes (soft fade/slide) rather than hard reloads.
- **Accessibility:** all motion respects `prefers-reduced-motion`; nothing essential to understanding the page is conveyed by animation alone.

---

## 7. Page-by-Page Requirements

### 7.1 The full-screen section pattern

Every content section is built as a **Full-Bleed Section** component:
- Height: `100dvh` (dynamic viewport height, not plain `vh`) — this is important on mobile, where `100vh` miscalculates because of the browser's address bar showing/hiding. `dvh` prevents content being cut off or leaving dead space on phones.
- Content is vertically and horizontally centered within a max-width container, with the ~8–10vh top/bottom clearance from §6.3.
- Scroll-snap (`scroll-snap-type: y mandatory` on the page, `scroll-snap-align: start` per section) so each scroll gesture settles cleanly on the next section — this is what gives the "one section, then the next on scroll" feel you described.
- A small scroll-cue indicator at the bottom of each section (except the last) hints that more content follows.

🔶 **One deviation worth flagging:** the *Artisan Pieces* page is a browsable catalog, not a linear story. Forcing a full product grid into exactly one 100vh screen either makes pieces too small to appreciate, or hides most of the catalog. Recommended approach: keep the **hero intro** as a strict 100dvh section, then let the **grid itself scroll normally** (not snapped) within its own section, styled as an editorial gallery — large imagery, generous spacing, same clean aesthetic, just not artificially clipped to one screen. Let me know if you'd rather keep the strict rule here and instead show pieces as full-screen "one piece at a time" slides.

### 7.2 Home (`/`)
1. Hero — full-bleed brand statement/visual + subtle entrance animation, primary "Enquire" CTA
2. Philosophy teaser — one line distilling the brand ethos, links to `/philosophy`
3. Featured Artisan Pieces — 3–4 hero pieces, links to `/artisan-pieces`
4. Our Story teaser — short founder/brand note, links to `/our-story`
5. Footer (§7.7)

### 7.3 Philosophy (`/philosophy`)
1. Hero — the core philosophy statement, large type, minimal imagery
2. Value pillars (1–2 sections) — e.g. craftsmanship, restraint, longevity — each full-bleed
3. Footer

### 7.4 Artisan Pieces (`/artisan-pieces`)
1. Hero — collection intro
2. Gallery (scrolling grid, see §7.1 deviation) — grouped by category (e.g. lighting, textiles, ceramics, wall art — 🔶 confirm your actual categories)
3. Each piece links to its own detail page `/artisan-pieces/[slug]` — recommended even without checkout, since individual, indexable product pages are what actually rank in Google/Pinterest image search for long-tail searches like "handwoven brass wall hanging India"
4. Every piece detail page ends in a clear **"Enquire about this piece"** CTA (WhatsApp deep link pre-filled with the piece name + a contact-form fallback)
5. Footer

### 7.5 Materiality (`/materiality`)
1. Hero — materials/craft philosophy
2. Material deep-dives (2–3 full-bleed sections) — wood, metal, textile, etc., with texture-forward photography and sourcing/sustainability notes
3. Footer

### 7.6 Our Story (`/our-story`)
1. Hero — founding story opener
2. Timeline / milestones (1–2 sections)
3. Artisan partners / mission section
4. Footer

### 7.7 Footer (all pages)
- Its own full `100dvh` "screen" — scroll-snapped like a section, so it's never partially visible alongside page content.
- Content is centered (not left-aligned like a typical footer): sitemap links, contact details, WhatsApp/social links, newsletter signup, copyright — arranged as a centered column or centered multi-column grid depending on viewport width.
- Nothing else renders below it — it is the definitive end of the scroll.

### 7.8 Contact (`/contact`)
1. Hero — enquiry form + WhatsApp CTA + email/phone, address if you have a physical studio/showroom
2. Footer directly after (short page, by design)

---

## 8. Enquiry Flow (in place of checkout)

Since there's no cart, "Enquire" is the single most important interaction on the site:
- Primary path: WhatsApp click-to-chat link (`wa.me/<number>?text=...`), pre-filled with the piece name/URL so you receive context automatically.
- Fallback path: lightweight contact form (name, email, message, optional piece reference) — important for international visitors who may not use WhatsApp as their default.
- Every enquiry point should also silently log to analytics as a conversion event, so you can measure what's actually driving interest even without sales data.

🔶 Need your WhatsApp Business number and preferred enquiry email to wire this up.

---

## 9. Responsive & Accessibility Requirements

- Breakpoints: mobile (≤480px), large mobile/small tablet (481–768px), tablet (769–1024px), desktop (1025–1439px), large desktop (≥1440px).
- No fixed pixel heights on text containers — content reflows and never clips, even with longer copy or translated text later.
- Images use responsive `srcset`/`next/image` so large hero art doesn't overflow smaller screens.
- Full-bleed sections tested specifically on iOS Safari and Chrome Android, where address-bar collapse most commonly breaks `100vh` layouts — this is exactly why `dvh` units are used from the start.
- WCAG AA color contrast maintained (black-on-white and black-on-mist both pass easily; verify any text placed directly over photography).
- All interactive elements (nav, CTAs, form fields) keyboard-navigable and screen-reader labeled.

---

## 10. Technical Architecture

- **Framework:** Next.js (App Router), TypeScript, React
- **Rendering:** SSG for mostly-static pages (Philosophy, Materiality, Our Story), ISR for Artisan Pieces so new pieces can be added without a full redeploy
- **Hosting:** Vercel recommended (native Next.js support, image optimization, edge caching) — alternative: Netlify if preferred
- **Forms:** serverless route or a form service (e.g. Resend/Formspree) emailing enquiries directly to you
- **Fonts:** Neue Haas Grotesk loaded via Adobe Fonts/Typekit, using `next/font` where possible to avoid layout shift
- **Analytics:** GA4 + Google Search Console (mandatory), Meta Pixel if you plan paid social, Microsoft Clarity (free) for scroll/heatmap insight — useful given the full-screen scroll format is unconventional and worth watching closely post-launch
- **Image pipeline:** `next/image` with modern formats (AVIF/WebP), since photography quality is central to this brand

---

## 11. SEO Strategy

### 11.1 Technical SEO
- Full SSR/SSG output — this alone fixes the current site's core problem (nothing indexable today)
- Auto-generated `sitemap.xml` and `robots.txt`
- Canonical tags on every page pointing to `https://elysiumhomedecor.in/...` (no trailing-slash inconsistencies, no `www` vs non-`www` duplication)
- Structured data (JSON-LD): `Organization` (with logo, sameAs links to your social profiles), `Product` per artisan piece (without price/offers since there's no checkout — using it purely for rich image/product search eligibility), `BreadcrumbList`, `LocalBusiness` if you have a physical address (helps Google Business Profile alignment)
- Clean, descriptive URLs (`/artisan-pieces/handwoven-brass-wall-panel`, not IDs)
- Core Web Vitals treated as a launch blocker, not a nice-to-have

### 11.2 Content SEO — starting keyword clusters
🔶 Directional starting point based on your positioning and the competitive landscape (Baaya Design, Gaatha, Rare Planet, Fabindia, etc. all target similar terms) — validate/refine with real keyword tool data during execution:
- Brand/category: *artisan home decor India*, *handcrafted home decor online*, *minimalist artisan decor*
- Craft/heritage angle: *handmade Indian home decor*, *artisan-made decor pieces*
- Material-led: *sustainable home decor materials*, *[material] home decor India* (e.g. brass, teak, terracotta — depends on your actual product mix)
- International intent: *authentic Indian artisan decor*, *handcrafted decor shipped internationally*

Each page needs a single unique H1, a logical H2/H3 hierarchy under it, and internal links between related pages (e.g. an Artisan Piece links to its Material page and a relevant Journal post).

### 11.3 Authority & Backlink Strategy
Backlinks aren't something that gets "coded" into the site — they come from ongoing outreach. What the site build *can* do is make that outreach effective:
- A **Journal/blog** (§5) built around craft stories, material guides, and styling content — this is the actual link-bait; design publications and bloggers link to well-researched content, not homepages.
- A simple **press/media page** with your brand story, high-res logo/imagery, and a contact — makes it easy for journalists to feature you.
- Consistent NAP (name/address/phone) across Google Business Profile and any directories, supporting local authority in India.
- Outreach targets worth pursuing post-launch: AD India, Elle Decor India, Houzz India, design-focused Instagram/blog features, and craft/heritage angle pitches (your artisan story is genuinely more compelling to press than a typical decor retailer).
- This is a recurring, month-over-month activity — flagging so it's not expected to be "done" at launch.

### 11.4 `llms.txt`
Building this as two files, following the emerging (still informal, not universally adopted, but low-cost and worth doing) convention:
- **`/llms.txt`** — concise: site name, one-line summary, then linked sections (Philosophy, Artisan Pieces, Materiality, Our Story, Contact) each with a one-line description, so an LLM can quickly navigate.
- **`/llms-full.txt`** — comprehensive: full brand story, philosophy statement, complete materials/sourcing detail, artisan piece descriptions, and enquiry process, all as clean plain-text/markdown — this is the "so much detailed content" version.

### 11.5 Metadata (draft — first pass)

| Page | Title tag (draft) | Meta description (draft) |
|---|---|---|
| Home | Elysium \| Artisan Minimalist Home Decor, Handcrafted in India | Discover Elysium's artisan-made home decor — handcrafted in India, curated for homes worldwide. Explore the collection and enquire today. |
| Philosophy | Our Philosophy \| Elysium Home Decor | Restraint, craftsmanship, and longevity — the philosophy behind every Elysium piece. |
| Artisan Pieces | Artisan Pieces \| Handcrafted Home Decor Collection | Browse Elysium's curated collection of handcrafted home decor, made by skilled artisans across India. |
| Materiality | Materiality \| Sustainable Craft & Materials \| Elysium | The materials and sourcing philosophy behind Elysium's artisan home decor — honest, sustainable, built to last. |
| Our Story | Our Story \| The Elysium Journey | How Elysium started, and the artisan partners behind every piece in the collection. |
| Contact | Contact Elysium \| Enquire About Artisan Home Decor | Get in touch with Elysium to enquire about our handcrafted home decor collection, in India or internationally. |

🔶 These are a first draft to lock structure/length — final copy should be refined once real content and keyword validation are in.

### 11.6 Starter `seo.ts` shape

For reference when development starts — a typed metadata config the codebase can build from:

```typescript
// lib/seo.ts
export type PageSeo = {
  title: string;
  description: string;
  path: string; // canonical path, e.g. "/philosophy"
};

export const SITE_URL = "https://elysiumhomedecor.in";

export const pageSeo: Record<string, PageSeo> = {
  home: {
    title: "Elysium | Artisan Minimalist Home Decor, Handcrafted in India",
    description:
      "Discover Elysium's artisan-made home decor — handcrafted in India, curated for homes worldwide.",
    path: "/",
  },
  philosophy: {
    title: "Our Philosophy | Elysium Home Decor",
    description:
      "Restraint, craftsmanship, and longevity — the philosophy behind every Elysium piece.",
    path: "/philosophy",
  },
  // ...artisanPieces, materiality, ourStory, contact, journal
};

export function canonicalUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
```

Each Next.js page would export its `metadata` (or `generateMetadata` for dynamic Artisan Piece pages) from this config, keeping titles/descriptions centrally managed rather than scattered per file.

---

## 12. Content & Assets Needed From You

🔶 Still outstanding — needed before design/build can start in earnest:
- Screenshots and/or text content from the current site (nav labels, product categories, About/Story copy) — the automated fetch of elysiumhomedecor.in returned no readable content, so this has to come from you directly
- Logo files (vector, if available) to confirm exact black/usage
- Product/artisan piece list with photography, names, short descriptions, and category groupings
- WhatsApp Business number + enquiry email
- Any existing brand guidelines beyond what's in this brief

---

## 13. Open Items Needing Your Confirmation

- [ ] Confirm sitemap: keep Contact and Journal as recommended, or trim back?
- [ ] Confirm Artisan Pieces catalog approach (scrolling gallery vs. strict full-screen slides — §7.1)
- [ ] Confirm exact black hex if different from `#000000`
- [ ] Confirm artisan piece categories
- [ ] Provide WhatsApp number / enquiry email
- [ ] Confirm hosting preference (Vercel recommended) and who manages DNS for elysiumhomedecor.in

---

## 14. Phased Plan

1. **Content & assets** — gather copy, photography, product list (§12)
2. **Design** — full visual design in Figma covering every section above, reviewed before build starts
3. **Build** — Next.js implementation, section by section
4. **SEO & QA** — structured data, metadata, cross-device testing of the full-bleed/scroll-snap behavior, Core Web Vitals pass
5. **Launch** — DNS cutover, Search Console submission, sitemap ping
6. **Post-launch** — Journal content cadence, backlink/PR outreach begins

---

## 15. Future Phases (not in this build)
- Online checkout, if the business model shifts to direct sales
- Multi-language / multi-currency
- Wholesale/trade portal (relevant given competitors like Faire operate in this space)

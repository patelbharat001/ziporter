# Ziporter Website Rebuild — Design Spec

Date: 2026-08-26
Status: Approved for planning

## 1. Goal

Replace the current placeholder dark-theme landing page with a premium,
enterprise-grade, conversion-focused corporate website for Ziporter — a B2B
courier aggregation / logistics platform for Indian businesses. Full
multi-page rebuild: new design system, new component library, ~16 routes,
all-new original copy and visuals. Shiprocket/Shipmozo are functional
reference only — no copied text, stats, illustrations, or UI.

Full content requirements (section-by-section homepage copy, page list, form
fields, FAQ questions, etc.) are as specified in the originating conversation
brief; this document captures the structural, technical, and design-system
decisions needed to plan and build it, plus the points where the brief left
room for a design call.

## 2. Constraints (from the existing codebase)

- **Next.js 16.3.2**: async `params` / `searchParams` (`Promise<...>`),
  global `PageProps<'/route'>` / `LayoutProps<'/route'>` helper types (no
  manual param interfaces), file-based metadata (`sitemap.ts`, `robots.ts`).
- **`output: "export"`** (`next.config.ts`), deployed to GitHub Pages under
  `basePath: "/ziporter"`. Consequences:
  - No server actions, no dynamic (POST/stateful) route handlers, no
    runtime `fetch` for page data — everything is static HTML at build time.
  - The demo-request form and shipment tracker are **client components**
    with local mock logic only (in-memory/local-state, `setTimeout` to
    simulate latency, lookups against a small local mock dataset). No real
    network calls.
  - `images: { unoptimized: true }` — `next/image` works but does no
    server-side optimization; fine for local SVG/raster assets.
  - Routes are plain static folders, not `[slug]` dynamic segments — the
    small fixed set of solution sub-pages doesn't need
    `generateStaticParams` machinery.
- Existing stack to keep: `@base-ui/react` (headless primitives),
  `class-variance-authority` + `tailwind-merge` (variant styling),
  `framer-motion` (motion), `lucide-react` (icons), Tailwind v4 with the
  shadcn `base-nova` oklch token architecture already wired into
  `globals.css`. No new dependencies needed for this project.

## 3. Design System

### 3.1 Color tokens

Retheme `src/app/globals.css` in place — same CSS variable architecture
(`--background`, `--primary`, `--card`, etc. under `:root` /
`@theme inline`), new oklch values. Single light theme only (see §3.4) —
no dark-mode toggle.

| Token | Role | Approx. value |
|---|---|---|
| `--background` | page bg | near-white, cool cast |
| `--foreground` | body text | deep navy-black |
| `--primary` | brand navy — headers, nav, primary buttons | deep logistics navy (`oklch(0.28 0.06 260)`) |
| `--primary-foreground` | text on primary | near-white |
| `--accent` | electric blue — links, active states, chart accents | `oklch(0.62 0.19 258)` |
| `--secondary` | teal — secondary accents, icon fills | `oklch(0.66 0.11 195)` |
| `--success` (new token) | delivered/success states | `oklch(0.68 0.15 150)` |
| `--muted` / `--muted-foreground` | soft blue-gray section backgrounds, secondary text | cool light gray |
| `--card` | card surfaces | white, 1px hairline `--border` |
| `--destructive` | error/exception states (NDR, RTO) | existing red, unchanged |

`--success` is a genuinely new token (not in the current file) — add it
alongside the existing shadcn set and wire it through `@theme inline` the
same way the others are.

### 3.2 Typography

Switch from Geist to **Manrope** (headings — geometric, confident, distinct
from generic SaaS Inter-everywhere look) + **Inter** (body/UI text —
proven readability at small sizes for dense dashboard data). Both via
`next/font/google` in `layout.tsx`, replacing the current Geist Sans/Mono
setup. Monospace (`--font-mono`) kept for the API code-preview card only —
Geist Mono is fine to retain for that narrow use.

### 3.3 Logo / brand mark

No existing logo asset — design an original one: a wordmark ("Ziporter" in
Manrope semibold) paired with a simple geometric mark — two offset chevrons
forming a forward-motion "zip" arrow, navy-to-electric-blue gradient. Built
as an inline SVG component (`src/components/logo.tsx`), not a raster file,
so it scales and recolors (e.g. white-on-navy in the footer) without extra
assets.

### 3.4 Background art system

"Prepare background images wherever needed" — since this is a fully static
site with no image-generation pipeline, these are **hand-authored original
SVG assets**, not photos, matching the brief's "original abstract visuals,
not stock-heavy" direction. Stored in `public/images/`:

- `grid-dots.svg` — low-opacity navy dot-grid, tileable, used behind the
  hero and other light sections for texture.
- `route-lines.svg` — abstract curved shipment-route lines with node
  markers (pickup/warehouse/delivery dots), used in the hero dashboard
  mockup map panel and as a faint full-bleed background on the Enterprise
  Workflow and Final CTA sections.
- `warehouse-grid.svg` — abstract warehouse/rack grid pattern, low opacity,
  used behind the Industries and Analytics sections for variety.
- `blob-navy.svg` / `blob-teal.svg` — soft abstract gradient blobs for
  depth behind CTA banners (Final CTA, Request Demo hero), placed absolute
  + blurred, respecting `prefers-reduced-motion` (static either way, these
  aren't animated).

These are referenced via plain `<img>`/`next/image` `src="/images/...svg"`
(basePath-relative, no import needed) or inlined directly where they need
currentColor theming (e.g. the logo). Section components that use one
background asset should accept no props for it — the asset choice is a
layout decision baked into the section, not configurable.

### 3.5 Cards, motion, layout

Rounded-2xl cards, soft shadow (`shadow-sm`/`shadow-md` on hover), 1px
hairline border, generous whitespace, alternating white / soft-blue-gray
section backgrounds for rhythm. `framer-motion` for: number counters
(stat cards), dashboard card stagger-in on scroll, gentle route-line
dash-offset animation, hover lift on cards — all gated behind
`useReducedMotion()` from framer-motion, degrading to instant/static.

## 4. Content & Configuration Architecture

Per your instruction, editable content lives in **JSON**, not hardcoded in
components — so nav links, contact details, CTAs, placeholder stats, FAQ
copy, industries, solutions, integrations, and testimonials can all be
changed later without touching component code.

```
src/config/
  site.json          # brand name, tagline, CTA labels, contact (email/phone
                      # placeholders), social links, nav menu items, footer
                      # column structure, placeholder stats (carrier count,
                      # pincode count use "XX+"/"XX,XXX+" literally per brief)
src/data/
  solutions.json
  industries.json
  integrations.json
  faq.json
  testimonials.json
  allocation-criteria.json   # the 10 decision-criteria chips in §5 workflow
  workflow-steps.json        # the 9-step enterprise workflow
  dashboard-metrics.json     # sample numbers for hero + dashboard mockups
  tracking-mock.json         # 2-3 mock AWBs with full status timelines
```

Each JSON file has a hand-written TypeScript type in
`src/lib/content-types.ts` (e.g. `Solution`, `Industry`, `FaqItem`) and a
thin typed loader in `src/lib/content.ts`
(`import raw from "@/data/solutions.json"; export const solutions = raw as Solution[];`)
so components consume typed data, not raw `any`. This is the "CMS-ready
structure" called for in the brief — swapping JSON for a real CMS fetch
later only touches `content.ts`.

Site-wide chrome (`Nav`, `Footer`) reads from `site.json` directly.
Page/section components read from the relevant `data/*.json` via
`content.ts`.

## 5. Sitemap

Static folders under `src/app/`:

```
/                          home
/solutions                 solutions hub (card grid, all 6)
/solutions/domestic-shipping
/solutions/b2b-logistics
/solutions/reverse-logistics
/solutions/hyperlocal
/solutions/international-shipping
/industries
/integrations
/api                        API docs marketing page (not real API docs)
/enterprise-dashboard       dashboard mockup showcase page
/track                      shipment tracking tool
/resources                  resource hub (placeholder listing)
/about
/contact
/request-demo               lead form
/login                      static stub (form UI only, no auth)
```

Each route gets its own `page.tsx` with a static `metadata` export
(title/description/OG), and sub-pages under `/solutions/*` render a
shared `BreadcrumbList` JSON-LD + a common page shell (hero + outcomes +
CTA) fed by that solution's entry in `solutions.json`.

## 6. Component Architecture

```
src/components/
  logo.tsx
  nav.tsx                  sticky, dropdown for Solutions/Industries,
                            mobile hamburger with CTA pinned at bottom
  footer.tsx                6-column, from site.json
  ui/                       existing base-ui-backed primitives (button.tsx
                            kept + extended); add: card.tsx, badge.tsx,
                            input.tsx, select.tsx, checkbox.tsx (request-demo
                            form needs real form controls, none exist yet)
  shared/
    section.tsx             consistent max-width/padding wrapper
    stat-card.tsx            animated counter card
    dashboard-mockup.tsx     the reusable "logistics dashboard" visual —
                              parameterized by which metrics/panels to show,
                              reused in Hero, Operations Dashboard section,
                              and /enterprise-dashboard page
    route-map.tsx            SVG route/node visual wrapper around
                              route-lines.svg
    process-steps.tsx        numbered horizontal/vertical step flow, used by
                              both the allocation workflow and the 9-step
                              enterprise workflow section
    json-ld.tsx               small helper to inject JSON-LD <script> tags
  sections/                  one component per homepage section (hero,
                              trust-strip, value-props, solutions-grid,
                              allocation-engine, operations-dashboard,
                              integrations, industries, workflow, analytics,
                              why-ziporter, testimonials, faq, final-cta) —
                              composed in src/app/page.tsx
```

`shape-landing-hero.tsx`, and the current `carriers.tsx` / `cta.tsx` /
`stats.tsx` / etc. placeholder section components are removed/replaced by
the above — nothing from the current dark-theme build is salvageable
as-is, though the removal itself is just deleting superseded files, not a
refactor of code we're keeping.

## 7. Interactive Pieces (static-export-safe)

- **`/request-demo`**: client component form (fields per brief: name, work
  email, mobile, company name, company website, business type, monthly
  volume, shipment types [multi-select], current challenge [textarea],
  preferred demo time, consent checkbox). Inline validation (required
  fields, email format). On submit: local state transition to a
  "Thank you — our logistics specialist will contact you shortly" success
  panel, after a simulated short delay. No data leaves the browser.
- **`/track`**: client component. AWB input + Track button → looks up
  against `tracking-mock.json` (2-3 sample AWBs covering Delivered,
  In-Transit, and Exception/RTO cases, plus a "not found" case for anything
  else) → renders a status timeline (Booked → Picked Up → In Transit → Out
  for Delivery → Delivered / Exception / RTO Initiated), a shipment-details
  card, address shown masked (e.g. "H.No. 4**, ***** Nagar, Pune - 4110**"),
  and a help/escalation CTA.

## 8. SEO / Schema / Metadata

- Per-page static `metadata` export (title, description, OG tags) — every
  route listed in §5.
- `src/app/sitemap.ts` and `src/app/robots.ts` (Next 16 file conventions),
  aware of `basePath`.
- `json-ld.tsx` used to inject: `Organization` (root layout, once),
  `SoftwareApplication` (homepage), `FAQPage` (FAQ section, generated from
  `faq.json`), `BreadcrumbList` (all sub-pages, generated from route
  segments).

## 9. Out of scope (explicitly, per brief)

No real payments, carrier APIs, or authentication. `/login` is a static
form shell. `/api` is a marketing page, not live API docs. No CMS backend —
JSON files are the content layer for this prototype.

# Ziporter Foundation, Design System & Homepage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme the app to the new Ziporter design system, build the JSON-driven content architecture, build the shared/ui component library, and ship a complete new homepage (nav, footer, 14 sections), replacing every dark-theme placeholder component currently in the repo.

**Architecture:** Static Next.js 16 App Router site (`output: "export"`). Content lives in `src/config/site.json` + `src/data/*.json`, typed via `src/lib/content-types.ts` and re-exported via `src/lib/content.ts`. Visual design system is CSS custom properties in `globals.css` (shadcn `base-nova` token architecture, retheme in place). Components are three layers: `ui/` (headless primitives, `@base-ui/react` + `cva`), `shared/` (composed, reusable across pages — dashboard mockup, section wrapper, stat card, process steps, route map, JSON-LD), `sections/` (one per homepage section, page-specific, composed in `src/app/page.tsx`).

**Tech Stack:** Next.js 16.3.2, React 19.2.8, TypeScript 5 (strict), Tailwind CSS v4, `@base-ui/react`, `class-variance-authority`, `tailwind-merge`, `framer-motion`, `lucide-react`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-26-ziporter-rebuild-design.md`

## Global Constraints

- `output: "export"` — no server actions, no runtime `fetch`, no dynamic route handlers. Everything renders at build time; any interactivity is a Client Component with local state only.
- `basePath: "/ziporter"`, `assetPrefix: "/ziporter"`, `trailingSlash: true`, `images: { unoptimized: true }` (`next.config.ts`, unchanged). Internal links use Next `Link`/root-relative paths (Next rewrites these under `basePath` automatically) — never hardcode `/ziporter/...` in source.
- No copied text, stats, illustrations, or UI from Shiprocket/Shipmozo. No unverifiable stats — use the literal placeholder tokens defined in Task 4 (`XX+`, `XX,XXX+`, etc.), never invented precise numbers.
- No real backend/payments/carrier APIs/auth. All data is local JSON.
- **No test framework exists in this repo** (no jest/vitest/testing-library in `package.json`) and the spec forbids adding new dependencies. Per-task verification is therefore: `npx tsc --noEmit`, `npm run lint`, `npm run build` (full static export must succeed), plus a manual check in the dev server (`npm run dev`) described concretely in each task — not unit tests. This is a deliberate adaptation of the standard TDD task loop to a content-driven static site with no test runner.
- Single light theme only — no dark-mode toggle.
- Path alias `@/*` → `./src/*` (already configured in `tsconfig.json`).
- Manrope = headings/display, Inter = body/UI text, Geist Mono = code/API preview only.
- Tailwind v4 + shadcn `base-nova`: styling is via `@theme inline` CSS vars already wired in `globals.css` (`bg-background`, `text-primary`, `rounded-2xl`, etc.) — new tokens must be added the same way (`--foo` in `:root`, mapped via `--color-foo: var(--foo)` in `@theme inline`).

---

## File Structure

```
src/app/globals.css                 MODIFY — retheme
src/app/layout.tsx                  MODIFY — fonts, metadata, Organization JSON-LD
src/app/page.tsx                    MODIFY — compose new homepage

src/components/logo.tsx             CREATE
src/components/nav.tsx              MODIFY (full rewrite)
src/components/footer.tsx           MODIFY (full rewrite)

src/components/ui/card.tsx          CREATE
src/components/ui/badge.tsx         CREATE
src/components/ui/input.tsx         CREATE
src/components/ui/textarea.tsx      CREATE
src/components/ui/select.tsx        CREATE
src/components/ui/checkbox.tsx      CREATE

src/components/shared/section.tsx           CREATE
src/components/shared/stat-card.tsx         CREATE
src/components/shared/dashboard-mockup.tsx  CREATE
src/components/shared/route-map.tsx         CREATE
src/components/shared/process-steps.tsx     CREATE
src/components/shared/json-ld.tsx           CREATE

src/components/sections/hero.tsx                CREATE
src/components/sections/trust-strip.tsx         CREATE
src/components/sections/value-props.tsx         CREATE
src/components/sections/solutions-grid.tsx      CREATE
src/components/sections/allocation-engine.tsx   CREATE
src/components/sections/operations-dashboard.tsx CREATE
src/components/sections/integrations.tsx        CREATE
src/components/sections/industries.tsx          CREATE
src/components/sections/workflow.tsx            CREATE
src/components/sections/analytics.tsx           CREATE
src/components/sections/why-ziporter.tsx        CREATE
src/components/sections/testimonials.tsx        CREATE
src/components/sections/faq.tsx                 CREATE
src/components/sections/final-cta.tsx           CREATE

src/lib/content-types.ts            CREATE
src/lib/content.ts                  CREATE

src/config/site.json                CREATE
src/data/solutions.json             CREATE
src/data/industries.json            CREATE
src/data/integrations.json          CREATE
src/data/faq.json                   CREATE
src/data/testimonials.json          CREATE
src/data/allocation-criteria.json   CREATE
src/data/workflow-steps.json        CREATE
src/data/dashboard-metrics.json     CREATE

public/images/grid-dots.svg         CREATE
public/images/route-lines.svg       CREATE
public/images/warehouse-grid.svg    CREATE
public/images/blob-navy.svg         CREATE
public/images/blob-teal.svg         CREATE

DELETE: src/components/ui/shape-landing-hero.tsx
DELETE: src/components/carriers.tsx
DELETE: src/components/cta.tsx
DELETE: src/components/faq.tsx
DELETE: src/components/features.tsx
DELETE: src/components/howitworks.tsx
DELETE: src/components/newsletter.tsx
DELETE: src/components/stats.tsx
DELETE: src/components/testimonials.tsx
DELETE: src/components/tracking.tsx
```

---

### Task 1: Retheme `globals.css`

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS custom properties consumed by every component via Tailwind utility classes (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `bg-accent`, `text-accent-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-success`/`text-success` (new), `bg-muted`, `text-muted-foreground`, `bg-card`, `border-border`, `bg-destructive`, `--radius-2xl`).

- [ ] **Step 1: Replace the `:root` block's color values**

In `src/app/globals.css`, replace the `:root { ... }` block (lines 51-84) with:

```css
:root {
  --background: oklch(0.99 0.003 240);
  --foreground: oklch(0.22 0.03 260);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.03 260);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.03 260);
  --primary: oklch(0.28 0.06 260);
  --primary-foreground: oklch(0.98 0.003 240);
  --secondary: oklch(0.66 0.11 195);
  --secondary-foreground: oklch(0.16 0.03 230);
  --muted: oklch(0.96 0.008 240);
  --muted-foreground: oklch(0.45 0.02 255);
  --accent: oklch(0.62 0.19 258);
  --accent-foreground: oklch(0.98 0.003 240);
  --success: oklch(0.68 0.15 150);
  --success-foreground: oklch(0.16 0.05 150);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.9 0.01 250);
  --input: oklch(0.9 0.01 250);
  --ring: oklch(0.62 0.19 258);
  --chart-1: oklch(0.62 0.19 258);
  --chart-2: oklch(0.66 0.11 195);
  --chart-3: oklch(0.68 0.15 150);
  --chart-4: oklch(0.28 0.06 260);
  --chart-5: oklch(0.75 0.15 80);
  --radius: 0.75rem;
  --sidebar: oklch(0.98 0.005 240);
  --sidebar-foreground: oklch(0.22 0.03 260);
  --sidebar-primary: oklch(0.28 0.06 260);
  --sidebar-primary-foreground: oklch(0.98 0.003 240);
  --sidebar-accent: oklch(0.96 0.008 240);
  --sidebar-accent-foreground: oklch(0.22 0.03 260);
  --sidebar-border: oklch(0.9 0.01 250);
  --sidebar-ring: oklch(0.62 0.19 258);
}
```

- [ ] **Step 2: Delete the `.dark { ... }` block**

Delete lines 86-118 (`.dark { ... }`) entirely — this project ships one light theme, no dark mode. Also delete the `@custom-variant dark (&:is(.dark *));` line (line 5) since there is no `.dark` class usage anymore.

- [ ] **Step 3: Add the `--success` token to `@theme inline` and fix the font/radius mappings**

In the `@theme inline` block, add two lines near the other color mappings:

```css
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
```

Replace the font lines:

```css
  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-manrope);
```

(Task 2 defines `--font-inter`, `--font-manrope`, `--font-geist-mono` as font-loader CSS vars in `layout.tsx`.)

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit` (should pass, CSS isn't type-checked but this catches nothing broke) and `npm run build`. Build must complete without CSS errors. Since no component references `--success` or the new font vars yet, visual regression isn't checkable until Task 2 — this step is a compile sanity check only.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "style: retheme to Ziporter navy/blue/teal design tokens"
```

---

### Task 2: Fonts, root metadata, and Organization JSON-LD in `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/shared/json-ld.tsx`

**Interfaces:**
- Produces: `JsonLd({ data }: { data: Record<string, unknown> })` component, used by every page that injects structured data (this plan's Task 25 for `SoftwareApplication`, later plans for `BreadcrumbList`/`FAQPage`).

- [ ] **Step 1: Create the JSON-LD helper**

Create `src/components/shared/json-ld.tsx`:

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

- [ ] **Step 2: Rewrite `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Manrope, Inter, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/shared/json-ld";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ziporter — Enterprise Logistics. Simplified.",
    template: "%s | Ziporter",
  },
  description:
    "Ziporter is the courier aggregation platform for Indian enterprises — one API and one dashboard to allocate, ship, track, and reconcile every order across XX+ carriers.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ziporter",
  description:
    "Enterprise courier aggregation and logistics orchestration platform for Indian businesses.",
  url: "https://ziporter.example.com",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
```

Note: `https://ziporter.example.com` is a placeholder domain — there is no real production domain yet. Keep it as a single literal that's easy to grep-replace later (do not scatter the domain string elsewhere; other tasks that need it should read it, but for this static-marketing build, root-relative URLs are used everywhere else so this is the only occurrence in this plan).

- [ ] **Step 3: Verify**

Run `npm run dev`, open `http://localhost:3000/ziporter`. Confirm the page renders (still the old dark hero — untouched until Task 25), and `view-source:` shows a `<script type="application/ld+json">` containing `"@type":"Organization"` in `<head>`... actually it renders in `<body>` before children — confirm it's present anywhere in the HTML via View Source. Confirm headings now render in Manrope and body text in Inter by inspecting computed `font-family` in DevTools on any existing text node.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/components/shared/json-ld.tsx
git commit -m "feat: swap to Manrope/Inter fonts, add Organization JSON-LD"
```

---

### Task 3: Logo component

**Files:**
- Create: `src/components/logo.tsx`

**Interfaces:**
- Produces: `Logo({ variant, className }: { variant?: "default" | "mono-light"; className?: string })` — `variant="default"` renders the navy-to-electric-blue gradient mark for light backgrounds; `variant="mono-light"` renders solid white (for the navy nav-on-scroll or footer).

- [ ] **Step 1: Create `src/components/logo.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function Logo({
  variant = "default",
  className,
}: {
  variant?: "default" | "mono-light";
  className?: string;
}) {
  const mono = variant === "mono-light";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        {!mono && (
          <defs>
            <linearGradient id="ziporter-mark" x1="0" y1="28" x2="28" y2="0">
              <stop offset="0" stopColor="oklch(0.28 0.06 260)" />
              <stop offset="1" stopColor="oklch(0.62 0.19 258)" />
            </linearGradient>
          </defs>
        )}
        <path
          d="M3 8 L15 8 L5 20 L17 20"
          stroke={mono ? "white" : "url(#ziporter-mark)"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M13 8 L25 8 L15 20 L25 20"
          stroke={mono ? "white" : "url(#ziporter-mark)"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.55"
        />
      </svg>
      <span
        className={cn(
          "font-heading text-lg font-bold tracking-tight",
          mono ? "text-white" : "text-primary"
        )}
      >
        Ziporter
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Verify**

Temporarily render `<Logo />` in `src/app/page.tsx` above the existing content, run `npm run dev`, confirm in browser it shows two offset chevrons in a navy-to-blue gradient next to the "Ziporter" wordmark in Manrope bold, then remove the temporary render (page.tsx composition is Task 25's job, not this task's).

- [ ] **Step 3: Commit**

```bash
git add src/components/logo.tsx
git commit -m "feat: add original Ziporter logo component"
```

---

### Task 4: Content types, config, and data JSON files

**Files:**
- Create: `src/lib/content-types.ts`
- Create: `src/lib/content.ts`
- Create: `src/config/site.json`
- Create: `src/data/solutions.json`
- Create: `src/data/industries.json`
- Create: `src/data/integrations.json`
- Create: `src/data/faq.json`
- Create: `src/data/testimonials.json`
- Create: `src/data/allocation-criteria.json`
- Create: `src/data/workflow-steps.json`
- Create: `src/data/dashboard-metrics.json`

**Interfaces:**
- Produces (from `src/lib/content.ts`): `site`, `solutions: Solution[]`, `industries: Industry[]`, `integrations: Integration[]`, `faqs: FaqItem[]`, `testimonials: Testimonial[]`, `allocationCriteria: AllocationCriterion[]`, `workflowSteps: WorkflowStep[]`, `dashboardMetrics: DashboardMetrics` — all typed, imported by every `sections/*` and route component in this and later plans.
- Produces (from `src/lib/content-types.ts`): the named interfaces below, importable independently for prop typing.

- [ ] **Step 1: Write `src/lib/content-types.ts`**

```ts
export interface SiteConfig {
  name: string;
  tagline: string;
  altHeadline: string;
  description: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    tertiary: { label: string; href: string };
  };
  stats: {
    carriers: string;
    pincodes: string;
    uptime: string;
  };
  contact: {
    salesEmail: string;
    supportEmail: string;
    phone: string;
  };
  social: { label: string; href: string }[];
  nav: {
    solutions: { label: string; href: string; description: string }[];
    links: { label: string; href: string }[];
  };
  footer: {
    product: { label: string; href: string }[];
    solutions: { label: string; href: string }[];
    company: { label: string; href: string }[];
    getStarted: { label: string; href: string }[];
  };
}

export interface Solution {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  heroDescription: string;
  outcomes: string[];
  icon: string;
}

export interface Industry {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface Integration {
  name: string;
  category: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  role: string;
  context: string;
}

export interface AllocationCriterion {
  label: string;
  description: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface DashboardMetrics {
  headline: string;
  cards: { label: string; value: string; trend: string }[];
}
```

- [ ] **Step 2: Write `src/lib/content.ts`**

```ts
import siteRaw from "@/config/site.json";
import solutionsRaw from "@/data/solutions.json";
import industriesRaw from "@/data/industries.json";
import integrationsRaw from "@/data/integrations.json";
import faqRaw from "@/data/faq.json";
import testimonialsRaw from "@/data/testimonials.json";
import allocationCriteriaRaw from "@/data/allocation-criteria.json";
import workflowStepsRaw from "@/data/workflow-steps.json";
import dashboardMetricsRaw from "@/data/dashboard-metrics.json";
import type {
  SiteConfig,
  Solution,
  Industry,
  Integration,
  FaqItem,
  Testimonial,
  AllocationCriterion,
  WorkflowStep,
  DashboardMetrics,
} from "@/lib/content-types";

export const site = siteRaw as SiteConfig;
export const solutions = solutionsRaw as Solution[];
export const industries = industriesRaw as Industry[];
export const integrations = integrationsRaw as Integration[];
export const faqs = faqRaw as FaqItem[];
export const testimonials = testimonialsRaw as Testimonial[];
export const allocationCriteria = allocationCriteriaRaw as AllocationCriterion[];
export const workflowSteps = workflowStepsRaw as WorkflowStep[];
export const dashboardMetrics = dashboardMetricsRaw as DashboardMetrics;
```

- [ ] **Step 3: Write `src/config/site.json`**

```json
{
  "name": "Ziporter",
  "tagline": "Enterprise logistics. Simplified.",
  "altHeadline": "One platform to orchestrate every shipment.",
  "description": "Ziporter is the courier aggregation and logistics orchestration platform for Indian enterprises — one API and one dashboard to allocate, ship, track, and reconcile every order.",
  "cta": {
    "primary": { "label": "Talk to a Logistics Expert", "href": "/contact" },
    "secondary": { "label": "Request a Demo", "href": "/request-demo" },
    "tertiary": { "label": "Track Shipment", "href": "/track" }
  },
  "stats": {
    "carriers": "XX+",
    "pincodes": "XX,XXX+",
    "uptime": "99.9%"
  },
  "contact": {
    "salesEmail": "sales@ziporter.example.com",
    "supportEmail": "support@ziporter.example.com",
    "phone": "+91 XXXXX XXXXX"
  },
  "social": [
    { "label": "LinkedIn", "href": "#" },
    { "label": "X", "href": "#" }
  ],
  "nav": {
    "solutions": [
      { "label": "Domestic Shipping", "href": "/solutions/domestic-shipping", "description": "Nationwide courier allocation and delivery" },
      { "label": "B2B Logistics", "href": "/solutions/b2b-logistics", "description": "Bulk and enterprise-to-enterprise freight" },
      { "label": "Reverse Logistics", "href": "/solutions/reverse-logistics", "description": "Returns, exchanges, and pickups" },
      { "label": "Hyperlocal Delivery", "href": "/solutions/hyperlocal", "description": "Same-day and city-level fulfillment" },
      { "label": "International Shipping", "href": "/solutions/international-shipping", "description": "Cross-border courier orchestration" }
    ],
    "links": [
      { "label": "Industries", "href": "/industries" },
      { "label": "Integrations", "href": "/integrations" },
      { "label": "Resources", "href": "/resources" },
      { "label": "About", "href": "/about" }
    ]
  },
  "footer": {
    "product": [
      { "label": "Solutions", "href": "/solutions" },
      { "label": "Industries", "href": "/industries" },
      { "label": "Integrations", "href": "/integrations" },
      { "label": "API", "href": "/api" },
      { "label": "Enterprise Dashboard", "href": "/enterprise-dashboard" }
    ],
    "solutions": [
      { "label": "Domestic Shipping", "href": "/solutions/domestic-shipping" },
      { "label": "B2B Logistics", "href": "/solutions/b2b-logistics" },
      { "label": "Reverse Logistics", "href": "/solutions/reverse-logistics" },
      { "label": "Hyperlocal Delivery", "href": "/solutions/hyperlocal" },
      { "label": "International Shipping", "href": "/solutions/international-shipping" }
    ],
    "company": [
      { "label": "About", "href": "/about" },
      { "label": "Resources", "href": "/resources" },
      { "label": "Contact", "href": "/contact" }
    ],
    "getStarted": [
      { "label": "Request a Demo", "href": "/request-demo" },
      { "label": "Track Shipment", "href": "/track" },
      { "label": "Login", "href": "/login" }
    ]
  }
}
```

- [ ] **Step 4: Write `src/data/solutions.json`**

```json
[
  {
    "slug": "domestic-shipping",
    "name": "Domestic Shipping",
    "shortName": "Domestic",
    "summary": "Nationwide courier allocation across every pincode you sell to.",
    "heroDescription": "Route every domestic order to the carrier that will actually deliver it fastest and cheapest — automatically, at checkout-to-manifest speed.",
    "outcomes": [
      "Lower average cost per shipment through carrier-mix optimization",
      "Fewer failed deliveries via serviceability-aware allocation",
      "Single manifest and pickup workflow across all carriers"
    ],
    "icon": "Truck"
  },
  {
    "slug": "b2b-logistics",
    "name": "B2B Logistics",
    "shortName": "B2B",
    "summary": "Bulk, palletized, and enterprise-to-enterprise freight movement.",
    "heroDescription": "Move bulk orders between warehouses, distributors, and retail partners with the same visibility you expect from parcel shipments.",
    "outcomes": [
      "Consolidated freight booking across LTL and FTL partners",
      "Warehouse-to-warehouse tracking on one timeline",
      "Reconciliation-ready documentation for every consignment"
    ],
    "icon": "Boxes"
  },
  {
    "slug": "reverse-logistics",
    "name": "Reverse Logistics",
    "shortName": "Returns",
    "summary": "Returns, exchanges, and reverse pickups without the manual follow-up.",
    "heroDescription": "Automate reverse pickup scheduling, quality checks, and refund-trigger events so returns stop draining your ops team's time.",
    "outcomes": [
      "Automated reverse pickup scheduling on customer request",
      "Return-reason analytics to reduce repeat RTOs",
      "Faster refund/exchange trigger events for your commerce stack"
    ],
    "icon": "RotateCcw"
  },
  {
    "slug": "hyperlocal",
    "name": "Hyperlocal Delivery",
    "shortName": "Hyperlocal",
    "summary": "Same-day and city-level fulfillment for time-sensitive orders.",
    "heroDescription": "Plug into hyperlocal fleets for same-day and scheduled-slot delivery in metro and tier-1 cities, orchestrated from the same dashboard as your national shipments.",
    "outcomes": [
      "Same-day and slot-based delivery windows",
      "Live rider tracking alongside standard courier shipments",
      "One dashboard for both hyperlocal and national fulfillment"
    ],
    "icon": "Zap"
  },
  {
    "slug": "international-shipping",
    "name": "International Shipping",
    "shortName": "International",
    "summary": "Cross-border courier orchestration with customs-ready documentation.",
    "heroDescription": "Extend the same allocation and visibility engine to cross-border shipments, with customs paperwork and duty handling built into the workflow.",
    "outcomes": [
      "Customs-ready documentation generated per shipment",
      "Landed-cost visibility before dispatch",
      "Consolidated tracking across international carrier partners"
    ],
    "icon": "Globe"
  }
]
```

- [ ] **Step 5: Write `src/data/industries.json`**

```json
[
  { "slug": "ecommerce-d2c", "name": "E-commerce & D2C", "description": "High-volume order fulfillment with COD, NDR, and RTO management built in.", "icon": "ShoppingCart" },
  { "slug": "fashion-apparel", "name": "Fashion & Apparel", "description": "High-return-rate categories with reverse logistics as a first-class workflow.", "icon": "Shirt" },
  { "slug": "electronics", "name": "Electronics & Accessories", "description": "High-value, fragile-handling shipments with serialized tracking.", "icon": "Smartphone" },
  { "slug": "health-wellness", "name": "Health & Wellness", "description": "Temperature-conscious and time-sensitive delivery windows.", "icon": "HeartPulse" },
  { "slug": "fmcg-grocery", "name": "FMCG & Grocery", "description": "High-frequency, low-margin shipments where per-order cost control matters most.", "icon": "ShoppingBasket" },
  { "slug": "manufacturing", "name": "Enterprise Manufacturing", "description": "B2B and bulk freight movement between plants, warehouses, and distributors.", "icon": "Factory" }
]
```

- [ ] **Step 6: Write `src/data/integrations.json`**

```json
[
  { "name": "Shopify", "category": "E-commerce", "description": "Sync orders and push tracking updates automatically." },
  { "name": "WooCommerce", "category": "E-commerce", "description": "Native plugin for order sync and status webhooks." },
  { "name": "Magento", "category": "E-commerce", "description": "Order ingestion and fulfillment status sync." },
  { "name": "Custom ERP / WMS", "category": "Enterprise", "description": "Connect any internal system via REST API and webhooks." },
  { "name": "Marketplaces", "category": "Marketplace", "description": "Consolidated order pull from major online marketplaces." },
  { "name": "Accounting & Reconciliation", "category": "Finance", "description": "Export shipment and COD reconciliation data to your finance stack." }
]
```

- [ ] **Step 7: Write `src/data/faq.json`**

```json
[
  { "question": "How does Ziporter select the best carrier for each shipment?", "answer": "Ziporter's allocation engine scores every available carrier against your shipment in real time — serviceability, delivery SLA, historical performance on that pincode, cost, and more — and assigns the best match automatically. Rules can be tuned per warehouse, category, or business unit." },
  { "question": "Which carriers and pincodes does Ziporter cover?", "answer": "Ziporter connects to XX+ carrier partners with coverage across XX,XXX+ pincodes nationwide, plus hyperlocal fleets in major metros and international partners for cross-border shipments." },
  { "question": "How does reverse logistics work on Ziporter?", "answer": "Customers or your support team can trigger a reverse pickup directly from an order's timeline. Ziporter schedules the pickup with an available carrier, tracks it through to warehouse receipt, and can fire a webhook to trigger your refund or exchange workflow." },
  { "question": "Can Ziporter integrate with our existing ERP or WMS?", "answer": "Yes. Beyond prebuilt e-commerce platform connectors, Ziporter exposes a REST API and webhook events so your ERP, WMS, or custom order-management system can push and receive shipment data directly." },
  { "question": "Is there a minimum shipment volume to get started?", "answer": "Ziporter is built for growing and enterprise shipping volumes. Talk to our team about your current and projected volume and we'll recommend the right onboarding path." },
  { "question": "How is pricing structured?", "answer": "Pricing depends on shipment volume, carrier mix, and which solutions (domestic, B2B, reverse, hyperlocal, international) you need. Request a demo and our team will walk you through a plan suited to your operation." },
  { "question": "What support do enterprise customers get?", "answer": "Enterprise accounts get a dedicated account manager, priority exception handling, and access to our operations support team for carrier escalations." },
  { "question": "How secure is shipment and customer data on Ziporter?", "answer": "Customer and shipment data is encrypted in transit and at rest, access is role-based, and address details are masked by default in any customer-facing tracking view." }
]
```

- [ ] **Step 8: Write `src/data/testimonials.json`**

```json
[
  { "quote": "Consolidating our carrier logins into one allocation engine cut the manual routing work our ops team used to do every morning.", "role": "Operations Lead", "context": "D2C Fashion Brand" },
  { "quote": "The reverse logistics workflow alone paid for the switch — pickups that used to take three calls to schedule now happen automatically.", "role": "Supply Chain Manager", "context": "Consumer Electronics" },
  { "quote": "Having one dashboard for both our national and hyperlocal fulfillment made it much easier to spot where deliveries were slipping.", "role": "Head of Fulfillment", "context": "Grocery & FMCG" }
]
```

- [ ] **Step 9: Write `src/data/allocation-criteria.json`**

```json
[
  { "label": "Serviceability", "description": "Is this carrier deliverable to the destination pincode?" },
  { "label": "Delivery SLA", "description": "Expected transit time for this route and carrier." },
  { "label": "Cost per Shipment", "description": "Carrier rate card for this weight, zone, and mode." },
  { "label": "Carrier Performance Score", "description": "Historical on-time delivery rate for this lane." },
  { "label": "COD Availability", "description": "Whether the carrier supports cash-on-delivery on this route." },
  { "label": "Weight & Dimension Slabs", "description": "Carrier-specific slab limits and volumetric rules." },
  { "label": "Return Risk Score", "description": "Likelihood of RTO based on pincode and category history." },
  { "label": "Real-Time Carrier Capacity", "description": "Current load and pickup availability for the carrier." },
  { "label": "Customer Pincode History", "description": "Past delivery success at this exact address/pincode." },
  { "label": "Fragile / Special Handling Tags", "description": "Whether the shipment needs special handling the carrier supports." }
]
```

- [ ] **Step 10: Write `src/data/workflow-steps.json`**

```json
[
  { "step": 1, "title": "Order Ingestion", "description": "Orders flow in from your storefront, marketplace, or ERP via API or connector." },
  { "step": 2, "title": "Smart Carrier Allocation", "description": "The allocation engine scores every eligible carrier and assigns the best match." },
  { "step": 3, "title": "Label & Manifest Generation", "description": "Shipping labels and carrier manifests are generated automatically." },
  { "step": 4, "title": "Pickup Scheduling", "description": "Pickup requests are scheduled with the assigned carrier for your warehouse." },
  { "step": 5, "title": "In-Transit Tracking", "description": "Every shipment status update is normalized into one tracking timeline." },
  { "step": 6, "title": "NDR & Exception Management", "description": "Failed delivery attempts and exceptions surface for action before they become RTOs." },
  { "step": 7, "title": "Delivery Confirmation", "description": "Proof of delivery is captured and synced back to your system." },
  { "step": 8, "title": "Reverse Pickup", "description": "Return and exchange pickups are scheduled automatically when triggered." },
  { "step": 9, "title": "Analytics & Reconciliation", "description": "Cost, performance, and COD reconciliation data roll up into reporting." }
]
```

- [ ] **Step 11: Write `src/data/dashboard-metrics.json`**

```json
{
  "headline": "Every shipment, one dashboard.",
  "cards": [
    { "label": "Orders Processed Today", "value": "4,218", "trend": "+12% vs. yesterday" },
    { "label": "In-Transit Shipments", "value": "9,842", "trend": "Across XX+ carriers" },
    { "label": "NDR Resolution Rate", "value": "91.4%", "trend": "+3.1pt this month" },
    { "label": "Average Delivery TAT", "value": "2.6 days", "trend": "-0.4 days this quarter" }
  ]
}
```

Note: the dashboard metric numbers above are illustrative UI sample data for a product mockup (clearly a "dashboard preview" visual, not a claim about Ziporter's real performance) — distinct from the brief's "no unverifiable stats" rule, which governs marketing claims about Ziporter itself (those use the `XX+`/`XX,XXX+` tokens from `site.json`).

- [ ] **Step 12: Verify**

Run `npx tsc --noEmit` — must pass with no type errors (confirms every JSON file's shape matches its interface via the `as` casts compiling, and `resolveJsonModule` picking up the files). Run `npm run build` — must succeed.

- [ ] **Step 13: Commit**

```bash
git add src/lib/content-types.ts src/lib/content.ts src/config/site.json src/data/
git commit -m "feat: add typed JSON content architecture and site data"
```

---

### Task 5: Background SVG assets

**Files:**
- Create: `public/images/grid-dots.svg`
- Create: `public/images/route-lines.svg`
- Create: `public/images/warehouse-grid.svg`
- Create: `public/images/blob-navy.svg`
- Create: `public/images/blob-teal.svg`

**Interfaces:**
- Produces: static assets referenced as `/images/<name>.svg` (root-relative; Next rewrites under `basePath` automatically) by `shared/route-map.tsx` and various `sections/*` in this plan.

- [ ] **Step 1: `public/images/grid-dots.svg`** — tileable dot grid, 40x40 tile, navy dots at low opacity:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <circle cx="2" cy="2" r="1.4" fill="#0a1e42" opacity="0.12" />
</svg>
```

- [ ] **Step 2: `public/images/route-lines.svg`** — abstract curved route with 3 node markers (pickup/hub/delivery), 800x400 viewBox:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" fill="none">
  <path d="M40 340 C 220 340, 260 120, 420 140 S 620 320, 760 80" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6 8" opacity="0.35"/>
  <circle cx="40" cy="340" r="7" fill="#0a1e42"/>
  <circle cx="420" cy="140" r="7" fill="#14b8a6"/>
  <circle cx="760" cy="80" r="7" fill="#3b82f6"/>
</svg>
```

- [ ] **Step 3: `public/images/warehouse-grid.svg`** — abstract rack/shelf grid, low opacity, 200x120 tile:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120" fill="none">
  <g stroke="#0a1e42" stroke-width="1.5" opacity="0.08">
    <rect x="10" y="10" width="35" height="35"/>
    <rect x="55" y="10" width="35" height="35"/>
    <rect x="100" y="10" width="35" height="35"/>
    <rect x="145" y="10" width="35" height="35"/>
    <rect x="10" y="55" width="35" height="35"/>
    <rect x="55" y="55" width="35" height="35"/>
    <rect x="100" y="55" width="35" height="35"/>
    <rect x="145" y="55" width="35" height="35"/>
  </g>
</svg>
```

- [ ] **Step 4: `public/images/blob-navy.svg`** — soft abstract gradient blob, 600x600:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" fill="none">
  <defs>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <path d="M300 60 C 430 60 520 170 500 300 C 480 430 370 540 240 520 C 110 500 40 380 70 250 C 100 120 200 60 300 60 Z" fill="url(#g1)"/>
</svg>
```

- [ ] **Step 5: `public/images/blob-teal.svg`** — soft abstract gradient blob, 600x600, teal:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" fill="none">
  <defs>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0d9488" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0d9488" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <path d="M300 80 C 420 80 500 180 480 300 C 460 420 360 520 240 500 C 120 480 60 370 90 250 C 120 130 200 80 300 80 Z" fill="url(#g2)"/>
</svg>
```

- [ ] **Step 6: Verify**

Run `npm run dev`, navigate to `http://localhost:3000/ziporter/images/grid-dots.svg` directly in the browser — confirm it renders as an image, not a 404. Repeat for the other 4 files (adjust filename).

- [ ] **Step 7: Commit**

```bash
git add public/images/
git commit -m "feat: add original SVG background art assets"
```

---

### Task 6: New `ui/` primitives — card, badge, input, textarea, select, checkbox

**Files:**
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/checkbox.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (existing).
- Produces: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`; `Badge` (+ `badgeVariants`); `Input`; `Textarea`; `Select` (native `<select>` wrapper, styled); `Checkbox` (native `<input type="checkbox">` wrapper, styled) — all used across `shared/`, `sections/`, and later the request-demo form plan.

- [ ] **Step 1: `src/components/ui/card.tsx`**

```tsx
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("font-heading text-lg font-semibold leading-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

- [ ] **Step 2: `src/components/ui/badge.tsx`**

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        accent: "border-transparent bg-accent/10 text-accent",
        secondary: "border-transparent bg-secondary/15 text-secondary-foreground",
        success: "border-transparent bg-success/15 text-success-foreground",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
```

- [ ] **Step 3: `src/components/ui/input.tsx`**

```tsx
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

- [ ] **Step 4: `src/components/ui/textarea.tsx`**

```tsx
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
```

- [ ] **Step 5: `src/components/ui/select.tsx`**

```tsx
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "flex h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 py-1 pr-8 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { Select }
```

- [ ] **Step 6: `src/components/ui/checkbox.tsx`**

```tsx
import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-4 shrink-0 rounded border border-input bg-background accent-accent outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        className
      )}
      {...props}
    />
  )
}

export { Checkbox }
```

- [ ] **Step 7: Verify**

Run `npx tsc --noEmit` — must pass. These have no visual host yet; Task 7 (`stat-card`) and later plans consume them, so full visual verification happens there. Confirm no TypeScript errors and no ESLint errors: `npm run lint`.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/card.tsx src/components/ui/badge.tsx src/components/ui/input.tsx src/components/ui/textarea.tsx src/components/ui/select.tsx src/components/ui/checkbox.tsx
git commit -m "feat: add card, badge, input, textarea, select, checkbox primitives"
```

---

### Task 7: `shared/section.tsx` and `shared/stat-card.tsx`

**Files:**
- Create: `src/components/shared/section.tsx`
- Create: `src/components/shared/stat-card.tsx`

**Interfaces:**
- Consumes: `cn`, `motion`/`useReducedMotion` from `framer-motion`.
- Produces: `Section({ children, className, background, id }: { children: React.ReactNode; className?: string; background?: "default" | "muted"; id?: string })`; `StatCard({ label, value, trend }: { label: string; value: string; trend?: string })` — both used by every `sections/*` component.

- [ ] **Step 1: `src/components/shared/section.tsx`**

```tsx
import { cn } from "@/lib/utils"

export function Section({
  children,
  className,
  background = "default",
  id,
}: {
  children: React.ReactNode
  className?: string
  background?: "default" | "muted"
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 md:py-24",
        background === "muted" && "bg-muted",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
```

- [ ] **Step 2: `src/components/shared/stat-card.tsx`**

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({
  label,
  value,
  trend,
}: {
  label: string
  value: string
  trend?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const [show, setShow] = useState(!!reduceMotion)

  useEffect(() => {
    if (inView) setShow(true)
  }, [inView])

  return (
    <Card ref={ref}>
      <CardContent className="py-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="font-heading text-2xl font-bold text-primary"
        >
          {value}
        </motion.div>
        <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
        {trend && <div className="mt-1 text-xs text-muted-foreground">{trend}</div>}
      </CardContent>
    </Card>
  )
}
```

Note: `Card` doesn't currently forward `ref` — since it's a plain `div` wrapper this works via standard `React.ComponentProps<"div">` + JSX ref forwarding is NOT automatic in a plain function component. Fix: change `Card` in Task 6 Step 1 to use `React.forwardRef`, or simpler — avoid the ref entirely here and use a local wrapper `div` for `useInView`. Use the simpler fix: wrap in a plain `<div ref={ref}>` around `<Card>` instead of passing `ref` to `Card`:

```tsx
  return (
    <div ref={ref}>
      <Card>
        <CardContent className="py-6">
          {/* ...same as above... */}
        </CardContent>
      </Card>
    </div>
  )
```

Use this corrected version (no `ref` prop on `Card`) when writing the file.

- [ ] **Step 3: Verify**

Temporarily render `<StatCard label="Test Metric" value="1,234" trend="+5%" />` inside a `<Section>` in `src/app/page.tsx`, run `npm run dev`, confirm the card renders with rounded-2xl border, soft shadow, and the value fades/slides in on scroll into view. Confirm with DevTools "Emulate CSS prefers-reduced-motion: reduce" that the value appears instantly (no animation) in that mode. Remove the temporary render afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/section.tsx src/components/shared/stat-card.tsx
git commit -m "feat: add Section wrapper and animated StatCard"
```

---

### Task 8: `shared/dashboard-mockup.tsx`, `shared/route-map.tsx`, `shared/process-steps.tsx`

**Files:**
- Create: `src/components/shared/dashboard-mockup.tsx`
- Create: `src/components/shared/route-map.tsx`
- Create: `src/components/shared/process-steps.tsx`

**Interfaces:**
- Consumes: `DashboardMetrics` type from `@/lib/content-types`, `dashboardMetrics` from `@/lib/content`, `WorkflowStep`/`AllocationCriterion` types.
- Produces: `DashboardMockup({ metrics }: { metrics: DashboardMetrics })`; `RouteMap({ className }: { className?: string })`; `ProcessSteps({ steps, orientation }: { steps: { title: string; description: string; number: number }[]; orientation?: "horizontal" | "vertical" })` — reused by `sections/hero.tsx`, `sections/operations-dashboard.tsx`, `sections/workflow.tsx`, `sections/allocation-engine.tsx`, and (later plan) `/enterprise-dashboard`.

- [ ] **Step 1: `src/components/shared/dashboard-mockup.tsx`**

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { RouteMap } from "@/components/shared/route-map"
import type { DashboardMetrics } from "@/lib/content-types"

export function DashboardMockup({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-5 py-3">
        <span className="font-heading text-sm font-semibold text-foreground">
          {metrics.headline}
        </span>
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/40" />
          <span className="size-2.5 rounded-full bg-chart-5/50" />
          <span className="size-2.5 rounded-full bg-success/50" />
        </span>
      </div>
      <CardContent className="grid grid-cols-2 gap-3 py-5">
        {metrics.cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-background p-3">
            <div className="text-xs text-muted-foreground">{card.label}</div>
            <div className="font-heading text-xl font-bold text-primary">{card.value}</div>
            <div className="text-[11px] text-success-foreground">{card.trend}</div>
          </div>
        ))}
      </CardContent>
      <div className="border-t border-border px-5 py-4">
        <RouteMap className="h-32 w-full" />
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: `src/components/shared/route-map.tsx`**

```tsx
import { cn } from "@/lib/utils"

export function RouteMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
      <img
        src="/images/route-lines.svg"
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
```

Note on `basePath`: use root-relative `/images/route-lines.svg` here — Next.js's `assetPrefix`/`basePath` rewriting applies to files resolved through the bundler (`next/image`, imported assets), NOT to raw string paths in a plain `<img src>`. Since `next.config.ts` sets `basePath: "/ziporter"`, a plain `<img src="/images/...">` will 404 in the exported site. **Correct this now**: use Next's `basePath`-aware pattern — read it from `next.config.ts` at build time isn't available client-side, so instead import the SVG as a static asset so the bundler rewrites the URL:

```tsx
import { cn } from "@/lib/utils"
import routeLines from "../../../public/images/route-lines.svg"

export function RouteMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
      <img
        src={routeLines.src}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
```

Use this corrected version. Static import of an SVG from `public/` by relative path returns `{ src: string, width, height }` in Next.js when the file is treated as a static asset import — verify this resolves correctly in Step 4 below; if the TypeScript compiler errors on the SVG import (no type declaration), add a `src/svg.d.ts`:

```ts
declare module "*.svg" {
  const content: { src: string; width: number; height: number }
  export default content
}
```

Create `src/svg.d.ts` only if Step 4's `tsc --noEmit` actually fails on the import — check first before adding it.

- [ ] **Step 3: `src/components/shared/process-steps.tsx`**

```tsx
import { cn } from "@/lib/utils"

export function ProcessSteps({
  steps,
  orientation = "vertical",
}: {
  steps: { title: string; description: string; number: number }[]
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <ol
      className={cn(
        "grid gap-6",
        orientation === "horizontal"
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      )}
    >
      {steps.map((step) => (
        <li key={step.number} className="flex gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
            {step.number}
          </span>
          <div>
            <div className="font-heading text-base font-semibold text-foreground">
              {step.title}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{step.description}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}
```

- [ ] **Step 4: Verify**

Temporarily render `<DashboardMockup metrics={dashboardMetrics} />` (import from `@/lib/content`) in `src/app/page.tsx`. Run `npm run dev` and `npx tsc --noEmit`. Confirm in-browser: the mockup card shows the headline, 4 metric tiles in a 2x2 grid, and the route-map image renders (not a broken-image icon) — this specifically confirms the `basePath`-safe asset import works. If `tsc --noEmit` fails on the `.svg` import, add `src/svg.d.ts` per Step 2's note, re-run, then remove the temporary render from `page.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/dashboard-mockup.tsx src/components/shared/route-map.tsx src/components/shared/process-steps.tsx
git status
```

If `src/svg.d.ts` was created, add it too:

```bash
git add src/svg.d.ts
git commit -m "feat: add dashboard mockup, route map, and process steps components"
```

---

### Task 9: `nav.tsx` (rewrite)

**Files:**
- Modify: `src/components/nav.tsx` (full rewrite — delete existing content, replace)

**Interfaces:**
- Consumes: `site` from `@/lib/content`, `Logo`, `Button` (existing), `lucide-react` icons (`Menu`, `X`, `ChevronDown`).
- Produces: `Nav()` — default export, rendered once in `src/app/layout.tsx`'s consumers (Task 25 wires it into `page.tsx`'s host, or — since nav/footer are site-wide chrome, not homepage-only — this task also updates `src/app/layout.tsx` to render `<Nav />`/`<Footer />` around `{children}`).

- [ ] **Step 1: Rewrite `src/components/nav.tsx`**

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Ziporter home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
              aria-expanded={solutionsOpen}
              aria-haspopup="true"
              onClick={() => setSolutionsOpen((v) => !v)}
            >
              Solutions <ChevronDown className="size-3.5" />
            </button>
            {solutionsOpen && (
              <div className="absolute left-0 top-full grid w-80 gap-1 rounded-2xl border border-border bg-card p-2 shadow-md">
                {site.nav.solutions.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="rounded-lg px-3 py-2 hover:bg-muted"
                  >
                    <div className="text-sm font-medium text-foreground">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {site.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href={site.cta.tertiary.href}>{site.cta.tertiary.label}</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={site.cta.secondary.href}>{site.cta.secondary.label}</Link>
          </Button>
        </div>

        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {site.nav.solutions.map((s) => (
              <Link key={s.href} href={s.href} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                {s.label}
              </Link>
            ))}
            {site.nav.links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              Login
            </Link>
            <Link href={site.cta.tertiary.href} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              {site.cta.tertiary.label}
            </Link>
            <Button asChild className="mt-2">
              <Link href={site.cta.secondary.href}>{site.cta.secondary.label}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
```

**Important — check `Button` supports `asChild`:** the existing `src/components/ui/button.tsx` (read during planning) does NOT currently have an `asChild` prop — it wraps `@base-ui/react`'s `Button` primitive directly with no Slot/asChild pattern. Before using `<Button asChild><Link ...></Button>` above, check `node_modules/next/dist/docs/` is irrelevant here (this is a `@base-ui/react` question, not Next) — check `@base-ui/react`'s `Button` primitive docs/types for `render`/`asChild` support (base-ui's convention is typically a `render` prop, not `asChild`). Resolve this in Step 1a below before writing the file.

- [ ] **Step 1a: Confirm `Button`'s polymorphic prop pattern**

Run:
```bash
grep -r "render" node_modules/@base-ui/react/button/*.d.ts 2>/dev/null | head -20
```
`@base-ui/react` primitives use a `render` prop (e.g. `render={<Link href="..." />}`), not `asChild`. Rewrite every `<Button asChild ...><Link href="...">label</Link></Button>` usage above to:

```tsx
<Button render={<Link href={site.cta.secondary.href} />}>{site.cta.secondary.label}</Button>
```

Apply this pattern consistently in `nav.tsx` (all 4 button/link combinations) instead of the `asChild` form shown in Step 1 — `asChild` was a shorthand placeholder for "link-styled-as-button" and must be corrected to base-ui's actual `render` API before this compiles. This same correction applies to every other task in this plan and later plans that pairs `Button` with `Link`.

- [ ] **Step 2: Wire `Nav` and (temporarily) confirm it renders**

`Nav`/`Footer` placement in `layout.tsx` happens in Task 10 (footer must exist first, both wired together). For this task's verification only, temporarily import and render `<Nav />` at the top of `src/app/page.tsx`, run `npm run dev`, and check:
- Logo + wordmark on the left.
- Desktop (≥1024px width): Solutions link with hover dropdown showing all 5 solutions with descriptions; Industries/Integrations/Resources/About links; Track Shipment, Login, Request a Demo on the right.
- Resize below 1024px: hamburger icon appears, clicking toggles a mobile menu listing all links plus the primary CTA button.
- Remove the temporary `<Nav />` render from `page.tsx` afterward (Task 10 re-adds it properly via `layout.tsx`).

- [ ] **Step 3: Commit**

```bash
git add src/components/nav.tsx
git commit -m "feat: rebuild site nav with solutions dropdown and mobile menu"
```

---

### Task 10: `footer.tsx` (rewrite) and wire `Nav`/`Footer` into `layout.tsx`

**Files:**
- Modify: `src/components/footer.tsx` (full rewrite)
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `site` from `@/lib/content`, `Logo`.
- Produces: `Footer()` default export, rendered globally via `layout.tsx`.

- [ ] **Step 1: Rewrite `src/components/footer.tsx`**

```tsx
import Link from "next/link"
import { Logo } from "@/components/logo"
import { site } from "@/lib/content"

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="font-heading text-sm font-semibold text-primary-foreground">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo variant="mono-light" />
            <p className="mt-3 text-sm text-primary-foreground/70">{site.description}</p>
            <div className="mt-4 flex gap-3">
              {site.social.map((s) => (
                <a key={s.label} href={s.href} className="text-xs text-primary-foreground/70 hover:text-primary-foreground">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <FooterColumn title="Product" links={site.footer.product} />
          <FooterColumn title="Solutions" links={site.footer.solutions} />
          <FooterColumn title="Company" links={site.footer.company} />
          <FooterColumn title="Get Started" links={site.footer.getStarted} />
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Ziporter. All rights reserved.</span>
          <span>{site.contact.salesEmail} · {site.contact.phone}</span>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Wire `Nav` and `Footer` into `layout.tsx`**

In `src/app/layout.tsx`, add imports and render around `{children}`:

```tsx
import Nav from "@/components/nav";
import Footer from "@/components/footer";
```

Change the `<body>` return to:

```tsx
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={organizationJsonLd} />
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
```

- [ ] **Step 3: Verify**

Run `npm run dev`, open `http://localhost:3000/ziporter`. Confirm nav is sticky at top and footer (navy background, white text, 5-column layout collapsing to 2 columns on mobile) renders at the bottom of every page. Since only `/` exists as a route right now, this is sufficient — later-plan routes inherit this automatically via the shared layout.

- [ ] **Step 4: Commit**

```bash
git add src/components/footer.tsx src/app/layout.tsx
git commit -m "feat: rebuild footer and wire nav/footer into root layout"
```

---

### Task 11: Remove superseded dark-theme components

**Files:**
- Delete: `src/components/ui/shape-landing-hero.tsx`
- Delete: `src/components/carriers.tsx`
- Delete: `src/components/cta.tsx`
- Delete: `src/components/faq.tsx`
- Delete: `src/components/features.tsx`
- Delete: `src/components/howitworks.tsx`
- Delete: `src/components/newsletter.tsx`
- Delete: `src/components/stats.tsx`
- Delete: `src/components/testimonials.tsx`
- Delete: `src/components/tracking.tsx`
- Modify: `src/app/page.tsx` (strip to a temporary minimal shell — full composition happens in Task 25 after all 14 sections exist)

**Interfaces:**
- None — this is pure removal. `nav.tsx` and `footer.tsx` were already rewritten in Tasks 9-10 and don't import any of these files.

- [ ] **Step 1: Confirm nothing outside this deletion list imports the old files**

```bash
grep -rl "components/carriers\|components/cta\|components/faq\|components/features\|components/howitworks\|components/newsletter\|components/stats\|components/testimonials\|components/tracking\|shape-landing-hero" src/
```

Expect only `src/app/page.tsx` to match (it still imports all of them from the original build). If anything else matches, stop and investigate before deleting.

- [ ] **Step 2: Delete the files**

```bash
git rm src/components/ui/shape-landing-hero.tsx src/components/carriers.tsx src/components/cta.tsx src/components/faq.tsx src/components/features.tsx src/components/howitworks.tsx src/components/newsletter.tsx src/components/stats.tsx src/components/testimonials.tsx src/components/tracking.tsx
```

- [ ] **Step 3: Replace `src/app/page.tsx` with a temporary minimal shell**

```tsx
export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">Homepage sections coming in Task 25</h1>
      </div>
    </main>
  );
}
```

(This keeps the build green between now and Task 25, which replaces this shell with the real 14-section composition once every section component exists.)

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit`, `npm run lint`, `npm run build` — all must pass with zero references to deleted files.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "chore: remove superseded dark-theme components"
```

---

### Task 12: `sections/hero.tsx`

**Files:**
- Create: `src/components/sections/hero.tsx`

**Interfaces:**
- Consumes: `site`, `dashboardMetrics` from `@/lib/content`; `Section`, `DashboardMockup` from `shared/`; `Button`; `Badge`.
- Produces: `Hero()` default export, composed in `src/app/page.tsx` (Task 25).

- [ ] **Step 1: Create `src/components/sections/hero.tsx`**

```tsx
import Link from "next/link"
import { Section } from "@/components/shared/section"
import { DashboardMockup } from "@/components/shared/dashboard-mockup"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { site, dashboardMetrics } from "@/lib/content"

export default function Hero() {
  return (
    <Section className="pt-14 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Badge variant="accent">Enterprise Logistics Platform</Badge>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {site.tagline}
          </h1>
          <p className="mt-2 font-heading text-xl font-medium text-accent">
            {site.altHeadline}
          </p>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            From order to doorstep, across {site.stats.carriers} carriers and{" "}
            {site.stats.pincodes} pincodes — with the allocation logic, tracking, and
            reconciliation your operations team actually needs, in one platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href={site.cta.primary.href} />}>
              {site.cta.primary.label}
            </Button>
            <Button size="lg" variant="outline" render={<Link href={site.cta.secondary.href} />}>
              {site.cta.secondary.label}
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Trusted by logistics and operations teams at growing Indian businesses
          </p>
        </div>
        <DashboardMockup metrics={dashboardMetrics} />
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Temporarily import and render `<Hero />` first in `src/app/page.tsx`'s `<main>` (above the "Task 25" placeholder), run `npm run dev`. Confirm: eyebrow badge, large headline (`site.tagline`), accent-colored sub-headline (`site.altHeadline`), body paragraph with `XX+`/`XX,XXX+` tokens interpolated, two CTA buttons linking to `/contact` and `/request-demo`, and the dashboard mockup card on the right (or stacked below on mobile <1024px). Leave the render in place — Task 25 will formalize the full composition, but having Hero visible now doesn't block anything.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/hero.tsx src/app/page.tsx
git commit -m "feat: add homepage hero section"
```

---

### Task 13: `sections/trust-strip.tsx`

**Files:**
- Create: `src/components/sections/trust-strip.tsx`

**Interfaces:**
- Consumes: `site` from `@/lib/content`.
- Produces: `TrustStrip()` default export.

- [ ] **Step 1: Create `src/components/sections/trust-strip.tsx`**

```tsx
import { Section } from "@/components/shared/section"
import { site } from "@/lib/content"

const items = [
  { label: `${site_placeholder_carriers}` }, // placeholder removed below
]
```

Do not use the stub above — write the real file directly:

```tsx
import { Section } from "@/components/shared/section"
import { site } from "@/lib/content"

export default function TrustStrip() {
  const items = [
    `${site.stats.carriers} Carrier Partners`,
    "PAN-India Coverage",
    `${site.stats.uptime} Platform Uptime`,
    "24x7 Ops Support",
  ]
  return (
    <Section background="muted" className="py-10 md:py-12">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Built for teams shipping at scale
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-primary"
          >
            {item}
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render `<TrustStrip />` after `<Hero />` in `page.tsx`, `npm run dev`, confirm 4 capability badges in a muted-background band, 2-column on mobile / 4-column on desktop.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/trust-strip.tsx src/app/page.tsx
git commit -m "feat: add trust strip section"
```

---

### Task 14: `sections/value-props.tsx`

**Files:**
- Create: `src/components/sections/value-props.tsx`

**Interfaces:**
- Consumes: `Section`, `Card`/`CardHeader`/`CardTitle`/`CardDescription`, `lucide-react` icons.
- Produces: `ValueProps()` default export.

- [ ] **Step 1: Create `src/components/sections/value-props.tsx`**

```tsx
import { Network, Cpu, Radar, RotateCcw, Plug, UserCheck } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const props = [
  { icon: Network, title: "Unified Carrier Network", description: "One integration replaces dozens of individual carrier logins and dashboards." },
  { icon: Cpu, title: "Smart Allocation Engine", description: "Every shipment routes to the best-fit carrier automatically, based on live performance data." },
  { icon: Radar, title: "Real-Time Visibility", description: "One normalized tracking timeline across every carrier, not ten different status formats." },
  { icon: RotateCcw, title: "Reverse Logistics Built-In", description: "Returns and exchanges are a first-class workflow, not a manual afterthought." },
  { icon: Plug, title: "Enterprise-Grade Integrations", description: "Prebuilt e-commerce connectors plus a REST API for your ERP or WMS." },
  { icon: UserCheck, title: "Dedicated Account Support", description: "Enterprise accounts get a named account manager and priority escalation." },
]

export default function ValueProps() {
  return (
    <Section>
      <h2 className="font-heading text-3xl font-bold text-foreground">
        Everything your logistics stack needs, in one platform
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {props.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <p.icon className="size-8 text-accent" />
              <CardTitle className="mt-2">{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<TrustStrip />` in `page.tsx`, confirm 6 cards in a responsive 1/2/3-column grid, each with an icon, title, and description, hover-lift shadow working (from `Card`'s `hover:shadow-md`).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/value-props.tsx src/app/page.tsx
git commit -m "feat: add value propositions section"
```

---

### Task 15: `sections/solutions-grid.tsx`

**Files:**
- Create: `src/components/sections/solutions-grid.tsx`

**Interfaces:**
- Consumes: `solutions` from `@/lib/content`, `lucide-react` (dynamic icon lookup by name string from `solution.icon`).
- Produces: `SolutionsGrid()` default export.

- [ ] **Step 1: Create `src/components/sections/solutions-grid.tsx`**

```tsx
import Link from "next/link"
import { Truck, Boxes, RotateCcw, Zap, Globe, ArrowRight, type LucideIcon } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { solutions } from "@/lib/content"

const iconMap: Record<string, LucideIcon> = { Truck, Boxes, RotateCcw, Zap, Globe }

export default function SolutionsGrid() {
  return (
    <Section background="muted">
      <div className="flex items-end justify-between">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Solutions for every shipment type
        </h2>
        <Link href="/solutions" className="hidden text-sm font-medium text-accent hover:underline sm:inline-flex items-center gap-1">
          View all solutions <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((s) => {
          const Icon = iconMap[s.icon]
          return (
            <Link key={s.slug} href={`/solutions/${s.slug}`}>
              <Card className="h-full">
                <CardHeader>
                  {Icon && <Icon className="size-8 text-accent" />}
                  <CardTitle className="mt-2">{s.name}</CardTitle>
                  <CardDescription>{s.summary}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<ValueProps />`, confirm 5 solution cards (Domestic, B2B, Reverse, Hyperlocal, International) each clickable — links will 404 until Plan 2 builds those routes, which is expected at this stage; confirm the href pattern is `/solutions/<slug>` matching `solutions.json` slugs exactly.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/solutions-grid.tsx src/app/page.tsx
git commit -m "feat: add solutions grid section"
```

---

### Task 16: `sections/allocation-engine.tsx`

**Files:**
- Create: `src/components/sections/allocation-engine.tsx`

**Interfaces:**
- Consumes: `allocationCriteria` from `@/lib/content`, `Badge`.
- Produces: `AllocationEngine()` default export.

- [ ] **Step 1: Create `src/components/sections/allocation-engine.tsx`**

```tsx
import { Section } from "@/components/shared/section"
import { Badge } from "@/components/ui/badge"
import { allocationCriteria } from "@/lib/content"

export default function AllocationEngine() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          One decision engine, ten signals, every shipment
        </h2>
        <p className="mt-3 text-muted-foreground">
          Ziporter's smart allocation engine scores every eligible carrier in real time
          before a shipment is ever booked.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {allocationCriteria.map((c) => (
          <div key={c.label} className="group relative">
            <Badge variant="outline" className="cursor-default px-3 py-1.5 text-sm">
              {c.label}
            </Badge>
            <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              {c.description}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<SolutionsGrid />`, confirm 10 chips render (Serviceability, Delivery SLA, Cost per Shipment, Carrier Performance Score, COD Availability, Weight & Dimension Slabs, Return Risk Score, Real-Time Carrier Capacity, Customer Pincode History, Fragile/Special Handling Tags) and hovering one shows its description tooltip below it.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/allocation-engine.tsx src/app/page.tsx
git commit -m "feat: add smart allocation engine section"
```

---

### Task 17: `sections/operations-dashboard.tsx`

**Files:**
- Create: `src/components/sections/operations-dashboard.tsx`

**Interfaces:**
- Consumes: `dashboardMetrics` from `@/lib/content`, `DashboardMockup` from `shared/`.
- Produces: `OperationsDashboard()` default export.

- [ ] **Step 1: Create `src/components/sections/operations-dashboard.tsx`**

```tsx
import { Section } from "@/components/shared/section"
import { DashboardMockup } from "@/components/shared/dashboard-mockup"
import { dashboardMetrics } from "@/lib/content"

export default function OperationsDashboard() {
  return (
    <Section background="muted">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <DashboardMockup metrics={dashboardMetrics} />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Your entire operation, one dashboard
          </h2>
          <p className="mt-4 text-muted-foreground">
            Orders processed, in-transit volume, NDR resolution, and delivery TAT — the
            metrics your ops team checks every morning, live and in one place instead
            of ten carrier logins.
          </p>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<AllocationEngine />`, confirm the dashboard mockup appears on the left on desktop (right on mobile stack order via `order-*` classes) alongside descriptive copy.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/operations-dashboard.tsx src/app/page.tsx
git commit -m "feat: add operations dashboard showcase section"
```

---

### Task 18: `sections/integrations.tsx`

**Files:**
- Create: `src/components/sections/integrations.tsx`

**Interfaces:**
- Consumes: `integrations` from `@/lib/content`, `Card`.
- Produces: `IntegrationsSection()` default export.

- [ ] **Step 1: Create `src/components/sections/integrations.tsx`**

```tsx
import { Section } from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { integrations } from "@/lib/content"

const codeSample = `POST /v1/shipments
{
  "order_id": "ORD-48213",
  "pickup_pincode": "560103",
  "delivery_pincode": "110045",
  "weight_kg": 1.2,
  "payment_mode": "prepaid"
}

// 200 OK
{
  "shipment_id": "ZP-9931882",
  "carrier": "auto-allocated",
  "eta": "2026-08-29"
}`

export default function IntegrationsSection() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Integrate once. Ship everywhere.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Prebuilt connectors for popular e-commerce platforms, plus a REST API and
            webhook events for any custom ERP or WMS.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {integrations.map((i) => (
              <Card key={i.name}>
                <CardContent className="py-4">
                  <div className="text-sm font-semibold text-foreground">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.category}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-6">
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-primary-foreground/90">
              <code>{codeSample}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<OperationsDashboard />`, confirm the 6 integration cards on the left and a dark navy code-preview panel on the right showing the sample request/response in Geist Mono.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/integrations.tsx src/app/page.tsx
git commit -m "feat: add integrations section with API code preview"
```

---

### Task 19: `sections/industries.tsx`

**Files:**
- Create: `src/components/sections/industries.tsx`

**Interfaces:**
- Consumes: `industries` from `@/lib/content`, `lucide-react` icon map.
- Produces: `IndustriesSection()` default export.

- [ ] **Step 1: Create `src/components/sections/industries.tsx`**

```tsx
import { ShoppingCart, Shirt, Smartphone, HeartPulse, ShoppingBasket, Factory, type LucideIcon } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { industries } from "@/lib/content"

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart, Shirt, Smartphone, HeartPulse, ShoppingBasket, Factory,
}

export default function IndustriesSection() {
  return (
    <Section background="muted">
      <h2 className="font-heading text-3xl font-bold text-foreground">Built for your industry</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((ind) => {
          const Icon = iconMap[ind.icon]
          return (
            <Card key={ind.slug}>
              <CardHeader>
                {Icon && <Icon className="size-7 text-secondary-foreground" />}
                <CardTitle className="mt-2">{ind.name}</CardTitle>
                <CardDescription>{ind.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<IntegrationsSection />`, confirm 6 industry cards (E-commerce & D2C, Fashion & Apparel, Electronics & Accessories, Health & Wellness, FMCG & Grocery, Enterprise Manufacturing).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/industries.tsx src/app/page.tsx
git commit -m "feat: add industries section"
```

---

### Task 20: `sections/workflow.tsx`

**Files:**
- Create: `src/components/sections/workflow.tsx`

**Interfaces:**
- Consumes: `workflowSteps` from `@/lib/content`, `ProcessSteps` from `shared/`.
- Produces: `WorkflowSection()` default export.

- [ ] **Step 1: Create `src/components/sections/workflow.tsx`**

```tsx
import { Section } from "@/components/shared/section"
import { ProcessSteps } from "@/components/shared/process-steps"
import { workflowSteps } from "@/lib/content"

export default function WorkflowSection() {
  const steps = workflowSteps.map((s) => ({ number: s.step, title: s.title, description: s.description }))
  return (
    <Section>
      <h2 className="font-heading text-3xl font-bold text-foreground">
        From order to reconciliation, nine steps, fully orchestrated
      </h2>
      <div className="mt-10">
        <ProcessSteps steps={steps} orientation="horizontal" />
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<IndustriesSection />`, confirm all 9 numbered steps (Order Ingestion → Analytics & Reconciliation) render in a responsive grid.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/workflow.tsx src/app/page.tsx
git commit -m "feat: add 9-step enterprise workflow section"
```

---

### Task 21: `sections/analytics.tsx`

**Files:**
- Create: `src/components/sections/analytics.tsx`

**Interfaces:**
- Consumes: `Section`, `Card`, `lucide-react` icons.
- Produces: `AnalyticsSection()` default export.

- [ ] **Step 1: Create `src/components/sections/analytics.tsx`**

```tsx
import { TrendingDown, BarChart3, MapPinned, FileSpreadsheet } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const items = [
  { icon: TrendingDown, title: "Cost per Shipment Trends", description: "Track cost movement by carrier, zone, and category over time." },
  { icon: BarChart3, title: "Carrier-Wise Scorecards", description: "Compare carrier performance side-by-side to inform allocation rules." },
  { icon: MapPinned, title: "Zone-Wise Delivery TAT", description: "See where delivery times are slipping, down to the zone level." },
  { icon: FileSpreadsheet, title: "RTO% & NDR% Tracking", description: "Exportable reports on return and non-delivery trends." },
]

export default function AnalyticsSection() {
  return (
    <Section background="muted">
      <h2 className="font-heading text-3xl font-bold text-foreground">
        Cost control without spreadsheets
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="size-7 text-accent" />
              <CardTitle className="mt-2 text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<WorkflowSection />`, confirm 4 analytics capability cards.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/analytics.tsx src/app/page.tsx
git commit -m "feat: add analytics and cost control section"
```

---

### Task 22: `sections/why-ziporter.tsx`

**Files:**
- Create: `src/components/sections/why-ziporter.tsx`

**Interfaces:**
- Consumes: `Section`, `lucide-react` icons.
- Produces: `WhyZiporter()` default export.

- [ ] **Step 1: Create `src/components/sections/why-ziporter.tsx`**

```tsx
import { Layers, BrainCircuit, UserCog, Eye, ShieldCheck, Globe2 } from "lucide-react"
import { Section } from "@/components/shared/section"

const points = [
  { icon: Layers, title: "One API, not ten", description: "Stop maintaining separate integrations for every carrier you use." },
  { icon: BrainCircuit, title: "AI-assisted allocation", description: "Allocation improves over time from real delivery outcomes, not static rules alone." },
  { icon: UserCog, title: "Dedicated account management", description: "Enterprise accounts get a named point of contact, not a support queue." },
  { icon: Eye, title: "Transparent cost visibility", description: "See exactly what every shipment costs, by carrier and zone, in real time." },
  { icon: ShieldCheck, title: "Enterprise-grade security", description: "Encrypted data, role-based access, and masked customer information by default." },
  { icon: Globe2, title: "India-wide and international reach", description: "The same platform scales from hyperlocal delivery to cross-border shipments." },
]

export default function WhyZiporter() {
  return (
    <Section>
      <h2 className="font-heading text-3xl font-bold text-foreground">Why enterprise teams choose Ziporter</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="flex gap-4">
            <p.icon className="size-6 shrink-0 text-accent" />
            <div>
              <div className="font-heading text-base font-semibold text-foreground">{p.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<AnalyticsSection />`, confirm 6 differentiator items in an icon+text layout (not cards this time — visual variety per spec §3.5).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/why-ziporter.tsx src/app/page.tsx
git commit -m "feat: add why-ziporter differentiators section"
```

---

### Task 23: `sections/testimonials.tsx`

**Files:**
- Create: `src/components/sections/testimonials.tsx`

**Interfaces:**
- Consumes: `testimonials` from `@/lib/content`, `Card`.
- Produces: `TestimonialsSection()` default export.

- [ ] **Step 1: Create `src/components/sections/testimonials.tsx`**

```tsx
import { Quote } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { testimonials } from "@/lib/content"

export default function TestimonialsSection() {
  return (
    <Section background="muted">
      <h2 className="font-heading text-3xl font-bold text-foreground">What operations teams say</h2>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.quote}>
            <CardContent className="py-6">
              <Quote className="size-6 text-accent" />
              <p className="mt-3 text-sm text-foreground">{t.quote}</p>
              <p className="mt-4 text-xs font-semibold text-foreground">{t.role}</p>
              <p className="text-xs text-muted-foreground">{t.context}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

Render after `<WhyZiporter />`, confirm 3 testimonial cards with quote icon, quote text, and role/context attribution (no fabricated company names or headshots, per plan design).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/testimonials.tsx src/app/page.tsx
git commit -m "feat: add testimonials section"
```

---

### Task 24: `sections/faq.tsx` and `sections/final-cta.tsx`

**Files:**
- Create: `src/components/sections/faq.tsx`
- Create: `src/components/sections/final-cta.tsx`

**Interfaces:**
- Consumes: `faqs`, `site` from `@/lib/content`; `Button`.
- Produces: `FaqSection()`, `FinalCta()` default exports. `FaqSection` also renders `FAQPage` JSON-LD directly (per spec §8) using `JsonLd` from Task 2.

- [ ] **Step 1: Create `src/components/sections/faq.tsx`**

```tsx
"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Section } from "@/components/shared/section"
import { JsonLd } from "@/components/shared/json-ld"
import { faqs } from "@/lib/content"

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <Section id="faq">
      <JsonLd data={faqJsonLd} />
      <h2 className="font-heading text-3xl font-bold text-foreground">Frequently asked questions</h2>
      <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
        {faqs.map((f, i) => {
          const open = openIndex === i
          return (
            <div key={f.question}>
              <button
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span className="font-medium text-foreground">{f.question}</span>
                <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <div className="px-5 pb-4 text-sm text-muted-foreground">{f.answer}</div>}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Create `src/components/sections/final-cta.tsx`**

```tsx
import Link from "next/link"
import { Section } from "@/components/shared/section"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"

export default function FinalCta() {
  return (
    <Section background="muted">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl font-bold">Ready to simplify your logistics stack?</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Talk to our team or see Ziporter on your own shipment data — no commitment required.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="secondary" render={<Link href={site.cta.primary.href} />}>
            {site.cta.primary.label}
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" render={<Link href={site.cta.secondary.href} />}>
            {site.cta.secondary.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 3: Verify**

Render both after `<TestimonialsSection />`, confirm the FAQ accordion opens/closes on click (only one open at a time) and View Source shows a `<script type="application/ld+json">` with `"@type":"FAQPage"` and all 8 questions. Confirm Final CTA renders as a navy rounded banner with two buttons.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/faq.tsx src/components/sections/final-cta.tsx src/app/page.tsx
git commit -m "feat: add FAQ (with FAQPage JSON-LD) and final CTA sections"
```

---

### Task 25: Compose the full homepage in `src/app/page.tsx`

**Files:**
- Modify: `src/app/page.tsx` (final rewrite — replace the incremental temporary renders from Tasks 12-24 with the definitive composition)
- Modify: `src/app/layout.tsx` (nothing further needed — already wired in Task 10)

**Interfaces:**
- Consumes: all 14 `sections/*` default exports.
- Produces: the complete homepage, plus a `SoftwareApplication` JSON-LD block per spec §8.

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld"
import Hero from "@/components/sections/hero"
import TrustStrip from "@/components/sections/trust-strip"
import ValueProps from "@/components/sections/value-props"
import SolutionsGrid from "@/components/sections/solutions-grid"
import AllocationEngine from "@/components/sections/allocation-engine"
import OperationsDashboard from "@/components/sections/operations-dashboard"
import IntegrationsSection from "@/components/sections/integrations"
import IndustriesSection from "@/components/sections/industries"
import WorkflowSection from "@/components/sections/workflow"
import AnalyticsSection from "@/components/sections/analytics"
import WhyZiporter from "@/components/sections/why-ziporter"
import TestimonialsSection from "@/components/sections/testimonials"
import FaqSection from "@/components/sections/faq"
import FinalCta from "@/components/sections/final-cta"

export const metadata: Metadata = {
  title: "Ziporter — Enterprise Logistics. Simplified.",
  description:
    "One platform to orchestrate every shipment. Smart carrier allocation, unified tracking, and reverse logistics for Indian enterprises.",
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ziporter",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Courier aggregation and logistics orchestration platform for Indian enterprises.",
};

export default function Home() {
  return (
    <main>
      <JsonLd data={softwareApplicationJsonLd} />
      <Hero />
      <TrustStrip />
      <ValueProps />
      <SolutionsGrid />
      <AllocationEngine />
      <OperationsDashboard />
      <IntegrationsSection />
      <IndustriesSection />
      <WorkflowSection />
      <AnalyticsSection />
      <WhyZiporter />
      <TestimonialsSection />
      <FaqSection />
      <FinalCta />
    </main>
  );
}
```

- [ ] **Step 2: Full verification pass**

Run, in order:
1. `npx tsc --noEmit` — zero errors.
2. `npm run lint` — zero errors.
3. `npm run build` — full static export succeeds, `out/` directory is produced.
4. `npm run dev`, open `http://localhost:3000/ziporter`, scroll the entire homepage top to bottom and confirm all 14 sections render in order with no console errors: Hero → Trust Strip → Value Props → Solutions Grid → Allocation Engine → Operations Dashboard → Integrations → Industries → Workflow → Analytics → Why Ziporter → Testimonials → FAQ → Final CTA, followed by the global Footer.
5. Resize to a mobile width (375px) and re-check the same scroll for layout breaks (overlapping text, horizontal scroll, unreadable contrast).
6. In DevTools, enable "Emulate CSS prefers-reduced-motion: reduce" and confirm the `StatCard`/dashboard mockup content still appears (no elements stuck at `opacity: 0`).

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose complete Ziporter homepage from all 14 sections"
```

---

## Self-Review

**Spec coverage:**
- §3.1 color tokens incl. new `--success` → Task 1. ✅
- §3.2 typography (Manrope/Inter/Geist Mono) → Task 2. ✅
- §3.3 logo → Task 3. ✅
- §3.4 background SVGs (all 5 named files) → Task 5. ✅
- §3.5 cards/motion/layout (rounded-2xl, shadow, reduced-motion) → Tasks 6, 7, 25 Step 2.6. ✅
- §4 content architecture (all 9 JSON files + types + loader) → Task 4. ✅
- §6 component architecture (logo, nav, footer, all 6 new ui/ primitives, all 6 shared/, all 14 sections/) → Tasks 3, 6, 7, 8, 9, 10, 12-24. ✅
- §8 SEO/schema (Organization on layout, SoftwareApplication on homepage, FAQPage on FAQ section) → Tasks 2, 24, 25. `BreadcrumbList` is explicitly out of scope for this plan (no sub-pages exist yet) — covered by the next plan.
- Removal of superseded components → Task 11. ✅
- Homepage §15-section brief (nav + 14 content sections + footer) → Tasks 9, 10, 12-24 = nav + footer + 14 sections = 16 pieces total, matching "sticky nav ... 14 sections ... footer." ✅

**Gaps intentionally deferred to later plans (not missing from this one):** `/solutions` hub + 5 sub-pages, `/industries`, `/integrations`, `/api`, `/enterprise-dashboard`, `/track`, `/resources`, `/about`, `/contact`, `/request-demo`, `/login`, `sitemap.ts`, `robots.ts`, per-page metadata, `BreadcrumbList` JSON-LD. These are Plan 2 (routes) and Plan 3 (interactive tools + SEO).

**Placeholder scan:** no "TBD"/"implement later"/"similar to Task N" patterns present — every task has literal file content. The one internal placeholder-looking line (Task 13 Step 1's rejected stub) is explicitly marked "do not use" and immediately followed by the real file.

**Type consistency:** `Solution.icon`, `Industry.icon` are `string` in `content-types.ts` and consumed via `Record<string, LucideIcon>` maps in `solutions-grid.tsx`/`industries.tsx` — consistent. `DashboardMetrics` shape matches `dashboard-metrics.json` exactly (`headline`, `cards[].{label,value,trend}`). `ProcessSteps` prop shape (`{ number, title, description }[]`) matches how `workflow.tsx` maps `WorkflowStep[]` (`step`→`number`) — consistent, no drift.

**Correction embedded in-line (Task 9):** `Button`'s actual polymorphic API is base-ui's `render` prop, not shadcn's `asChild` — flagged and corrected within Task 9 Step 1a, and that correction is called out as applying to every other `Button`+`Link` pairing in this plan (Tasks 12, 24) and future plans.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-26-ziporter-foundation-and-homepage.md`.

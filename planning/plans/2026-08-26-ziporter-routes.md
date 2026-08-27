# Ziporter Additional Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every remaining static route in the sitemap (`/solutions` hub + 5 sub-pages, `/industries`, `/integrations`, `/api`, `/enterprise-dashboard`, `/resources`, `/about`, `/contact`, `/login`), each with its own metadata (title/description/OG) and `BreadcrumbList` JSON-LD, so every link already present in `site.json`'s nav/footer resolves instead of 404ing.

**Architecture:** Plain static folders under `src/app/`, each a Server Component `page.tsx` exporting `metadata`. Pages compose the `shared/` and `ui/` primitives and read content from `src/lib/content.ts` — no new visual system work, this plan is pure content-page assembly on top of the foundation plan's design system.

**Tech Stack:** Same as the foundation plan — Next.js 16.3.2, React 19.2.8, TypeScript 5, Tailwind v4, `@base-ui/react`, `lucide-react`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-26-ziporter-rebuild-design.md`

**Depends on:** `docs/superpowers/plans/2026-08-26-ziporter-foundation-and-homepage.md` must be fully executed first — this plan imports `Section`, `PageHero` (new here), `Card`/`Badge`/`Button`/`Input`, `DashboardMockup`, `JsonLd`, `site`/`solutions`/`industries`/`integrations`/`dashboardMetrics` from `@/lib/content`, and the retheme/fonts already applied to `globals.css`/`layout.tsx`.

## Global Constraints

(Same as the foundation plan — repeated here since a fresh executor may start from this plan file alone.)

- `output: "export"` — every page here is 100% static at build time; `/login`'s form is inert (no submit handler beyond `preventDefault`), not a real auth flow.
- `basePath: "/ziporter"` — internal links use `next/link` with root-relative `href`s only, never hardcoded with the basePath prefix.
- No copied text/stats/UI from Shiprocket/Shipmozo. No invented precise stats — reuse `site.stats.carriers`/`site.stats.pincodes` tokens (`XX+`/`XX,XXX+`) wherever a coverage number is implied.
- No test framework in this repo — verification per task is `npx tsc --noEmit`, `npm run lint`, `npm run build`, plus a concrete manual dev-server check described in each task.
- `/api` is a marketing page, not real API docs. `/login` is a static form shell, no authentication.
- Path alias `@/*` → `./src/*`.
- **`Button` polymorphic pattern:** `@base-ui/react`'s `Button` primitive uses a `render` prop, not shadcn's `asChild` — every `Button`+`Link` pairing in this plan uses `<Button render={<Link href="..." />}>Label</Button>`, confirmed against the foundation plan's Task 9 Step 1a finding.

---

## File Structure

```
src/lib/metadata.ts                          CREATE — pageMetadata() helper
src/components/shared/breadcrumbs.ts         CREATE — buildBreadcrumbJsonLd()
src/components/shared/page-hero.tsx          CREATE — generic interior-page hero
src/components/shared/solution-page-shell.tsx CREATE — shared solution sub-page layout
src/lib/content.ts                           MODIFY — add SITE_URL export, resources export
src/lib/content-types.ts                     MODIFY — add Resource interface
src/data/resources.json                      CREATE
src/app/layout.tsx                           MODIFY — default openGraph siteName
src/app/page.tsx                             MODIFY — retrofit metadata to use pageMetadata()

src/app/solutions/page.tsx                          CREATE
src/app/solutions/domestic-shipping/page.tsx        CREATE
src/app/solutions/b2b-logistics/page.tsx            CREATE
src/app/solutions/reverse-logistics/page.tsx        CREATE
src/app/solutions/hyperlocal/page.tsx               CREATE
src/app/solutions/international-shipping/page.tsx   CREATE
src/app/industries/page.tsx                         CREATE
src/app/integrations/page.tsx                       CREATE
src/app/api/page.tsx                                CREATE
src/app/enterprise-dashboard/page.tsx               CREATE
src/app/resources/page.tsx                          CREATE
src/app/about/page.tsx                              CREATE
src/app/contact/page.tsx                            CREATE
src/app/login/page.tsx                              CREATE
src/components/login-form.tsx                       CREATE
```

---

### Task 1: Metadata helper, breadcrumb JSON-LD helper, `SITE_URL`, and `PageHero`

**Files:**
- Create: `src/lib/metadata.ts`
- Create: `src/components/shared/breadcrumbs.ts`
- Create: `src/components/shared/page-hero.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: `pageMetadata(title: string, description: string): Metadata`; `buildBreadcrumbJsonLd(items: { name: string; href: string }[]): Record<string, unknown>`; `PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string })`; `SITE_URL: string` (exported from `content.ts`) — all four consumed by every route task in this plan.

- [ ] **Step 1: Create `src/lib/metadata.ts`**

```ts
import type { Metadata } from "next"

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  }
}
```

- [ ] **Step 2: Create `src/components/shared/breadcrumbs.ts`**

```ts
export interface BreadcrumbItem {
  name: string
  href: string
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  }
}
```

- [ ] **Step 3: Create `src/components/shared/page-hero.tsx`**

```tsx
import { Section } from "@/components/shared/section"

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description: string
}) {
  return (
    <Section className="pt-14 pb-8 md:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">{title}</h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Add `SITE_URL` to `src/lib/content.ts`**

Add near the top of `src/lib/content.ts` (after the imports, before the `export const site = ...` line):

```ts
export const SITE_URL = "https://ziporter.example.com";
```

- [ ] **Step 5: Add default `openGraph.siteName` in `src/app/layout.tsx`**

In `src/app/layout.tsx`, extend the existing `metadata` export (do not replace it — add the `openGraph` key alongside the existing `title`/`description`):

```ts
export const metadata: Metadata = {
  title: {
    default: "Ziporter — Enterprise Logistics. Simplified.",
    template: "%s | Ziporter",
  },
  description:
    "Ziporter is the courier aggregation platform for Indian enterprises — one API and one dashboard to allocate, ship, track, and reconcile every order across XX+ carriers.",
  openGraph: {
    siteName: "Ziporter",
    type: "website",
  },
};
```

Next.js merges child-route `openGraph` objects on top of this default (child `title`/`description` override, `siteName`/`type` inherit) — verified by Next's metadata merging behavior for nested layouts/pages.

- [ ] **Step 6: Retrofit `src/app/page.tsx`'s metadata to use `pageMetadata`**

In `src/app/page.tsx`, replace:

```ts
export const metadata: Metadata = {
  title: "Ziporter — Enterprise Logistics. Simplified.",
  description:
    "One platform to orchestrate every shipment. Smart carrier allocation, unified tracking, and reverse logistics for Indian enterprises.",
};
```

with:

```ts
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Ziporter — Enterprise Logistics. Simplified.",
  "One platform to orchestrate every shipment. Smart carrier allocation, unified tracking, and reverse logistics for Indian enterprises."
);
```

Remove the now-unused `import type { Metadata } from "next";` line if nothing else in the file references `Metadata`.

- [ ] **Step 7: Verify**

Run `npx tsc --noEmit`, `npm run lint`, `npm run build` — all must pass. Run `npm run dev`, View Source on `http://localhost:3000/ziporter`, confirm `<meta property="og:title" ...>` and `<meta property="og:site_name" content="Ziporter">` are present in `<head>`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/metadata.ts src/components/shared/breadcrumbs.ts src/components/shared/page-hero.tsx src/lib/content.ts src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add page metadata/breadcrumb helpers and PageHero, wire default OG tags"
```

---

### Task 2: Solutions hub + shared solution page shell + 5 solution sub-pages

**Files:**
- Create: `src/components/shared/solution-page-shell.tsx`
- Create: `src/app/solutions/page.tsx`
- Create: `src/app/solutions/domestic-shipping/page.tsx`
- Create: `src/app/solutions/b2b-logistics/page.tsx`
- Create: `src/app/solutions/reverse-logistics/page.tsx`
- Create: `src/app/solutions/hyperlocal/page.tsx`
- Create: `src/app/solutions/international-shipping/page.tsx`

**Interfaces:**
- Consumes: `Solution` type, `solutions` array, `SITE_URL`, `site` from `@/lib/content`; `pageMetadata`, `buildBreadcrumbJsonLd`, `JsonLd`, `Section`, `PageHero`, `Button`, `Card`/`CardHeader`/`CardTitle`/`CardDescription`.
- Produces: `SolutionPageShell({ solution }: { solution: Solution })`, and 6 routes (`/solutions`, `/solutions/domestic-shipping`, `/solutions/b2b-logistics`, `/solutions/reverse-logistics`, `/solutions/hyperlocal`, `/solutions/international-shipping`).

This is one task (not six) because all six files are mechanically derived from `solutions.json` through the same shell component — a reviewer cannot meaningfully approve one sub-page while rejecting a sibling that differs only by which `slug` it passes in.

- [ ] **Step 1: Create `src/components/shared/solution-page-shell.tsx`**

```tsx
import Link from "next/link"
import { JsonLd } from "@/components/shared/json-ld"
import { Section } from "@/components/shared/section"
import { Button } from "@/components/ui/button"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { SITE_URL, site } from "@/lib/content"
import type { Solution } from "@/lib/content-types"

export function SolutionPageShell({ solution }: { solution: Solution }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Solutions", href: `${SITE_URL}/solutions` },
    { name: solution.name, href: `${SITE_URL}/solutions/${solution.slug}` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <Section className="pt-14 pb-8 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Solutions
          </span>
          <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">
            {solution.name}
          </h1>
          <p className="mt-4 text-muted-foreground">{solution.heroDescription}</p>
        </div>
      </Section>
      <Section background="muted">
        <h2 className="font-heading text-2xl font-bold text-foreground">Outcomes</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {solution.outcomes.map((outcome) => (
            <li
              key={outcome}
              className="rounded-xl border border-border bg-background p-4 text-sm text-foreground"
            >
              {outcome}
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground">
          <h2 className="font-heading text-2xl font-bold">
            See {solution.shortName} in action
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" render={<Link href={site.cta.secondary.href} />}>
              {site.cta.secondary.label}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              render={<Link href={site.cta.primary.href} />}
            >
              {site.cta.primary.label}
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 2: Create `src/app/solutions/page.tsx`** (the hub)

```tsx
import Link from "next/link"
import { Truck, Boxes, RotateCcw, Zap, Globe, type LucideIcon } from "lucide-react"
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, solutions } from "@/lib/content"

const iconMap: Record<string, LucideIcon> = { Truck, Boxes, RotateCcw, Zap, Globe }

export const metadata = pageMetadata(
  "Solutions",
  "Domestic, B2B, reverse, hyperlocal, and international logistics solutions on one platform."
)

export default function SolutionsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Solutions", href: `${SITE_URL}/solutions` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Solutions"
        title="A solution for every shipment type"
        description="From domestic parcels to cross-border freight, Ziporter's allocation engine adapts to how you ship."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  )
}
```

- [ ] **Step 3: Create `src/app/solutions/domestic-shipping/page.tsx`**

```tsx
import { SolutionPageShell } from "@/components/shared/solution-page-shell"
import { pageMetadata } from "@/lib/metadata"
import { solutions } from "@/lib/content"

const solution = solutions.find((s) => s.slug === "domestic-shipping")!

export const metadata = pageMetadata(solution.name, solution.summary)

export default function DomesticShippingPage() {
  return <SolutionPageShell solution={solution} />
}
```

- [ ] **Step 4: Create the remaining 4 solution pages**

Each file is the exact same code as Step 3, with only the `find()` slug and the default export's function name changed. Create these 4 files verbatim per the table below:

| File | slug in `.find()` | function name |
|---|---|---|
| `src/app/solutions/b2b-logistics/page.tsx` | `"b2b-logistics"` | `B2bLogisticsPage` |
| `src/app/solutions/reverse-logistics/page.tsx` | `"reverse-logistics"` | `ReverseLogisticsPage` |
| `src/app/solutions/hyperlocal/page.tsx` | `"hyperlocal"` | `HyperlocalPage` |
| `src/app/solutions/international-shipping/page.tsx` | `"international-shipping"` | `InternationalShippingPage` |

Example, `src/app/solutions/b2b-logistics/page.tsx`:

```tsx
import { SolutionPageShell } from "@/components/shared/solution-page-shell"
import { pageMetadata } from "@/lib/metadata"
import { solutions } from "@/lib/content"

const solution = solutions.find((s) => s.slug === "b2b-logistics")!

export const metadata = pageMetadata(solution.name, solution.summary)

export default function B2bLogisticsPage() {
  return <SolutionPageShell solution={solution} />
}
```

Apply the same substitution for `reverse-logistics`/`ReverseLogisticsPage`, `hyperlocal`/`HyperlocalPage`, and `international-shipping`/`InternationalShippingPage`.

- [ ] **Step 5: Verify**

Run `npm run dev`. Visit `/solutions` — confirm 5 cards, each linking correctly. Click through to all 5 sub-pages and confirm each renders its own name/description/outcomes/CTA, and that the homepage's `SolutionsGrid` section (built in the foundation plan) now links to working pages instead of 404s. View Source on one sub-page and confirm a `BreadcrumbList` JSON-LD block with 3 items (Home, Solutions, the solution name). Run `npx tsc --noEmit`, `npm run lint`, `npm run build`.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/solution-page-shell.tsx src/app/solutions/
git commit -m "feat: add solutions hub and 5 solution sub-pages"
```

---

### Task 3: `/industries` page

**Files:**
- Create: `src/app/industries/page.tsx`

- [ ] **Step 1: Create `src/app/industries/page.tsx`**

```tsx
import { ShoppingCart, Shirt, Smartphone, HeartPulse, ShoppingBasket, Factory, type LucideIcon } from "lucide-react"
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, industries } from "@/lib/content"

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart, Shirt, Smartphone, HeartPulse, ShoppingBasket, Factory,
}

export const metadata = pageMetadata(
  "Industries",
  "Logistics built for e-commerce, fashion, electronics, health, FMCG, and manufacturing."
)

export default function IndustriesPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Industries", href: `${SITE_URL}/industries` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Industries"
        title="Logistics tuned to your category"
        description="Every industry ships differently — Ziporter's allocation rules and workflows adapt to how your category actually moves."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  )
}
```

- [ ] **Step 2: Verify**

`npm run dev`, visit `/industries`, confirm 6 industry cards and a `BreadcrumbList` JSON-LD (Home, Industries) in View Source.

- [ ] **Step 3: Commit**

```bash
git add src/app/industries/page.tsx
git commit -m "feat: add industries page"
```

---

### Task 4: `/integrations` page

**Files:**
- Create: `src/app/integrations/page.tsx`

- [ ] **Step 1: Create `src/app/integrations/page.tsx`**

```tsx
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, integrations } from "@/lib/content"

export const metadata = pageMetadata(
  "Integrations",
  "Prebuilt e-commerce connectors and a REST API for any ERP or WMS."
)

export default function IntegrationsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Integrations", href: `${SITE_URL}/integrations` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Integrations"
        title="Connect Ziporter to your stack"
        description="Prebuilt connectors for popular platforms, plus a REST API and webhooks for anything custom."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((i) => (
            <Card key={i.name}>
              <CardContent className="py-6">
                <div className="text-sm font-semibold text-foreground">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.category}</div>
                <p className="mt-2 text-sm text-muted-foreground">{i.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 2: Verify**

`npm run dev`, visit `/integrations`, confirm 6 integration cards with name/category/description.

- [ ] **Step 3: Commit**

```bash
git add src/app/integrations/page.tsx
git commit -m "feat: add integrations page"
```

---

### Task 5: `/api` page

**Files:**
- Create: `src/app/api/page.tsx`

- [ ] **Step 1: Create `src/app/api/page.tsx`**

```tsx
import Link from "next/link"
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, site } from "@/lib/content"

export const metadata = pageMetadata(
  "API",
  "One REST API for shipment creation, allocation, and tracking across every carrier."
)

const requestSample = `POST /v1/shipments
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "order_id": "ORD-48213",
  "pickup_pincode": "560103",
  "delivery_pincode": "110045",
  "weight_kg": 1.2,
  "payment_mode": "prepaid"
}`

const responseSample = `200 OK
{
  "shipment_id": "ZP-9931882",
  "carrier": "auto-allocated",
  "status": "booked",
  "eta": "2026-08-29"
}`

const webhookSample = `POST https://your-endpoint.example.com/webhooks/ziporter
{
  "event": "shipment.status_updated",
  "shipment_id": "ZP-9931882",
  "status": "out_for_delivery"
}`

export default function ApiPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "API", href: `${SITE_URL}/api` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Developer API"
        title="One API for every carrier"
        description="Create shipments, check allocation, and receive real-time status webhooks — without integrating each carrier individually."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
                Request
              </div>
              <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-primary-foreground/90">
                <code>{requestSample}</code>
              </pre>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
                Response
              </div>
              <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-primary-foreground/90">
                <code>{responseSample}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6 bg-primary text-primary-foreground">
          <CardContent className="py-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
              Status webhook
            </div>
            <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-primary-foreground/90">
              <code>{webhookSample}</code>
            </pre>
          </CardContent>
        </Card>
      </Section>
      <Section background="muted">
        <div className="rounded-3xl bg-background px-6 py-12 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Get API access</h2>
          <p className="mt-2 text-muted-foreground">
            API keys are provisioned as part of enterprise onboarding.
          </p>
          <div className="mt-6 flex justify-center">
            <Button size="lg" render={<Link href={site.cta.secondary.href} />}>
              {site.cta.secondary.label}
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 2: Verify**

`npm run dev`, visit `/api`, confirm three navy code-preview cards (request, response, webhook) in Geist Mono and a "Get API access" CTA linking to `/request-demo`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/page.tsx
git commit -m "feat: add API marketing page"
```

---

### Task 6: `/enterprise-dashboard` page

**Files:**
- Create: `src/app/enterprise-dashboard/page.tsx`

- [ ] **Step 1: Create `src/app/enterprise-dashboard/page.tsx`**

```tsx
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { DashboardMockup } from "@/components/shared/dashboard-mockup"
import { Card, CardContent } from "@/components/ui/card"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, dashboardMetrics } from "@/lib/content"

export const metadata = pageMetadata(
  "Enterprise Dashboard",
  "See how the Ziporter operations dashboard brings every carrier, shipment, and exception into one view."
)

export default function EnterpriseDashboardPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Enterprise Dashboard", href: `${SITE_URL}/enterprise-dashboard` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Enterprise Dashboard"
        title="Every shipment, every carrier, one screen"
        description="A preview of the operations view your team gets on day one."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <DashboardMockup metrics={dashboardMetrics} />
          <div className="space-y-4">
            <Card>
              <CardContent className="py-4">
                <div className="text-sm font-semibold text-foreground">Carrier Performance</div>
                <div className="text-xs text-muted-foreground">
                  Compare on-time rate, cost, and NDR% across every connected carrier.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-sm font-semibold text-foreground">Exception Queue</div>
                <div className="text-xs text-muted-foreground">
                  Every NDR and delayed shipment surfaced for action, sorted by urgency.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-sm font-semibold text-foreground">Reconciliation</div>
                <div className="text-xs text-muted-foreground">
                  COD and invoice reconciliation exportable by carrier and date range.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 2: Verify**

`npm run dev`, visit `/enterprise-dashboard`, confirm the dashboard mockup on the left and 3 stacked capability cards on the right (reflowing to stacked on mobile).

- [ ] **Step 3: Commit**

```bash
git add src/app/enterprise-dashboard/page.tsx
git commit -m "feat: add enterprise dashboard showcase page"
```

---

### Task 7: `/resources` page and `resources.json` data

**Files:**
- Create: `src/data/resources.json`
- Create: `src/app/resources/page.tsx`
- Modify: `src/lib/content-types.ts` — add `Resource` interface
- Modify: `src/lib/content.ts` — import and export `resources`

**Interfaces:**
- Produces: `Resource` type, `resources: Resource[]` export from `content.ts`.

- [ ] **Step 1: Create `src/data/resources.json`**

```json
[
  { "title": "Choosing the right carrier mix for your business", "category": "Guide", "description": "How to evaluate carrier coverage, cost, and performance before you commit volume." },
  { "title": "Reducing RTO in fashion and apparel", "category": "Guide", "description": "Practical steps to lower return-to-origin rates in high-return categories." },
  { "title": "A checklist for switching logistics platforms", "category": "Checklist", "description": "What to plan for when migrating shipment volume to a new platform." },
  { "title": "Understanding NDR management", "category": "Guide", "description": "Why non-delivery reports happen and how automated workflows reduce them." },
  { "title": "Reverse logistics 101", "category": "Guide", "description": "Setting up a returns workflow that doesn't burden your support team." },
  { "title": "Enterprise shipping glossary", "category": "Reference", "description": "Common logistics and carrier-allocation terminology explained." }
]
```

- [ ] **Step 2: Add `Resource` to `src/lib/content-types.ts`**

Append at the end of the file:

```ts
export interface Resource {
  title: string;
  category: string;
  description: string;
}
```

- [ ] **Step 3: Wire `resources` into `src/lib/content.ts`**

Add the import near the other `*Raw` imports:

```ts
import resourcesRaw from "@/data/resources.json";
```

Add the type import:

```ts
import type { Resource } from "@/lib/content-types";
```

(Add `Resource` to the existing multi-line type import list rather than a separate statement.)

Add the export:

```ts
export const resources = resourcesRaw as Resource[];
```

- [ ] **Step 4: Create `src/app/resources/page.tsx`**

```tsx
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, resources } from "@/lib/content"

export const metadata = pageMetadata(
  "Resources",
  "Guides and references for running enterprise logistics operations."
)

export default function ResourcesPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Resources", href: `${SITE_URL}/resources` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Resources"
        title="Guides for logistics operators"
        description="Practical reading on carrier allocation, returns, and running enterprise shipping operations."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Card key={r.title}>
              <CardHeader>
                <Badge variant="outline">{r.category}</Badge>
                <CardTitle className="mt-2 text-base">{r.title}</CardTitle>
                <CardDescription>{r.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` (confirms the `Resource` type/JSON shape line up). `npm run dev`, visit `/resources`, confirm 6 resource cards each with a category badge.

- [ ] **Step 6: Commit**

```bash
git add src/data/resources.json src/lib/content-types.ts src/lib/content.ts src/app/resources/page.tsx
git commit -m "feat: add resources page and resources data"
```

---

### Task 8: `/about` page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create `src/app/about/page.tsx`**

```tsx
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, site } from "@/lib/content"

export const metadata = pageMetadata(
  "About",
  "Ziporter builds logistics infrastructure for Indian enterprises."
)

export default function AboutPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "About", href: `${SITE_URL}/about` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="About Ziporter"
        title="Logistics infrastructure for growing enterprises"
        description={site.description}
      />
      <Section>
        <div className="mx-auto grid max-w-3xl gap-6">
          <p className="text-muted-foreground">
            Ziporter was built on a simple premise: enterprise shipping teams shouldn&apos;t
            have to juggle a dozen carrier dashboards to run one operation. We built the
            allocation, tracking, and reconciliation layer that sits on top of every carrier
            you already use — so your team manages shipments in one place instead of many.
          </p>
          <p className="text-muted-foreground">
            Our platform is built for operations and logistics teams at growing Indian
            businesses — from D2C brands managing thousands of daily orders to enterprises
            coordinating bulk B2B freight across the country.
          </p>
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 2: Verify**

`npm run dev`, visit `/about`, confirm hero + two paragraphs render, no apostrophe/JSX escaping errors (note the `&apos;` escape in "shouldn't" — required because raw `'` inside JSX text is an ESLint `react/no-unescaped-entities` violation under `eslint-config-next`).

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add about page"
```

---

### Task 9: `/contact` page

**Files:**
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: Create `src/app/contact/page.tsx`**

```tsx
import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL, site } from "@/lib/content"

export const metadata = pageMetadata(
  "Contact",
  "Talk to the Ziporter team about your shipping volume and operations."
)

export default function ContactPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Contact", href: `${SITE_URL}/contact` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Contact"
        title="Talk to a logistics expert"
        description="Tell us about your shipping volume and we'll route you to the right person on our team."
      />
      <Section>
        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 py-6">
              <Mail className="size-5 text-accent" />
              <div>
                <div className="text-sm font-semibold text-foreground">Email sales</div>
                <a
                  href={`mailto:${site.contact.salesEmail}`}
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  {site.contact.salesEmail}
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-6">
              <Phone className="size-5 text-accent" />
              <div>
                <div className="text-sm font-semibold text-foreground">Call us</div>
                <span className="text-sm text-muted-foreground">{site.contact.phone}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 flex justify-center">
          <Button size="lg" render={<Link href={site.cta.secondary.href} />}>
            {site.cta.secondary.label}
          </Button>
        </div>
      </Section>
    </>
  )
}
```

Note: `we'll` in the JSX text above is inside a string passed as a `description` prop (not raw JSX children text), so it does NOT trigger `react/no-unescaped-entities` — that rule only fires on unescaped apostrophes in JSX element children, not in string/prop literals. Contrast with Task 8, where the apostrophe is in `<p>` children and needed `&apos;`.

- [ ] **Step 2: Verify**

`npm run dev`, visit `/contact`, confirm email/phone cards (mailto link works) and the "Request a Demo" CTA button.

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: add contact page"
```

---

### Task 10: `/login` page (static stub)

**Files:**
- Create: `src/components/login-form.tsx`
- Create: `src/app/login/page.tsx`

**Interfaces:**
- Produces: `LoginForm()` (client component), `login/page.tsx` (server component wrapping it) — split this way because a page file with `metadata` export must be a Server Component, but the form needs `"use client"` for its (no-op) `onSubmit` handler.

- [ ] **Step 1: Create `src/components/login-form.tsx`**

```tsx
"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function LoginForm() {
  return (
    <div className="mx-auto max-w-sm">
      <div className="flex justify-center">
        <Logo />
      </div>
      <Card className="mt-8">
        <CardContent className="py-6">
          <h1 className="font-heading text-xl font-semibold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This is a demo environment — login is not enabled.
          </p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Work email
              </label>
              <Input id="email" type="email" placeholder="you@company.com" className="mt-1" disabled />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1" disabled />
            </div>
            <Button type="submit" className="w-full" disabled>
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Want access?{" "}
            <Link href="/request-demo" className="text-accent hover:underline">
              Request a demo
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/login/page.tsx`**

```tsx
import { Section } from "@/components/shared/section"
import { LoginForm } from "@/components/login-form"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata(
  "Login",
  "Sign in to your Ziporter account."
)

export default function LoginPage() {
  return (
    <Section className="py-20">
      <LoginForm />
    </Section>
  )
}
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/login`, confirm the centered card with disabled email/password inputs and a disabled "Sign in" button (both inputs and button visibly disabled — not a functioning form, matching the spec's "static form shell, no auth" requirement), plus a working link to `/request-demo`.

- [ ] **Step 4: Commit**

```bash
git add src/components/login-form.tsx src/app/login/page.tsx
git commit -m "feat: add static login page stub"
```

---

### Task 11: Full site link audit

**Files:**
- None created/modified — verification-only task confirming every route this plan and the foundation plan promised actually resolves.

- [ ] **Step 1: Grep every `href` in `site.json` and confirm a matching route folder exists**

```bash
grep -o '"href": "[^"]*"' src/config/site.json | sort -u
```

For every value printed (excluding `"#"` placeholders for social links), confirm a corresponding `src/app/<path>/page.tsx` exists on disk. Cross-check against: `/`, `/solutions`, `/solutions/domestic-shipping`, `/solutions/b2b-logistics`, `/solutions/reverse-logistics`, `/solutions/hyperlocal`, `/solutions/international-shipping`, `/industries`, `/integrations`, `/api`, `/enterprise-dashboard`, `/resources`, `/about`, `/contact`, `/login`. (`/request-demo` and `/track` are intentionally not yet built — that's the next plan; confirm they're absent for now, not broken.)

- [ ] **Step 2: Full build and click-through**

Run `npm run build` (must succeed — confirms every internal `Link` resolves at build time, since `output: "export"` fails the build on unresolvable static params, though plain `Link href` typos to a missing folder won't fail the build, only 404 at runtime — so also do a manual pass). Run `npm run dev` and manually click every link in the desktop nav, the mobile nav, and all 5 footer columns, confirming none 404 (aside from the two intentionally-deferred routes, which are not linked from anywhere yet since `site.json`'s CTAs already point at `/request-demo`/`/track` — note any such link currently 404s and will be resolved by the next plan, not a defect in this one).

- [ ] **Step 3: No commit** — this is a verification-only task with no file changes. If Step 1 or Step 2 finds a genuine gap (a route this plan should have built but didn't), fix it as part of the relevant task above and re-run this audit.

---

## Self-Review

**Spec coverage:** §5 sitemap — every route except `/request-demo` and `/track` (explicitly deferred to the next plan per spec §7) now exists: `/solutions` + 5 sub-pages (Task 2), `/industries` (Task 3), `/integrations` (Task 4), `/api` (Task 5), `/enterprise-dashboard` (Task 6), `/resources` (Task 7), `/about` (Task 8), `/contact` (Task 9), `/login` (Task 10). §5's "each route gets its own `page.tsx` with a static `metadata` export" and "sub-pages render a shared `BreadcrumbList` JSON-LD + common page shell" — satisfied via `pageMetadata()` (Task 1) and `SolutionPageShell`/`buildBreadcrumbJsonLd` (Tasks 1-2), applied to every single page created in this plan. §8 OG tags — satisfied via `pageMetadata()`'s `openGraph` field plus the root layout default (Task 1).

**Placeholder scan:** no "TBD"/vague instructions. Task 2 Step 4's "same code with substitutions" table is a complete, unambiguous mechanical instruction (not a vague "similar to" reference) — full example code is given for one file plus an exact substitution table for the other four.

**Type consistency:** `Resource` interface (Task 7) fields (`title`, `category`, `description`) match `resources.json` exactly. `buildBreadcrumbJsonLd`'s `BreadcrumbItem` shape (`{ name, href }`) is used identically across Tasks 2-10. `pageMetadata(title, description)` signature is used identically in every page task.

**Cross-plan dependency check:** this plan assumes the foundation plan's `Section`, `Card`/`CardHeader`/`CardTitle`/`CardDescription`, `Badge`, `Button` (with the `render` prop pattern), `Input`, `DashboardMockup`, `JsonLd`, `Logo`, and `src/lib/content.ts`/`content-types.ts` already exist exactly as that plan defines them — verified by name and import path against that plan's File Structure section.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-26-ziporter-routes.md`.

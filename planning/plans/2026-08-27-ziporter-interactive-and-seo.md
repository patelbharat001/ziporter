# Ziporter Interactive Pieces & SEO Files — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two remaining sitemap routes that need client-side interactivity — `/track` (shipment tracking lookup against mock data) and `/request-demo` (validated lead-capture form with a local success state) — plus `src/app/sitemap.ts` and `src/app/robots.ts`. This closes out every route and every CTA link promised by `site.json`.

**Architecture:** Same static-export pattern as the other two plans: each route is a Server Component `page.tsx` (metadata export) wrapping a `"use client"` component that owns all interactive state. No data leaves the browser — `/track` looks up against a local JSON fixture, `/request-demo` simulates a submit with a `setTimeout` and local state transition. `sitemap.ts`/`robots.ts` are Next 16 file-convention route handlers that render to static `sitemap.xml`/`robots.txt` at build time (verified static-export-safe: neither uses a request-time API, so `output: "export"` can pre-render them).

**Tech Stack:** Same as the other two plans — Next.js 16.3.2, React 19.2.8, TypeScript 5, Tailwind v4, `@base-ui/react`, `lucide-react`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-26-ziporter-rebuild-design.md` (§5 Sitemap, §7 Interactive Pieces, §8 SEO/Schema/Metadata)

**Depends on:**
- `docs/superpowers/plans/2026-08-26-ziporter-foundation-and-homepage.md` — must be fully executed first (design system, `ui/` primitives, `shared/section.tsx`, `shared/json-ld.tsx`, `src/lib/content.ts`/`content-types.ts`).
- `docs/superpowers/plans/2026-08-26-ziporter-routes.md` — must be fully executed first (`pageMetadata()`, `buildBreadcrumbJsonLd()`, `PageHero`, `SITE_URL` export from `content.ts`). This plan follows that plan's exact page-shell pattern.

## Global Constraints

(Same as the other two plans — repeated here since a fresh executor may start from this plan file alone.)

- `output: "export"` — no server actions, no runtime `fetch`, no dynamic route handlers. `/track` and `/request-demo` are Client Components with local state only; nothing is actually submitted anywhere.
- `basePath: "/ziporter"` — internal links use `next/link` with root-relative `href`s only, never hardcoded with the basePath prefix.
- No test framework in this repo — verification per task is `npx tsc --noEmit`, `npm run lint`, `npm run build`, plus a concrete manual dev-server check described in each task.
- Path alias `@/*` → `./src/*`.
- `SITE_URL = "https://ziporter.example.com"` (defined in `content.ts` by the routes plan) is a placeholder future production domain, assumed deployed at its own root — it is used for `sitemap.ts`/`robots.ts`/JSON-LD absolute URLs and deliberately does NOT include the `/ziporter` basePath, consistent with how the routes plan's `SolutionPageShell` and every page task already build breadcrumb JSON-LD.
- `next.config.ts` sets `trailingSlash: true` — every exported page is served at a trailing-slash URL (e.g. `/solutions/`), so `sitemap.ts` must emit trailing-slash URLs for every non-root route to match what's actually deployed.

---

## File Structure

```
src/lib/content-types.ts            MODIFY — add TrackingEvent, TrackingRecord interfaces
src/lib/content.ts                  MODIFY — add trackingRecords export
src/data/tracking-mock.json         CREATE — 3 sample AWBs (Delivered, In Transit, Exception)

src/components/shared/status-timeline.tsx  CREATE
src/components/tracking-form.tsx           CREATE
src/app/track/page.tsx                     CREATE

src/components/request-demo-form.tsx       CREATE
src/app/request-demo/page.tsx              CREATE

src/app/sitemap.ts                  CREATE
src/app/robots.ts                   CREATE
```

---

### Task 1: Tracking types, mock data, and `content.ts` wiring

**Files:**
- Modify: `src/lib/content-types.ts`
- Modify: `src/lib/content.ts`
- Create: `src/data/tracking-mock.json`

**Interfaces:**
- Produces: `TrackingEvent`, `TrackingRecord` types; `trackingRecords: TrackingRecord[]` export from `content.ts`, consumed by `tracking-form.tsx` (Task 3) and `status-timeline.tsx` (Task 2).

- [ ] **Step 1: Append to `src/lib/content-types.ts`**

```ts
export interface TrackingEvent {
  status: string;
  timestamp: string;
  location: string;
  note?: string;
}

export interface TrackingRecord {
  awb: string;
  status: "Delivered" | "In Transit" | "Exception" | "RTO Initiated";
  carrier: string;
  origin: string;
  destination: string;
  maskedAddress: string;
  events: TrackingEvent[];
}
```

- [ ] **Step 2: Create `src/data/tracking-mock.json`**

```json
[
  {
    "awb": "AWB1234567890",
    "status": "Delivered",
    "carrier": "BlueDart",
    "origin": "Bengaluru Fulfillment Center",
    "destination": "Pune, Maharashtra",
    "maskedAddress": "H.No. 4**, ***** Nagar, Pune - 4110**",
    "events": [
      { "status": "Booked", "timestamp": "2026-08-20 10:15", "location": "Bengaluru Fulfillment Center" },
      { "status": "Picked Up", "timestamp": "2026-08-20 14:40", "location": "Bengaluru Fulfillment Center" },
      { "status": "In Transit", "timestamp": "2026-08-21 09:05", "location": "Mumbai Hub" },
      { "status": "Out for Delivery", "timestamp": "2026-08-22 08:30", "location": "Pune" },
      { "status": "Delivered", "timestamp": "2026-08-22 13:52", "location": "Pune" }
    ]
  },
  {
    "awb": "AWB2233445566",
    "status": "In Transit",
    "carrier": "Delhivery",
    "origin": "Delhi Fulfillment Center",
    "destination": "Jaipur, Rajasthan",
    "maskedAddress": "Plot **, ***** Colony, Jaipur - 3020**",
    "events": [
      { "status": "Booked", "timestamp": "2026-08-24 11:00", "location": "Delhi Fulfillment Center" },
      { "status": "Picked Up", "timestamp": "2026-08-24 16:20", "location": "Delhi Fulfillment Center" },
      { "status": "In Transit", "timestamp": "2026-08-25 07:15", "location": "Jaipur Hub" }
    ]
  },
  {
    "awb": "AWB9988776655",
    "status": "Exception",
    "carrier": "Ecom Express",
    "origin": "Chennai Fulfillment Center",
    "destination": "Hyderabad, Telangana",
    "maskedAddress": "Flat ***, ***** Towers, Hyderabad - 5000**",
    "events": [
      { "status": "Booked", "timestamp": "2026-08-18 09:40", "location": "Chennai Fulfillment Center" },
      { "status": "Picked Up", "timestamp": "2026-08-18 15:10", "location": "Chennai Fulfillment Center" },
      { "status": "In Transit", "timestamp": "2026-08-19 10:00", "location": "Hyderabad Hub" },
      { "status": "Exception", "timestamp": "2026-08-20 12:35", "location": "Hyderabad Hub", "note": "Delivery attempt failed — recipient unavailable." }
    ]
  }
]
```

- [ ] **Step 3: Wire into `src/lib/content.ts`**

Add the import near the other `*Raw` imports:

```ts
import trackingMockRaw from "@/data/tracking-mock.json";
```

Add `TrackingRecord` to the existing multi-line type import list from `@/lib/content-types`.

Add the export:

```ts
export const trackingRecords = trackingMockRaw as TrackingRecord[];
```

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit` — confirms `tracking-mock.json`'s shape matches `TrackingRecord[]` via the `as` cast. Run `npm run build` — must succeed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/content-types.ts src/lib/content.ts src/data/tracking-mock.json
git commit -m "feat: add tracking mock data and types"
```

---

### Task 2: `shared/status-timeline.tsx`

**Files:**
- Create: `src/components/shared/status-timeline.tsx`

**Interfaces:**
- Consumes: `TrackingRecord` type from `@/lib/content-types`.
- Produces: `StatusTimeline({ record }: { record: TrackingRecord })`, consumed by `tracking-form.tsx` (Task 3).

Behavior: shows the fixed 5-step happy path (`Booked → Picked Up → In Transit → Out for Delivery → Delivered`) with each step marked done/pending based on which statuses appear in `record.events`. For a shipment whose `status` is `"Exception"` or `"RTO Initiated"`, the path is truncated to the first 3 steps plus a 4th step showing the exception status in red — it does not force an "Out for Delivery"/"Delivered" step that never happened.

- [ ] **Step 1: Create `src/components/shared/status-timeline.tsx`**

```tsx
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TrackingRecord } from "@/lib/content-types"

const HAPPY_PATH = ["Booked", "Picked Up", "In Transit", "Out for Delivery", "Delivered"]

export function StatusTimeline({ record }: { record: TrackingRecord }) {
  const isException = record.status === "Exception" || record.status === "RTO Initiated"
  const completedStatuses = new Set(record.events.map((e) => e.status))
  const steps = isException ? [...HAPPY_PATH.slice(0, 3), record.status] : HAPPY_PATH

  return (
    <ol className="space-y-4">
      {steps.map((step, i) => {
        const exceptionStep = isException && i === steps.length - 1
        const done = completedStatuses.has(step)
        const event = record.events.find((e) => e.status === step)
        return (
          <li key={step} className="flex gap-3">
            {exceptionStep ? (
              <AlertTriangle className="size-5 shrink-0 text-destructive" />
            ) : done ? (
              <CheckCircle2 className="size-5 shrink-0 text-success" />
            ) : (
              <Circle className="size-5 shrink-0 text-muted-foreground" />
            )}
            <div>
              <div
                className={cn(
                  "text-sm font-medium",
                  exceptionStep ? "text-destructive" : "text-foreground"
                )}
              >
                {step}
              </div>
              {event && (
                <div className="text-xs text-muted-foreground">
                  {event.timestamp} · {event.location}
                  {event.note && <div>{event.note}</div>}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
```

- [ ] **Step 2: Verify**

Temporarily render `<StatusTimeline record={trackingRecords[0]} />` (import from `@/lib/content`) in `src/app/page.tsx`, run `npm run dev`. Confirm all 5 steps show green checkmarks (the Delivered fixture has every event). Swap the index to `trackingRecords[1]` (In Transit) and confirm only the first 3 steps are checked, the last 2 show empty circles. Swap to `trackingRecords[2]` (Exception) and confirm 4 steps total, the last one red with a triangle icon and the note text visible. Remove the temporary render afterward.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/status-timeline.tsx
git commit -m "feat: add shipment status timeline component"
```

---

### Task 3: `/track` page

**Files:**
- Create: `src/components/tracking-form.tsx`
- Create: `src/app/track/page.tsx`

**Interfaces:**
- Produces: `TrackingForm()` (client component), `track/page.tsx` (server component with metadata) — split for the same reason as `/login`: a page file with a `metadata` export must be a Server Component, but the lookup form needs `"use client"`.

- [ ] **Step 1: Create `src/components/tracking-form.tsx`**

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusTimeline } from "@/components/shared/status-timeline"
import { trackingRecords } from "@/lib/content"
import type { TrackingRecord } from "@/lib/content-types"

type LookupState =
  | { kind: "idle" }
  | { kind: "not-found" }
  | { kind: "found"; record: TrackingRecord }

export function TrackingForm() {
  const [awb, setAwb] = useState("")
  const [state, setState] = useState<LookupState>({ kind: "idle" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = awb.trim().toUpperCase()
    const record = trackingRecords.find((r) => r.awb === query)
    setState(record ? { kind: "found", record } : { kind: "not-found" })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          placeholder="Enter AWB / tracking number"
          aria-label="AWB tracking number"
        />
        <Button type="submit">
          <Search className="size-4" />
          Track
        </Button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        Try{" "}
        <button type="button" className="underline" onClick={() => setAwb("AWB1234567890")}>
          AWB1234567890
        </button>{" "}
        (Delivered),{" "}
        <button type="button" className="underline" onClick={() => setAwb("AWB2233445566")}>
          AWB2233445566
        </button>{" "}
        (In Transit), or{" "}
        <button type="button" className="underline" onClick={() => setAwb("AWB9988776655")}>
          AWB9988776655
        </button>{" "}
        (Exception).
      </p>

      {state.kind === "not-found" && (
        <Card className="mt-6 border-destructive/40">
          <CardContent className="py-6 text-sm text-foreground">
            We couldn&apos;t find a shipment with that AWB number. Double-check the
            number and try again, or{" "}
            <Link href="/contact" className="text-accent hover:underline">
              contact support
            </Link>
            .
          </CardContent>
        </Card>
      )}

      {state.kind === "found" && (
        <Card className="mt-6">
          <CardContent className="space-y-6 py-6">
            <div>
              <div className="text-sm font-semibold text-foreground">{state.record.awb}</div>
              <div className="text-xs text-muted-foreground">
                {state.record.carrier} · {state.record.origin} → {state.record.destination}
              </div>
            </div>
            <StatusTimeline record={state.record} />
            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              Delivery address: {state.record.maskedAddress}
            </div>
            <div className="text-center">
              <Link href="/contact" className="text-sm text-accent hover:underline">
                Need help with this shipment? Contact support
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

Note: the "try these AWBs" hint buttons are a deliberate UX affordance for a prototype with no real backend — they let a reviewer exercise all 3 fixture cases without knowing the mock data by heart. `&apos;` in "couldn't" is required (raw JSX children text, same `react/no-unescaped-entities` rule noted in the routes plan's `/about` task).

- [ ] **Step 2: Create `src/app/track/page.tsx`**

```tsx
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { TrackingForm } from "@/components/tracking-form"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL } from "@/lib/content"

export const metadata = pageMetadata(
  "Track Shipment",
  "Track the status of any Ziporter shipment using its AWB number."
)

export default function TrackPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Track Shipment", href: `${SITE_URL}/track` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Track Shipment"
        title="Where's your shipment?"
        description="Enter your AWB / tracking number to see the latest status."
      />
      <Section className="pt-0">
        <TrackingForm />
      </Section>
    </>
  )
}
```

Note: `"Where's your shipment?"` is a string literal passed as the `title` prop, not raw JSX children — no `&apos;` escaping needed (same reasoning as the routes plan's `/contact` task note).

- [ ] **Step 3: Verify**

Run `npm run dev`, visit `/track`. Submit an empty form — expect "not found" (no fixture has an empty AWB). Try each of the 3 hint buttons: confirm Delivered shows a full green timeline, In Transit shows a partially-checked timeline, Exception shows the 4-step red-terminated timeline with its note. Confirm the masked address renders exactly as stored (not a real address). Confirm `View Source` shows a `BreadcrumbList` JSON-LD (Home, Track Shipment).

- [ ] **Step 4: Commit**

```bash
git add src/components/tracking-form.tsx src/app/track/page.tsx
git commit -m "feat: add shipment tracking page"
```

---

### Task 4: `/request-demo` page

**Files:**
- Create: `src/components/request-demo-form.tsx`
- Create: `src/app/request-demo/page.tsx`

**Interfaces:**
- Produces: `RequestDemoForm()` (client component), `request-demo/page.tsx` (server component with metadata) — same split pattern as Task 3.
- Consumes: `solutions` from `@/lib/content` (drives the "shipment types" checkbox list off the same 5 solutions used everywhere else, instead of a separately invented list).

Fields per spec §7: name, work email, mobile, company name, company website (optional), business type, monthly volume, shipment types (multi-select), current challenge (optional textarea), preferred demo time, consent checkbox. Required fields are validated on submit (not per-keystroke); email format is checked with a simple regex. On successful submit, the form is replaced by a static "thank you" panel after a short simulated delay — no data leaves the browser.

- [ ] **Step 1: Create `src/components/request-demo-form.tsx`**

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { solutions } from "@/lib/content"

const BUSINESS_TYPES = [
  "E-commerce / D2C",
  "B2B / Enterprise",
  "Marketplace Seller",
  "Logistics / 3PL",
  "Other",
]

const VOLUME_BANDS = [
  "< 500 shipments/month",
  "500 - 5,000 shipments/month",
  "5,000 - 25,000 shipments/month",
  "25,000+ shipments/month",
]

const DEMO_TIMES = [
  "Morning (10 AM - 12 PM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (4 PM - 6 PM)",
]

interface FormState {
  name: string
  email: string
  mobile: string
  companyName: string
  companyWebsite: string
  businessType: string
  monthlyVolume: string
  shipmentTypes: string[]
  challenge: string
  preferredTime: string
  consent: boolean
}

const initialState: FormState = {
  name: "",
  email: "",
  mobile: "",
  companyName: "",
  companyWebsite: "",
  businessType: "",
  monthlyVolume: "",
  shipmentTypes: [],
  challenge: "",
  preferredTime: "",
  consent: false,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = Partial<Record<keyof FormState, string>>

export function RequestDemoForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle")

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleShipmentType(name: string) {
    setForm((f) => ({
      ...f,
      shipmentTypes: f.shipmentTypes.includes(name)
        ? f.shipmentTypes.filter((t) => t !== name)
        : [...f.shipmentTypes, name],
    }))
  }

  function validate(): Errors {
    const next: Errors = {}
    if (!form.name.trim()) next.name = "Name is required."
    if (!form.email.trim()) next.email = "Work email is required."
    else if (!EMAIL_REGEX.test(form.email)) next.email = "Enter a valid email address."
    if (!form.mobile.trim()) next.mobile = "Mobile number is required."
    if (!form.companyName.trim()) next.companyName = "Company name is required."
    if (!form.businessType) next.businessType = "Select a business type."
    if (!form.monthlyVolume) next.monthlyVolume = "Select your monthly volume."
    if (form.shipmentTypes.length === 0) next.shipmentTypes = "Select at least one shipment type."
    if (!form.preferredTime) next.preferredTime = "Select a preferred demo time."
    if (!form.consent) next.consent = "Consent is required to proceed."
    return next
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setStatus("submitting")
    setTimeout(() => setStatus("submitted"), 900)
  }

  if (status === "submitted") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-10 text-center">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Thank you — our logistics specialist will contact you shortly.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We typically respond within one business day.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl space-y-5">
      <Field label="Full name" error={errors.name}>
        <Input value={form.name} onChange={(e) => update("name", e.target.value)} aria-invalid={!!errors.name} />
      </Field>
      <Field label="Work email" error={errors.email}>
        <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} aria-invalid={!!errors.email} />
      </Field>
      <Field label="Mobile number" error={errors.mobile}>
        <Input type="tel" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} aria-invalid={!!errors.mobile} />
      </Field>
      <Field label="Company name" error={errors.companyName}>
        <Input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} aria-invalid={!!errors.companyName} />
      </Field>
      <Field label="Company website (optional)">
        <Input type="url" value={form.companyWebsite} onChange={(e) => update("companyWebsite", e.target.value)} />
      </Field>
      <Field label="Business type" error={errors.businessType}>
        <Select value={form.businessType} onChange={(e) => update("businessType", e.target.value)} aria-invalid={!!errors.businessType}>
          <option value="">Select one</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Monthly shipment volume" error={errors.monthlyVolume}>
        <Select value={form.monthlyVolume} onChange={(e) => update("monthlyVolume", e.target.value)} aria-invalid={!!errors.monthlyVolume}>
          <option value="">Select one</option>
          {VOLUME_BANDS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </Select>
      </Field>
      <Field label="Shipment types you need" error={errors.shipmentTypes}>
        <div className="grid gap-2 sm:grid-cols-2">
          {solutions.map((s) => (
            <label key={s.slug} className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={form.shipmentTypes.includes(s.shortName)}
                onChange={() => toggleShipmentType(s.shortName)}
              />
              {s.shortName}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Current shipping challenge (optional)">
        <Textarea value={form.challenge} onChange={(e) => update("challenge", e.target.value)} rows={3} />
      </Field>
      <Field label="Preferred demo time" error={errors.preferredTime}>
        <Select value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} aria-invalid={!!errors.preferredTime}>
          <option value="">Select one</option>
          {DEMO_TIMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field error={errors.consent}>
        <label className="flex items-start gap-2 text-sm text-foreground">
          <Checkbox
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5"
          />
          I agree to be contacted by Ziporter&apos;s sales team about this request.
        </label>
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Request a Demo"}
      </Button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className={label ? "mt-1" : undefined}>{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
```

Note: validation runs only on submit, not per-keystroke, so `aria-invalid` and the error message only appear after a failed submit attempt — deliberate, to avoid flashing "required" errors while the user is still typing their first field.

- [ ] **Step 2: Create `src/app/request-demo/page.tsx`**

```tsx
import { JsonLd } from "@/components/shared/json-ld"
import { PageHero } from "@/components/shared/page-hero"
import { Section } from "@/components/shared/section"
import { RequestDemoForm } from "@/components/request-demo-form"
import { buildBreadcrumbJsonLd } from "@/components/shared/breadcrumbs"
import { pageMetadata } from "@/lib/metadata"
import { SITE_URL } from "@/lib/content"

export const metadata = pageMetadata(
  "Request a Demo",
  "Tell us about your shipping volume and we'll set up a personalized Ziporter demo."
)

export default function RequestDemoPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Request a Demo", href: `${SITE_URL}/request-demo` },
  ])
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Request a Demo"
        title="See Ziporter in action"
        description="Tell us about your business and shipping volume — we'll set up a demo tailored to your operation."
      />
      <Section className="pt-0">
        <RequestDemoForm />
      </Section>
    </>
  )
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`, visit `/request-demo`. Click "Request a Demo" with everything empty — confirm every required field shows a red error message and the form does NOT submit. Fill in an invalid email (e.g. `notanemail`) with everything else valid — confirm only the email field errors with "Enter a valid email address." Fill in all required fields validly (including checking at least one shipment type and the consent box) and submit — confirm the button reads "Submitting..." briefly, then the form is replaced by the "Thank you" panel. Confirm `View Source` shows a `BreadcrumbList` JSON-LD (Home, Request a Demo).

- [ ] **Step 4: Commit**

```bash
git add src/components/request-demo-form.tsx src/app/request-demo/page.tsx
git commit -m "feat: add request-demo lead form"
```

---

### Task 5: `sitemap.ts` and `robots.ts`

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Interfaces:**
- Produces: static-exported `sitemap.xml` and `robots.txt` at the site root.

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next"
import { SITE_URL, solutions } from "@/lib/content"

const staticRoutes = [
  "/",
  "/solutions",
  "/industries",
  "/integrations",
  "/api",
  "/enterprise-dashboard",
  "/track",
  "/resources",
  "/about",
  "/contact",
  "/request-demo",
  "/login",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const solutionRoutes = solutions.map((s) => `/solutions/${s.slug}`)
  const paths = [...staticRoutes, ...solutionRoutes]

  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "/" : `${path}/`}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }))
}
```

Note: every non-root URL gets a trailing slash to match `next.config.ts`'s `trailingSlash: true` — the actual exported/served URL for `/solutions` is `/solutions/`, so the sitemap must list it that way to avoid a redirect hop.

- [ ] **Step 2: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/content"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Verify**

Run `npm run build`. Confirm the export output directory (`out/`, per `output: "export"`) contains `sitemap.xml` and `robots.txt` as static files. Open `out/sitemap.xml` and confirm it lists all 12 static routes plus all 5 solution sub-routes (17 `<url>` entries total), each under the `https://ziporter.example.com` domain with a trailing slash (except the root). Open `out/robots.txt` and confirm it contains `Allow: /` and a `Sitemap:` line pointing at `https://ziporter.example.com/sitemap.xml`.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt generation"
```

---

### Task 6: Full site link and build audit (final)

**Files:**
- None created/modified — verification-only task, closing out the "intentionally deferred" note from the routes plan's own Task 11.

- [ ] **Step 1: Full build**

Run `npx tsc --noEmit`, `npm run lint`, `npm run build` — all three must pass with zero errors across the whole site (all three plans combined).

- [ ] **Step 2: Full click-through**

Run `npm run dev`. Click every link in the desktop nav, mobile nav, and all 5 footer columns, plus every CTA button on the homepage and every solution/industry/interior page. Confirm **zero** 404s — this specifically closes the two links (`/request-demo`, `/track`) the routes plan's audit explicitly left unresolved. Re-run the `grep` from the routes plan's Task 11 Step 1 (`grep -o '"href": "[^"]*"' src/config/site.json | sort -u`) and confirm every non-`#` href now has a matching route on disk.

- [ ] **Step 3: No commit** — verification-only. If a genuine gap is found, fix it as part of the relevant task above (in this plan or either prior plan) and re-run this audit.

---

## Self-Review

**Spec coverage:** §5 sitemap — now 100% complete; `/request-demo` (Task 4) and `/track` (Task 3) were the only two routes left after the routes plan. §7 Interactive Pieces — `/request-demo`'s field list, inline validation, and "Thank you" success-panel copy match the brief verbatim; `/track`'s AWB lookup, 5-status timeline, masked address, and help/escalation CTA match the brief, including explicit Delivered / In-Transit / Exception-RTO fixture coverage. §8 SEO — `sitemap.ts`/`robots.ts` (Task 5) complete the metadata/schema checklist alongside the JSON-LD and per-page `metadata` work already done in the prior two plans.

**Placeholder scan:** no "TBD"/vague instructions; both forms are fully specified field-by-field with concrete validation rules and copy.

**Type consistency:** `TrackingRecord`/`TrackingEvent` (Task 1) fields match `tracking-mock.json` exactly. `FormState` in `request-demo-form.tsx` covers every field named in spec §7 with no extras. `Solution.shortName` (already defined by the foundation plan) is reused for the shipment-types checkboxes instead of inventing a parallel list.

**Cross-plan dependency check:** this plan assumes `Section`, `PageHero`, `JsonLd`, `buildBreadcrumbJsonLd`, `pageMetadata`, `SITE_URL`, `Card`/`CardContent`, `Input`/`Textarea`/`Select`/`Checkbox`/`Button`, and `solutions` all exist exactly as the foundation and routes plans define them — verified by name and import path against both plans' File Structure sections. `site.json`'s `cta.secondary.href` (`/request-demo`) and `cta.tertiary.href` (`/track`), already wired into the nav/footer/every CTA button across both prior plans, resolve for the first time once this plan lands.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-27-ziporter-interactive-and-seo.md`.

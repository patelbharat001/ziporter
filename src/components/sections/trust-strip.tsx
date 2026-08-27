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

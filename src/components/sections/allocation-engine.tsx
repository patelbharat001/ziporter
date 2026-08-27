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
          Ziporter&apos;s smart allocation engine scores every eligible carrier in real time
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

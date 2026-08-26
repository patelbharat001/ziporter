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

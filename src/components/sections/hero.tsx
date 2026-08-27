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

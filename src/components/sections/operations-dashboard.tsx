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

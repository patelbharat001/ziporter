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

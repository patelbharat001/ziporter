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

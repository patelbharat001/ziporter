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

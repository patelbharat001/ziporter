import { Layers, BrainCircuit, UserCog, Eye, ShieldCheck, Globe2 } from "lucide-react"
import { Section } from "@/components/shared/section"

const points = [
  { icon: Layers, title: "One API, not ten", description: "Stop maintaining separate integrations for every carrier you use." },
  { icon: BrainCircuit, title: "AI-assisted allocation", description: "Allocation improves over time from real delivery outcomes, not static rules alone." },
  { icon: UserCog, title: "Dedicated account management", description: "Enterprise accounts get a named point of contact, not a support queue." },
  { icon: Eye, title: "Transparent cost visibility", description: "See exactly what every shipment costs, by carrier and zone, in real time." },
  { icon: ShieldCheck, title: "Enterprise-grade security", description: "Encrypted data, role-based access, and masked customer information by default." },
  { icon: Globe2, title: "India-wide and international reach", description: "The same platform scales from hyperlocal delivery to cross-border shipments." },
]

export default function WhyZiporter() {
  return (
    <Section>
      <h2 className="font-heading text-3xl font-bold text-foreground">Why enterprise teams choose Ziporter</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="flex gap-4">
            <p.icon className="size-6 shrink-0 text-accent" />
            <div>
              <div className="font-heading text-base font-semibold text-foreground">{p.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

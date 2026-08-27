import { ShoppingCart, Shirt, Smartphone, HeartPulse, ShoppingBasket, Factory, type LucideIcon } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { industries } from "@/lib/content"

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart, Shirt, Smartphone, HeartPulse, ShoppingBasket, Factory,
}

export default function IndustriesSection() {
  return (
    <Section background="muted">
      <h2 className="font-heading text-3xl font-bold text-foreground">Built for your industry</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((ind) => {
          const Icon = iconMap[ind.icon]
          return (
            <Card key={ind.slug}>
              <CardHeader>
                {Icon && <Icon className="size-7 text-secondary-foreground" />}
                <CardTitle className="mt-2">{ind.name}</CardTitle>
                <CardDescription>{ind.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}

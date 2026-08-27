import Link from "next/link"
import { Truck, Boxes, RotateCcw, Zap, Globe, ArrowRight, type LucideIcon } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { solutions } from "@/lib/content"

const iconMap: Record<string, LucideIcon> = { Truck, Boxes, RotateCcw, Zap, Globe }

export default function SolutionsGrid() {
  return (
    <Section background="muted">
      <div className="flex items-end justify-between">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Solutions for every shipment type
        </h2>
        <Link href="/solutions" className="hidden text-sm font-medium text-accent hover:underline sm:inline-flex items-center gap-1">
          View all solutions <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((s) => {
          const Icon = iconMap[s.icon]
          return (
            <Link key={s.slug} href={`/solutions/${s.slug}`}>
              <Card className="h-full">
                <CardHeader>
                  {Icon && <Icon className="size-8 text-accent" />}
                  <CardTitle className="mt-2">{s.name}</CardTitle>
                  <CardDescription>{s.summary}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}

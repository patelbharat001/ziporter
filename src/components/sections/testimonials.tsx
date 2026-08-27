import { Quote } from "lucide-react"
import { Section } from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { testimonials } from "@/lib/content"

export default function TestimonialsSection() {
  return (
    <Section background="muted">
      <h2 className="font-heading text-3xl font-bold text-foreground">What operations teams say</h2>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.quote}>
            <CardContent className="py-6">
              <Quote className="size-6 text-accent" />
              <p className="mt-3 text-sm text-foreground">{t.quote}</p>
              <p className="mt-4 text-xs font-semibold text-foreground">{t.role}</p>
              <p className="text-xs text-muted-foreground">{t.context}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}

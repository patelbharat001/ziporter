import Link from "next/link"
import { Section } from "@/components/shared/section"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"

export default function FinalCta() {
  return (
    <Section background="muted">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl font-bold">Ready to simplify your logistics stack?</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Talk to our team or see Ziporter on your own shipment data — no commitment required.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="secondary" render={<Link href={site.cta.primary.href} />}>
            {site.cta.primary.label}
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" render={<Link href={site.cta.secondary.href} />}>
            {site.cta.secondary.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}

"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Section } from "@/components/shared/section"
import { JsonLd } from "@/components/shared/json-ld"
import { faqs } from "@/lib/content"

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <Section id="faq">
      <JsonLd data={faqJsonLd} />
      <h2 className="font-heading text-3xl font-bold text-foreground">Frequently asked questions</h2>
      <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
        {faqs.map((f, i) => {
          const open = openIndex === i
          return (
            <div key={f.question}>
              <button
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span className="font-medium text-foreground">{f.question}</span>
                <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <div className="px-5 pb-4 text-sm text-muted-foreground">{f.answer}</div>}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

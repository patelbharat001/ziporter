"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  { q: "Which courier services integrate with Ziporter?", a: "FedEx, DHL, UPS, Canada Post, Royal Mail, and local regional couriers are all integrated, with new partners added quarterly." },
  { q: "Can I generate bulk corporate shipments?", a: "Yes — upload a CSV or use our API to generate thousands of labels across carriers in seconds." },
  { q: "Do you support returns lifecycle management?", a: "Return labels, cancellations, and proof-of-delivery collection are all handled in the same dashboard." },
  { q: "Where is my data hosted?", a: "Data is stored in GDPR-compliant EU data centers with AES-256 encryption at rest." },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="relative bg-[#030303] py-20 px-6 border-b border-white/5">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">Frequently asked questions</h2>
        <p className="text-white/50 text-center mb-10">For corporate courier operations teams.</p>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="border border-white/10 rounded-xl bg-white/[0.03] overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 flex items-center justify-between text-left text-white/90 font-medium">
                <span>{it.q}</span>
                <ChevronDown className={open === i ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>
              {open === i && <div className="px-5 pb-4 text-white/60 text-sm leading-relaxed">{it.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

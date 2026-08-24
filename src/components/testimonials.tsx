"use client";

import { motion } from "framer-motion";

const quotes = [
  { name: "Sarah Li", title: "Head of Logistics, NexaTech", text: "Ziporter cut our courier management overhead by 60% — one dashboard instead of six tabs." },
  { name: "Ravi Patel", title: "Operations lead, CloudCart", text: "Tracking across DHL, FedEx, and local couriers is finally unified for our corporate shipments." },
];

export default function Testimonials() {
  return (
    <section className="relative bg-[#030303] py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What corporate teams say</h2>
        <p className="text-white/50 mb-12 max-w-xl mx-auto">Built for companies shipping at scale.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {quotes.map((q) => (
            <motion.div
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-left"
            >
              <p className="text-white/80 italic mb-4">"{q.text}"</p>
              <div className="text-right">
                <div className="font-semibold text-white">{q.name}</div>
                <div className="text-xs text-white/50">{q.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

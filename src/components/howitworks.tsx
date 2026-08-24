"use client";

import { motion } from "framer-motion";

const steps = [
  { step: "1", title: "Create Shipments", desc: "Generate single or bulk courier bookings across 14 carrier integrations." },
  { step: "2", title: "Track Live", desc: "Real-time multi-courier status unified into one dashboard." },
  { step: "3", title: "Manage Lifecycle", desc: "Handle returns, cancellations, and proofs of delivery in one place." },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-[#050505] py-20 px-6 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">How Ziporter works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Number(s.step) * 0.2 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-rose-400 flex items-center justify-center mb-4 font-bold text-black">{s.step}</div>
              <h3 className="text-white font-semibold mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

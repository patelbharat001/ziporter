"use client";

import { motion } from "framer-motion";

const carriers = [
  { name: "FedEx", icon: "🟣" },
  { name: "DHL", icon: "🔴" },
  { name: "UPS", icon: "🟦" },
  { name: "Canada Post", icon: "🟧" },
  { name: "Royal Mail", icon: "🟩" },
  { name: "APCourier", icon: "🟨" },
];

export default function Carriers() {
  return (
    <section className="relative bg-[#040404] py-20 px-6 border-y border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Integrated with 14 carriers</h2>
        <p className="text-white/50 mb-10 max-w-xl mx-auto">Generate and track shipments across every major courier from a single API.</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {carriers.map((c) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center gap-2"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-white font-medium text-sm">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

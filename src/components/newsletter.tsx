"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="relative bg-[#060606] py-20 px-6 border-y border-white/5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in the loop</h2>
        <p className="text-white/50 mb-6 max-w-md mx-auto">Get the latest on new carrier integrations, features, and logistics best practices for corporate teams.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-400 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-400 text-black font-bold"
          >
            {sent ? "Subscribed ✓" : "Subscribe"}
          </motion.button>
        </form>
      </div>
    </section>
  );
}

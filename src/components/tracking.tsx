"use client";
import { useState } from "react";
import { Search, Truck, CheckCircle2 } from "lucide-react";

const packages = [
  { id: "ZP-1024", carrier: "DHL", status: "In Transit", location: "Frankfurt, DE", eta: "2 hrs", progress: 65 },
  { id: "ZP-1025", carrier: "FedEx", status: "Out for Delivery", location: "Chicago, US", eta: "30 min", progress: 92 },
  { id: "ZP-1026", carrier: "UPS", status: "Picked Up", location: "Toronto, CA", eta: "12 hrs", progress: 15 },
];

export default function Tracking() {
  const [query, setQuery] = useState("");
  return (
    <section id="tracking" className="relative bg-[#0a0a0a] py-24 px-6 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Track Multiple Couriers</h2>
          <p className="text-white/50">Enter any package ID or search all active shipments.</p>
        </div>
        <div className="flex gap-2 mb-10 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search package ID..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-400 transition-colors" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map(p => (
            <div key={p.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-rose-400">{p.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "Out for Delivery" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{p.status}</span>
              </div>
              <div className="flex items-center gap-3 mb-2 text-white/80 text-sm"><Truck className="w-4 h-4 text-white/40" /> {p.carrier} · {p.location}</div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2"><div className="h-full bg-gradient-to-r from-indigo-500 to-rose-400 rounded-full" style={{ width: `${p.progress}%` }} /></div>
              <div className="flex items-center justify-between text-xs text-white/40"><span>ETA: {p.eta}</span><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

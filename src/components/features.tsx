import { Package, BarChart3, ShieldCheck, Zap } from "lucide-react";

const features = [
  { icon: Package, title: "Multi-Courier Generation", desc: "Generate shipments across FedEx, DHL, UPS, and local carriers instantly." },
  { icon: BarChart3, title: "Lifecycle Management", desc: "From pickup to delivery — manage the full courier lifecycle in one dashboard." },
  { icon: ShieldCheck, title: "Real-Time Tracking", desc: "Track all courier statuses simultaneously with unified visibility." },
  { icon: Zap, title: "Corporate Scale", desc: "Built for enterprises that ship thousands of parcels daily." },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-[#030303] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">One Platform. <span className="text-rose-400">Every Courier.</span></h2>
          <p className="text-white/50 max-w-xl mx-auto">Ziporter aggregates courier services, management, and tracking so your corporate logistics team never switches tabs.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-rose-500/30 transition-colors">
              <f.icon className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

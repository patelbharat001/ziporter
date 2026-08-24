export default function CTA() {
  return (
    <section id="pricing" className="relative bg-[#030303] py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.07] via-rose-500/[0.07] to-transparent" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to unify your logistics?</h2>
        <p className="text-white/50 mb-10 text-lg">Start managing couriers, tracking, and lifecycle from one platform today.</p>
        <a href="#" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-rose-400 transition-colors">Book a demo →</a>
      </div>
    </section>
  );
}

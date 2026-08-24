export default function Stats() {
  return (
    <section className="bg-[#030303] py-16 px-6 border-b border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { label: "Shipments / month", value: "2.4M+" },
          { label: "Corporate clients", value: "180+" },
          { label: "Carriers integrated", value: "14" },
          { label: "Countries served", value: "32" },
        ].map(s => (
          <div key={s.label} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.value}</div>
            <div className="text-sm text-white/50">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { Truck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#020202] border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-xl"><Truck className="text-rose-400" /> Ziporter</div>
        <div className="text-white/40 text-sm">© 2026 Ziporter. Corporate courier aggregator.</div>
        <div className="flex gap-6 text-sm text-white/60">
          <Link href="#" className="hover:text-white">Privacy</Link>
          <Link href="#" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

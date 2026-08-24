"use client";
import Link from "next/link";
import { Truck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 z-50 w-full bg-black/60 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <Truck className="text-rose-400" /> Ziporter
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#tracking" className="hover:text-white transition-colors">Tracking</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-black/90 border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-white/80">
          <Link href="#features" onClick={() => setOpen(false)}>Features</Link>
          <Link href="#tracking" onClick={() => setOpen(false)}>Tracking</Link>
          <Link href="#pricing" onClick={() => setOpen(false)}>Pricing</Link>
        </div>
      )}
    </nav>
  );
}

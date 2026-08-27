"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Ziporter home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
              aria-expanded={solutionsOpen}
              aria-haspopup="true"
              onClick={() => setSolutionsOpen((v) => !v)}
            >
              Solutions <ChevronDown className="size-3.5" />
            </button>
            {solutionsOpen && (
              <div className="absolute left-0 top-full grid w-80 gap-1 rounded-2xl border border-border bg-card p-2 shadow-md">
                {site.nav.solutions.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="rounded-lg px-3 py-2 hover:bg-muted"
                  >
                    <div className="text-sm font-medium text-foreground">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {site.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button render={<Link href={site.cta.tertiary.href} />} variant="ghost" size="sm">
            {site.cta.tertiary.label}
          </Button>
          <Button render={<Link href="/login" />} variant="outline" size="sm">
            Login
          </Button>
          <Button render={<Link href={site.cta.secondary.href} />} size="sm">
            {site.cta.secondary.label}
          </Button>
        </div>

        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {site.nav.solutions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {s.label}
              </Link>
            ))}
            {site.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href={site.cta.tertiary.href}
              className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              {site.cta.tertiary.label}
            </Link>
            <Button
              render={<Link href={site.cta.secondary.href} onClick={() => setMobileOpen(false)} />}
              className="mt-2"
            >
              {site.cta.secondary.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

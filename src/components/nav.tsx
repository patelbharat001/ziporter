"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"
import { isLive } from "@/lib/routes"

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  const liveSolutions = site.nav.solutions.filter((s) => isLive(s.href))
  const liveLinks = site.nav.links.filter((link) => isLive(link.href))
  const showTertiary = isLive(site.cta.tertiary.href)
  const showLogin = isLive("/login")
  const showSecondary = isLive(site.cta.secondary.href)
  const hasNavMenu = liveSolutions.length > 0 || liveLinks.length > 0
  const hasCtas = showTertiary || showLogin || showSecondary
  const hasAnyExtras = hasNavMenu || hasCtas

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Ziporter home">
          <Logo />
        </Link>

        {hasNavMenu && (
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {liveSolutions.length > 0 && (
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
                    {liveSolutions.map((s) => (
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
            )}
            {liveLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {hasCtas && (
          <div className="hidden items-center gap-2 lg:flex">
            {showTertiary && (
              <Button render={<Link href={site.cta.tertiary.href} />} variant="ghost" size="sm">
                {site.cta.tertiary.label}
              </Button>
            )}
            {showLogin && (
              <Button render={<Link href="/login" />} variant="outline" size="sm">
                Login
              </Button>
            )}
            {showSecondary && (
              <Button render={<Link href={site.cta.secondary.href} />} size="sm">
                {site.cta.secondary.label}
              </Button>
            )}
          </div>
        )}

        {hasAnyExtras && (
          <button
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        )}
      </div>

      {mobileOpen && hasAnyExtras && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {liveSolutions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {s.label}
              </Link>
            ))}
            {liveLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {showLogin && (
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
            {showTertiary && (
              <Link
                href={site.cta.tertiary.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {site.cta.tertiary.label}
              </Link>
            )}
            {showSecondary && (
              <Button
                render={<Link href={site.cta.secondary.href} onClick={() => setMobileOpen(false)} />}
                className="mt-2"
              >
                {site.cta.secondary.label}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

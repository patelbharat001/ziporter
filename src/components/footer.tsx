import Link from "next/link"
import { Logo } from "@/components/logo"
import { site } from "@/lib/content"
import { isLive } from "@/lib/routes"

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const liveLinks = links.filter((link) => isLive(link.href))
  if (liveLinks.length === 0) return null
  return (
    <div>
      <div className="font-heading text-sm font-semibold text-primary-foreground">{title}</div>
      <ul className="mt-3 space-y-2">
        {liveLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const hasFooterLinks =
    site.footer.product.some((l) => isLive(l.href)) ||
    site.footer.solutions.some((l) => isLive(l.href)) ||
    site.footer.company.some((l) => isLive(l.href)) ||
    site.footer.getStarted.some((l) => isLive(l.href))

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className={hasFooterLinks ? "grid grid-cols-2 gap-8 md:grid-cols-5" : ""}>
          <div className={hasFooterLinks ? "col-span-2 md:col-span-1" : "max-w-sm"}>
            <Logo variant="mono-light" />
            <p className="mt-3 text-sm text-primary-foreground/70">{site.description}</p>
            <div className="mt-4 flex gap-3">
              {site.social.map((s) => (
                <a key={s.label} href={s.href} className="text-xs text-primary-foreground/70 hover:text-primary-foreground">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {hasFooterLinks && (
            <>
              <FooterColumn title="Product" links={site.footer.product} />
              <FooterColumn title="Solutions" links={site.footer.solutions} />
              <FooterColumn title="Company" links={site.footer.company} />
              <FooterColumn title="Get Started" links={site.footer.getStarted} />
            </>
          )}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Ziporter. All rights reserved.</span>
          <span>{site.contact.salesEmail} · {site.contact.phone}</span>
        </div>
      </div>
    </footer>
  )
}

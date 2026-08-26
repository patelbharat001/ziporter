import { cn } from "@/lib/utils"

export function Section({
  children,
  className,
  background = "default",
  id,
}: {
  children: React.ReactNode
  className?: string
  background?: "default" | "muted"
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 md:py-24",
        background === "muted" && "bg-muted",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

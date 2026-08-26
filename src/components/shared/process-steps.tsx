import { cn } from "@/lib/utils"

export function ProcessSteps({
  steps,
  orientation = "vertical",
}: {
  steps: { title: string; description: string; number: number }[]
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <ol
      className={cn(
        "grid gap-6",
        orientation === "horizontal"
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      )}
    >
      {steps.map((step) => (
        <li key={step.number} className="flex gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
            {step.number}
          </span>
          <div>
            <div className="font-heading text-base font-semibold text-foreground">
              {step.title}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{step.description}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

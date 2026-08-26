import { cn } from "@/lib/utils"
import routeLines from "../../../public/images/route-lines.svg"

export function RouteMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
      <img
        src={routeLines.src}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

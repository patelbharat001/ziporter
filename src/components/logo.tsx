import { cn } from "@/lib/utils";

export function Logo({
  variant = "default",
  className,
}: {
  variant?: "default" | "mono-light";
  className?: string;
}) {
  const mono = variant === "mono-light";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        {!mono && (
          <defs>
            <linearGradient id="ziporter-mark" x1="0" y1="28" x2="28" y2="0">
              <stop offset="0" stopColor="oklch(0.28 0.06 260)" />
              <stop offset="1" stopColor="oklch(0.62 0.19 258)" />
            </linearGradient>
          </defs>
        )}
        <path
          d="M3 8 L15 8 L5 20 L17 20"
          stroke={mono ? "white" : "url(#ziporter-mark)"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M13 8 L25 8 L15 20 L25 20"
          stroke={mono ? "white" : "url(#ziporter-mark)"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.55"
        />
      </svg>
      <span
        className={cn(
          "font-heading text-lg font-bold tracking-tight",
          mono ? "text-white" : "text-primary"
        )}
      >
        Ziporter
      </span>
    </span>
  );
}

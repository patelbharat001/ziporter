import Hero from "@/components/sections/hero"
import TrustStrip from "@/components/sections/trust-strip"
import ValueProps from "@/components/sections/value-props"
import SolutionsGrid from "@/components/sections/solutions-grid"

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <ValueProps />
      <SolutionsGrid />
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">Homepage sections coming in Task 25</h1>
      </div>
    </main>
  );
}

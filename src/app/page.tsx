import Hero from "@/components/sections/hero"
import TrustStrip from "@/components/sections/trust-strip"
import ValueProps from "@/components/sections/value-props"
import SolutionsGrid from "@/components/sections/solutions-grid"
import AllocationEngine from "@/components/sections/allocation-engine"
import OperationsDashboard from "@/components/sections/operations-dashboard"
import IntegrationsSection from "@/components/sections/integrations"
import IndustriesSection from "@/components/sections/industries"
import WorkflowSection from "@/components/sections/workflow"
import AnalyticsSection from "@/components/sections/analytics"
import WhyZiporter from "@/components/sections/why-ziporter"
import TestimonialsSection from "@/components/sections/testimonials"

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <ValueProps />
      <SolutionsGrid />
      <AllocationEngine />
      <OperationsDashboard />
      <IntegrationsSection />
      <IndustriesSection />
      <WorkflowSection />
      <AnalyticsSection />
      <WhyZiporter />
      <TestimonialsSection />
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">Homepage sections coming in Task 25</h1>
      </div>
    </main>
  );
}

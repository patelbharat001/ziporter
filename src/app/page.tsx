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
import FaqSection from "@/components/sections/faq"
import FinalCta from "@/components/sections/final-cta"

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
      <FaqSection />
      <FinalCta />
    </main>
  );
}

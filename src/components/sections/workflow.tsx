import { Section } from "@/components/shared/section"
import { ProcessSteps } from "@/components/shared/process-steps"
import { workflowSteps } from "@/lib/content"

export default function WorkflowSection() {
  const steps = workflowSteps.map((s) => ({ number: s.step, title: s.title, description: s.description }))
  return (
    <Section>
      <h2 className="font-heading text-3xl font-bold text-foreground">
        From order to reconciliation, nine steps, fully orchestrated
      </h2>
      <div className="mt-10">
        <ProcessSteps steps={steps} orientation="horizontal" />
      </div>
    </Section>
  )
}

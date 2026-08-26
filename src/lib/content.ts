import siteRaw from "@/config/site.json";
import solutionsRaw from "@/data/solutions.json";
import industriesRaw from "@/data/industries.json";
import integrationsRaw from "@/data/integrations.json";
import faqRaw from "@/data/faq.json";
import testimonialsRaw from "@/data/testimonials.json";
import allocationCriteriaRaw from "@/data/allocation-criteria.json";
import workflowStepsRaw from "@/data/workflow-steps.json";
import dashboardMetricsRaw from "@/data/dashboard-metrics.json";
import type {
  SiteConfig,
  Solution,
  Industry,
  Integration,
  FaqItem,
  Testimonial,
  AllocationCriterion,
  WorkflowStep,
  DashboardMetrics,
} from "@/lib/content-types";

export const site = siteRaw as SiteConfig;
export const solutions = solutionsRaw as Solution[];
export const industries = industriesRaw as Industry[];
export const integrations = integrationsRaw as Integration[];
export const faqs = faqRaw as FaqItem[];
export const testimonials = testimonialsRaw as Testimonial[];
export const allocationCriteria = allocationCriteriaRaw as AllocationCriterion[];
export const workflowSteps = workflowStepsRaw as WorkflowStep[];
export const dashboardMetrics = dashboardMetricsRaw as DashboardMetrics;

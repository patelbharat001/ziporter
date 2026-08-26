export interface SiteConfig {
  name: string;
  tagline: string;
  altHeadline: string;
  description: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    tertiary: { label: string; href: string };
  };
  stats: {
    carriers: string;
    pincodes: string;
    uptime: string;
  };
  contact: {
    salesEmail: string;
    supportEmail: string;
    phone: string;
  };
  social: { label: string; href: string }[];
  nav: {
    solutions: { label: string; href: string; description: string }[];
    links: { label: string; href: string }[];
  };
  footer: {
    product: { label: string; href: string }[];
    solutions: { label: string; href: string }[];
    company: { label: string; href: string }[];
    getStarted: { label: string; href: string }[];
  };
}

export interface Solution {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  heroDescription: string;
  outcomes: string[];
  icon: string;
}

export interface Industry {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface Integration {
  name: string;
  category: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  role: string;
  context: string;
}

export interface AllocationCriterion {
  label: string;
  description: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface DashboardMetrics {
  headline: string;
  cards: { label: string; value: string; trend: string }[];
}

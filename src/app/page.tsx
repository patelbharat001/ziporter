import Nav from "@/components/nav";
import HowItWorks from "@/components/howitworks";
import Testimonials from "@/components/testimonials";
import Carriers from "@/components/carriers";
import Faq from "@/components/faq";
import Newsletter from "@/components/newsletter";
import HeroGeometric from "@/components/ui/shape-landing-hero";
import Features from "@/components/features";
import Tracking from "@/components/tracking";
import Stats from "@/components/stats";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303] text-white font-sans selection:bg-rose-500/30">
      <Nav />
      <HeroGeometric
        badge="Ziporter — Corporate Logistics"
        title1="Courier Aggregator"
        title2="For Corporate Growth"
        description="Track multiple courier statuses, generate shipments, and manage the full courier lifecycle from a single intelligent platform."
        rotate={12}
        width={600}
        height={140}
        y={15}
      />
      <Features />
      <HowItWorks />
      <Carriers />
      <Tracking />
      <Testimonials />
      <Stats />
      <Faq />
      <Newsletter />
      <CTA />
      <Footer />
    </main>
  );
}

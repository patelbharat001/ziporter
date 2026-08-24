import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export default function Demo() {
  return (
    <div className="h-screen w-screen bg-[#030303]">
      <HeroGeometric
        badge="Ziporter"
        title1="Courier Aggregator"
        title2="For Corporate Growth"
        description="Track, manage, and scale all your courier operations from one intelligent platform."
        rotate={12}
        width={600}
        height={140}
        y={15}
      />
    </div>
  );
}

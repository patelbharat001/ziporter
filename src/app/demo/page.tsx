import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const settings = {
  rotate: 12,
  width: 600,
  height: 140,
  y: 15,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div className="h-screen w-screen bg-[#030303]">
      <HeroGeometric
        {...s}
        badge="Ziporter"
        title1="Courier Aggregator"
        title2="For Corporate Growth"
        description="Track, manage, and scale all your courier operations from one intelligent platform."
      />
    </div>
  );
}

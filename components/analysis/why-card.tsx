import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

export function WhyCard({ why }: { why: string }) {
  return (
    <Card>
      <SectionTitle>Why</SectionTitle>
      <p className="mt-3 text-sm leading-relaxed text-white">{why}</p>
    </Card>
  );
}

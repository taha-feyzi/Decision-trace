import { Evidence } from "@/types/evidence";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { EvidenceBadge } from "@/components/analysis/evidence-badge";

export function EvidenceCard({ evidence }: { evidence: Evidence[] }) {
  return (
    <Card>
      <SectionTitle>Evidence</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {evidence.map((item, index) => (
          <EvidenceBadge key={`${item.type}-${index}`} evidence={item} />
        ))}
      </div>
    </Card>
  );
}

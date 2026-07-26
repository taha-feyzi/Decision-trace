import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { ProgressBar } from "@/components/ui/progress-bar";
import { confidenceLabel } from "@/lib/utils";

export function ConfidenceCard({ confidence }: { confidence: number }) {
  return (
    <Card>
      <SectionTitle>Confidence</SectionTitle>
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar value={confidence} className="flex-1" />
        <span className="text-sm font-medium text-white">{confidence}%</span>
      </div>
      <p className="mt-2 text-sm text-text-secondary">{confidenceLabel(confidence)} based on available repository history.</p>
    </Card>
  );
}
